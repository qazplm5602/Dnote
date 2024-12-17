package com.domi.dnote.Service;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.PostChat;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Exception.ChatException;
import com.domi.dnote.Exception.FileException;
import com.domi.dnote.Repository.PostChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class PostChatService {
    private final PostChatRepository postChatRepository;

    public PostChat getChatById(long chatId) {
        return postChatRepository.findById(chatId).orElseThrow(() -> new ChatException(ChatException.Type.NOT_FOUND_CHAT));
    }

    public long createPostChat(Post post, User owner, String content, PostChat reply) {
        PostChat newChat = PostChat.builder()
                .post(post)
                .reply(reply)
                .build();

        newChat.setContent(content);
        newChat.setOwner(owner);
        newChat.setCreated(LocalDateTime.now());

        PostChat releaseChat = postChatRepository.save(newChat);
        return releaseChat.getId();
    }
}
