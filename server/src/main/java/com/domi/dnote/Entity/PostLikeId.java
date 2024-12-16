package com.domi.dnote.Entity;

import java.io.Serializable;
import java.util.Objects;

public class PostLikeId implements Serializable {
    private Long user;
    private Long target;
    private Long post;
}
