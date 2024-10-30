package com.domi.dnote.Controller;

import com.domi.dnote.DTO.PostUploadDTO;
import com.domi.dnote.Entity.PostTemp;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Service.PostTempService;
import com.domi.dnote.Service.UserService;
import com.domi.dnote.Util.MiscUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/post/temp")
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
}
