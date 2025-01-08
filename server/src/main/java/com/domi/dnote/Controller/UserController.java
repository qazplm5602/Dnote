package com.domi.dnote.Controller;

import com.domi.dnote.DTO.DomiWebAccountDTO;
import com.domi.dnote.DTO.LoginDTO;
import com.domi.dnote.DTO.TokenDTO;
import com.domi.dnote.DTO.UserDTO;
import com.domi.dnote.Entity.CustomUserDetails;
import com.domi.dnote.Entity.Role;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Exception.DomiException;
import com.domi.dnote.Exception.UserException;
import com.domi.dnote.Service.DomiWebService;
import com.domi.dnote.Service.OAuth2SuccessService;
import com.domi.dnote.Service.UserService;
import com.domi.dnote.Util.TokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    final UserService userService;
    final OAuth2SuccessService oAuth2SuccessService;
    final DomiWebService domiWebService;

    @PostMapping("/login")
    void LoginUser(@RequestBody LoginDTO data, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        User user = userService.getUserByEmail(data.email);
        if (user == null || user.getPassword() == null) { // password 가 null이면 소셜로그인임
            throw new UserException(UserException.Type.FAILED_LOGIN);
        }

        boolean result = userService.checkUserPassword(user, data.password);
        if (!result) {
            throw new UserException(UserException.Type.FAILED_LOGIN);
        }

        // 이메일 인증??
        if (user.getVerify() != null) {
            throw new DomiException("SIGNUP2", "이메일 인증이 필요합니다.", HttpStatus.FORBIDDEN);
        }

        // 토큰 만들기
        CustomUserDetails userDetails = new CustomUserDetails(user, null, null);
        Authentication authentication = new UsernamePasswordAuthenticationToken(data.email, data.password, userDetails.getAuthorities());

        oAuth2SuccessService.onAuthenticationSuccess(request, response, authentication, false);
    }

    @PostMapping("/login/refresh")
    String refreshAccessToken(@RequestBody String refreshToken) {
        return userService.renewAccessTokenByRefreshToken(refreshToken);
    }

    @GetMapping("/login/domiweb")
    void userLoginByDomiWeb(@CookieValue("PHPSESSID") Cookie cookie, HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        DomiWebAccountDTO account = domiWebService.getAccountInfo(cookie.getValue());

        if (account == null) {
            response.sendRedirect("/login");
            return; // domiWeb 로그인 안됨 ㄷㄷ
        }

        User user = userService.getUserByEmail(account.getEmail());
        if (user == null) { // 새로운 회원임
            user = User.builder()
                    .email(account.getEmail())
                    .name(account.getName())
                    .role(Role.USER)
                    .password(null)
                    .verify(null)
                    .build();

            userService.save(user); // 회원가입 해버림
        }

//        로그인 ㄱㄱㄱ
        CustomUserDetails userDetails = new CustomUserDetails(user, null, null);
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), null, userDetails.getAuthorities());

        oAuth2SuccessService.onAuthenticationSuccess(request, response, authentication, true);
    }

    @GetMapping("/@me")
    UserDTO getCurrentUser() {
        User user = userService.getCurrentUser();
        return UserDTO.toEntity(user);
    }
}
