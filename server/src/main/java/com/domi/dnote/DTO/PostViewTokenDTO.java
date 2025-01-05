package com.domi.dnote.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
public class PostViewTokenDTO {
    private long userId;
    private long postId;

    private LocalDateTime createdAt;
}
