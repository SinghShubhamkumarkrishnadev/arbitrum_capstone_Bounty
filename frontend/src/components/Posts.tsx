import type { Address } from "viem";
import type { PostDetails } from "../types/posts/types";
import ShareablePostComponent from "./ShareablePostComponent";

const Posts = ({
	posts,
	account,
}: { posts: PostDetails[]; account: Address | undefined }) => {
	if (account === undefined)
		return (
			<>
				<h3>Account is disconnected. Please connect to load posts</h3>
			</>
		);
	return (
		<>
			<h3 style={{display: 'flex', justifyContent: 'center'}}>⇓⇓⇓ All Posts ⇓⇓⇓</h3>
			{posts.map((post) => (
				<ShareablePostComponent post={post} key={post.id} />
			))}
		</>
	);
};

export default Posts;