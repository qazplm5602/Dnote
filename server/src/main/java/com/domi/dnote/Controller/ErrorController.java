package com.domi.dnote.Controller;

import com.domi.dnote.DTO.ExceptionDTO;
import com.domi.dnote.Exception.DomiException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ErrorController {
    @ExceptionHandler(DomiException.class)
    ResponseEntity<ExceptionDTO> showError(DomiException e) {
        ExceptionDTO data = new ExceptionDTO();
        data.code = e.getCode();
        data.message = e.getMessage();

        return ResponseEntity.status(e.getStatus()).body(data);
    }
}
