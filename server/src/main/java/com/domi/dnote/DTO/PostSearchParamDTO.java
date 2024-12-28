package com.domi.dnote.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostSearchParamDTO {
    @Min(0)
    private byte page = 0;

    @Min(0)
    @Max(2)
    private byte sort = 0;

    @NotBlank
    private String query;
}
