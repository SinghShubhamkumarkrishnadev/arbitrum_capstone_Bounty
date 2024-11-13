import { useWaitForTransactionReceipt } from "wagmi";
import { deployedAddress } from "../contracts/deployed-contract";
import styles from "../styles/Custom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpLong } from "@fortawesome/free-solid-svg-icons";
import {
	useReadForumGetPollFromPost,
	useWriteForumUpVotePollOption,
} from "../contracts/generated";

const Poll = ({ postId }: { postId: bigint }) => {
	const { data: pollDetails } = useReadForumGetPollFromPost({
		address: deployedAddress,
		args: [postId],
	});

	let voteCounter1 = pollDetails?.option1Counter;
	let voteCounter2 = pollDetails?.option2Counter;

	const { data: option1TxHash, writeContractAsync: votingOption1 } =
		useWriteForumUpVotePollOption();
	const { data: option2TxHash, writeContractAsync: votingOption2 } =
		useWriteForumUpVotePollOption();

	const { isLoading: isVotingOption1, isSuccess: hasVotedOption1 } =
		useWaitForTransactionReceipt({
			hash: option1TxHash,
		});

	const { isLoading: isVotingOption2, isSuccess: hasVotedOption2 } =
		useWaitForTransactionReceipt({
			hash: option2TxHash,
		});

	if (hasVotedOption1 && voteCounter1 !== undefined) voteCounter1 += BigInt(1);
	if (hasVotedOption2 && voteCounter2 !== undefined) voteCounter2 += BigInt(1);

	return (
		<>
			{pollDetails?.id && (
				<div
					className={styles.card}
					style={{
						border: "1px solid #ddd",
						borderRadius: "8px",
						width: "90%",
						backgroundColor: "#fff",
						display: "flex",
						flexDirection: "column",
						boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
						padding: "16px",
						marginBottom: "20px",
					}}
				>
					<h1
						style={{
							fontSize: "18px",
							fontWeight: "bold",
							color: "#333",
							marginBottom: "16px",
						}}
					>
						Here is the poll: {pollDetails?.question}
					</h1>
					<div className={styles.form}>
						<button
							className={styles.pollButton}
							type="button"
							title="Up Vote Poll 1"
							onClick={() => {
								votingOption1({
									address: deployedAddress,
									args: [postId, pollDetails?.option1.trim()],
								});
							}}
							style={{
								padding: "10px 20px",
								border: "1px solid #ddd",
								borderRadius: "4px",
								backgroundColor: "#f9f9f9",
								cursor: "pointer",
								marginBottom: "10px",
								width: "100%",
								textAlign: "left",
								fontSize: "16px",
								color: "#333",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								whiteSpace: "nowrap",        
								overflowY: "auto",          
								textOverflow: "ellipsis",
							}}
						>
							{isVotingOption1 ? (
								<>Voting... {pollDetails?.option1}</>
							) : (
								<>
									<FontAwesomeIcon icon={faArrowUpLong} />
									<span style={{ flex: "1", marginLeft: "8px" }}>
										{pollDetails?.option1}
									</span>
								</>
							)}
							<span>{voteCounter1?.toString()}</span>
						</button>
						<button
							className={styles.pollButton}
							type="button"
							title="Up Vote Poll 2"
							onClick={() => {
								votingOption2({
									address: deployedAddress,
									args: [postId, pollDetails?.option2.trim()],
								});
							}}
							style={{
								padding: "10px 20px",
								border: "1px solid #ddd",
								borderRadius: "4px",
								backgroundColor: "#f9f9f9",
								cursor: "pointer",
								width: "100%",
								textAlign: "left",
								fontSize: "16px",
								color: "#333",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								whiteSpace: "nowrap",        
								overflowY: "auto",          
								textOverflow: "ellipsis",
							}}
						>
							{isVotingOption2 ? (
								<>Voting... {pollDetails?.option2}</>
							) : (
								<>
									<FontAwesomeIcon icon={faArrowUpLong} />
									<span style={{ flex: "1", marginLeft: "8px" }}>
										{pollDetails?.option2}
									</span>
								</>
							)}
							<span>{voteCounter2?.toString()}</span>
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Poll;
