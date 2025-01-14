package com.domi.dnote.Service;

import com.domi.dnote.Entity.TagCount;
import com.domi.dnote.Repository.TagCountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class TagCountService {
    private final TagCountRepository tagCountRepository;
    private final UserTagSearchService userTagSearchService;
    private static final int EXPIRE_TIME = 30; // 일
    private static final int POPULAR_MIN_COUNT = 10; // 인기 태그에 들려면 30번 이상 검색되야함

    public void tagCountUp(String tag) {
        LocalDateTime now = LocalDateTime.now();

        TagCount tagCount = tagCountRepository.findById(tag).orElseGet(() -> {
            TagCount newTagCount = new TagCount();
            newTagCount.setTag(tag);
            newTagCount.setCount(0);
            newTagCount.setUpdateAt(now);

            return newTagCount;
        });

        long dayDiff = ChronoUnit.DAYS.between(tagCount.getUpdateAt(), now);
        if (dayDiff > EXPIRE_TIME) { // 만료됨 ㅅㄱ
            tagCount.setCount(1);
        } else {
            tagCount.setCount(tagCount.getCount() + 1);
        }

        tagCount.setUpdateAt(now);
        tagCountRepository.save(tagCount);
    }

    @Transactional
    public void tagsUpClient(String ip, List<String> tags) {
        tags.forEach(tag -> {
            if (userTagSearchService.hasLocked(tag, ip)) return; // 이미 함

            userTagSearchService.registerLock(tag, ip);
            tagCountUp(tag);
        });
    }

    public List<TagCount> getPopularTags() {
        LocalDateTime now = LocalDateTime.now();

        return tagCountRepository.findTop10ByCountIsAfterAndUpdateAtIsAfterOrderByCountDesc(POPULAR_MIN_COUNT, now.minusDays(EXPIRE_TIME));
    }
}
