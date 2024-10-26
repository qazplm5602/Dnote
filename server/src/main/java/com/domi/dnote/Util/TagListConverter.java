package com.domi.dnote.Util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;
import java.util.stream.Collectors;

@Converter
public class TagListConverter implements AttributeConverter<List<String>, String> {
    @Override
    public String convertToDatabaseColumn(List<String> stringList) {
        return String.join(",", stringList);
    }

    @Override
    public List<String> convertToEntityAttribute(String s) {
        if (s == null)
            return List.of();

        return List.of(s.split(","));
    }
}
