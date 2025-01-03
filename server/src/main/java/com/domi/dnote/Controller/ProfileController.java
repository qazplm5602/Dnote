package com.domi.dnote.Controller;

import com.domi.dnote.DTO.ProfileDTO;
import com.domi.dnote.Entity.Profile;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Enums.FileGroup;
import com.domi.dnote.Exception.ProfileException;
import com.domi.dnote.Service.FileService;
import com.domi.dnote.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final UserService userService;
    private final FileService fileService;

    @GetMapping("/{id}")
    ProfileDTO getProfile(@PathVariable("id") long id) {
        User user = userService.getUserById(id);
        return ProfileDTO.toEntity(user);
    }

    @PostMapping("/avatar")
    String changeAvatar(@RequestParam MultipartFile file) throws IOException {
        User user = userService.getCurrentUser();

        // 확장자
        if (!Objects.equals(file.getContentType(), "image/png")) {
            throw new ProfileException(ProfileException.Type.ONLY_PNG_FILE);
        }

        // 파일 크기
        int AVATAR_SIZE = 1024 * 1024 * 10; // 10mb
        if (file.getSize() > AVATAR_SIZE) {
            throw new ProfileException(ProfileException.Type.TO_BIG_FILE);
        }

        Profile profile = user.getProfileForce();

        String oldAvatar = profile.getAvatar();
        if (oldAvatar != null) { // 이미 프사가 있음
            fileService.removeFile(FileGroup.Avatar, oldAvatar);
        }

        // 새로운 프사로 변경
        String newAvatar = fileService.registerFile(FileGroup.Avatar, file);
        profile.setAvatar(newAvatar);

        userService.save(user);
        return newAvatar;
    }
}
