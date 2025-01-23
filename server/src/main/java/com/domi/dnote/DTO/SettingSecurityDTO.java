package com.domi.dnote.DTO;

import com.domi.dnote.Entity.Profile;
import com.domi.dnote.Entity.User;
import lombok.Data;

@Data
public class SettingSecurityDTO {
    Boolean followHide;

    public static SettingSecurityDTO toEntity(User user) {
        Profile profile = user.getProfile();

        SettingSecurityDTO dto = new SettingSecurityDTO();
        dto.followHide = profile != null && profile.isFollowHide();

        return dto;
    }
}
