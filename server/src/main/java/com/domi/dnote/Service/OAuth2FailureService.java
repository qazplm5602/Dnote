package com.domi.dnote.Service;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class OAuth2FailureService implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        String reason = getErrorReason(exception);
        response.sendRedirect("/login?error=" + URLEncoder.encode(reason, StandardCharsets.UTF_8));
    }

    private String getErrorReason(AuthenticationException exception) {
        switch (exception.getMessage()) {
            case "[account_banned]":
                return "차단된 계정입니다.";
            default:
                return "잘못된 인증입니다. 나중에 다시 시도하세요.";
        }
    }
}
