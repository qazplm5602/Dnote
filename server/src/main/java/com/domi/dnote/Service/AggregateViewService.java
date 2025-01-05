package com.domi.dnote.Service;

import com.domi.dnote.DTO.AggregateViewDataInterface;
import com.domi.dnote.DTO.PostPopularityDTO;
import com.domi.dnote.Entity.AggregateView;
import com.domi.dnote.Entity.Post;
import com.domi.dnote.Exception.DomiException;
import com.domi.dnote.Exception.PostException;
import com.domi.dnote.Repository.AggregateViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class AggregateViewService {
    final AggregateViewRepository aggregateViewRepository;
    final PostService postService;
    final PostLikeService postLikeService;

    // 캐싱..
    List<PostPopularityDTO> cachePostPopularises = null;

    final int MAX_ITEM = 20; // 20개까지만...

    public void addView(Post post, LocalDateTime time) {
        AggregateView newEntity = new AggregateView();
        newEntity.setPostId(post.getId());
        newEntity.setOwnerId(post.getOwner().getId());
        newEntity.setView_count(post.getViewCount());
        newEntity.setCreated(time);

        aggregateViewRepository.save(newEntity);
    }

    public List<PostPopularityDTO> getPopularPosts() {
        if (cachePostPopularises == null)
            throw new DomiException("POSTAGGVIEW0", "인기 post가 갱신되지 않았습니다.", HttpStatus.SERVICE_UNAVAILABLE);

        return cachePostPopularises;
    }

    public void refreshPopularPosts() {
        List<AggregateViewDataInterface> views = aggregateViewRepository.getPostViewPercent();
        List<PostPopularityDTO> popularities = new ArrayList<>();

        int i = 0;
        for (AggregateViewDataInterface view : views) {
            Post post = null;
            try {
                post = postService.getPostByOwnerPostId(view.getOwnerId(), view.getPostId());
            } catch (PostException ignored) {}

            if (post == null) continue; // 게시물이 삭제 됨/????

            PostPopularityDTO dto = new PostPopularityDTO(post, calculatePopularity(view, post));
            popularities.add(dto);

            if (MAX_ITEM < ++i)
                break;
        }

        popularities.sort((a, b) -> {
            return Float.compare(b.getPopularity(), a.getPopularity());
        });

        cachePostPopularises = popularities;
//
//        for (PostPopularityDTO popularity : popularities) {
//            System.out.println("post: " + popularity.getPost().getId() + ", popularity: " + popularity.getPopularity());
//        }
    }

    float calculatePopularity(AggregateViewDataInterface view, Post post) {
        long recent_weight = 0;
        if (view.getGrowthRate() != null)
            recent_weight = view.getGrowthRate();

        long good = postLikeService.getLikeCountByPost(post);
        return view.getViews() + recent_weight + (good * 0.5f);
    }
}
