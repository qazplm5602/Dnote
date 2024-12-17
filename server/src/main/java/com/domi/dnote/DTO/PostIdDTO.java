package com.domi.dnote.DTO;

import com.domi.dnote.Entity.Post;
import lombok.Data;

@Data
public class PostIdDTO {
    long id;
    long owner;

    public static PostIdDTO toEntity(Post post) {
        PostIdDTO dto = new PostIdDTO();
        dto.id = post.getId();
        dto.owner = post.getOwner().getId();

        return dto;
    }
}
