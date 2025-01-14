package com.domi.dnote.Util;

import org.commonmark.Extension;
import org.commonmark.ext.gfm.tables.TablesExtension;
import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.commonmark.renderer.text.TextContentRenderer;
import org.jsoup.Jsoup;

import java.util.ArrayList;
import java.util.List;

public class MarkdownUtil {
    public final static List<Extension> extensions = List.of(TablesExtension.create());

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

    public static String extractText(String markdown) {
        String html = convertHtml(markdown);
        return Jsoup.parse(html).text(); // html에서 text만
    }
}
