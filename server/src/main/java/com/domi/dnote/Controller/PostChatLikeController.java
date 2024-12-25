package com.domi.dnote.Controller;

import com.domi.dnote.Entity.PostChat;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Service.PostChatLikeService;
import com.domi.dnote.Service.PostChatService;
import com.domi.dnote.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/api/chat")
@RestController
public class PostChatLikeController {
    final UserService userService;
    final PostChatService postChatService;
    final PostChatLikeService postChatLikeService;

    @PutMapping("/{id}")
    void setChatLike(@PathVariable int id) {
        User user = userService.getCurrentUser();
        PostChat chat = postChatService.getChatById(id);

        postChatLikeService.setLikeByUser(user, chat, true);
    }

    @DeleteMapping("/{id}")
    void removeChatLike(@PathVariable int id) {
        User user = userService.getCurrentUser();
        PostChat chat = postChatService.getChatById(id);

        postChatLikeService.setLikeByUser(user, chat, false);
    }
}
