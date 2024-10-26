package com.domi.dnote.Repository;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.PostId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, PostId> {
}
