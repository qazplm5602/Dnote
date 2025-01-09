package com.domi.dnote.Service;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.PostChat;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Exception.ChatException;
import com.domi.dnote.Exception.FileException;
import com.domi.dnote.Repository.PostChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class PostChatService {
    private final PostChatRepository postChatRepository;
    private final int pageSize = 20;

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

    public List<PostChat> getChatsByPost(Post post, int page, LocalDateTime timeBefore) {
        Pageable pageable = PageRequest.of(page, pageSize);
        if (timeBefore == null)
            timeBefore = LocalDateTime.now();

        return postChatRepository.findByPostAndCreatedIsBeforeAndReplyIsNullOrderByCreatedDesc(post, timeBefore, pageable);
    }
    public int getChatCountByPost(Post post) {
        return postChatRepository.countByPostAndReplyIsNull(post);
    }

    public List<PostChat> getReplyChatsByChat(PostChat chat, int page, LocalDateTime timeBefore) {
        Pageable pageable = PageRequest.of(page, pageSize);
        if (timeBefore == null)
            timeBefore = LocalDateTime.now();

        return postChatRepository.findByReplyAndCreatedIsBeforeOrderByCreatedDesc(chat, timeBefore, pageable);
    }
    public int getReplyChatCount(PostChat reply) {
        return postChatRepository.countByReply(reply);
    }

    public void removeChat(PostChat chat) {
        if (chat.getReply() == null) // 그럼 이 댓글에 답글 한것도 있을 수 있음
            postChatRepository.deleteByReply(chat);

        postChatRepository.delete(chat);
    }
    public void removeChatByPost(Post post) {
        postChatRepository.deleteByPost(post);
    }
    public void editContentChat(PostChat chat, String content) {
        chat.setContent(content);
        postChatRepository.save(chat);
    }
}
