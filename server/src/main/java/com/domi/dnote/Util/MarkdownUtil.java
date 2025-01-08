package com.domi.dnote.Util;

import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.text.TextContentRenderer;

public class MarkdownUtil {
    public static String extractText(String markdown) {
        Parser parser = Parser.builder().build();
        Node document = parser.parse(markdown);

        TextContentRenderer renderer = TextContentRenderer.builder().build();
        return renderer.render(document);
    }
}
