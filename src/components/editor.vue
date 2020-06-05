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
let historyStack = [{
    content: '',
    selection: {
        start: 0,
        end: 0
    }
}];
let futureStack = [];

export default {
    name: "editor",
    data() {
        return {
            highlightPaused: true,
        }
    },
    mounted() {
        window.editor = document.getElementById("editor");
        window.editor.addEventListener("input", this.codeChanged);
        window.editor.addEventListener("compositionstart", this.compositionStart);
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
                this.doRemember();
            }, 300);
        },
        async doRemember() {
            // 压入历史栈
            historyStack.push({
                selection: this.getSelection(window.editor),
                content: window.editor.innerText
            });
            if (historyStack > 50) {
                historyStack.shift();
            }
            futureStack = [];
        },
        async doHighlight() {
            // 过长的代码不予以高亮
            if (window.editor.innerText.length > 5000) {
                if (!this.highlightPaused) {
                    this.highlightPaused = true;
                }
                this.$message({
                    type: 'info',
                    message: '代码长度过长，CodeSlice 已暂停进行实时高亮',
                })
                return;
            } else {
                this.highlightPaused = false;
            }
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
            if (e.keyCode === 90 && e.ctrlKey) {
                // ctrl + z
                if (historyStack.length) {
                    futureStack.push({
                        selection: this.getSelection(window.editor),
                        content: window.editor.innerText
                    });
                    let history = historyStack.pop();
                    window.editor.innerText = history.content;
                    this.restoreSelection(window.editor, history.selection);
                }
                e.preventDefault();
                e.stopPropagation();
            }
            if (e.keyCode === 89 && e.ctrlKey) {
                // ctrl + y
                if (futureStack.length) {
                    historyStack.push({
                        selection: this.getSelection(window.editor),
                        content: window.editor.innerText
                    });
                    let future = futureStack.pop();
                    window.editor.innerText = future.content;
                    this.restoreSelection(window.editor, future.selection);
                }
                e.preventDefault();
                e.stopPropagation();
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