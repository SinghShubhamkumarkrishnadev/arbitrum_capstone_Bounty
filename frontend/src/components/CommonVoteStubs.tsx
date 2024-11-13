import config from "../wagmi";
import Link from "next/link";
import { useState } from "react";
import {
	simulateContract,
	writeContract,
	waitForTransactionReceipt,
	readContract,
} from "@wagmi/core";
import { deployedAddress, ABI } from "../contracts/deployed-contract";
import type {
	PostDetails,
	CommentDetails,
	writeContractFn,
	readContractFn,
} from "../types/posts/types";
import { FaHeart, FaShareAlt, FaCommentDots } from "react-icons/fa";

const CommonVoteStubs = ({
	id,
	likes,
	shareCount,
	commentCount,
	upVoteFn,
	downVoteFn,
	getFn,
}: {
	id: bigint;
	likes: bigint;
	shareCount: any;
	commentCount: any;
	upVoteFn: writeContractFn;
	downVoteFn: writeContractFn;
	getFn: readContractFn;
}) => {
	const [likeCounter, setLikeCounter] = useState(likes);
	const [shareCountV, setShareCount] = useState(shareCount || 0);
	const [commentCountV, setCommentCount] = useState(commentCount || 0);
	const [isShareModalOpen, setShareModalOpen] = useState(false);


	const handleUpvote = async () => {
		const { result } = await simulateContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: upVoteFn,
			args: [id],
		});

		console.log(result);

		const upvoteTxHash = await writeContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: upVoteFn as writeContractFn,
			args: [id],
		});

		const transaction = await waitForTransactionReceipt(config, {
			hash: upvoteTxHash,
		});

		if (transaction.status === "reverted") {
			alert("Upvoting failed! Transaction was reverted due to an error!");
			return;
		}

		const postOrComment: PostDetails | CommentDetails = (await readContract(
			config,
			{
				abi: ABI,
				address: deployedAddress,
				functionName: getFn,
				args: [id],
			},
		)) as PostDetails | CommentDetails;

		setLikeCounter(postOrComment.likes);
	};

	const handleDownVote = async () => {
		const { result } = await simulateContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: downVoteFn,
			args: [id],
		});

		console.log(result);

		const downvoteTxHash = await writeContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: downVoteFn,
			args: [id],
		});

		const transaction = await waitForTransactionReceipt(config, {
			hash: downvoteTxHash,
		});

		if (transaction.status === "reverted") {
			alert("Downvoting failed! Transaction was reverted due to an error!");
			return;
		}

		const postOrComment: PostDetails | CommentDetails = (await readContract(
			config,
			{
				abi: ABI,
				address: deployedAddress,
				functionName: getFn,
				args: [id],
			},
		)) as PostDetails | CommentDetails;

		setLikeCounter(postOrComment.likes);
	};

	const handleShare = async () => {
		// Call simulateContract to ensure that the share increment function is valid
		const { result } = await simulateContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: "incrementShareCount", 
			args: [id],
		});

		console.log(result);

		// Write transaction for incrementing the share count
		const shareTxHash = await writeContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: "incrementShareCount", 
			args: [id],
		});

		const transaction = await waitForTransactionReceipt(config, {
			hash: shareTxHash,
		});

		if (transaction.status === "reverted") {
			alert("Sharing failed! Transaction was reverted due to an error!");
			return;
		}

		// Retrieve updated share count from contract
		const postOrComment: PostDetails | CommentDetails = (await readContract(
			config,
			{
				abi: ABI,
				address: deployedAddress,
				functionName: getFn,
				args: [id],
			},
		)) as PostDetails | CommentDetails;

		setShareCount(postOrComment.shareCount);
		setShareModalOpen(true);
	};

	// Function to copy the share link to clipboard
	const copyLinkToClipboard = () => {
		const shareLink = `${window.location.href.replace('/forum', '').replace(/\/posts\/\d+$/, '')}/posts/${id}`;
		navigator.clipboard.writeText(shareLink);
		alert("Link copied to clipboard!");
	};


	return (
		<>  <div style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "space-around",
			padding: "10px",
			backgroundColor: "#f5f5f5",
			borderRadius: "5px",
			gap: "103px"
		}}
		>
			<button onClick={handleUpvote} style={buttonStyle} title="Up Vote">
				<FaHeart style={{ marginRight: "6px", color: "#FF6347" }} /> {likeCounter.toString()}
			</button>
			<button onClick={handleDownVote} style={buttonStyle} title="Down Vote">
				💔
			</button>
			<button onClick={handleShare} style={buttonStyle} title="Share">
				<FaShareAlt style={{ marginRight: "6px", color: "#1E90FF" }} /> {shareCountV.toString()}
			</button>
			<Link href={{ pathname: "/posts/[id]", query: { id: id.toString() } }} passHref>
				<button style={buttonStyle} title="Comment">
					<FaCommentDots style={{ marginRight: "6px", color: "#FFA500" }} /> {commentCountV.toString()}
				</button>
			</Link>

			{/* Share Modal */}
			{isShareModalOpen && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div
						style={{
							backgroundColor: "#fff",
							padding: "20px",
							borderRadius: "8px",
							width: "300px",
							textAlign: "center",
						}}
					>
						<p>Successfully shared! Here’s the link to copy or share:</p>
						<input
							type="text"
							value={`${window.location.href.replace('/forum', '').replace(/\/posts\/\d+$/, '')}/posts/${id}`}
							readOnly
							style={{
								width: "100%",
								padding: "8px",
								marginBottom: "10px",
								borderRadius: "4px",
								border: "1px solid #ddd",
								textAlign: "center",
							}}
						/>
						<button
							onClick={copyLinkToClipboard}
							style={{
								display: "block",
								width: "100%",
								padding: "10px",
								borderRadius: "6px",
								background: "#4caf50",
								color: "#fff",
								cursor: "pointer",
								fontSize: "16px",
								marginBottom: "10px",
							}}
						>
							Copy Link
						</button>
						<button
							onClick={() => setShareModalOpen(false)}
							style={{
								display: "block",
								width: "100%",
								padding: "10px",
								borderRadius: "6px",
								background: "#f44336",
								color: "#fff",
								cursor: "pointer",
								fontSize: "16px",
							}}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
		</>
	);
};

const buttonStyle = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	padding: "8px 12px",
	borderRadius: "8px",
	background: "#f1f1f1",
	border: "1px solid #ccc",
	cursor: "pointer",
	fontSize: "16px",
	color: "#333",
	gap: "5px",
	transition: "background-color 0.2s, color 0.2s",
};

export default CommonVoteStubs;