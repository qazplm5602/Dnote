package com.domi.dnote.Controller;

import com.domi.dnote.Entity.User;
import com.domi.dnote.Entity.UserFollow;
import com.domi.dnote.Service.UserFollowService;
import com.domi.dnote.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
