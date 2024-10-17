package com.domi.dnote.Controller;

import com.domi.dnote.DTO.ProfileDTO;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final UserService userService;

    @GetMapping("/{id}")
    ProfileDTO getProfile(@PathVariable("id") long id) {
        User user = userService.getUserById(id);
        return ProfileDTO.toEntity(user);
    }
}
