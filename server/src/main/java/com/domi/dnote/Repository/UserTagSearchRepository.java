package com.domi.dnote.Repository;

import com.domi.dnote.Entity.UserTagSearch;
import org.springframework.data.repository.CrudRepository;

public interface UserTagSearchRepository extends CrudRepository<UserTagSearch, String> {
    byte countByIpAndTag(String ip, String tag);
}
