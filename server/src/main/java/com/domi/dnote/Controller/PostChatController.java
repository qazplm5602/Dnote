package com.domi.dnote.Controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PostChatController {
    @GetMapping("/post/{userId}/{postId}/chat")
    void getPostChats() {

    }

    @PostMapping("/post/{userId}/{postId}/chat")
    void createPostChat() {

    }

    // reply도 삭제 가능
    @DeleteMapping("/post/chat/{chatId}")
    void removePostChat() {

    }

    @GetMapping("/chat/{chatId}/reply")
    void getChatReplies() {

    }

    @PostMapping("/chat/{chatId}/reply")
    void createChatReply() {

    }
}
