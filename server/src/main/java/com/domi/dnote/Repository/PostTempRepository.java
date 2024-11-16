package com.domi.dnote.Repository;

import com.domi.dnote.Entity.PostTemp;
import com.domi.dnote.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostTempRepository extends JpaRepository<PostTemp, String> {
    @Modifying
    void deleteById(String id);

    Optional<PostTemp> findById(String id);

    List<PostTemp> findByUser(User user);
}
