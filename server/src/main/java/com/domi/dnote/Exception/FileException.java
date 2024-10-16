package com.domi.dnote.Exception;

import org.springframework.http.HttpStatus;

public class FileException extends DomiException {
    public enum Type {
        NOT_EXIST_FILE(0, "파일을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
        NOT_FOUND_GROUP(1, "해당 파일 그룹이 없습니다.", HttpStatus.BAD_REQUEST),
        FAILED_REMOVE(2, "파일 삭제를 실패하였습니다.", HttpStatus.INTERNAL_SERVER_ERROR);

        final int id;
        final String message;
        final HttpStatus status;

        Type(int _id, String msg, HttpStatus _status) {
            id = _id;
            message = msg;
            status = _status;
        }
    }

    public FileException(Type type) {
        super("FILE"+type.id, type.message, HttpStatus.FORBIDDEN);
    }
}
