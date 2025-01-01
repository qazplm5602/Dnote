package com.domi.dnote.DTO;

import com.domi.dnote.Entity.Post;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class PostPageResultDTO {
    private long total;
    private List<PostDTO> posts;

    public static PostPageResultDTO toEntity(Page<Post> data) {
        PostPageResultDTO dto = new PostPageResultDTO();
        dto.total = data.getTotalElements();
        dto.posts = data.getContent().stream().map(PostDTO::toEntity).collect(Collectors.toList());

        return dto;
    }
}
