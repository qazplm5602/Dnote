package com.domi.dnote.DTO;

import lombok.Data;

import java.util.List;

@Data
public class PostSearchResultDTO {
    private long total;
    private List<PostDTO> posts;
}
