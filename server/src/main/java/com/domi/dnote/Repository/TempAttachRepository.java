package com.domi.dnote.Repository;

import com.domi.dnote.Entity.TempAttach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TempAttachRepository extends JpaRepository<TempAttach, String> {
    List<TempAttach> findByExpiredLessThan(LocalDateTime time);

    @Modifying
    void deleteByFileIn(List<String> fileIds);
}
