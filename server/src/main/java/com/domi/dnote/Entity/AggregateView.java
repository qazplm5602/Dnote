package com.domi.dnote.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@IdClass(AggregateViewId.class)
@Table(name = "post_aggregated_views")
public class AggregateView {
    @Id
    long postId;

    @Id
    long ownerId;

    long view_count;

    @Id
    LocalDateTime created;
}
