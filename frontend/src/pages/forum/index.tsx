import { useState } from "react";
import PostForm from "../../components/PostForm";
import styles from "../../styles/Custom.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useAccountEffect } from "wagmi";

const Forum = () => {
	const [account, setAccount] = useState(useAccount()?.address);
	useAccountEffect({
		onConnect(data) {
			setAccount(data.address);
		},
		onDisconnect() {
			console.log("Account Disconnected");
			setAccount(undefined);
		},
	});
	return (
		<>
			<div className={styles.main}>
				<header>
					<nav>
						<ConnectButton
							label={account === undefined ? "Connect Wallet To Post" : ""}
						/>
					</nav>
				</header>

				<div>
					<PostForm account={account} />
				</div>
			</div>

			<footer
				style={{
					display: "flex",
					justifyContent: "center",
					textAlign: "center",
					marginTop: "-60px",
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
};

export default Forum;