package com.domi.dnote.Entity;

import lombok.Getter;

import java.io.Serializable;

@Getter
public class PostChatLikeId implements Serializable {
    private Long user;
    private Long chat;
}
