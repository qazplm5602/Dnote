package com.domi.dnote.Exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public class DomiException extends RuntimeException {
    String code;
    String message;
    HttpStatus status;
}
