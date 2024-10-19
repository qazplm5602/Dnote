package com.domi.dnote.Controller;

import com.domi.dnote.Entity.User;
import com.domi.dnote.Entity.UserFollow;
import com.domi.dnote.Exception.DomiException;
import com.domi.dnote.Service.UserFollowService;
import com.domi.dnote.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user/follow")
public class UserFollowController {
    final UserService userService;
    final UserFollowService userFollowService;

    @GetMapping("/count")
    long getUserFollowerCount(@RequestParam("id") long id) { // 팔로워 수
        User user = userService.getUserById(id);
        List<UserFollow> follows = userFollowService.getFollowers(user);

        return follows.size();
    }

    @GetMapping("/status")
    boolean hasTargetFollowing(@RequestParam("id") long id) { // 내가 타겟 팔로우 중임??
        User user = userService.getCurrentUser();
        User target = userService.getUserById(id);

        return userFollowService.hasFollow(user, target);
    }

    @Transactional
    @PostMapping("/set")
    void setFollow(@RequestParam("id") long id, @RequestBody boolean active) {
        User user = userService.getCurrentUser();
        if (user.getId() == id) {
            throw new DomiException("FOLLOW1", "자기 자신은 팔로우를 할 수 없습니다.", HttpStatus.FORBIDDEN);
        }

        User target = userService.getUserById(id);

        if (userFollowService.hasFollow(user, target) == active) {
            throw new DomiException("FOLLOW0", "이미 팔로우가 되어있거나 해제되어 있습니다.", HttpStatus.BAD_REQUEST);
        }

        userFollowService.setFollow(user, target, active);
    }
}
