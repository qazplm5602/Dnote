package com.domi.dnote.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@MappedSuperclass
public abstract class ChatBase {
    @ManyToOne
    protected User owner;
    @Column(nullable = false)
    protected String content;
    @Column(nullable = false)
    protected LocalDateTime created;
}
