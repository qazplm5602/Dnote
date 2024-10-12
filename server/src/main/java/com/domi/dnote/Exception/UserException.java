package com.domi.dnote.Exception;

import org.springframework.http.HttpStatus;

public class UserException extends DomiException {
    public enum Type {
        REQUIRE_LOGIN(0, "로그인이 필요합니다.", HttpStatus.UNAUTHORIZED),
        FAILED_LOGIN(1, "아이디 및 비밀번호가 잘못되었습니다.", HttpStatus.FORBIDDEN);

        final int id;
        final String message;
        final HttpStatus status;

        Type(int _id, String msg, HttpStatus _status) {
            id = _id;
            message = msg;
            status = _status;
        }
    }

    public UserException(Type type) {
        super("USER"+type.id, type.message, HttpStatus.FORBIDDEN);
    }
}
