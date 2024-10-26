package com.domi.dnote.Entity;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
public class PostId implements Serializable {
    private Long owner;
    private Long id;
}
