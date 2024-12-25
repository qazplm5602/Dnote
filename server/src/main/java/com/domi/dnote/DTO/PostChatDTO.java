package com.domi.dnote.DTO;

import com.domi.dnote.Entity.PostChat;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Service.PostChatLikeService;
import com.domi.dnote.Service.PostChatService;
import com.domi.dnote.Service.UserService;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class PostChatDTO extends ChatBaseDTO {
    long id;
    long good; // 좋아요 수
    boolean my_good;
    int reply_count;
    PostIdDTO post;
    Long reply;

    public void loadMyLike(UserService userService, PostChatService postChatService, PostChatLikeService postChatLikeService) {
        User user = userService.getCurrentUserForce();
        if (user == null) return;

        PostChat chat = postChatService.getChatById(id);
        my_good = postChatLikeService.isLikeByUser(user, chat);
    }

    public static PostChatDTO toEntity(PostChat chat, PostChatLikeService postChatLikeService) {
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

        dto.good = postChatLikeService.getCountLikeByChat(chat);

        return dto;
    }

    public static PostChatDTO toEntity(PostChat chat, PostChatLikeService postChatLikeService, PostChatService chatService) {
        PostChatDTO dto = toEntity(chat, postChatLikeService);

        if (dto.reply == null) // 답글 댓글이 아님
            dto.reply_count = chatService.getReplyChatCount(chat);

        return dto;
    }
}
