package com.domi.dnote.Repository;

import com.domi.dnote.DTO.AggregateViewDataInterface;
import com.domi.dnote.Entity.AggregateView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AggregateViewRepository extends JpaRepository<AggregateView, Long> {
    @Query(value = """
    WITH hourly_views AS (
        SELECT
            post_id,
            owner_id,
            DATE_FORMAT(created, '%Y-%m-%d %H:00:00') AS hour,
            SUM(view_count) AS views
        FROM post_aggregated_views
        WHERE created >= NOW() - INTERVAL 24 HOUR
        GROUP BY post_id, owner_id, DATE_FORMAT(created, '%Y-%m-%d %H:00:00')
    ),
    recent_1hr AS (
        SELECT
            post_id,
            owner_id,
            SUM(views) AS views_1hr
        FROM hourly_views
        WHERE hour = DATE_FORMAT(NOW() - INTERVAL 0 HOUR, '%Y-%m-%d %H:00:00')
        GROUP BY post_id, owner_id
    ),
    recent_24hr AS (
        SELECT
            post_id,
            owner_id,
            SUM(views) AS views_24hr
        FROM hourly_views
        WHERE hour >= DATE_FORMAT(NOW() - INTERVAL 24 HOUR, '%Y-%m-%d %H:00:00')
        GROUP BY post_id, owner_id
    ),
    previous_1hr AS (
        SELECT
            post_id,
            owner_id,
            SUM(views) AS views_1hr_prev
        FROM hourly_views
        WHERE hour = DATE_FORMAT(NOW() - INTERVAL 1 HOUR, '%Y-%m-%d %H:00:00')
        GROUP BY post_id, owner_id
    )
    SELECT
        r1.post_id,
        r1.owner_id,
        COALESCE(r1.views_1hr, 0) AS views,
        COALESCE(
            CASE
                WHEN p1.views_1hr_prev = 0 THEN NULL
                WHEN p1.views_1hr_prev IS NULL THEN NULL
                ELSE ((r1.views_1hr - p1.views_1hr_prev) / p1.views_1hr_prev) * 100
            END, 0) AS growth_rate
    FROM recent_1hr r1
    LEFT JOIN previous_1hr p1 ON r1.post_id = p1.post_id AND r1.owner_id = p1.owner_id
    LEFT JOIN recent_24hr r24 ON r1.post_id = r24.post_id AND r1.owner_id = r24.owner_id
    ;
""", nativeQuery = true)
    List<AggregateViewDataInterface> getPostViewPercent();

    int deleteByCreatedBefore(LocalDateTime createdBefore);
}
