package com.domi.dnote.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "post_aggregated_views")
public class AggregateView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @ManyToOne
    Post post;

    LocalDateTime created;
}
