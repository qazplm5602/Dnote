package com.domi.dnote.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;

import java.time.LocalDateTime;

@MappedSuperclass
public abstract class ChatBase {
    @ManyToOne
    private User owner;
    @Column(nullable = false)
    private String content;
    @Column(nullable = false)
    private LocalDateTime created;
}
