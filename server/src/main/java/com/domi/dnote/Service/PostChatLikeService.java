package com.domi.dnote.Service;

import com.domi.dnote.Entity.PostChat;
import com.domi.dnote.Entity.PostChatLike;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Exception.DomiException;
import com.domi.dnote.Repository.PostChatLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PostChatLikeService {
    final PostChatLikeRepository postChatLikeRepository;

    public boolean isLikeByUser(User user, PostChat chat) {
        return postChatLikeRepository.countByUserAndChat(user, chat) > 0;
    }

    public void setLikeByUser(User user, PostChat chat, boolean active) {
        boolean currentLike = isLikeByUser(user, chat);
        if (currentLike == active) {
            throw new DomiException("POSTCHATLIKE0", "이미 설정/해제가 되어있습니다.", HttpStatus.BAD_REQUEST);
        }

        if (active) {
            postChatLikeRepository.save(new PostChatLike(user, chat));
        } else {
            postChatLikeRepository.deleteByUserAndChat(user, chat);
        }
    }

    public int getCountLikeByChat(PostChat chat) {
        return postChatLikeRepository.countByChat(chat);
    }
}
