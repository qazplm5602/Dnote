package com.domi.dnote.Service;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Exception.PostException;
import com.domi.dnote.Repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class PostService {
    final PostRepository postRepository;

    public Post getPostByOwnerId(User owner, long id) {
        Optional<Post> postOption = postRepository.findByOwnerAndId(owner, id);
        return postOption.orElseThrow(() -> new PostException(PostException.Type.NOT_FOUND_POST));
    }
}
