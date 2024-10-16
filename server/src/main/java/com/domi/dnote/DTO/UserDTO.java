package com.domi.dnote.DTO;

import com.domi.dnote.Entity.Profile;
import com.domi.dnote.Entity.User;
import lombok.Data;

@Data
public class UserDTO {
    private long id;
    private String name;
    private String avatar;
    
    public static UserDTO toEntity(User user) {
        UserDTO data = new UserDTO();
        data.id = user.getId();
        data.name = user.getName();

        Profile profile = user.getProfile();
        if (profile != null) {
            data.avatar = profile.getAvatar();
        }

        return data;
    }
}
