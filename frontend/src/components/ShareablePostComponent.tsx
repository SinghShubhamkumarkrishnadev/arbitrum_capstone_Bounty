import type { PostDetails } from "../types/posts/types";
import CommonVoteStubs from "./CommonVoteStubs";
import { FaUser, FaThumbsUp } from "react-icons/fa";
import Poll from "./Poll";

const ShareablePostComponent = ({ post }: { post: PostDetails }) => {

    const isVideo = (url: string) => {
        return url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg");
    };

    return (
        <article
            key={post.id}
            style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                maxWidth: "600px",
                margin: "20px auto",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
        >
            {/* Header with User Info */}
            <div style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ddd",
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#f0f0f0",
                    marginRight: "12px",
                }}>
                    <FaUser style={{ fontSize: "20px", color: "#555" }} title={`User: ${post.username}`} />
                </div>
                <div>
                    <h3 style={{ fontSize: "18px", color: "#333", margin: 0 }} title="User Address">
                        {post.owner}
                    </h3>
                    {post.username && (
                        <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                            @{post.username}
                        </p>
                    )}
                </div>
            </div>

            {/* Image Display */}
            {post.imageUrl ? (
                <div style={{
                    height: "400px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f9f9f9"
                }}>
                    {isVideo(post.imageUrl) ? (
                        <video
                            controls
                            src={post.imageUrl}
                            style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                objectFit: "cover"
                            }}
                            title="Post video"
                        />
                    ) : (
                        <img
                            src={post.imageUrl}
                            alt="Post image"
                            style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                objectFit: "cover"
                            }}
                            title="Image"
                        />
                    )}
                </div>
            ) : (
                <div style={{
                    backgroundColor: "#eee",
                    height: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <span style={{ fontSize: "24px", color: "#999" }}>Currently Unavailable, Coming Soon</span>
                </div>
            )}


            {/* Post Content */}
            <div style={{ padding: "16px" }}>
                <div
                    style={{
                        textDecoration: "none",
                        color: "#333",
                        fontSize: "18px",
                        fontWeight: "bold",
                        marginBottom: "8px",
                        display: "block",
                    }}
                    title={`Title: ${post.title}`}
                >
                    <FaThumbsUp style={{ marginRight: "8px" }} /> {post.title}
                </div>
                {post.mood && (
                    <p style={{ fontSize: "14px", color: "#666", margin: "8px 0" }}>
                        <strong>Mood:</strong> {post.mood}
                    </p>
                )}

                {/* Description Wrapper */}
                <div style={{
                    maxHeight: "150px",
                    overflowY: "auto",
                    padding: "8px",
                }}
                    title="Description"
                >
                    <p style={{ fontSize: "14px", color: "#333", margin: 0 }}>
                        {post.description}
                    </p>
                </div>
            </div>

            {/* Poll Section */}
            <div style={{
                paddingLeft: "15px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}>
                <Poll postId={post.id} />
            </div>


            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderTop: "1px solid #ddd",
            }}>
                <CommonVoteStubs
                    key={post.id}
                    id={post.id}
                    likes={post.likes}
                    shareCount={post.shareCount}
                    commentCount={post.commentCount}
                    upVoteFn={"upVotePost"}
                    downVoteFn={"downVotePost"}
                    getFn={"getPost"}
                />
            </div>
        </article>
    );
};

export default ShareablePostComponent;
