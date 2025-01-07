package com.domi.dnote.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PostUploadDTO {
    @NotBlank
    private String title;

    private List<String> tags;

    @NotBlank
    private String content;

    private String thumbnail;
}
