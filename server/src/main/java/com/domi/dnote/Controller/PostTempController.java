package com.domi.dnote.Controller;

import com.domi.dnote.DTO.BasePostDTO;
import com.domi.dnote.DTO.PostTempPreviewDTO;
import com.domi.dnote.DTO.PostUploadDTO;
import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.PostTemp;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Enums.FileGroup;
import com.domi.dnote.Exception.DomiException;
import com.domi.dnote.Exception.UserException;
import com.domi.dnote.Service.*;
import com.domi.dnote.Util.MiscUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post/temp")
public class PostTempController {
    final UserService userService;
    final PostController postController;
    final PostTempService postTempService;
    final PostService postService;
    final TempAttachService tempAttachService;
    final FileService fileService;

    @Transactional
    @PostMapping("/upload")
    String postTempUpload(@RequestBody @Valid PostUploadDTO form) {
        User user = userService.getCurrentUser();
        String tempId = MiscUtil.randomString(10);

        PostTemp post = PostTemp.builder()
                .id(tempId)
                .title(form.getTitle())
                .tags(form.getTags())
                .content(form.getContent())
                .user(user)
                .thumbnail(form.getThumbnail())
                .created(LocalDateTime.now())
                .build();

        postTempService.save(post);

        // 임시 저장 파일 해제하기
        List<String> tempIds = MiscUtil.getImageUrls(form.getContent());
        tempAttachService.removeFiles(tempIds);

        String thumbnail = form.getThumbnail();
        if (thumbnail != null)
            tempAttachService.removeFiles(Collections.singletonList(thumbnail)); // 섬네일

        return tempId;
    }

    @Transactional
    @DeleteMapping("/remove")
    void postTempRemove(@RequestParam("id") String tempId, @RequestParam(value = "origin", required = false) Long postId) {
        User user = userService.getCurrentUser();

        // postId 가 있으면 검증하고 이미지 삭제를 안함 (임시 저장에서 게시글을 올려서)
        PostTemp postTemp = postTempService.getById(tempId);
        if (postTemp.getUser() != user)
            throw new UserException(UserException.Type.NEED_PERMISSION);

        postTempService.removeById(tempId);

        if (postId != null) {
            Post post = postService.getPostByOwnerId(user, postId);
            if (!post.getContent().equals(postTemp.getContent())) // 이거 아마 검증이 안되는듯
                throw new DomiException("POSTTEMP0", "다른 포스트 입니다.", HttpStatus.FORBIDDEN);

            return;
        }

        // 파일 삭제
        List<String> images = MiscUtil.getImageUrls(postTemp.getContent());
        for (String fileId : images) {
            try {
                fileService.removeFile(FileGroup.Attachment, fileId);
            } catch (DomiException ignored) {}
        }

        String thumbnail = postTemp.getThumbnail();
        if (thumbnail != null)
            try {
                fileService.removeFile(FileGroup.Attachment, thumbnail);
            } catch (DomiException ignored) {}
    }

    @Transactional
    @PostMapping("/edit")
    void postTempEdit(@RequestParam("id") String tempId, @RequestBody PostUploadDTO form) {
        User user = userService.getCurrentUser();
        PostTemp postTemp = postTempService.getById(tempId);

        // 다른 사람이 수정할 순 없음 ㅅㄱ
        if (user != postTemp.getUser())
            throw new UserException(UserException.Type.NEED_PERMISSION);

        // 이미지 변경 적용
        postController.imageDiffApply(postTemp.getContent(), form.getContent());

        String prevThumbnail = postTemp.getThumbnail();
        String nowThumbnail = form.getThumbnail();
        if (!Objects.equals(prevThumbnail, nowThumbnail)) {
            if (prevThumbnail != null)
                fileService.removeFile(FileGroup.Attachment, prevThumbnail);
            if (nowThumbnail != null)
                tempAttachService.removeFiles(Collections.singletonList(nowThumbnail)); // 올리는 썸네일은 temp에서 삭제
        }

        postTemp.setTitle(form.getTitle());
        postTemp.setTags(form.getTags());
        postTemp.setContent(form.getContent());
        postTemp.setThumbnail(form.getThumbnail());

        postTempService.save(postTemp);
    }

    @GetMapping("/{id}")
    BasePostDTO getTempPost(@PathVariable("id") String id) {
        User user = userService.getCurrentUser();
        PostTemp post =  postTempService.getById(id);


        // 자기꺼 아님
        if (post.getUser() != user) {
            throw new UserException(UserException.Type.NEED_PERMISSION);
        }

        BasePostDTO data = new BasePostDTO();
        data.setTitle(post.getTitle());
        data.setTags(post.getTags());
        data.setThumbnail(post.getThumbnail());
        data.setContent(post.getContent());
        data.setCreated(post.getCreated());

        return data;
    }

    @GetMapping("/list")
    List<PostTempPreviewDTO> getMyTemps() {
        User user = userService.getCurrentUser();
        return postTempService.getTempsByUser(user).stream().map(PostTempPreviewDTO::toEntity).toList();
    }
}
