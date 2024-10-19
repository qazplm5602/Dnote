package com.domi.dnote.Entity;

import jakarta.persistence.*;

@Entity
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
