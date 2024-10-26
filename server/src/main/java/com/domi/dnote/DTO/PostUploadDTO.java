package com.domi.dnote.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PostUploadDTO {
    private String title;
    private List<String> tags;
    private String content;
}
