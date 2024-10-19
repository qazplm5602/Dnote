package com.domi.dnote.Repository;

import com.domi.dnote.Entity.User;
import com.domi.dnote.Entity.UserFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, User> {
    List<UserFollow> findByUser(User user);
    List<UserFollow> findByTarget(User target);
    Optional<UserFollow> findByUserAndTarget(User user, User target);
}
