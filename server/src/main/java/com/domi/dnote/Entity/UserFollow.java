package com.domi.dnote.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@IdClass(UserFollowId.class)
@Table(name = "follow")
public class UserFollow {
    @Id
    @ManyToOne
    User user;

    @Id
    @ManyToOne
    User target;
}
