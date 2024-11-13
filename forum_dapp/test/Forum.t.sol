// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {Test, console} from "forge-std/Test.sol";
import {Forum} from "../src/Forum.sol";

contract ForumTest is Test {
    Forum public forum;

    // Part A - Test Create Post Function with Mood and Image URL
    function setUp() public {
        // create dummy address to simulate msg.sender
        vm.prank(address(1));
        string memory _title = "StackUp";
        string memory _description = "Empowering Developers at Scale!";
        bool _spoil = false;
        string memory _mood = "Excited"; 
        string memory _username = "StackUp";
        string memory _imageUrl = "https://example.com/image.png"; 
        forum = new Forum();
        
        forum.createPost(_title, _description, _spoil, _mood, _username, _imageUrl);
    }

    // Part B - Test Create Poll Function
    function testCreatePoll() public {
        forum.createPoll(1, "Enjoying the quest so far?", "Yes", "No");
        Forum.Poll memory _poll = forum.getPollFromPost(1);
        assertEq(_poll.question, "Enjoying the quest so far?");
    }

    // Part C - Test Get Post Function including Mood and Image URL
    function testGetPost() public view {
        Forum.Post memory _post = forum.getPost(1);
        assertEq(_post.title, "StackUp");
        assertEq(_post.description, "Empowering Developers at Scale!");
        assertEq(_post.spoil, false);
        assertEq(_post.mood, "Excited"); // Check mood value
        assertEq(_post.username, "StackUp");
        assertEq(_post.imageUrl, "https://example.com/image.png"); 
    }

    // Part D - Test Upvote and Downvote Post
    function testVotePost() public {
        forum.upVotePost(1);
        Forum.Post memory _post = forum.getPost(1);
        assertEq(_post.likes, 1);

        forum.incrementShareCount(1);
        assertEq(_post.shareCount, 0);
        
        forum.downVotePost(1);
        _post = forum.getPost(1);
        assertEq(_post.likes, 0);
    }
}
