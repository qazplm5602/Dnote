package com.domi.dnote.Repository;

import com.domi.dnote.Entity.User;
import com.domi.dnote.Entity.UserFollow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserFollowRepository extends JpaRepository<UserFollow, User> {

}
