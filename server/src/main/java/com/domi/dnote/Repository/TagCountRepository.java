package com.domi.dnote.Repository;

import com.domi.dnote.Entity.TagCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TagCountRepository extends JpaRepository<TagCount, String> {
    List<TagCount> findTop10ByCountIsAfterAndUpdateAtIsAfterOrderByCountDesc(int countAfter, LocalDateTime updateAtAfter);
}
