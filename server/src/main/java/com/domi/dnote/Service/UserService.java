package com.domi.dnote.Service;

import com.domi.dnote.Entity.User;
import com.domi.dnote.Exception.UserException;
import com.domi.dnote.Repository.UserRepository;
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

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public boolean checkUserPassword(User user, String inputPassword) {
        return passwordEncoder.matches(inputPassword, user.getPassword());
    }

    public User getUserByVerifyToken(String token) {
        return userRepository.findByVerify(token).orElse(null);
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

        return user;
    }
}
