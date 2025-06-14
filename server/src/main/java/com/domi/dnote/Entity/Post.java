package com.domi.dnote.Entity;

import com.domi.dnote.Util.TagListConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
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

    @Convert(converter = TagListConverter.class)
    private List<String> tags;

    private long viewCount; // 조회수

    @JoinColumn(nullable = false, columnDefinition = "TEXT")
    private String content;

    @JoinColumn(nullable = false, columnDefinition = "TEXT")
    private String contentPreview; // 콘텐츠 미리보기

    @JoinColumn(nullable = false)
    private int readTime; // 읽는데 걸리는 시간

    @JoinColumn(nullable = false)
    private LocalDateTime created;

    private LocalDateTime modified;
}
