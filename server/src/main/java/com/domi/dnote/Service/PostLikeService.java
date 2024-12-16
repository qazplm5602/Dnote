package com.domi.dnote.Service;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.PostLike;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Exception.PostLikeException;
import com.domi.dnote.Repository.PostLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class PostLikeService {
    private final PostLikeRepository postLikeRepository;

    public long getLikeCountByPost(Post post) {
        return postLikeRepository.countByTargetAndPost(post.getOwner(), post.getId());
    }

    public boolean hasUserLikePost(User user, Post post) {
        return postLikeRepository.countByUserAndTargetAndPost(user, post.getOwner(), post.getId()) > 0;
    }

    @Transactional
    public void setUserPostLike(User user, Post post, boolean value) {
        if (hasUserLikePost(user, post) == value)
            throw new PostLikeException(PostLikeException.Type.ALREADY_SET);

        if (value) {
            PostLike newLike = PostLike.builder()
                    .user(user)
                    .target(post.getOwner())
                    .post(post.getId())
                    .build();
            postLikeRepository.save(newLike);
        } else {
            postLikeRepository.deleteByUserAndTargetAndPost(user, post.getOwner(), post.getId());
        }
    }
}
