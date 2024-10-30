package com.domi.dnote.Entity;

import com.domi.dnote.Util.TagListConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "post_temps")
public class PostTemp {
    @Id
    String id;

    @ManyToOne
    User user;

    @Convert(converter = TagListConverter.class)
    List<String> tags;

    @Column(nullable = false)
    String content;

    String thumbnail; // 썸네일 이미지 ID Group: Attachment

    @Column(nullable = false)
    LocalDateTime created;
}
