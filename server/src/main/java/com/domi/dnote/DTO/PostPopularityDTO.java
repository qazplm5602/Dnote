package com.domi.dnote.DTO;

import com.domi.dnote.Entity.Post;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class PostPopularityDTO {
    Post post;
    float popularity;
}
