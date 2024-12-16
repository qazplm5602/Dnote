package com.domi.dnote.Entity;

import jakarta.persistence.*;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@IdClass(PostLikeId.class)
@Table(name = "post_likes")
public class PostLike {
    @Id
    @ManyToOne
    User user;

    @Id
    @ManyToOne
    User target;

    @Id
    long post;
}
