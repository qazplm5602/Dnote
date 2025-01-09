package com.domi.dnote.Service;

import com.domi.dnote.Entity.User;
import com.domi.dnote.Exception.TokenException;
import com.domi.dnote.Exception.UserException;
import com.domi.dnote.Repository.UserRepository;
import com.domi.dnote.Util.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {
    final UserRepository userRepository;
    final PasswordEncoder passwordEncoder;
    final TokenProvider tokenProvider;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    public User getUserById(long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserException(UserException.Type.NOT_FOUND_USER));
    }

    public boolean checkUserPassword(User user, String inputPassword) {
        return passwordEncoder.matches(inputPassword, user.getPassword());
    }
    public void changeUserPassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public User getUserByVerifyToken(String token) {
        return userRepository.findByVerify(token).orElse(null);
    }

    public String renewAccessTokenByRefreshToken(String refreshToken) {
        if (!tokenProvider.hasRefreshToken(refreshToken))
            throw new TokenException(TokenException.Type.NOT_REFRESH_TOKEN);

        return tokenProvider.copyAccessToken(refreshToken);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!auth.isAuthenticated()) {
            throw new UserException(UserException.Type.REQUIRE_LOGIN);
        }

        String email = auth.getName();
        User user = getUserByEmail(email);
        if (user == null) { // 근데 이럴수가 있나??
            throw new UserException(UserException.Type.REQUIRE_LOGIN);
        }

        if (user.isBan())
            throw new UserException(UserException.Type.BAN_ACCOUNT);

        return user;
    }

    // 이건 그냥 throw 하지 않고 null로 줌
    public User getCurrentUserForce() {
        User user = null;
        try {
            user = getCurrentUser();
        } catch (UserException ignored) {
        }

        return user;
    }
}
