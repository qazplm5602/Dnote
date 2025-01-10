package com.domi.dnote.DTO;

import com.domi.dnote.Entity.Post;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PostDTO extends PostPreviewDTO {
    private String previewContent;
    private long view;
    private int read;

    @Override
    protected void initPost(Post post) {
        super.initPost(post);

        content = post.getContent();
        previewContent = post.getContentPreview();
        view = post.getViewCount();
        read = post.getReadTime();
    }

    public static PostDTO toEntity(Post post) {
        PostDTO data = new PostDTO();
        data.initPost(post);

        return data;
    }
}
