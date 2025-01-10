package com.domi.dnote.Controller;

import com.domi.dnote.DTO.*;
import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Enums.FileGroup;
import com.domi.dnote.Enums.PostSort;
import com.domi.dnote.Exception.DomiException;
import com.domi.dnote.Exception.PostException;
import com.domi.dnote.Service.*;
import com.domi.dnote.Util.MiscUtil;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post")
public class PostController {
    final PostService postService;
    final UserService userService;
    final FileService fileService;
    final TempAttachService tempAttachService;
    final AggregateViewService aggregateViewService;

    final int VIEW_ACCEPT_TIME = 10; // 10초 이후 view 카운팅
    private final PostChatService postChatService;
    Map<String, PostViewTokenDTO> viewTokens = new HashMap<>();

    @GetMapping("/info/{user}/{id}")
    PostDTO getPostInfo(@PathVariable("user") long userId, @PathVariable("id") long postId) {
        User user = userService.getUserById(userId);
        Post post = postService.getPostByOwnerId(user, postId);

        return PostDTO.toEntity(post);
    }

    @GetMapping("/user/{user}")
    PostPageResultDTO getUserPosts(@ModelAttribute @Valid PostUserParamDTO form) {
        User user = userService.getUserById(form.getUser());
        Pageable page = PageRequest.of(form.getPage(), form.getSize());

        PostSort sortType = PostSort.Popular;
        switch (form.getSort()) {
            case 0 -> sortType = PostSort.Popular;
            case 1 -> sortType = PostSort.Latest;
            case 2 -> sortType = PostSort.Oldest;
        }

        Page<Post> posts = postService.getPostsByUser(user, page, sortType);
        return PostPageResultDTO.toEntity(posts);
    }

    @PostMapping("/upload")
    @Transactional
    long uploadPost(@RequestBody @Valid PostUploadDTO form) {
        User user = userService.getCurrentUser();
        Post newPost = postService.createPost(user, form);

        // 임시 저장 파일 해제하기
        List<String> tempIds = MiscUtil.getImageUrls(form.getContent());
        tempAttachService.removeFiles(tempIds);

        // 섬네일 임시 저장 파일 해제
        String thumbnail = form.getThumbnail();
        if (thumbnail != null)
            tempAttachService.removeFiles(Collections.singletonList(thumbnail));

        return newPost.getId();
    }

    @Transactional
    @DeleteMapping("/remove/{id}")
    void removePost(@PathVariable("id") long postId) {
        User user = userService.getCurrentUser();
        Post post = postService.getPostByOwnerId(user, postId);

        postChatService.removeChatByPost(post);
        boolean result = postService.removePost(user, postId);

//        if (!result) return; // 머임..
        if (!result) // 익셉션 일어나게 해서 db 취소함 (트랜잭션)
            throw new PostException(PostException.Type.FAILD_REMOVE_POST);

        List<String> images = MiscUtil.getImageUrls(post.getContent());

        for (String imageId : images) {
            try {
                fileService.removeFile(FileGroup.Attachment, imageId);
            } catch (DomiException ignored) {}
        }

        String thumbnail = post.getThumbnail();
        if (thumbnail != null)
            try {
                fileService.removeFile(FileGroup.Attachment, thumbnail);
            } catch (DomiException ignored) {}
    }

    @Transactional
    @PostMapping("/edit/{id}")
    void editPost(@PathVariable("id") long postId, @RequestBody PostUploadDTO form) {
        User user = userService.getCurrentUser();
        Post post = postService.getPostByOwnerId(user, postId);

        imageDiffApply(post.getContent(), form.getContent());

        String prevThumbnail = post.getThumbnail();
        String nowThumbnail = form.getThumbnail();
        if (!Objects.equals(prevThumbnail, nowThumbnail)) {
            if (prevThumbnail != null)
                fileService.removeFile(FileGroup.Attachment, prevThumbnail);
            if (nowThumbnail != null)
                tempAttachService.removeFiles(Collections.singletonList(nowThumbnail)); // 올리는 썸네일은 temp에서 삭제
        }

        post.setTitle(form.getTitle());
        post.setTags(form.getTags());
        post.setContent(form.getContent());
        post.setContentPreview(postService.createContentPreview(form.getContent()));
        post.setReadTime(postService.calculateReadTime(form.getContent()));
        post.setThumbnail(form.getThumbnail());

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

    // view
    @PutMapping("/view")
    String getViewToken(@RequestParam("user") long userId, @RequestParam("post") long postId) {
        User user = userService.getUserById(userId);
        postService.getPostByOwnerId(user, postId); // 게시물 있는지만 확인

        String token = MiscUtil.randomString(30);
        PostViewTokenDTO form = new PostViewTokenDTO(userId, postId, LocalDateTime.now());
        viewTokens.put(token, form);

        return token;
    }

    @PostMapping("/view")
    void addViewCount(@RequestBody String token) {
        PostViewTokenDTO form = viewTokens.get(token);
        if (form == null)
            throw new DomiException("POSTVIEW0", "private domi error", HttpStatus.FORBIDDEN);

        // 시간 확인
        Duration durationTime = Duration.between(form.getCreatedAt(), LocalDateTime.now());
        if (durationTime.getSeconds() < VIEW_ACCEPT_TIME)
            throw new DomiException("POSTVIEW1", "private domi error", HttpStatus.FORBIDDEN);

        // 게시물 불러오깅
        User user = userService.getUserById(form.getUserId());
        Post post = postService.getPostByOwnerId(user, form.getPostId());

        // 토큰 지우고
        viewTokens.remove(token);

        post.setViewCount(post.getViewCount() + 1); // 카운팅
        postService.save(post);
    }

    @DeleteMapping("/view")
    void removeViewToken(@RequestBody String token) {
        viewTokens.remove(token);
    }

    // 인기 post
    @GetMapping("/popular")
    List<PostPreviewDTO> getPopularPosts(@RequestParam(name = "size", required = false) Byte size, @RequestParam(name = "random", required = false) Boolean random) {
        List<PostPopularityDTO> posts = aggregateViewService.getPopularPosts();

        if (random != null) {
            List<PostPopularityDTO> origin = posts;
            posts = new ArrayList<>(origin); // 복사

            for (int i = 0; i < posts.size(); i++) {
                int idx = MiscUtil.randomInt(0, posts.size() - 1);
                int idx2 = MiscUtil.randomInt(0, posts.size() - 1);
                Collections.swap(posts, idx, idx2);
            }
        }

        if (size != null) {
            List<PostPopularityDTO> origin = posts;
            posts = new ArrayList<>();

            for (byte i = 0; i < Math.min(origin.size(), size); i++) {
                posts.add(origin.get(i));
            }
        }

        return posts.stream().map(v -> PostPreviewDTO.toEntity(v.getPost())).toList();
    }
}
