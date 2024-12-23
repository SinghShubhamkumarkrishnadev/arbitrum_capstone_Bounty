import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useAccount } from "wagmi";
import Link from "next/link";

const Home: NextPage = () => {
	const { isConnected } = useAccount();

	return (
		<div className={styles.container}>
			<Head>
				<title>StackUp x Arbitrum Social Forum App</title>
				<meta content="Generated by @rainbow-me/create-rainbowkit" name="description" />
				<link href="/favicon.ico" rel="icon" />
			</Head>

			<main className={styles.main}>
				<h1 style={{ color: 'white', fontSize: '50px' }}>
					Welcome to StackUp x Arbitrum Social Forums
				</h1>

				{!isConnected && (
					<h3>Please Sign In to Interact with this Social Forum</h3>
				)}

				<ConnectButton label="Sign In" />
				<br />

				<p className={styles.description}>
					{isConnected && (
						<>
							You are now connected. Head to our{" "}
							<Link className={styles.glitter} href="/forum">
								Forum
							</Link>{" "}
							now!
						</>
					)}
				</p>
			</main>

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

		</div>
	);
};

export default Home;
