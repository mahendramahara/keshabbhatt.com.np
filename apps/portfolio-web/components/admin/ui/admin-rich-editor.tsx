"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Minus,
  Undo,
  Redo,
  Eye,
  PenTool,
  Code,
  Sparkles,
  RemoveFormatting,
} from "lucide-react";
import { sanitizeHtml, getArticleMetrics } from "@/lib/markdown";

export interface AdminRichEditorProps {
  label?: string;
  value: string;
  onChange: (content: string) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  minHeight?: string;
}

type EditorMode = "visual" | "source" | "preview";

/**
 * Heals any legacy malformed or recursively nested tags (e.g. from previous buggy runs).
 * Flattens repeated <p align="..."> tags and ensures proper closing markers.
 */
export function healCorruptedContent(rawInput: string): string {
  if (!rawInput || !rawInput.trim()) return "";
  let text = rawInput.trim();

  // 1. Fix malformed unclosed <u> tags: e.g. *<u>text<u>* -> <u>text</u>
  text = text.replace(/<u>([^<]+)<u>/gi, "<u>$1</u>");

  // 2. Flatten nested alignment tags: collapse multiple <p align="..."> into the innermost alignment
  let prev = "";
  while (prev !== text) {
    prev = text;
    // Replace <p align="X">\s*<p align="Y"> with <p align="Y">
    text = text.replace(
      /<p\s+align=["'][^"']*["']\s*>\s*(<p\s+align=["'][^"']*["']\s*>)/gi,
      "$1"
    );
    // Remove extra trailing </p>\s*</p> when left orphaned
    text = text.replace(/<\/p>\s*<\/p>/gi, "</p>");
  }

  // 3. Strip duplicate prefixes like `> 1. <p align="...">`
  text = text.replace(
    /(?:^|\n)(?:>\s*)+(?:1\.\s*)+<p\s+align=["'][^"']*["']\s*>/gi,
    (match) => {
      return match.includes("1.") ? "\n1. " : "\n> ";
    }
  );

  return text.trim();
}

/**
 * Strict SEO Cleaner: Removes all phantom empty tags (<p></p>, <h1></h1>, <p><br></p>)
 * and sanitizes against any XSS or script injections.
 */
export function cleanEditorHtml(rawHtml: string): string {
  if (!rawHtml || !rawHtml.trim()) return "";

  let cleaned = rawHtml;

  // 1. Remove standard TipTap empty paragraph placeholder: <p></p> or <p><br></p> or <p>&nbsp;</p>
  cleaned = cleaned.replace(
    /<p\b[^>]*>\s*(?:<br\s*\/?>|&nbsp;|\u00a0)?\s*<\/p>/gi,
    ""
  );

  // 2. Remove empty headings
  cleaned = cleaned.replace(
    /<h[1-6]\b[^>]*>\s*(?:<br\s*\/?>|&nbsp;|\u00a0)?\s*<\/h[1-6]>/gi,
    ""
  );

  // 3. Remove empty blockquotes and lists
  cleaned = cleaned.replace(/<blockquote\b[^>]*>\s*<\/blockquote>/gi, "");
  cleaned = cleaned.replace(/<(?:ul|ol)\b[^>]*>\s*<\/(?:ul|ol)>/gi, "");

  // 4. Repeatedly remove any resulting nested empty tags
  let prev = "";
  while (prev !== cleaned) {
    prev = cleaned;
    cleaned = cleaned.replace(
      /<(p|h[1-6]|blockquote|ul|ol|li)\b[^>]*>\s*<\/\1>/gi,
      ""
    );
  }

  return sanitizeHtml(cleaned.trim());
}

export const AdminRichEditor: React.FC<AdminRichEditorProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  placeholder = "Write your executive insights, empirical analysis, and strategic perspectives...",
  minHeight = "380px",
}) => {
  const [mode, setMode] = useState<EditorMode>("visual");
  const [sourceValue, setSourceValue] = useState<string>(value || "");
  const [, setEditorTick] = useState(0);

  // Force toolbar re-render immediately on every cursor position change or formatting toggle (MS Word-like)
  const refreshToolbar = useCallback(() => {
    setEditorTick((t) => (t + 1) % 1_000_000);
  }, []);

  // Compute live reading metrics
  const metrics = useMemo(() => getArticleMetrics(value || ""), [value]);

  // Compute safe HTML preview (100% XSS-immune, 0 empty tags)
  const previewHtml = useMemo(() => cleanEditorHtml(value || ""), [value]);

  // Initialize TipTap managed editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-6 my-3 space-y-1",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-6 my-3 space-y-1",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-[var(--accent-gold)] pl-4 my-4 italic text-[var(--text-main)] bg-[var(--accent-gold)]/5 py-2 rounded-r-lg",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] p-4 rounded-xl font-mono text-xs my-4 text-[var(--accent-gold)] overflow-x-auto",
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "my-6 border-t border-[var(--border-subtle)]",
          },
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[var(--accent-gold)] underline font-medium hover:text-[var(--accent-gold)]/80 transition-colors",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: healCorruptedContent(value || ""),
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none text-[var(--text-main)] text-sm sm:text-base leading-[1.85] focus:outline-none p-5 sm:p-7 min-h-[380px] font-[family-name:var(--font-sans)]",
        "data-placeholder": placeholder,
      },
    },
    onSelectionUpdate: refreshToolbar,
    onTransaction: refreshToolbar,
    onUpdate: ({ editor: activeEditor }) => {
      const html = activeEditor.getHTML();
      const cleaned = cleanEditorHtml(html);
      setSourceValue(cleaned);
      onChange(cleaned);
    },
  });

  // Sync incoming value from external updates (e.g. initial fetch)
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentEditorHtml = cleanEditorHtml(editor.getHTML());
      const incomingHtml = cleanEditorHtml(value);
      if (incomingHtml !== currentEditorHtml) {
        editor.commands.setContent(healCorruptedContent(value));
        void Promise.resolve().then(() => {
          setSourceValue(incomingHtml);
        });
      }
    }
  }, [value, editor]);

  // Handle switching between Visual and Source code mode
  const handleModeChange = (newMode: EditorMode) => {
    if (newMode === "visual" && mode === "source") {
      // Sync manual source edits back to TipTap
      const cleaned = cleanEditorHtml(sourceValue);
      editor?.commands.setContent(healCorruptedContent(cleaned));
      onChange(cleaned);
    } else if (newMode === "source") {
      setSourceValue(cleanEditorHtml(value || ""));
    }
    setMode(newMode);
  };

  // Source text area change
  const handleSourceChange = (newText: string) => {
    setSourceValue(newText);
    onChange(newText);
  };

  // --- Strict Non-Nesting Alignment Actions ---
  const setAlignment = useCallback(
    (alignment: "left" | "center" | "right" | "justify") => {
      if (!editor) return;
      if (editor.isActive({ textAlign: alignment })) {
        // Toggle OFF: If already active, unset alignment
        editor.chain().focus().unsetTextAlign().run();
      } else {
        // Set new alignment: TipTap replaces the attribute, NEVER nests!
        editor.chain().focus().setTextAlign(alignment).run();
      }
    },
    [editor]
  );

  // Link Dialog
  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL (e.g. https://...):", previousUrl || "https://");

    if (url === null) return;
    if (url.trim() === "" || url.trim() === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }, [editor]);

  return (
    <div className="w-full space-y-2 select-auto">
      {/* Header Bar: Label, View Modes, Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {label && (
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
            {label}
            <span className="text-red-500 ml-1">*</span>
          </label>
        )}

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center p-0.5 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-xs">
            <button
              type="button"
              onClick={() => handleModeChange("visual")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                mode === "visual"
                  ? "bg-[var(--accent-gold)] text-[#0a0f1d] font-semibold shadow-xs"
                  : "text-[var(--text-sub)] hover:text-[var(--text-main)]"
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Visual Editor</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("source")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                mode === "source"
                  ? "bg-[var(--accent-gold)] text-[#0a0f1d] font-semibold shadow-xs"
                  : "text-[var(--text-sub)] hover:text-[var(--text-main)]"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Source HTML</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                mode === "preview"
                  ? "bg-[var(--accent-gold)] text-[#0a0f1d] font-semibold shadow-xs"
                  : "text-[var(--text-sub)] hover:text-[var(--text-main)]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          <span className="text-[11px] text-[var(--text-muted)] font-mono hidden sm:inline pl-2">
            {metrics.words} words • {metrics.chars} chars • {metrics.readingTime}
          </span>
        </div>
      </div>

      {/* Main Elevated Editor Container with Executive Highlight Halo Shadow */}
      <div
        className={`w-full rounded-2xl bg-[var(--bg-card)] border transition-all duration-200 overflow-hidden ${
          error
            ? "border-red-500 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/15 focus-within:shadow-[0_0_24px_rgba(239,68,68,0.18)]"
            : "border-[var(--border-card)] hover:border-[var(--accent-gold)]/40 focus-within:border-[var(--accent-gold)] focus-within:ring-4 focus-within:ring-[var(--accent-gold)]/15 focus-within:shadow-[0_0_24px_rgba(201,133,22,0.16)] shadow-xs"
        }`}
      >
        {/* Managed WYSIWYG Toolbar */}
        {mode === "visual" && editor && (() => {
          const isBold = editor.isActive("bold");
          const isItalic = editor.isActive("italic");
          const isUnderline = editor.isActive("underline");
          const isStrike = editor.isActive("strike");
          const isH1 = editor.isActive("heading", { level: 1 });
          const isH2 = editor.isActive("heading", { level: 2 });
          const isH3 = editor.isActive("heading", { level: 3 });
          const isParagraph = editor.isActive("paragraph") && !isH1 && !isH2 && !isH3 && !editor.isActive("blockquote") && !editor.isActive("codeBlock");
          const isCenter = editor.isActive({ textAlign: "center" });
          const isRight = editor.isActive({ textAlign: "right" });
          const isJustify = editor.isActive({ textAlign: "justify" });
          const isLeft = editor.isActive({ textAlign: "left" }) || (!isCenter && !isRight && !isJustify);
          const isBulletList = editor.isActive("bulletList");
          const isOrderedList = editor.isActive("orderedList");
          const isBlockquote = editor.isActive("blockquote");
          const isCodeBlock = editor.isActive("codeBlock");
          const isLink = editor.isActive("link");

          const btnClass = (active: boolean) =>
            `p-1.5 sm:p-2 rounded-lg font-medium transition-all duration-150 flex items-center justify-center cursor-pointer select-none ${
              active
                ? "bg-[var(--accent-gold)] text-[#0a0f1d] font-bold shadow-xs ring-2 ring-[var(--accent-gold)] scale-[1.04]"
                : "text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] active:scale-95"
            }`;

          return (
            <div className="flex flex-wrap items-center gap-1 p-2 bg-[var(--bg-card-inner)] border-b border-[var(--border-subtle)] select-none">
              {/* Undo / Redo */}
              <div className="flex items-center gap-0.5 border-r border-[var(--border-subtle)] pr-1.5 mr-1">
                <button
                  type="button"
                  title="Undo (Ctrl+Z)"
                  aria-label="Undo"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  className="p-1.5 sm:p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <Undo className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Redo (Ctrl+Y)"
                  aria-label="Redo"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  className="p-1.5 sm:p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>

              {/* Block Hierarchy: Paragraph, H1, H2, H3 */}
              <div className="flex items-center gap-0.5 border-r border-[var(--border-subtle)] pr-1.5 mr-1">
                <button
                  type="button"
                  title="Normal Paragraph (Click to activate)"
                  aria-pressed={isParagraph}
                  onClick={() => editor.chain().focus().setParagraph().run()}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer select-none ${
                    isParagraph
                      ? "bg-[var(--accent-gold)] text-[#0a0f1d] font-bold shadow-xs ring-2 ring-[var(--accent-gold)] scale-[1.04]"
                      : "text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] active:scale-95"
                  }`}
                >
                  P
                </button>

                <button
                  type="button"
                  title="Heading 1 (Click to activate or toggle off)"
                  aria-pressed={isH1}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={btnClass(isH1)}
                >
                  <Heading1 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Heading 2 (Click to activate or toggle off)"
                  aria-pressed={isH2}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={btnClass(isH2)}
                >
                  <Heading2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Heading 3 (Click to activate or toggle off)"
                  aria-pressed={isH3}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={btnClass(isH3)}
                >
                  <Heading3 className="w-4 h-4" />
                </button>
              </div>

              {/* Inline Typography: Bold, Italic, Underline, Strike */}
              <div className="flex items-center gap-0.5 border-r border-[var(--border-subtle)] pr-1.5 mr-1">
                <button
                  type="button"
                  title="Bold (Ctrl+B - Click to activate or toggle off)"
                  aria-pressed={isBold}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={btnClass(isBold)}
                >
                  <Bold className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Italic (Ctrl+I - Click to activate or toggle off)"
                  aria-pressed={isItalic}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={btnClass(isItalic)}
                >
                  <Italic className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Underline (Ctrl+U - Click to activate or toggle off)"
                  aria-pressed={isUnderline}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={btnClass(isUnderline)}
                >
                  <UnderlineIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Strikethrough (Click to activate or toggle off)"
                  aria-pressed={isStrike}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={btnClass(isStrike)}
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
              </div>

              {/* Alignments (Strict single attribute, never nests, toggles clean) */}
              <div className="flex items-center gap-0.5 border-r border-[var(--border-subtle)] pr-1.5 mr-1">
                <button
                  type="button"
                  title="Align Left (Default)"
                  aria-pressed={isLeft}
                  onClick={() => setAlignment("left")}
                  className={btnClass(isLeft)}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Center Text (Click to activate or toggle off)"
                  aria-pressed={isCenter}
                  onClick={() => setAlignment("center")}
                  className={btnClass(isCenter)}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Align Right (Click to activate or toggle off)"
                  aria-pressed={isRight}
                  onClick={() => setAlignment("right")}
                  className={btnClass(isRight)}
                >
                  <AlignRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Justify Text (Click to activate or toggle off)"
                  aria-pressed={isJustify}
                  onClick={() => setAlignment("justify")}
                  className={btnClass(isJustify)}
                >
                  <AlignJustify className="w-4 h-4" />
                </button>
              </div>

              {/* Lists, Quote, Code Block */}
              <div className="flex items-center gap-0.5 border-r border-[var(--border-subtle)] pr-1.5 mr-1">
                <button
                  type="button"
                  title="Bullet List (Click to activate or toggle off)"
                  aria-pressed={isBulletList}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={btnClass(isBulletList)}
                >
                  <List className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Numbered List (Click to activate or toggle off)"
                  aria-pressed={isOrderedList}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={btnClass(isOrderedList)}
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Executive Blockquote (Click to activate or toggle off)"
                  aria-pressed={isBlockquote}
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={btnClass(isBlockquote)}
                >
                  <Quote className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Code Block (Click to activate or toggle off)"
                  aria-pressed={isCodeBlock}
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={btnClass(isCodeBlock)}
                >
                  <Code2 className="w-4 h-4" />
                </button>
              </div>

              {/* Links, Divider, Clear Formatting */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  title="Insert Web Link"
                  aria-pressed={isLink}
                  onClick={handleSetLink}
                  className={btnClass(isLink)}
                >
                  <LinkIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Horizontal Divider"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  className="p-1.5 sm:p-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Clear Formatting from selected text"
                  onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                  className="p-1.5 sm:p-2 rounded-lg text-[var(--text-muted)] hover:text-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
                >
                  <RemoveFormatting className="w-4 h-4" />
                </button>
              </div>

              {/* Status indicator */}
              <div className="hidden xl:flex items-center gap-1.5 ml-auto text-[11px] text-[var(--text-muted)] pr-2">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Managed Service • Realtime Word-like Ribbon</span>
              </div>
            </div>
          );
        })()}

        {/* Editor Body Area: Single Scrollbar (Auto-grow without nested inner scrollbars) */}
        <div style={{ minHeight }} className="w-full">
          {/* Visual Mode: Real-time WYSIWYG without raw tags */}
          {mode === "visual" && (
            <div className="tiptap-editor-wrap">
              <EditorContent editor={editor} />
            </div>
          )}

          {/* Source Code Mode: Clean HTML view */}
          {mode === "source" && (
            <div className="p-4 sm:p-6 bg-[var(--bg-card-inner)]/50">
              <div className="flex items-center justify-between pb-2 text-xs text-[var(--text-muted)]">
                <span>Direct HTML Source Code</span>
                <span>Auto-cleans on save</span>
              </div>
              <textarea
                value={sourceValue}
                onChange={(e) => handleSourceChange(e.target.value)}
                style={{ minHeight: "340px" }}
                className="w-full p-4 rounded-xl font-mono text-xs sm:text-sm bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-gold)] resize-y leading-relaxed"
                placeholder="<p>Write raw HTML here...</p>"
              />
            </div>
          )}

          {/* Live Article Preview Mode */}
          {mode === "preview" && (
            <div
              style={{ minHeight }}
              className="p-6 sm:p-10 prose dark:prose-invert max-w-none text-[var(--text-sub)] text-[15px] sm:text-[17px] leading-[1.85] bg-[var(--bg-app)]/30 font-[family-name:var(--font-sans)] prose-headings:text-[var(--text-main)] prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[var(--accent-gold)] prose-strong:text-[var(--text-main)] prose-blockquote:border-[var(--accent-gold)] prose-blockquote:text-[var(--text-main)]"
              dangerouslySetInnerHTML={{
                __html:
                  previewHtml ||
                  "<p class='text-[var(--text-muted)] italic'>Preview will appear here once you begin writing...</p>",
              }}
            />
          )}
        </div>
      </div>

      {/* Helper text & error validation */}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-[var(--text-muted)]">{helperText}</p>
      )}
    </div>
  );
};

export default AdminRichEditor;
