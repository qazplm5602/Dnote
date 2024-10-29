package com.domi.dnote.Repository;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.PostId;
import com.domi.dnote.Entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, PostId> {
    public Optional<Post> findByOwnerAndId(User owner, long id);

    @Query("SELECT IFNULL(MAX(c.id), 0) FROM Post AS c WHERE c.owner = :user")
    long getMaxIdByOwner(@Value("user") User user);

    @Modifying
    byte deleteByOwnerAndId(User owner, long id);
}
