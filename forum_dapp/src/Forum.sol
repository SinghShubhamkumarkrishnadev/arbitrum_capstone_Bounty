// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Forum {

    // post struct
    struct Post {
        address owner;
        uint256 id;
        string title;
        string description;
        bool spoil;
        uint256 likes;
        uint256 commentCount;
        uint256 shareCount;
        uint256 timestamp;
        string mood; 
        string username; 
        string imageUrl; 
    }

    // comment struct
    struct Comment {
        address owner;
        uint256 id;
        string title;
        string description;
        bool spoil;
        uint256 likes;
        uint256 commentCount;
        uint256 shareCount;
        uint256 timestamp;
    }

    // poll struct
    struct Poll {
        uint256 id;
        string question;
        string option1;
        string option2;
        uint256 option1Counter;
        uint256 option2Counter;
    }

    uint256 public postIdIncrement = 1;
    uint256 public pollIdIncrement = 1;
    uint256 public commentIdIncrement = 1;
    uint256 public dailyLimit = 5; 

    mapping(address => uint256[]) private userPosts; // Map user to post IDs
    mapping(uint256 => Post) public posts; // Map postId to posts
    mapping(uint256 => Poll) public polls; // Map pollId to polls
    mapping(uint256 => Comment) public comments; // Map commentId to comments
    mapping(uint256 => uint256) public postToPoll; // Map postId to pollId
    mapping(uint256 => uint256[]) private postToComments; // Map postId to commentId[]
    mapping(address => uint256[]) private userComments; // Map address to comment IDs
    mapping(address => uint256[]) private userPolls; // Map address to poll IDs
    mapping(address => mapping(uint256 => uint256)) public dailyPosts; // Track daily posts for each user

    event PostSubmitted(address indexed userAddress, Post post);

    function createPost(string memory _title, string memory _description, bool _spoil, string memory _mood, string memory _username, string memory _imageUrl) public returns (uint256) {
        uint256 today = block.timestamp / 1 days;
        require(dailyPosts[msg.sender][today] < dailyLimit, "Daily post limit reached");

        uint256 postId = postIdIncrement++;
        posts[postId] = Post(msg.sender, postId, _title, _description, _spoil, 0, 0, 0, block.timestamp, _mood, _username, _imageUrl); 
        userPosts[msg.sender].push(postId);

        dailyPosts[msg.sender][today]++;

        emit PostSubmitted(msg.sender, posts[postId]);
        return postId;
    }

    function createPoll(uint256 _postId, string memory _question, string memory _option1, string memory _option2)
        public
        returns (uint256)
    {
        require(_postId <= postIdIncrement, "Post does not exist!");
        uint256 pollId = pollIdIncrement++;
        polls[pollId] = Poll(pollId, _question, _option1, _option2, 0, 0);
        postToPoll[_postId] = pollId;
        userPolls[msg.sender].push(pollId);
        return pollId;
    }

    function createComment(uint256 _postId, string memory _title, string memory _description, bool _spoil)
        public
        returns (uint256)
    {
        require(_postId <= postIdIncrement, "Post does not exist!");
        uint256 commentId = commentIdIncrement++;
        comments[commentId] = Comment(msg.sender, commentId, _title, _description, _spoil, 0, 0, 0, block.timestamp);
        postToComments[_postId].push(commentId);
        userComments[msg.sender].push(commentId);
        Post storage post = posts[_postId];
        post.commentCount += 1;
        return commentId;
    }

    function getPostsFromAddress(address _user) public view returns (uint256[] memory) {
        return userPosts[_user];
    }

    function getPost(uint256 _postId) public view returns (Post memory) {
        require(_postId <= postIdIncrement, "Post does not exist!");
        return posts[_postId];
    }

    function getPollFromPost(uint256 _postId) public view returns (Poll memory) {
        require(_postId <= postIdIncrement, "Post does not exist!");
        uint256 _pollId = postToPoll[_postId];
        Poll memory poll = getPoll(_pollId);
        return poll;
    }

    function getPoll(uint256 _pollId) public view returns (Poll memory) {
        require(_pollId <= pollIdIncrement, "Poll does not exist!");
        return polls[_pollId];
    }

    function getCommentsFromPost(uint256 _postId) public view returns (uint256[] memory) {
        require(_postId <= postIdIncrement, "Post does not exist!");
        return postToComments[_postId];
    }

    function getComment(uint256 _commentId) public view returns (Comment memory) {
        require(_commentId <= commentIdIncrement, "Comment does not exist!");
        return comments[_commentId];
    }

    function upVotePost(uint256 _postId) public {
        require(_postId <= postIdIncrement, "Post does not exist!");
        Post storage post = posts[_postId];
        post.likes += 1;
    }

    function downVotePost(uint256 _postId) public {
        require(_postId <= postIdIncrement, "Post does not exist!");
        Post storage post = posts[_postId];
        post.likes -= 1;
    }

    function incrementShareCount(uint256 _postId) public {
        require(_postId <= postIdIncrement, "Post does not exist!");
        Post storage post = posts[_postId];
        post.shareCount += 1;
    }

    function upVoteComment(uint256 _commentId) public {
        require(_commentId <= commentIdIncrement, "Comment does not exist!");
        Comment storage comment = comments[_commentId];
        comment.likes += 1;
    }

    function downVoteComment(uint256 _commentId) public {
        require(_commentId <= commentIdIncrement, "Comment does not exist!");
        Comment storage comment = comments[_commentId];
        comment.likes -= 1;
    }

    function upVotePollOption(uint256 _postId, string memory option) public {
        require(_postId <= postIdIncrement, "Post does not exist!");
        Poll storage poll = polls[postToPoll[_postId]];
        if (compareStringsbyBytes(poll.option1, option)) {
            poll.option1Counter++;
        } else if (compareStringsbyBytes(poll.option2, option)) {
            poll.option2Counter++;
        } else {
            revert("Not a valid option");
        }
    }

    function compareStringsbyBytes(string memory s1, string memory s2) public pure returns (bool) {
        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }
}