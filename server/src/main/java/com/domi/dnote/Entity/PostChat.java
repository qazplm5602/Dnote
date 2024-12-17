package com.domi.dnote.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name = "post_chats")
public class PostChat extends ChatBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

//    long good; // 좋아요는 따로 추적해야함
    @ManyToOne
    Post post;

    @ManyToOne
    PostChat reply;
}
