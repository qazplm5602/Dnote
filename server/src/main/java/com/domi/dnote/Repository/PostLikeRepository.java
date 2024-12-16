package com.domi.dnote.Repository;

import com.domi.dnote.Entity.PostLike;
import com.domi.dnote.Entity.PostLikeId;
import com.domi.dnote.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, PostLikeId> {
    public long countByTargetAndPost(User target, long post);
}
