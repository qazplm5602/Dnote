package com.domi.dnote.Service;

import com.domi.dnote.Entity.PostTemp;
import com.domi.dnote.Exception.PostException;
import com.domi.dnote.Repository.PostTempRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class PostTempService {
    final PostTempRepository postTempRepository;

    public PostTemp save(PostTemp data) {
        return postTempRepository.save(data);
    }

    public PostTemp getById(String id) {
        Optional<PostTemp> post = postTempRepository.findById(id);
        return post.orElseThrow(() -> new PostException(PostException.Type.NOT_FOUND_TEMP));
    }

    public void removeById(String id) {
        postTempRepository.deleteById(id);
    }
}
