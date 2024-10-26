package com.domi.dnote.Entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Entity
@IdClass(PostId.class)
@Table(name = "posts")
public class Post {
    @Id
    @ManyToOne
    private User owner;

    @Id
    private long id;

    @JoinColumn(nullable = false)
    private String title;

    private String thumbnail; // 썸네일 이미지 ID Group: Attachment

    private String tags;

    @JoinColumn(nullable = false)
    private String content;

    @JoinColumn(nullable = false)
    private int readTime; // 읽는데 걸리는 시간

    @JoinColumn(nullable = false)
    private LocalDateTime created;
}
