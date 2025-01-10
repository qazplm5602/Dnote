package com.domi.dnote.DTO;

import com.domi.dnote.Entity.Post;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class BasePostDTO {
    protected String title;
    protected List<String> tags;
    protected String thumbnail;
    protected String content;
    protected LocalDateTime created;

    protected void initPost(Post post) {
        title = post.getTitle();
        tags = post.getTags();
        thumbnail = post.getThumbnail();
        content = post.getContent();
        created = post.getCreated();
    }

    public static BasePostDTO toEntity(Post post) {
        BasePostDTO data = new BasePostDTO();
        data.initPost(post);

        return data;
    }
}
