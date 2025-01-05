package com.domi.dnote.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "post_aggregated_views")
public class AggregateView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    long postId;

    long view_count;

    LocalDateTime created;
}
