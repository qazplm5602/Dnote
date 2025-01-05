package com.domi.dnote.Util;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;

public class MiscUtil {
    public static String randomString(int length) {
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        Random random = new Random();

        return random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(length)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
    }

    public static boolean validateEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$");
    }

    public static boolean validateId(String id) {
        return id.matches("^[A-Za-z0-9]*$");
    }

    public static int randomInt(int min, int max) {
        Random random = new Random();
        return random.nextInt(max - min + 1) + min;
    }

    static final String SERVER_IMAGE_PATH = "/file/attachment/";
    public static List<String> getImageUrls(String content) {
        Document document = Jsoup.parse(content);

        Elements elements = document.select("img");
        return elements.stream()
                .map(v -> v.attr("src"))
                .filter(v -> v.startsWith(SERVER_IMAGE_PATH))
                .map(v -> v.substring(SERVER_IMAGE_PATH.length()))
                .toList();
    }
    public static LocalDateTime getDatetimeTimestemp(long time) {
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(time), ZoneId.systemDefault());
    }
}
