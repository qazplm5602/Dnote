package com.domi.dnote.Service;

import com.domi.dnote.Repository.UserTagSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserTagSearchService {
    final UserTagSearchRepository userTagSearchRepository;

}
