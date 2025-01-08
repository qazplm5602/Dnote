package com.domi.dnote.Exception;

import org.springframework.http.HttpStatus;

public class DomiWebException extends DomiException {
    public enum Type {
        URL_PROTOCOL_ERROR(0, "server protocol error", HttpStatus.INTERNAL_SERVER_ERROR),
        URI_ERROR(1, "server uri error", HttpStatus.INTERNAL_SERVER_ERROR),
        IO_ERROR(2, "server IO error", HttpStatus.INTERNAL_SERVER_ERROR),
        METHOD_ERROR(3, "server IO error", HttpStatus.INTERNAL_SERVER_ERROR),
        SERVER_BAD_RESPONSE(4, "server bad response", HttpStatus.BAD_GATEWAY),
        TARGET_SERVER_ERROR(5, "server bad gateway", HttpStatus.BAD_GATEWAY);

        final int id;
        final String message;
        final HttpStatus status;

        Type(int _id, String msg, HttpStatus status) {
            id = _id;
            message = msg;
            this.status = status;
        }
    }

    public DomiWebException(Type type) {
        super("DOMIWEB"+type.id, type.message, type.status);
    }
}
