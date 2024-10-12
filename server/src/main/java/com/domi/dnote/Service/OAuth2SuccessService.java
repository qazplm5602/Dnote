package com.domi.dnote.Service;

import com.domi.dnote.DTO.TokenDTO;
import com.domi.dnote.Util.TokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@RequiredArgsConstructor
@Service
public class OAuth2SuccessService implements AuthenticationSuccessHandler {
    final TokenProvider tokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // 토큰 발급
        TokenDTO tokens = tokenProvider.generateAccessRefresh(authentication);

        // 쿠키로 저장
        Cookie accessCookie = new Cookie("accessToken", tokens.access);
        Cookie refreshCookie = new Cookie("refreshToken", tokens.refresh);
        setCookie(accessCookie);
        setCookie(refreshCookie);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        String targetUrl = UriComponentsBuilder.fromUriString("/login/success").build().toUriString();
        response.sendRedirect(targetUrl);
    }

    void setCookie(Cookie cookie) {
        cookie.setHttpOnly(false); // 자바스크립트에서 쓸꺼
        cookie.setSecure(false); // 나중에 https 로 하면 할꺼
        cookie.setPath("/");
        cookie.setMaxAge(60 * 30);
    }
}
