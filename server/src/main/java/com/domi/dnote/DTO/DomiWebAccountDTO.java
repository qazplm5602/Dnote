package com.domi.dnote.DTO;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DomiWebAccountDTO {
    private String email;
    private String name;
}
