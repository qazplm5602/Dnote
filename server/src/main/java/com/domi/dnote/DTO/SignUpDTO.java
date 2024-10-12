package com.domi.dnote.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Length;

public class SignUpDTO {
    @Email
    public String email;
    @Length(min = 8, message = "비밀번호는 8자리 이상이여야 합니다.")
    public String password;
    @NotBlank
    public String name;
}
