package com.domi.dnote.Entity;

import jakarta.security.auth.message.AuthException;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Builder
public class OAuth2UserInfo {
    String name;
    String email;

    public static OAuth2UserInfo of(String registrationId, Map<String, Object> attributes) throws AuthException {
        return switch (registrationId) {
            case "google" -> ofGoogle(attributes);
            case "kakao" -> ofKakao(attributes);
            case "naver" -> ofNaver(attributes);
            case "discord" -> ofDiscord(attributes);
            default -> throw new AuthException("소셜 아이디 알 수 없음");
        };
    }

    private static OAuth2UserInfo ofGoogle(Map<String, Object> attributes) {
        return OAuth2UserInfo.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .build();
    }

    private static OAuth2UserInfo ofKakao(Map<String, Object> attributes) {
        Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) attributes.get("profile");

        return OAuth2UserInfo.builder()
                .name((String) profile.get("nickname"))
                .email((String) account.get("email"))
                .build();
    }

    private static OAuth2UserInfo ofDiscord(Map<String, Object> attributes) {
        String id = (String) attributes.get("id");

        return OAuth2UserInfo.builder()
                .name((String) attributes.get("global_name"))
                .email("discord.temp."+ id +"@discord.com")
                .build();
    }

    private static OAuth2UserInfo ofNaver(Map<String, Object> attributes) {
        Map<String, String> account = (Map<String, String>) attributes.get("response");
        String id = account.get("id");

        return OAuth2UserInfo.builder()
                .name(account.get("name"))
                .email("naver.temp."+ id +"@naver.com")
                .build();
    }

    public User toEntity() {
        return User.builder()
                .name(name)
                .email(email)
                .verify(null)
                .role(Role.USER)
                .created(LocalDateTime.now())
                .build();
    }
}
