export type writeContractFn = Readonly<
	| "createComment"
	| "createPoll"
	| "createPost"
	| "downVoteComment"
	| "downVotePost"
	| "upVoteComment"
	| "upVotePollOption"
	| "upVotePost"
>;

export type readContractFn = Readonly<
	| "commentIdIncrement"
	| "comments"
	| "compareStringsbyBytes"
	| "getComment"
	| "getCommentsFromPost"
	| "getPoll"
	| "getPollFromPost"
	| "getPost"
	| "getPostsFromAddress"
	| "pollIdIncrement"
>;

export type PostDetails = {
	owner: `0x${string}`;
	id: bigint;
	title: string;
	description: string;
	spoil: boolean;
	likes: bigint;
	shareCount: any;
	commentCount: any;
	timestamp: bigint;
	mood: any;
	username: string;
	imageUrl: string;
};

export type CommentDetails = {
	owner: `0x${string}`;
	id: bigint;
	title: string;
	description: string;
	spoil: boolean;
	likes: bigint;
	shareCount: any;
	commentCount: any;
	timestamp: bigint;
};

export type PollFormDetails = {
	question: string;
	option1: string;
	option2: string;
};

export type PollAllDetails = {
	id: bigint;
	question: string;
	option1: string;
	option2: string;
	option1Counter: bigint;
	option2Counter: bigint;
};