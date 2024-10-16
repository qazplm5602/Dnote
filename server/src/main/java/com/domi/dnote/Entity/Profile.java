package com.domi.dnote.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "profile")
public class Profile {
    @Id
    @ManyToOne
    User user;

    String avatar;
    String info;

//    링크
    String github;
    String email; // 이건 사용자가 커스텀할 수 있는 메일임 (로그인 메일 아님 ㅅㄱ)
}
