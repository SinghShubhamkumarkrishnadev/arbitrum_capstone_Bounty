// Ensure the correct hook is imported
import { useRouter } from "next/router";
import { deployedAddress } from "../../contracts/deployed-contract";
import { useEffect, useState } from "react";
import ShareablePostComponent from "../../components/ShareablePostComponent";
import Comments from "../../components/Comments";
import type { ParsedUrlQuery } from "node:querystring";
import { getAccount } from "@wagmi/core";
import config from "../../wagmi";
import Link from "next/link";
import styles from "../../styles/Custom.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadForumGetPost } from "../../contracts/generated";
import CommentForm from "../../components/CommentForm";

export interface PostIdParams extends ParsedUrlQuery {
    id: string;
}

export default function Post() {
    const account = getAccount(config);
    const router = useRouter();
    const [postId, setPostId] = useState<string>("0");

    const { data: postDetails, isError: isErrorLoadingPost } = useReadForumGetPost({
        address: deployedAddress,
        args: [BigInt(Number.parseInt(postId.trim(), 10))],
    });

    useEffect(() => {
        if (!router.isReady) return;
        if (!router.query.id) router.push("/");

        const { id: postId } = router.query as PostIdParams;
        setPostId(postId);

    }, [router.isReady, router.query, router.push]);

    return (
        <>
            {postDetails?.id && (
                <div className={styles.main}>
                    <ConnectButton />
                    {isErrorLoadingPost && "Failed to load post"}
                    <h3 style={{ marginRight: "15px", marginTop: "40px" }}>
                        <Link href="/forum" style={{ marginRight: "15px", textDecoration: "underline" }}>↞ Go back to forum</Link>{" "}
                        <Link href={"/comments"} style={{ textDecoration: "underline" }}>↶ See all comments</Link>
                    </h3>
                    <ShareablePostComponent post={postDetails} />
                    <div className={styles.card}>
                        {account.isConnected ? (
                            <CommentForm post={postDetails} />
                        ) : (
                            <h3>You must sign in to comment</h3>
                        )}
                    </div>
                    <h3>⇓⇓⇓ Comments ⇓⇓⇓</h3>
                    <Comments post={postDetails} />
                </div>
            )}

            <footer
                style={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <p>
                    Powered by ❤️<a href="https://stackup.dev" target="_blank" rel="noreferrer">
                        <span style={{ color: "red", textDecoration: "underline" }}>StackUp</span>
                    </a> and <a href="https://arbitrum.io" target="_blank" rel="noreferrer">
                        💙🧡<span style={{ color: "red", textDecoration: "underline" }}>Arbitrum</span>
                    </a> – bridging communities through decentralized technology. Join us in shaping the future of social forums!
                </p>
            </footer>
        </>
    );
}
