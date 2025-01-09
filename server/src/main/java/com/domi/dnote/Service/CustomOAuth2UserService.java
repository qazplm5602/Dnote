package com.domi.dnote.Service;

import com.domi.dnote.Entity.CustomUserDetails;
import com.domi.dnote.Entity.OAuth2UserInfo;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Repository.UserRepository;
import jakarta.security.auth.message.AuthException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 유저 정보 가져옴
        Map<String, Object> oAuth2UserAttributes = super.loadUser(userRequest).getAttributes();

        // resistrationId 가져옴
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        // 닉네임속성?? 각자 식별자 가져옴
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        // 유저 정보 dto
        OAuth2UserInfo oAuth2UserInfo = null;
        try {
            oAuth2UserInfo = OAuth2UserInfo.of(registrationId, oAuth2UserAttributes);
        } catch (AuthException e) {
            throw new OAuth2AuthenticationException("UNKNOWN_REGISTRATION_ID");
        }

        // 로그인 / 회원가입
        User user = getUserOrRegister(oAuth2UserInfo);
        if (user.isBan())
            throw new OAuth2AuthenticationException(new OAuth2Error("ACCOUNT_BANNED"), "[account_banned]");

        return new CustomUserDetails(user, oAuth2UserAttributes, userNameAttributeName);
    }

    private User getUserOrRegister(OAuth2UserInfo info) {
        Optional<User> user = userRepository.findByEmail(info.getEmail());
        return user.orElseGet(() -> userRepository.save(info.toEntity()));
    }
}
