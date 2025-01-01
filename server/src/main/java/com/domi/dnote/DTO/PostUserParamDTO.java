package com.domi.dnote.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class PostUserParamDTO {
    @Min(0)
    private byte page = 0;

    @Min(0)
    @Max(2)
    private byte sort = 0;

    @Min(0)
    @Max(16)
    private byte size = 16;

    private long user;
}
