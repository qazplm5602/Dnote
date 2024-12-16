package com.domi.dnote.Service;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Repository.PostLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PostLikeService {
    private final PostLikeRepository postLikeRepository;

    public long getLikeCountByPost(Post post) {
        return postLikeRepository.countByTargetAndPost(post.getOwner(), post.getId());
    }
}
