package com.domi.dnote.Service;

import com.domi.dnote.DTO.AggregateViewDataInterface;
import com.domi.dnote.DTO.PostPopularityDTO;
import com.domi.dnote.Entity.AggregateView;
import com.domi.dnote.Entity.Post;
import com.domi.dnote.Exception.PostException;
import com.domi.dnote.Repository.AggregateViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class AggregateViewService {
    final AggregateViewRepository aggregateViewRepository;
    final PostService postService;

    public void addView(Post post, LocalDateTime time) {
        AggregateView newEntity = new AggregateView();
        newEntity.setPostId(post.getId());
        newEntity.setOwnerId(post.getOwner().getId());
        newEntity.setView_count(post.getViewCount());
        newEntity.setCreated(time);

        aggregateViewRepository.save(newEntity);
    }

    public void getPopularPosts() {
        List<AggregateViewDataInterface> views = aggregateViewRepository.getPostViewPercent();
        List<PostPopularityDTO> popularities = new ArrayList<>();

        for (AggregateViewDataInterface view : views) {
            Post post = null;
            try {
                post = postService.getPostByOwnerPostId(view.getOwnerId(), view.getPostId());
            } catch (PostException ignored) {}

            if (post == null) continue; // 게시물이 삭제 됨/????

            PostPopularityDTO dto = new PostPopularityDTO(post, calculatePopularity(view, post));
        }
    }

    float calculatePopularity(AggregateViewDataInterface view, Post post) {
        
    }
}
