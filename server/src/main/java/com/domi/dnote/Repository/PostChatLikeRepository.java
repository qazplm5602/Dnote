package com.domi.dnote.Repository;

import com.domi.dnote.Entity.PostChat;
import com.domi.dnote.Entity.PostChatLike;
import com.domi.dnote.Entity.PostChatLikeId;
import com.domi.dnote.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostChatLikeRepository extends JpaRepository<PostChatLike, PostChatLikeId> {
    byte countByUserAndChat(User user, PostChat chat);
    void deleteByUserAndChat(User user, PostChat chat);
    int countByChat(PostChat chat);
}
