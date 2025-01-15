package com.domi.dnote.Controller;

import com.domi.dnote.DTO.PostPreviewDTO;
import com.domi.dnote.DTO.PostSearchParamDTO;
import com.domi.dnote.DTO.PostPageResultDTO;
import com.domi.dnote.Entity.Post;
import com.domi.dnote.Enums.PostSort;
import com.domi.dnote.Service.PostService;
import com.domi.dnote.Service.TagCountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequestMapping("/api/post/search")
@RequiredArgsConstructor
@RestController
public class PostSearchController {
    private final PostService postService;
    private final TagCountService tagCountService;

    @GetMapping("")
    PostPageResultDTO getSearchResult(@ModelAttribute @Valid PostSearchParamDTO form, HttpServletRequest request) {
        List<String> keywords = new ArrayList<>();
        List<String> tags = new ArrayList<>();


        for (String value : form.getQuery().split(" ")) {
            if (value.isEmpty()) continue;

            if (value.startsWith("#")) { // 태그임
                if (value.length() <= 1) continue; // ? # <-- 왜 이것만 있음
                tags.add(value.substring(1));
            } else {
                keywords.add(value);
            }
        }

        PostSort sortType = PostSort.Relation;
        sortType = switch (form.getSort()) {
            case 0 -> PostSort.Relation;
            case 1 -> PostSort.Latest;
            case 2 -> PostSort.Popular;
            default -> sortType;
        };

        // 태그 인기 수집
//        System.out.println("post search CF-Connecting-IP: " + request.getHeader("CF-Connecting-IP") + " / x-real-ip: "+ request.getHeader("x-real-ip") + " / X-Forwarded-For: " + request.getHeader("X-Forwarded-For"));
        String ip = request.getHeader("CF-Connecting-IP"); // cloudflare에서 헤더로 ip보내줌 (신뢰 ㄱㄴ)
        if (ip != null) // 만약 null 이면 페이지 캐싱으로 접속한듯
            tagCountService.tagsUpClient(ip, tags);

        Page<Post> postPage = postService.searchPost(keywords, tags, sortType, form.getPage());

        var dto = new PostPageResultDTO();
        dto.setTotal(postPage.getTotalElements());
        dto.setPosts(postPage.get().map(PostPreviewDTO::toEntity).toList());

        return dto;
    }
}
