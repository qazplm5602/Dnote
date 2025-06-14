package com.domi.dnote.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GeneratedColumn;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    String name;

    @Column(unique = true)
    String email;

    String password;

    @Enumerated(EnumType.STRING)
    Role role;

    boolean ban;
    String verify; // null 이면 인증 되어있음 , 토큰이면 인증해야됨

    @Column(nullable = false)
    LocalDateTime created;

    @JoinColumn(nullable = true)
    @ManyToOne(cascade = CascadeType.PERSIST)
    Profile profile;

    public Profile getProfileForce() {
        if (profile == null) {
            profile = new Profile();
            profile.setUser(this);
        }

        return profile;
    }
}
