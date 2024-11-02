package com.domi.dnote.Controller;

import com.domi.dnote.DTO.PostDTO;
import com.domi.dnote.DTO.PostUploadDTO;
import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Enums.FileGroup;
import com.domi.dnote.Exception.DomiException;
import com.domi.dnote.Exception.PostException;
import com.domi.dnote.Service.FileService;
import com.domi.dnote.Service.PostService;
import com.domi.dnote.Service.TempAttachService;
import com.domi.dnote.Service.UserService;
import com.domi.dnote.Util.MiscUtil;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post")
public class PostController {
    final PostService postService;
    final UserService userService;
    final FileService fileService;
    final TempAttachService tempAttachService;

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

        // 임시 저장 파일 해제하기
        List<String> tempIds = MiscUtil.getImageUrls(form.getContent());
        tempAttachService.removeFiles(tempIds);

        return newPost.getId();
    }

    @Transactional
    @DeleteMapping("/remove/{id}")
    void removePost(@PathVariable("id") long postId) {
        User user = userService.getCurrentUser();
        Post post = postService.getPostByOwnerId(user, postId);
        boolean result = postService.removePost(user, postId);

        if (!result) return; // 머임..

        List<String> images = MiscUtil.getImageUrls(post.getContent());

        for (String imageId : images) {
            try {
                fileService.removeFile(FileGroup.Attachment, imageId);
            } catch (DomiException ignored) {}
        }
    }

    @Transactional
    @PostMapping("/edit/{id}")
    void editPost(@PathVariable("id") long postId, @RequestBody PostUploadDTO form) {
        User user = userService.getCurrentUser();
        Post post = postService.getPostByOwnerId(user, postId);

        imageDiffApply(post.getContent(), form.getContent());

        post.setTitle(form.getTitle());
        post.setTags(form.getTags());
        post.setContent(form.getContent());

        postService.save(post);
    }

    @PostMapping("/attachment/upload")
    String tempImageUpload(@RequestParam("domi") MultipartFile file) throws IOException {
        userService.getCurrentUser(); // 로그인 유도
        String fileId = fileService.registerFile(FileGroup.Attachment, file);

        // 임시 파일로 지정
        tempAttachService.setAttach(fileId, 60 * 60 * 6 /* 12시간 */);

        return fileId;
    }

    public void imageDiffApply(String prev, String next) {
        Set<String> oldImages = new HashSet<String>(MiscUtil.getImageUrls(prev));
        Set<String> newImages = new HashSet<String>(MiscUtil.getImageUrls(next));

        List<String> removeImages = new ArrayList<>(); // 삭제된건 파일도 삭제해야함
        List<String> addImages = new ArrayList<>(); // 추가된 이미지는 임시 파일에서 제거해야함

        // 삭제한 이미지 감지
        oldImages.forEach(v -> {
            if (!newImages.contains(v)) // 바꿀곳에는 없다ㅏ
                removeImages.add(v);
        });

        // 추가된 이미지 감지
        newImages.forEach(v -> {
            if (!oldImages.contains(v)) // 바꿀곳에는 없다ㅏ
                addImages.add(v);
        });

        for (String imageId : removeImages) {
            try {
                fileService.removeFile(FileGroup.Attachment, imageId);
            } catch (DomiException ignored) {}
        }

        tempAttachService.removeFiles(addImages);
    }
}
