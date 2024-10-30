package com.domi.dnote.Controller;

import com.domi.dnote.DTO.BasePostDTO;
import com.domi.dnote.DTO.PostUploadDTO;
import com.domi.dnote.Entity.PostTemp;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Exception.UserException;
import com.domi.dnote.Service.PostTempService;
import com.domi.dnote.Service.UserService;
import com.domi.dnote.Util.MiscUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post/temp")
public class PostTempController {
    final UserService userService;
    final PostTempService postTempService;

    @PostMapping("/upload")
    String postTempUpload(@RequestBody PostUploadDTO form) {
        User user = userService.getCurrentUser();
        String tempId = MiscUtil.randomString(10);

        PostTemp post = PostTemp.builder()
                .id(tempId)
                .tags(form.getTags())
                .content(form.getContent())
                .user(user)
                .thumbnail(null)
                .build();

        postTempService.save(post);
        return tempId;
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
