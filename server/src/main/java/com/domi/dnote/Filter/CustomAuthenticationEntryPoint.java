package com.domi.dnote.Filter;

import com.domi.dnote.DTO.ExceptionDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json; charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        ExceptionDTO data = new ExceptionDTO();
        data.code = "USER0";
        data.message = "로그인이 필요합니다.";

        try (PrintWriter writer = response.getWriter()) {
            writer.write(objectMapper.writeValueAsString(data));
            writer.flush();
        }
    }
}
