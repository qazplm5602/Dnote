package com.domi.dnote.Service;

import com.domi.dnote.Entity.AggregateView;
import com.domi.dnote.Entity.Post;
import com.domi.dnote.Repository.AggregateViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class AggregateViewService {
    final AggregateViewRepository aggregateViewRepository;

    public void addView(Post post, LocalDateTime time) {
        AggregateView newEntity = new AggregateView();
        newEntity.setPostId(post.getId());
        newEntity.setView_count(post.getViewCount());
        newEntity.setCreated(time);

        aggregateViewRepository.save(newEntity);
    }
}
