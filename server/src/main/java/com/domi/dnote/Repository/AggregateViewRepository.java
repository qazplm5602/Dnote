package com.domi.dnote.Repository;

import com.domi.dnote.Entity.AggregateView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AggregateViewRepository extends JpaRepository<AggregateView, Long> {

}
