package com.domi.dnote.DTO;

public interface AggregateViewDataInterface {
    Long getPostId();
    Long getOwnerId();
    Long getViews(); // 1시간 조회수
    Long getGrowthRate(); // 24 조회수 증가율
}
