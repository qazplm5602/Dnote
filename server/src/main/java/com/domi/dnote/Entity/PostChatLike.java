package com.domi.dnote.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@IdClass(PostChatLikeId.class)
@Table(name = "post_chat_likes")
public class PostChatLike {
    @Id
    @ManyToOne
    User user;

    @Id
    @ManyToOne
    PostChat chat;
}
