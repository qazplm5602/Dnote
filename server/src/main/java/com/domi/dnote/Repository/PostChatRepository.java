package com.domi.dnote.Repository;

import com.domi.dnote.Entity.PostChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostChatRepository extends JpaRepository<PostChat, Long> {

}
