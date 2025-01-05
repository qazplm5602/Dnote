package com.domi.dnote.DTO;

import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class PasswordChangeFormDTO {
    @Length(min = 8)
    String currentPassword;

    @Length(min = 8)
    String newPassword;
}
