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

    public static BasePostDTO toEntity(Post post) {
        BasePostDTO data = new BasePostDTO();

        data.title = post.getTitle();
        data.tags = post.getTags();
        data.thumbnail = post.getThumbnail();
        data.content = post.getContent();
        data.created = post.getCreated();

        return data;
    }
}
