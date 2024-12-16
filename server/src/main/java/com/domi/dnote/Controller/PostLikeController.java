package com.domi.dnote.Controller;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Service.PostLikeService;
import com.domi.dnote.Service.PostService;
import com.domi.dnote.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
