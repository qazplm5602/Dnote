package com.domi.dnote.Util;

import org.commonmark.Extension;
import org.commonmark.ext.gfm.tables.TablesExtension;
import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.commonmark.renderer.text.TextContentRenderer;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MarkdownUtil {
    public final static List<Extension> extensions = List.of(TablesExtension.create());
//    private final static String CUSTOM_PREFIX = "$$";

    public static Node parse(String markdown) {
        Parser parser = Parser.builder()
                .extensions(extensions)
                .build();

        return parser.parse(markdown);
    }

    public static String convertHtml(String markdown) {
        Node document = parse(markdown);

        // 마크다운 -> html
        HtmlRenderer renderer = HtmlRenderer.builder()
                .extensions(MarkdownUtil.extensions)
                .build();

        return renderer.render(document);
    }

    // p 태그 안에 커스텀 말고 다른것도 있었응
    public static Document removeCustomRenderer(Document root) {
        for (Element element : root.select("p")) {
            String content = element.text();

            Pattern pattern = Pattern.compile("\\$\\$[\\s\\S]*?\\$\\$");
            Matcher matcher = pattern.matcher(content);

            while (matcher.find()) {
                content = content.substring(0, matcher.start()) + content.substring(matcher.end());
                matcher = pattern.matcher(content);
            }

            if (content.isEmpty())
                element.remove(); // 아무것도 없지롱
            else
                element.text(content);

//            if (content.startsWith((CUSTOM_PREFIX))) {
//
//                // 아니 전부 다 커스텀 ㄷㄷ
//                if (content.endsWith(CUSTOM_PREFIX)) {
//                    element.remove();
//                    continue;
//                }
//
//                // 첫 $$ <-- 이거 제외한거
//                String nonStartContent = content.substring(CUSTOM_PREFIX.length());
//
//            }
        }

        return root;
    }

    public static String extractText(String markdown) {
        markdown = replaceSafeContent(markdown);
        String html = convertHtml(markdown);
        return removeCustomRenderer(Jsoup.parse(html)).text(); // html에서 text만
    }

    public static String replaceSafeContent(String markdown) {
        return markdown.replaceAll("</?br>", "").replaceAll("!\\[", "\n![");
    }
}
