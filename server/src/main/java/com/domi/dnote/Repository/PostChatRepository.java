package com.domi.dnote.Repository;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.PostChat;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostChatRepository extends JpaRepository<PostChat, Long> {
    public Optional<PostChat> findById(long id);
    public List<PostChat> findByPostAndCreatedIsBeforeAndReplyIsNullOrderByCreatedDesc(Post post, LocalDateTime created, Pageable pageable);
}
