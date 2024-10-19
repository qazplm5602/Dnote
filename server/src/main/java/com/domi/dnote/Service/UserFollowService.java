package com.domi.dnote.Service;

import com.domi.dnote.Entity.User;
import com.domi.dnote.Entity.UserFollow;
import com.domi.dnote.Repository.UserFollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserFollowService {
    final UserFollowRepository userFollowRepository;

    public List<UserFollow> getFollowings(User user) {
        return userFollowRepository.findByUser(user);
    }

    public List<UserFollow> getFollowers(User user) {
        return userFollowRepository.findByTarget(user);
    }

    public boolean hasFollow(User user, User target) {
        Optional<UserFollow> userFollow = userFollowRepository.findByUserAndTarget(user, target);
        return userFollow.isPresent();
    }

    public void setFollow(User user, User target, boolean active) {
        if (active) {
            userFollowRepository.save(UserFollow.builder().user(user).target(target).build());
        } else {
            userFollowRepository.deleteByUserAndTarget(user, target);
        }
    }
}
