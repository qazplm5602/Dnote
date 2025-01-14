package com.domi.dnote.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "tag_counts")
public class TagCount {
    @Id
    String tag;
    int count;
    LocalDateTime updateAt;
}
