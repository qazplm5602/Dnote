package com.domi.dnote.DTO;

import com.domi.dnote.Entity.Post;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostPreviewDTO extends BasePostDTO {
    private long id;
    private UserDTO owner;

    @Override
    protected void initPost(Post post) {
        super.initPost(post);

        id = post.getId();
        owner = UserDTO.toEntity(post.getOwner());
        content = post.getContentPreview();
    }

    public static PostPreviewDTO toEntity(Post post) {
        PostPreviewDTO dto = new PostPreviewDTO();
        dto.initPost(post);

        return dto;
    }
}
