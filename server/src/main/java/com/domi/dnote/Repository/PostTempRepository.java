package com.domi.dnote.Repository;

import com.domi.dnote.Entity.PostTemp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostTempRepository extends JpaRepository<PostTemp, String> {
    
}
