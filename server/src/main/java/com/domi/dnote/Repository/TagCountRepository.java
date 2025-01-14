package com.domi.dnote.Repository;

import com.domi.dnote.Entity.TagCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagCountRepository extends JpaRepository<TagCount, String> {

}
