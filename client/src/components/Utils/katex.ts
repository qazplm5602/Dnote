import katex from 'katex';

export function renderKatexView(node: { literal: string }) {
    const html = katex.renderToString(node.literal, { throwOnError: false, output: 'mathml' });
        return [
            { type: 'openTag', tagName: 'div', outerNewLine: true },
            { type: 'html', content: html },
            { type: 'closeTag', tagName: 'div', outerNewLine: true }
        ];
}