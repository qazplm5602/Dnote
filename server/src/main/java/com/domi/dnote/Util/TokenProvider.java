package com.domi.dnote.Util;


import ch.qos.logback.core.util.StringUtil;
import com.domi.dnote.DTO.TokenDTO;
import com.domi.dnote.Exception.TokenException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TokenProvider {
    @Value("${jwt.key}")
    private String key;
    private SecretKey secretKey;

    private static final long ACCESS_TOKEN_TIME = 1000 * 60 * 30L;
    private static final long REFRESH_TOKEN_TIME = 1000 * 60 * 60L * 24 * 7;
    private static final String KEY_ROLE = "role";
    private static final String KEY_REFRESH = "refresh";

    @PostConstruct
    private void setSecretKey() {
        secretKey = Keys.hmacShaKeyFor(key.getBytes());
    }

    public TokenDTO generateAccessRefresh(Authentication authentication) {
        return new TokenDTO(generateToken(authentication, false), generateToken(authentication, true));
    }

    private String generateToken(Authentication authentication, boolean refresh) {
        Date now = new Date();
        Date expiredDate = new Date(now.getTime() + (refresh ? REFRESH_TOKEN_TIME : ACCESS_TOKEN_TIME));

        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining());

        return Jwts.builder()
                .subject(authentication.getName())
                .claim(KEY_ROLE, authorities)
                .claim(KEY_REFRESH, refresh)
                .issuedAt(now)
                .expiration(expiredDate)
                .signWith(secretKey, Jwts.SIG.HS512)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);
        List<SimpleGrantedAuthority> authorities = getAuthorities(claims);

        // user 객체 만듬
        User principal = new User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    private List<SimpleGrantedAuthority> getAuthorities(Claims claims) {
        return Collections.singletonList(new SimpleGrantedAuthority(
                claims.get(KEY_ROLE).toString()
        ));
    }

    public boolean validateToken(String token) {
        if (!StringUtils.hasText(token)) return false;

        try {
            parseClaims(token);
        } catch (ExpiredJwtException e) {
            return false;
        };

        return true;
    }
    
    public boolean hasRefreshToken(String token) {
        Claims claims = parseClaims(token);
        return (boolean) claims.get(KEY_REFRESH);
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parser().verifyWith(secretKey).build()
                    .parseSignedClaims(token).getPayload();
        } catch (ExpiredJwtException e) {
            throw new TokenException(TokenException.Type.EXPIRED_TOKEN);
        } catch (MalformedJwtException e) {
            throw new TokenException(TokenException.Type.INVALID_TOKEN);
        } catch (SecurityException e) {
            throw new TokenException(TokenException.Type.INVALID_JWT_SIGNATURE);
        }
    }
}
