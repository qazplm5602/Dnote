package com.domi.dnote.Entity;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
public class UserFollowId implements Serializable {
    private Long user;
    private Long target;
}
