package com.domi.dnote.DTO;

import com.domi.dnote.Entity.User;
import lombok.Data;

@Data
public class UserDTO {
    private long id;
    private String name;
    // 프사도 나중에 추가 예정
    
    public static UserDTO toEntity(User user) {
        UserDTO data = new UserDTO();
        data.id = user.getId();
        data.name = user.getName();

        return data;
    }
}
