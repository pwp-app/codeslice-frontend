<template>
    <div class="container-editor">
        <pre id="editor" ref="editor" contenteditable="plaintext-only" spellcheck="false"></pre>
    </div>
</template>

<script>
let highlightDebounce;
let editorTextLength = 0;
export default {
    name: "editor",
    mounted() {
        window.editor = document.getElementById("editor");
        window.editor.addEventListener("input", this.codeChanged);
    },
    destroyed() {
        window.editor.removeEventListener("input", this.codeChanged);
    },
    methods: {
        codeChanged() {
            // 渲染高亮
            if (!highlightDebounce && window.editor.innerText.length -  editorTextLength > 5) {
                // 没有定时器的时候立刻对更改执行一次，提升复制粘贴的体验
                this.doHighlight();
            }
            clearTimeout(highlightDebounce);
            highlightDebounce = setTimeout(() => {
                this.doHighlight();
            }, 100);
        },
        doHighlight() {
            let savPos = this.saveSelection(window.editor);
            window.editor.removeAttribute('class');
            hljs.highlightBlock(window.editor);
            this.restoreSelection(window.editor, savPos);
            editorTextLength = window.editor.innerText.length;
        },
        restoreSelection(containerEl, savedSel) {
            let charIndex = 0,
                range = document.createRange();
            range.setStart(containerEl, 0);
            range.collapse(true);
            let nodeStack = [containerEl],
                node,
                foundStart = false,
                stop = false;

            while (!stop && (node = nodeStack.pop())) {
                if (node.nodeType == 3) {
                    var nextCharIndex = charIndex + node.length;
                    if (
                        !foundStart &&
                        savedSel.start >= charIndex &&
                        savedSel.start <= nextCharIndex
                    ) {
                        range.setStart(node, savedSel.start - charIndex);
                        foundStart = true;
                    }
                    if (
                        foundStart &&
                        savedSel.end >= charIndex &&
                        savedSel.end <= nextCharIndex
                    ) {
                        range.setEnd(node, savedSel.end - charIndex);
                        stop = true;
                    }
                    charIndex = nextCharIndex;
                } else {
                    let i = node.childNodes.length;
                    while (i--) {
                        nodeStack.push(node.childNodes[i]);
                    }
                }
            }

            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        },
        saveSelection(containerEl) {
            let range = window.getSelection().getRangeAt(0);
            let preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(containerEl);
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            let start = preSelectionRange.toString().length;

            return {
                start: start,
                end: start + range.toString().length
            };
        }
    }
};
</script>