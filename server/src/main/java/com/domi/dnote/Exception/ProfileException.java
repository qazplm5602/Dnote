package com.domi.dnote.Exception;

import org.springframework.http.HttpStatus;

public class ProfileException extends DomiException {
    public enum Type {
        ONLY_PNG_FILE(0, "아바타는 png 확장자만 가능합니다.", HttpStatus.BAD_REQUEST),
        TO_BIG_FILE(1, "파일 크기는 10MB 이하여야 합니다.", HttpStatus.BAD_REQUEST),
        NOT_INPUT_ACCOUNT_ID(2, "아이디 형식이 아닙니다.", HttpStatus.BAD_REQUEST),
        NOT_INPUT_EMAIL(3, "이메일 형식이 아닙니다.", HttpStatus.BAD_REQUEST),
        NEED_NOT_SOCIAL_ACCOUNT(4, "소셜계정은 불가능 합니다.", HttpStatus.FORBIDDEN);

        final int id;
        final String message;
        final HttpStatus status;

        Type(int _id, String msg, HttpStatus status) {
            id = _id;
            message = msg;
            this.status = status;
        }
    }

    public ProfileException(Type type) {
        super("PROFILE"+type.id, type.message, type.status);
    }
}
