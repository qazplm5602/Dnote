package com.domi.dnote.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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
    @OnDelete(action = OnDeleteAction.CASCADE)
    PostChat chat;
}
