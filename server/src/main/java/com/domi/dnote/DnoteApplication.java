package com.domi.dnote;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class DnoteApplication {

    public static void main(String[] args) {
        SpringApplication.run(DnoteApplication.class, args);
    }

}
