package com.domi.dnote.Exception;

import org.springframework.http.HttpStatus;

public class PostException extends DomiException {
    public enum Type {
        NOT_FOUND_POST(0, "게시글을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);

        final int id;
        final String message;
        final HttpStatus status;

        Type(int _id, String msg, HttpStatus status) {
            id = _id;
            message = msg;
            this.status = status;
        }
    }

    public PostException(Type type) {
        super("POST"+type.id, type.message, type.status);
    }
}
