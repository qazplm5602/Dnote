package com.domi.dnote.DTO;

import com.domi.dnote.Entity.PostChat;
import com.domi.dnote.Service.PostChatService;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class PostChatDTO extends ChatBaseDTO {
    long id;
    long good; // 좋아요 수
    int reply_count;
    PostIdDTO post;
    Long reply;

    public static PostChatDTO toEntity(PostChat chat) {
        PostChatDTO dto = new PostChatDTO();
        dto.applyData(chat);

        // ...
        dto.id = chat.getId();
//        dto.good =
//        dto.owner = UserDTO.toEntity(chat.getOwner());
        dto.post = PostIdDTO.toEntity(chat.getPost());

        PostChat replyChat = chat.getReply();
        if (replyChat != null)
            dto.reply = replyChat.getId();

        return dto;
    }

    public static PostChatDTO toEntity(PostChat chat, PostChatService chatService) {
        PostChatDTO dto = toEntity(chat);

        if (dto.reply == null) // 답글 댓글이 아님
            dto.reply_count = chatService.getReplyChatCount(chat);

        return dto;
    }
}
