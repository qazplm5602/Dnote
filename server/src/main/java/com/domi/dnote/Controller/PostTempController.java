package com.domi.dnote.Controller;

import com.domi.dnote.DTO.BasePostDTO;
import com.domi.dnote.DTO.PostUploadDTO;
import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.PostTemp;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Enums.FileGroup;
import com.domi.dnote.Exception.DomiException;
import com.domi.dnote.Exception.UserException;
import com.domi.dnote.Service.*;
import com.domi.dnote.Util.MiscUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post/temp")
public class PostTempController {
    final UserService userService;
    final PostTempService postTempService;
    final PostService postService;
    final TempAttachService tempAttachService;
    final FileService fileService;

    @Transactional
    @PostMapping("/upload")
    String postTempUpload(@RequestBody PostUploadDTO form) {
        User user = userService.getCurrentUser();
        String tempId = MiscUtil.randomString(10);

        PostTemp post = PostTemp.builder()
                .id(tempId)
                .title(form.getTitle())
                .tags(form.getTags())
                .content(form.getContent())
                .user(user)
                .thumbnail(null)
                .created(LocalDateTime.now())
                .build();

        postTempService.save(post);

        // 임시 저장 파일 해제하기
        List<String> tempIds = MiscUtil.getImageUrls(form.getContent());
        tempAttachService.removeFiles(tempIds);

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
            if (post.getContent().equals(postTemp.getContent())) // 이거 아마 검증이 안되는듯
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
}
