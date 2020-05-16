<template>
    <div class="container-editor">
        <pre id="editor" ref="editor" contenteditable="plaintext-only" spellcheck="false"></pre>
    </div>
</template>


<script>
let highlightDebounce;
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
            clearTimeout(highlightDebounce);
            highlightDebounce = setTimeout(() => {
                let savPos = this.saveSelection(window.editor);
                hljs.highlightBlock(window.editor);
                this.restoreSelection(window.editor, savPos);
            }, 100);
        },
        restoreSelection(containerEl, savedSel) {
            var charIndex = 0,
                range = document.createRange();
            range.setStart(containerEl, 0);
            range.collapse(true);
            var nodeStack = [containerEl],
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
                    var i = node.childNodes.length;
                    while (i--) {
                        nodeStack.push(node.childNodes[i]);
                    }
                }
            }

            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        },
        saveSelection(containerEl) {
            var range = window.getSelection().getRangeAt(0);
            var preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(containerEl);
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            var start = preSelectionRange.toString().length;

            return {
                start: start,
                end: start + range.toString().length
            };
        }
    }
};
</script>