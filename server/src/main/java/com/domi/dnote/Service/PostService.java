package com.domi.dnote.Service;

import com.domi.dnote.DTO.PostUploadDTO;
import com.domi.dnote.Entity.Post;
import com.domi.dnote.Entity.User;
import com.domi.dnote.Enums.PostSort;
import com.domi.dnote.Exception.PostException;
import com.domi.dnote.Repository.PostRepository;
import com.domi.dnote.Util.MarkdownUtil;
import lombok.RequiredArgsConstructor;
import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.jsoup.Jsoup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class PostService {
    final PostRepository postRepository;
    final UserService userService;

    public Post getPostByOwnerId(User owner, long id) {
        Optional<Post> postOption = postRepository.findByOwnerAndId(owner, id);
        return postOption.orElseThrow(() -> new PostException(PostException.Type.NOT_FOUND_POST));
    }

    public Post getPostByOwnerPostId(long userId, long postId) {
        return getPostByOwnerId(userService.getUserById(userId), postId);
    }

    public Post createPost(User user, PostUploadDTO form) {
        long postId = postRepository.getMaxIdByOwner(user);

        Post newPost = Post.builder()
                .owner(user)
                .id(postId + 1)
                .title(form.getTitle())
                .content(form.getContent())
                .contentPreview(createContentPreview(form.getContent()))
                .thumbnail(form.getThumbnail())
                .tags(form.getTags())
                .readTime(calculateReadTime(form.getContent()))
                .viewCount(0)
                .created(LocalDateTime.now())
                .build();

        return postRepository.save(newPost);
    }

    public boolean removePost(User user, long id) {
        return postRepository.deleteByOwnerAndId(user, id) > 0;
    }

    public Post save(Post post) {
        return postRepository.save(post);
    }

    public Page<Post> searchPost(List<String> keywords, List<String> tags, PostSort sortType, byte page) {
        String keyword = String.join(" ", keywords);
        String tag = String.join(" ", tags);
        Pageable pageable = PageRequest.of(page, 16);

        switch (sortType) {
            case Relation -> {
                return postRepository.getSearchKeywordOrTagsOrderRelation(keyword, tag, pageable);
            }
            case Latest -> {
                return postRepository.getSearchKeywordOrTagsOrderLatest(keyword, tag, pageable);
            }
            case Popular -> {
                return postRepository.getSearchKeywordOrTagsOrderPopular(keyword, tag, pageable);
            }

            case null, default ->  throw new RuntimeException(); // 이럴리가 없는데..
        }
    }

    public Page<Post> getPostsByUser(User user, Pageable pageable, PostSort sortType) {
        switch (sortType) {
            case Popular -> {
                return postRepository.findByOwnerOrderByViewCountDesc(user, pageable);
            }
            case Latest -> {
                return postRepository.findByOwnerOrderByCreatedDesc(user, pageable);
            }
            case Oldest -> {
                return postRepository.findByOwnerOrderByCreatedAsc(user, pageable);
            }
            default -> throw new RuntimeException();
        }
    }

    public List<Post> getPostsByDateAfter(LocalDateTime date) {
        return postRepository.findByCreatedAfter(date);
    }

    public String createContentPreview(String markdown) {
        String content = MarkdownUtil.extractText(markdown);

        int maxLength = 150; // 최대 100자리까지
        return content.substring(0, Math.min(content.length(), maxLength)).trim();
    }

    public int calculateReadTime(String html) {
        String content = MarkdownUtil.extractText(html);

        int wordCount = content.split("").length;
        int readSpeed = 250; // 분당 읽는 시간 (1분당 250단어)

        return wordCount / readSpeed;
    }
}
