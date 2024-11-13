import type { PollFormDetails, PostDetails } from "../types/posts/types";
import { type FormEvent, useEffect, useState } from "react";
import { readContract, simulateContract } from "@wagmi/core";
import config from "../wagmi";
import type { Address } from "viem";
import { ABI, deployedAddress } from "../contracts/deployed-contract";
import { redirect } from "next/navigation";
import styles from "../styles/Custom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPoll, faWarning } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Posts from "./Posts";
import allPosts from "./allPosts";
import { useWaitForTransactionReceipt } from "wagmi";
import {
    useWriteForumCreatePoll,
    useWriteForumCreatePost,
} from "../contracts/generated";
import axios from "axios";

const PostForm = ({ account }: { account: Address | undefined }) => {
    if (account === undefined) return <div>Account not connected.</div>;

    const postInitialiser: PostDetails = {
        id: BigInt(0),
        title: "",
        owner: account,
        description: "",
        spoil: false,
        likes: BigInt(0),
        timestamp: BigInt(0),
        mood: "",
        username: "",
        shareCount: BigInt(0),
        commentCount: BigInt(0),
        imageUrl: ""
    };

    const { data: postTxHash, writeContractAsync: submitPost } = useWriteForumCreatePost();
    const { data: pollTxHash, writeContractAsync: submitPoll } = useWriteForumCreatePoll();

    const {
        isSuccess: isPostSubmitted,
        isLoading: isPostSubmitting,
        isError: isPostSubmitError,
    } = useWaitForTransactionReceipt({ hash: postTxHash });
    const {
        isSuccess: isPollSubmitted,
        isLoading: isPollSubmitting,
        isError: isPollSubmitError,
    } = useWaitForTransactionReceipt({ hash: pollTxHash });

    const [posts, setPosts] = useState<PostDetails[]>([]);
    const [post, setPost] = useState<PostDetails>(postInitialiser);
    const [pollElementVisible, setPollElementVisible] = useState(false);

    const pollInitialiser: PollFormDetails = {
        question: "",
        option1: "",
        option2: "",
    };
    const [pollDetails, setPollDetails] = useState<PollFormDetails>(pollInitialiser);

    const [sortOption, setSortOption] = useState<string>('newest');
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    const [username, setUsername] = useState("");
    const [imageUrl, setimageurl] = useState("");
    const [loading, setLoading] = useState(false);


    // Character counter for description field
    const maxDescriptionLength = 1000;
    const [charCount, setCharCount] = useState(maxDescriptionLength);

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setPost({ ...post, description: newValue });
        setCharCount(maxDescriptionLength - newValue.length);
    };

    // Image upload handler
    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        const isVideo = file.type.startsWith("video/");
        const folder = isVideo ? "video" : "image";

        formData.append("upload_preset", "arbitrum"); //replace with your upload preset
        formData.append("folder", folder); 
        setLoading(true);
        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${folder}/upload`,
                formData
            );
            const imageUrl = response.data.secure_url;
            setPost({ ...post, imageUrl });
            alert("Media upload complete!");
        } catch (error) {
            console.error("Error uploading media: ", error);
            alert("Media upload failed. Please try again.");
        } finally {
            setLoading(false); 
        }

    };

    const handlePostCreation = async (e: FormEvent) => {
        e.preventDefault();

        if (pollElementVisible) {
            if (!pollDetails.question?.trim() || !pollDetails.option1?.trim() || !pollDetails.option2?.trim()) {
                alert("One or more of your poll details are empty. Consider checking your inputs.");
                return;
            }
            if (pollDetails.option1.trim() === pollDetails.option2.trim()) {
                alert("Option 1 and 2 are the same. Consider checking your inputs.");
                return;
            }
        }

        if (!post.description.trim() || !post.title.trim()) {
            alert("Title, description cannot be empty...");
            return;
        }

        await simulateContract(config, {
            abi: ABI,
            address: deployedAddress,
            functionName: "createPost",
            args: [post.title, post.description, post.spoil, post.mood, username, post.imageUrl],
        }).catch((err) => {
            console.error("Simulation failed with ", err);
        });

        await submitPost({
            address: deployedAddress,
            args: [post.title, post.description, post.spoil, post.mood, username, post.imageUrl],
        });

        if (isPostSubmitError) {
            alert("Creating post failed!");
            return redirect(".");
        }

        if (isPollSubmitted) alert("Post submitted");

        const readUserPosts = await readContract(config, {
            abi: ABI,
            address: deployedAddress,
            functionName: "getPostsFromAddress",
            args: [account],
        });

        const latestPostId = readUserPosts[readUserPosts.length - 1];

        if (pollElementVisible) {
            alert("You created a poll. You have to sign another transaction again 🙏");
            await simulateContract(config, {
                abi: ABI,
                address: deployedAddress,
                functionName: "createPoll",
                args: [latestPostId, pollDetails.question.trim(), pollDetails.option1.trim(), pollDetails.option2.trim()],
            }).catch((err) => {
                console.error("Simulation failed with ", err);
            });

            await submitPoll({
                address: deployedAddress,
                args: [latestPostId, pollDetails.question.trim(), pollDetails.option1.trim(), pollDetails.option2.trim()],
            });

            if (isPollSubmitError) {
                alert("Creating poll failed!");
                return;
            }

            if (isPollSubmitted) {
                alert("Poll submitted");
            }
        }

        if (isPostSubmitted) alert("Post submission complete.");
        setPollDetails(pollInitialiser);
        setPost(postInitialiser);
        setCharCount(maxDescriptionLength);
        setUsername("");
        setimageurl("");
    };

    useEffect(() => {
        const fetchPosts = async () => {
            const posts = await allPosts();

            if (sortOption === 'mostUpvoted') {
                posts.sort((a, b) => Number(b.likes) - Number(a.likes));
            } else if (sortOption === 'mostShared') {
                posts.sort((a, b) => Number(b.shareCount) - Number(a.shareCount));
            } else if (sortOption === 'mostCommented') {
                posts.sort((a, b) => Number(b.commentCount) - Number(a.commentCount));
            } else {
                posts.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
            }

            setPosts(posts);
        };
        if (!isPostSubmitting) {
            fetchPosts();
        }
    }, [isPostSubmitting, sortOption]);
    return (
        <>
            {account !== undefined && (
                <div className={styles.cardPlain}>
                    <div className={styles.home}>
                        <h3>
                            <Link href="/">🔙 Main Page </Link>{" "}
                            <Link href={"/comments"}>💬 comments</Link>
                        </h3>
                    </div>
                    <form
                        className={styles.form}
                        onSubmit={(e) => {
                            handlePostCreation(e);
                        }}
                    >
                        <input
                            type="text"
                            name="username"
                            value={username}
                            placeholder="Your Username"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            name="post-title"
                            value={post.title}
                            placeholder="Post title"
                            onChange={(e) => setPost({ ...post, title: e.target.value })}
                            required
                        />
                        <textarea
                            rows={5}
                            name="post-description"
                            placeholder="What's on your mind?"
                            value={post.description}
                            onChange={handleDescriptionChange}
                        />
                        <div style={{ color: charCount < 50 ? 'red' : 'white' }}>
                            {charCount} characters remaining
                        </div>

                        {/* Image Upload Field */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'start',
                            gap: '0.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <label htmlFor="media-upload" style={{ fontWeight: 'bold', fontSize: '1rem', color: '#fff' }}>
                                Upload an Image or Video:
                            </label>
                            <input
                                id="media-upload"
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleMediaUpload}
                                required
                                style={{
                                    padding: '0.6rem',
                                    backgroundColor: '#f9f9f9',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    color: '#555',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>

                        {loading && <div className={styles.loading}>⌛ Uploading Media...</div>}

                        {/* Mood Selection */}
                        <label htmlFor="mood-select" style={{ fontWeight: 'bold' }}>Select Mood:</label>
                        <select
                            id="mood-select"
                            value={post.mood}
                            onChange={(e) => setPost({ ...post, mood: e.target.value })}
                            required
                            style={{
                                marginBottom: '1rem',
                                padding: '0.5rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        >
                            <option value="">Choose mood</option>
                            <option value="Happy 😊">Happy 😊</option>
                            <option value="Sad 😢">Sad 😢</option>
                            <option value="Excited 🎉">Excited 🎉</option>
                            <option value="Curious 🤔">Curious 🤔</option>
                            <option value="Don't know 🤔">Don't Know 🤔</option>
                        </select>

                        <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                            <label htmlFor="sortPosts" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>Sort by: </label>
                            <select
                                id="sortPosts"
                                value={sortOption}
                                onChange={handleSortChange}
                                style={{
                                    padding: '0.5rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '1rem',
                                    backgroundColor: '#f9f9f9',
                                    cursor: 'pointer',
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#0070f3'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#ccc'}
                            >
                                <option value="newest">Newest</option>
                                <option value="mostUpvoted">Most Upvoted</option>
                                <option value="mostShared">Most Shared</option>
                                <option value="mostCommented">Most Commneted</option>
                            </select>
                        </div>

                        {pollElementVisible && (
                            <>
                                <input
                                    type="text"
                                    name="poll-question"
                                    placeholder="What's the poll about?"
                                    value={pollDetails.question}
                                    onChange={(e) =>
                                        setPollDetails({ ...pollDetails, question: e.target.value })
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    name="poll-option1"
                                    placeholder="Option 1 Description"
                                    value={pollDetails.option1}
                                    onChange={(e) =>
                                        setPollDetails({ ...pollDetails, option1: e.target.value })
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    name="poll-option2"
                                    placeholder="Option 2 Description"
                                    value={pollDetails.option2}
                                    onChange={(e) =>
                                        setPollDetails({ ...pollDetails, option2: e.target.value })
                                    }
                                    required
                                />
                            </>
                        )}

                        <div className={styles.bottomPrimary}>
                            <div className={styles.secondary}>
                                <label htmlFor="spoiler">
                                    <button
                                        type="button"
                                        onClick={() => setPost({ ...post, spoil: !post.spoil })}
                                    >
                                        <FontAwesomeIcon
                                            icon={faWarning}
                                            color={!post.spoil ? "#359AECff" : "#FF5D64ff"}
                                        />{" "}
                                        Spoiler
                                    </button>
                                </label>
                                <label htmlFor="hasPoll">
                                    <button
                                        type="button"
                                        onClick={() => setPollElementVisible(!pollElementVisible)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faPoll}
                                            color={!pollElementVisible ? "#359AECff" : "#FF5D64ff"}
                                        />{" "}
                                        {isPollSubmitting ? "Generating poll..." : "Poll"}
                                    </button>
                                </label>

                                <button type="submit" className={styles.submit} disabled={charCount < 0 || isPostSubmitting}>
                                    <FontAwesomeIcon
                                        icon={faPencil}
                                        color={!isPostSubmitting ? "#359AECff" : "#FF5D64ff"}
                                    />{" "}
                                    {isPostSubmitting ? "Submitting..." : "Submit post"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            <section>
                <Posts account={account} posts={posts} />
            </section>
        </>
    );
};

export default PostForm;


