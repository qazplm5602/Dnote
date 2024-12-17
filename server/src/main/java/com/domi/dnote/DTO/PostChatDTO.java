package com.domi.dnote.DTO;

import com.domi.dnote.Entity.PostChat;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class PostChatDTO extends ChatBaseDTO {
    long id;
    long good; // 좋아요 수
    UserDTO owner;
    PostIdDTO post;
    PostIdDTO reply;

    public static PostChatDTO toEntity(PostChat chat) {
        PostChatDTO dto = new PostChatDTO();
        dto.applyData(chat);

        // ...

    }
}
