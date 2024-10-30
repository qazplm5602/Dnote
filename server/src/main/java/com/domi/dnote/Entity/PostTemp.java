package com.domi.dnote.Entity;

import com.domi.dnote.Util.TagListConverter;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "post_temps")
public class PostTemp {
    @Id
    String id;

    @Convert(converter = TagListConverter.class)
    List<String> tags;

    @Column(nullable = false)
    String content;

    String thumbnail; // 썸네일 이미지 ID Group: Attachment

    @Column(nullable = false)
    LocalDateTime created;
}
