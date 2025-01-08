package com.domi.dnote.Util;

import org.commonmark.node.AbstractVisitor;
import org.commonmark.node.Image;

import java.util.ArrayList;
import java.util.List;

public class ImageLinkExtractor extends AbstractVisitor {
    private final List<String> links = new ArrayList<>();

    public List<String> getImageLinks() {
        return links;
    }

    @Override
    public void visit(Image image) {
        links.add(image.getDestination());
        visitChildren(image);
    }
}
