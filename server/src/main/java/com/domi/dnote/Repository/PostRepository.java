package com.domi.dnote.Repository;

import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.PostId;
import com.domi.dnote.Entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, PostId> {
    public Optional<Post> findByOwnerAndId(User owner, long id);

    @Query("SELECT IFNULL(MAX(c.id), 0) FROM Post AS c WHERE c.owner = :user")
    long getMaxIdByOwner(@Value("user") User user);

    @Modifying
    byte deleteByOwnerAndId(User owner, long id);

    // 키워드, 태그 검색 (연관순)
    @Query(value = """
        SELECT * 
        FROM posts 
        WHERE MATCH (title, content) AGAINST (:keyword IN BOOLEAN MODE)
           OR MATCH (tags) AGAINST (:tag IN BOOLEAN MODE)
        ORDER BY (
            MATCH (title, content) AGAINST (:keyword IN BOOLEAN MODE) + 
            MATCH (tags) AGAINST (:tag IN BOOLEAN MODE)
        ) DESC
    """, nativeQuery = true)
    Page<Post> getSearchKeywordOrTagsOrderRelation(@Param("keyword") String keyword, @Param("tag") String tag, Pageable pageable);

    // 키워드, 태그 검색 (최근순)
    @Query(value = """
        SELECT * 
        FROM posts 
        WHERE MATCH (title, content) AGAINST (:keyword IN BOOLEAN MODE)
           OR MATCH (tags) AGAINST (:tag IN BOOLEAN MODE)
        ORDER BY created DESC
    """, nativeQuery = true)
    Page<Post> getSearchKeywordOrTagsOrderLatest(@Param("keyword") String keyword, @Param("tag") String tag, Pageable pageable);


    // 키워드, 태그 검색 (인기순)
    @Query(value = """
        SELECT * 
        FROM posts 
        WHERE MATCH (title, content) AGAINST (:keyword IN BOOLEAN MODE)
           OR MATCH (tags) AGAINST (:tag IN BOOLEAN MODE)
        ORDER BY view_count DESC
    """, nativeQuery = true)
    Page<Post> getSearchKeywordOrTagsOrderPopular(@Param("keyword") String keyword, @Param("tag") String tag, Pageable pageable);

    // 유저로 포스트 가져옴
    Page<Post> findByOwnerOrderByViewCountDesc(User owner, Pageable pageable); // 인기
    Page<Post> findByOwnerOrderByCreatedDesc(User owner, Pageable pageable); // 최신
    Page<Post> findByOwnerOrderByCreatedAsc(User owner, Pageable pageable); // 오래된거

    List<Post> findByCreatedAfter(LocalDateTime created);
}
