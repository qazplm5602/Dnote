package com.domi.dnote.Repository;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.PostId;
import com.domi.dnote.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, PostId> {
    public Optional<Post> findByOwnerAndId(User owner, long id);
}
