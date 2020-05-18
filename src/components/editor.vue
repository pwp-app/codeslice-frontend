<template>
    <div class="container-editor">
        <pre
            id="editor"
            ref="editor"
            contenteditable="plaintext-only"
            spellcheck="false"
        ></pre>
    </div>
</template>

<script>
let highlightDebounce;
let editorTextLength = 0;
let composition = false;
export default {
    name: "editor",
    mounted() {
        window.editor = document.getElementById("editor");
        window.editor.addEventListener("input", this.codeChanged);
        window.editor.addEventListener(
            "compositionstart",
            this.compositionStart
        );
        window.editor.addEventListener("compositionend", this.compositionEnd);
        window.editor.addEventListener("keydown", this.editorKeyDown);
    },
    destroyed() {
        window.editor.removeEventListener("input", this.codeChanged);
        window.editor.removeEventListener(
            "compositionstart",
            this.compositionStart
        );
        window.editor.removeEventListener(
            "compositionend",
            this.compositionEnd
        );
        window.editor.removeEventListener("keydown", this.editorKeyDown);
    },
    methods: {
        codeChanged() {
            if (composition) {
                return;
            }
            // 渲染高亮
            if (
                !highlightDebounce &&
                window.editor.innerText.length - editorTextLength > 5
            ) {
                // 没有定时器的时候立刻对更改执行一次，提升复制粘贴的体验
                this.doHighlight();
            }
            clearTimeout(highlightDebounce);
            highlightDebounce = setTimeout(() => {
                this.doHighlight();
            }, 100);
        },
        doHighlight() {
            let savPos = this.getSelection(window.editor);
            window.editor.removeAttribute("class");
            hljs.highlightBlock(window.editor);
            this.restoreSelection(window.editor, savPos);
            editorTextLength = window.editor.innerText.length;
        },
        compositionStart() {
            composition = true;
        },
        compositionEnd() {
            composition = false;
        },
        editorKeyDown(e) {
            if (e.keyCode === 9) {
                let selection = this.getSelection(window.editor);
                let { start, end } = selection;
                if (start === end) {
                    document.execCommand("insertText", false, "    ");
                    setTimeout(() => {
                        selection.start += 4;
                        selection.end += 4;
                        this.restoreSelection(window.editor, selection);
                    }, 0)
                } else {
                    let offset = 4 - (selection.end - selection.start);
                    document.execCommand("insertText", false, "    ");
                    setTimeout(() => {
                        selection.end += offset;
                        selection.start = selection.end;
                        this.restoreSelection(window.editor, selection);
                    }, 0)
                }
            }
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
        getSelection(containerEl) {
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