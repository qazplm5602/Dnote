package com.domi.dnote.Exception;

import org.springframework.http.HttpStatus;

public class PostLikeException extends DomiException {
    public enum Type {
        ALREADY_SET(0, "이미 좋아요가 설정/해제 되어 있습니다.", HttpStatus.BAD_REQUEST);

        final int id;
        final String message;
        final HttpStatus status;

        Type(int id, String message, HttpStatus status) {
            this.id = id;
            this.message = message;
            this.status = status;
        }
    }

    public PostLikeException(Type type) {
        super("POSTLIKE"+type.id, type.message, type.status);
    }
}
