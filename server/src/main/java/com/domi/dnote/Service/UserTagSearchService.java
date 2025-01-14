package com.domi.dnote.Service;

import com.domi.dnote.Entity.UserTagSearch;
import com.domi.dnote.Repository.UserTagSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserTagSearchService {
    final UserTagSearchRepository userTagSearchRepository;

    public boolean hasLocked(String tag, String ip) {
        return userTagSearchRepository.findByIpAndTag(ip, tag) != null;
    }

    public void registerLock(String tag, String ip) {
        UserTagSearch userTagSearch = new UserTagSearch();
        userTagSearch.setTag(tag);
        userTagSearch.setIp(ip);

        userTagSearchRepository.save(userTagSearch);
    }
}
