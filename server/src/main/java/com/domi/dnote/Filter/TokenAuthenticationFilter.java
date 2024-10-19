package com.domi.dnote.Filter;

import com.domi.dnote.DTO.ExceptionDTO;
import com.domi.dnote.Exception.DomiException;
import com.domi.dnote.Exception.TokenException;
import com.domi.dnote.Util.TokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

@RequiredArgsConstructor
@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {
    private final TokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = parseToken(request);

        try {
            if (accessToken != null && tokenProvider.validateToken(accessToken) && !tokenProvider.hasRefreshToken(accessToken)) {
                setAuthentication(accessToken);
            }

            filterChain.doFilter(request, response);
        } catch (DomiException e) {
            setErrorResponse(response, e);
        }
    }

    private String parseToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (ObjectUtils.isEmpty(token) || !token.startsWith("Barer ")) return null;

        return token.substring("Barer ".length());
    }

    private void setAuthentication(String accessToken) {
        Authentication authentication = tokenProvider.getAuthentication(accessToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private void setErrorResponse(HttpServletResponse response, DomiException e){
        ObjectMapper objectMapper = new ObjectMapper();
        response.setStatus(e.getStatus().value());
        response.setContentType("application/json; charset=UTF-8");

        ExceptionDTO data = new ExceptionDTO();
        data.message = e.getMessage();
        data.code = e.getCode();

        try (PrintWriter writer = response.getWriter()) {
            writer.write(objectMapper.writeValueAsString(data));
            writer.flush();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
