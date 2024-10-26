package com.domi.dnote.Repository;

import com.domi.dnote.Entity.TempAttach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TempAttachRepository extends JpaRepository<TempAttach, String> {
}
