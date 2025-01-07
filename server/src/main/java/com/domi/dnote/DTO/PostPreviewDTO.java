package com.domi.dnote.DTO;

import com.domi.dnote.Entity.Post;

public class PostPreviewDTO extends PostDTO {
    public static PostDTO toEntity(Post post) {
        PostDTO dto = PostDTO.toEntity(post);
        dto.setContent(post.getContentPreview());
        return dto;
    }
}
