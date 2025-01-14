package com.domi.dnote.Service;

import com.domi.dnote.Entity.TagCount;
import com.domi.dnote.Repository.TagCountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class TagCountService {
    private final TagCountRepository tagCountRepository;
    private static final int EXPIRE_TIME = 60; // 초

    public void tagCountUp(String tag) {
        LocalDateTime now = LocalDateTime.now();

        TagCount tagCount = tagCountRepository.findById(tag).orElseGet(() -> {
            TagCount newTagCount = new TagCount();
            newTagCount.setTag(tag);
            newTagCount.setCount(0);
            newTagCount.setUpdateAt(now);

            return newTagCount;
        });

        Duration duration = Duration.between(now, tagCount.getUpdateAt());
        if (duration.getSeconds() > EXPIRE_TIME) { // 만료됨 ㅅㄱ
            tagCount.setCount(1);
        } else {
            tagCount.setCount(tagCount.getCount() + 1);
        }

        tagCount.setUpdateAt(now);
        tagCountRepository.save(tagCount);
    }
}
