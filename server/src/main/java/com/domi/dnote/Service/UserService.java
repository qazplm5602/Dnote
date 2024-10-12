package com.domi.dnote.Service;

import com.domi.dnote.Entity.User;
import com.domi.dnote.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
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
}
