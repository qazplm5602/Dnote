package com.domi.dnote.Controller;

import com.domi.dnote.DTO.PostDTO;
import com.domi.dnote.DTO.PostUploadDTO;
import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Enums.FileGroup;
import com.domi.dnote.Service.FileService;
import com.domi.dnote.Service.PostService;
import com.domi.dnote.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post")
public class PostController {
    final PostService postService;
    final UserService userService;
    final FileService fileService;

    @GetMapping("/info/{user}/{id}")
    PostDTO getPostInfo(@PathVariable("user") long userId, @PathVariable("id") long postId) {
        User user = userService.getUserById(userId);
        Post post = postService.getPostByOwnerId(user, postId);

        return PostDTO.toEntity(post);
    }

    @PostMapping("/upload")
    @Transactional
    long uploadPost(@RequestBody PostUploadDTO form) {
        User user = userService.getCurrentUser();
        Post newPost = postService.createPost(user, form);

        return newPost.getId();
    }

    @PostMapping("/attachment/upload")
    String tempImageUpload(@RequestParam("domi") MultipartFile file) throws IOException {
        userService.getCurrentUser(); // 로그인 유도

        return fileService.registerFile(FileGroup.Attachment, file);
    }
}
