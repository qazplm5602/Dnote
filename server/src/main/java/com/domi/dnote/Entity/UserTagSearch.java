package com.domi.dnote.Entity;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@RedisHash(value = "user_tag_search", timeToLive = 30)
public class UserTagSearch {
    @Id
    private String id;

    @Indexed
    private String ip;
    @Indexed
    private String tag;
}
