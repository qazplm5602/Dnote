package com.domi.dnote.DTO;

import com.domi.dnote.Entity.PostTemp;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
public class PostTempPreviewDTO {
    private String id;
    private String title;
    private LocalDateTime created;

    public static PostTempPreviewDTO toEntity(PostTemp data) {
        PostTempPreviewDTO entity = new PostTempPreviewDTO();
        entity.id = data.getId();
        entity.title = data.getTitle();
        entity.created = data.getCreated();

        return entity;
    }
}
