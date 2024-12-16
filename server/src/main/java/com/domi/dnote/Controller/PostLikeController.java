package com.domi.dnote.Controller;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Service.PostLikeService;
import com.domi.dnote.Service.PostService;
import com.domi.dnote.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/post/like")
public class PostLikeController {
    private final UserService userService;
    private final PostService postService;
    private final PostLikeService postLikeService;

    @GetMapping("")
    long getPostCount(@RequestParam("user") long userId, @RequestParam("post") long postId) {
        User user = userService.getUserById(userId);
        Post post = postService.getPostByOwnerId(user, postId);

        return postLikeService.getLikeCountByPost(post);
    }

    @GetMapping("/check")
    boolean getCheckLikePost(@RequestParam("user") long targetId, @RequestParam("post") long postId) {
        User user = userService.getCurrentUser();
        User target = userService.getUserById(targetId);
        Post post = postService.getPostByOwnerId(target, postId);

        return postLikeService.hasUserLikePost(user, post);
    }

    @PutMapping()
    void setLikePost(@RequestParam("user") long targetId, @RequestParam("post") long postId) {
        User user = userService.getCurrentUser();
        User target = userService.getUserById(targetId);
        Post post = postService.getPostByOwnerId(target, postId);

        postLikeService.setUserPostLike(user, post, true);
    }

    @DeleteMapping()
    void dislikePost(@RequestParam("user") long targetId, @RequestParam("post") long postId) {
        User user = userService.getCurrentUser();
        User target = userService.getUserById(targetId);
        Post post = postService.getPostByOwnerId(target, postId);

        postLikeService.setUserPostLike(user, post, false);
    }
}
