package com.domi.dnote.Exception;

import org.springframework.http.HttpStatus;

public class TokenException extends DomiException {
    public enum Type {
        INVALID_TOKEN(1, "잘못된 토큰 입니다."),
        INVALID_JWT_SIGNATURE(2, "잘못된 서명 입니다."),
        EXPIRED_TOKEN(3, "만료된 토큰 입니다.");

        final int id;
        final String message;

        Type(int _id, String msg) {
            id = _id;
            message = msg;
        }
    }

    public TokenException(Type type) {
        super("TOKEN"+type.id, type.message, HttpStatus.FORBIDDEN);
    }
}
