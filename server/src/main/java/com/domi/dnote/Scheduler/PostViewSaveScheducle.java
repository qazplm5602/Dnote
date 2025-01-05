package com.domi.dnote.Scheduler;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Service.AggregateViewService;
import com.domi.dnote.Service.PostService;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RequiredArgsConstructor
@Component
public class PostViewSaveScheducle {
    final Logger log = LoggerFactory.getLogger(this.getClass().getSimpleName());
    final AggregateViewService aggregateViewService;
    final PostService postService;

    @PostConstruct
    void testInit() {
        startSavePostView();
    }

    @Scheduled(cron = "0 0 * * * *") // 시간 당
    @Transactional
    void startSavePostView() {
        log.info("Start Saving Post Views....");

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime beforeMonth = now.minusMonths(1);
        LocalDateTime nowHour = LocalDateTime.of(now.getYear(), now.getMonth(), now.getDayOfMonth(), now.getHour(), 0, 0);

        List<Post> posts = postService.getPostsByDateAfter(beforeMonth);

        posts.forEach(post -> aggregateViewService.addView(post, nowHour));
    }
}
