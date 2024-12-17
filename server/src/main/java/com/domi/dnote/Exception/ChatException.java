package com.domi.dnote.Exception;

import org.springframework.http.HttpStatus;

public class ChatException extends DomiException {
    public enum Type {
        NOT_FOUND_CHAT(0, "채팅을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
        NOT_CREATE_REPLY_CHAT(1, "답글에 답글을 달 수 없습니다.", HttpStatus.BAD_REQUEST);

        final int id;
        final String message;
        final HttpStatus status;

        Type(int _id, String msg, HttpStatus _status) {
            id = _id;
            message = msg;
            status = _status;
        }
    }

    public ChatException(Type type) {
        super("CHAT"+type.id, type.message, type.status);
    }
}
