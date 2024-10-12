package com.domi.dnote.Controller;

import com.domi.dnote.DTO.SignUpDTO;
import com.domi.dnote.Entity.Role;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Exception.DomiException;
import com.domi.dnote.Service.UserService;
import com.domi.dnote.Util.MiscUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/signup")
public class SignUpController {
    final private UserService userService;
    final private PasswordEncoder passwordEncoder;

    @PostMapping("")
    void createAccount(@RequestBody @Valid SignUpDTO data) {
        // 이메일 겹치는지 확인
        if (userService.getUserByEmail(data.email) != null) {
            throw new DomiException("SIGNUP1", "이미 사용중인 이메일 입니다.", HttpStatus.BAD_REQUEST);
        }

        User user = User.builder()
                .name(data.name)
                .verify(MiscUtil.randomString(50))
                .ban(false)
                .password(passwordEncoder.encode(data.password))
                .email(data.email)
                .role(Role.USER)
                .build();

        userService.save(user);
    }

    @Transactional
    @PostMapping("/verify")
    void verifyEmailAccount(@RequestParam(value = "token", required = true) @NotBlank @NotNull String token, HttpServletResponse response) throws IOException {
        User user = userService.getUserByVerifyToken(token);
        if (user == null) {
            throw new DomiException("SIGNUP3", "잘못된 인증 토큰 입니다.", HttpStatus.BAD_REQUEST);
        }

        user.setVerify(null); // 이메일 인증 됨
        userService.save(user);

        response.sendRedirect("/login"); // 다시 로그인 해라
    }
}
