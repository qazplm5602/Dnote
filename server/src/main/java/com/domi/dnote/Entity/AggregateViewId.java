package com.domi.dnote.Entity;

import java.io.Serializable;
import java.time.LocalDateTime;

public class AggregateViewId implements Serializable {
    public Long postId;
    public Long ownerId;
    public LocalDateTime created;
}
