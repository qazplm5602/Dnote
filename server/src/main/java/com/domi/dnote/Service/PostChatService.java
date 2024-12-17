package com.domi.dnote.Service;

import com.domi.dnote.Repository.PostChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PostChatService {
    private final PostChatRepository postChatRepository;
}
