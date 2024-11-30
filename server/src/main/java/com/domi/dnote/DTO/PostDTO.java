package com.domi.dnote.DTO;

import com.domi.dnote.Entity.Post;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PostDTO extends BasePostDTO {
    private long id;
    private UserDTO owner;

    private long view;
    private int read;

    public static PostDTO toEntity(Post post) {
        PostDTO data = new PostDTO();

//        data.owner = post.getOwner().getId();
        data.owner = UserDTO.toEntity(post.getOwner());
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
