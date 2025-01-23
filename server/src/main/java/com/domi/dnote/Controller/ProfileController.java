package com.domi.dnote.Controller;

import com.domi.dnote.DTO.PasswordChangeFormDTO;
import com.domi.dnote.DTO.ProfileDTO;
import com.domi.dnote.DTO.ProfileSocialVO2;
import com.domi.dnote.DTO.SettingSecurityDTO;
import com.domi.dnote.Entity.Profile;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Enums.FileGroup;
import com.domi.dnote.Exception.ProfileException;
import com.domi.dnote.Exception.UserException;
import com.domi.dnote.Service.FileService;
import com.domi.dnote.Service.UserService;
import com.domi.dnote.Util.MiscUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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

    @PostMapping("/name")
    void changeName(@RequestBody @Valid @NotBlank String name) {
        User user = userService.getCurrentUser();
        user.setName(name.trim().replaceAll("\\s+", " ")); // 양옆 공백 지우고 사이에 공백 여러개는 한개로 바꿈
        userService.save(user);
    }

    @PostMapping("/info")
    void changeInfo(@RequestBody(required = false) String info) {
        User user = userService.getCurrentUser();
        if (info == null && user.getProfile() == null) {
            return; // 할게 없음.. (이미 null임)
        }

        Profile profile = user.getProfileForce();
        profile.setInfo(info);

        userService.save(user);
    }

    @PostMapping("/social")
    void changeSocial(@RequestBody ProfileSocialVO2 form) {
        User user = userService.getCurrentUser();
        Profile profile = user.getProfile();

        boolean allNull = Objects.equals(form.getGithub(), "") && Objects.equals(form.getEmail(), "");
        if (allNull && profile == null) return; // 할게 없음

        if (profile == null)
            profile = user.getProfileForce();

        String github = form.getGithub();
        if (github != null) {
            if (github.isEmpty())
                github = null;
            else if (!MiscUtil.validateId(github))
                throw new ProfileException(ProfileException.Type.NOT_INPUT_ACCOUNT_ID);

            profile.setGithub(github);
        }

        String email = form.getEmail();
        if (email != null) {
            if (email.isEmpty())
                email = null;
            else if (!MiscUtil.validateEmail(email))
                throw new ProfileException(ProfileException.Type.NOT_INPUT_EMAIL);

            profile.setEmail(email);
        }

        userService.save(user);
    }

    @PostMapping("/password")
    void changePassword(@RequestBody @Valid PasswordChangeFormDTO form) {
        User user = userService.getCurrentUser();
        if (user.getPassword() == null) { // 소셜 계정은 안됨
            throw new ProfileException(ProfileException.Type.NEED_NOT_SOCIAL_ACCOUNT);
        }

        // 비번 틀림
        if (!userService.checkUserPassword(user, form.getCurrentPassword())) {
            throw new UserException(UserException.Type.FAILED_LOGIN);
        }

        userService.changeUserPassword(user, form.getNewPassword());
    }

    @GetMapping("/security")
    SettingSecurityDTO getSettingSecurity() {
        User user = userService.getCurrentUser();
        return SettingSecurityDTO.toEntity(user);
    }

    @PostMapping("/security")
    void changeSettingSecurity(@RequestBody SettingSecurityDTO data) {
        User user = userService.getCurrentUser();
        Profile profile = user.getProfileForce();

        if (data.getFollowHide() != null)
            profile.setFollowHide(data.getFollowHide());

        userService.save(user);
    }
}
