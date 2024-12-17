package com.domi.dnote.Controller;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.PostChat;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Exception.ChatException;
import com.domi.dnote.Service.PostChatService;
import com.domi.dnote.Service.PostService;
import com.domi.dnote.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class PostChatController {
    final PostChatService postChatService;
    final PostService postService;
    final UserService userService;

    @GetMapping("/post/{userId}/{postId}/chat")
    void getPostChats() {

    }

    @PostMapping("/post/{userId}/{postId}/chat")
    long createPostChat(@PathVariable("userId") long postOwnerId, @PathVariable("postId") long postId, @RequestBody String content) {
        User user = userService.getCurrentUser();
        Post post = postService.getPostByOwnerPostId(postOwnerId, postId);

        return postChatService.createPostChat(post, user, content, null);
    }

    // reply도 삭제 가능
    @DeleteMapping("/post/chat/{chatId}")
    void removePostChat() {

    }

    @GetMapping("/chat/{chatId}/reply")
    void getChatReplies() {

    }

    @PostMapping("/chat/{chatId}/reply")
    long createChatReply(@PathVariable("chatId") long targetId, @RequestBody String content) {
        User user = userService.getCurrentUser();
        PostChat replyChat = postChatService.getChatById(targetId);
        if (replyChat.getReply() != null) {
            throw new ChatException(ChatException.Type.NOT_CREATE_REPLY_CHAT);
        }

        return postChatService.createPostChat(replyChat.getPost(), user, content, replyChat);
    }
}
