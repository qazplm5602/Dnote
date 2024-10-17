package com.domi.dnote.DTO;

import com.domi.dnote.Entity.Profile;
import com.domi.dnote.Entity.User;
import lombok.Data;

@Data
public class ProfileDTO {
    private UserDTO user;
    private ProfileSocialVO2 social;
    private String info;

    public static ProfileDTO toEntity(User user) {
        ProfileDTO data = new ProfileDTO();
        data.user = UserDTO.toEntity(user);

        ProfileSocialVO2 socials = new ProfileSocialVO2();
        Profile profile = user.getProfile();
        if (profile != null) {
            socials.github = profile.getGithub();
            socials.email = profile.getEmail();
            data.info = profile.getInfo();
        }

        data.social = socials;
        return data;
    }
}
