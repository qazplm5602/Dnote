package com.domi.dnote.Service;

import com.domi.dnote.DTO.PostUploadDTO;
import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Exception.PostException;
import com.domi.dnote.Repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class PostService {
    final PostRepository postRepository;

    public Post getPostByOwnerId(User owner, long id) {
        Optional<Post> postOption = postRepository.findByOwnerAndId(owner, id);
        return postOption.orElseThrow(() -> new PostException(PostException.Type.NOT_FOUND_POST));
    }

    public Post createPost(User user, PostUploadDTO form) {
        long postId = postRepository.getMaxIdByOwner(user);

        Post newPost = Post.builder()
                .owner(user)
                .id(postId + 1)
                .title(form.getTitle())
                .content(form.getContent())
                .tags(form.getTags())
                .readTime(-1)
                .thumbnail(null)
                .viewCount(0)
                .created(LocalDateTime.now())
                .build();

        return postRepository.save(newPost);
    }

    public boolean removePost(User user, long id) {
        return postRepository.deleteByOwnerAndId(user, id) > 0;
    }

    public Post save(Post post) {
        return postRepository.save(post);
    }
}
