package com.domi.dnote.DTO;

import com.domi.dnote.Entity.Post;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PostDTO {
    private long id;
    private long owner;

    private String title;
    private List<String> tags;
    private String thumbnail;
    private long view;
    private String content;
    private int read;
    private LocalDateTime created;

    public static PostDTO toEntity(Post post) {
        PostDTO data = new PostDTO();

        data.owner = post.getOwner().getId();
        data.id = post.getId();

        data.title = post.getTitle();
        data.tags = post.getTags();

        data.thumbnail = post.getThumbnail();
        data.view = post.getViewCount();
        data.content = post.getContent();
        data.read = post.getReadTime();
        data.created = post.getCreated();

        return data;
    }

}
