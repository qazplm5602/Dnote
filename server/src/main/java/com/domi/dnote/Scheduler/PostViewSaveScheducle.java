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
        // 처음 할때는 갱신을 해줘야징
//        aggregateViewService.refreshPopularPosts();
    }

    @Scheduled(cron = "0 0 * * * *") // 시간 당
    @Transactional
    void startSavePostView() {
        log.info("Start Saving Post Views....");

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime beforeMonth = now.minusMonths(1);
        LocalDateTime nowHour = LocalDateTime.of(now.getYear(), now.getMonth(), now.getDayOfMonth(), now.getHour(), 0, 0);

        List<Post> posts = postService.getPostsByDateAfter(beforeMonth);
        posts.stream().filter(post -> post.getViewCount() > 0).forEach(post -> aggregateViewService.addView(post, nowHour));
        
        // 이제 안쓰는 데이터는 삭제
        log.info("Start PostView Log Garbage Remove...");
        int removeTotal = aggregateViewService.removeGarbageData();

        log.info("Removed old logs. total: {}", removeTotal);
    }

    @Scheduled(fixedRate = 1000 * 60 * 60 * 3)
    void startRefreshPopularPosts() {
        log.info("Start Refreshing Popular Posts....");
        aggregateViewService.refreshPopularPosts();

        var popularPosts = aggregateViewService.getPopularPosts();
        log.info("Finish Load Popular Posts. Length: {}", popularPosts.size());
    }
}
