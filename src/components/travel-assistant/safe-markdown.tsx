import React from 'react';

interface SafeMarkdownProps {
  content: string;
  className?: string;
  variant?: 'assistant' | 'user';
}

interface ListItem {
  text: string;
  isSub: boolean;
  prefix?: string;
}

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'hr' }
  | { type: 'ul'; items: ListItem[] }
  | { type: 'ol'; items: ListItem[] }
  | { type: 'blockquote'; text: string }
  | { type: 'p'; text: string };

/**
 * Validates links to strictly allow safe protocols and prevent XSS (e.g. javascript: URLs).
 */
function sanitizeUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^(https?:\/\/|\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  return null;
}

/**
 * Unescapes markdown characters that were backslash-escaped by LLMs or formatting pipelines.
 * e.g., \*\*bold\*\* -> **bold**, \--- -> ---
 */
function cleanEscapedMarkdown(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\\\*/g, '*')
    .replace(/\\_/g, '_')
    .replace(/\\#/g, '#')
    .replace(/\\~/g, '~')
    .replace(/\\-/g, '-')
    .replace(/\\`/g, '`');
}

/**
 * Parses inline markdown tokens (bold, italic, code, links) into safe React elements.
 * Uses zero dangerouslySetInnerHTML to guarantee complete XSS protection.
 */
function renderInline(text: string, variant: 'assistant' | 'user'): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  // Pattern matches **bold**, *italic*, `code`, [link text](url)
  const tokenRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/;

  while (remaining) {
    const match = remaining.match(tokenRegex);
    if (!match || match.index === undefined) {
      elements.push(remaining);
      break;
    }

    const matchIndex = match.index;
    if (matchIndex > 0) {
      elements.push(remaining.slice(0, matchIndex));
    }

    const matchedStr = match[0];

    if (matchedStr.startsWith('**') && matchedStr.endsWith('**') && matchedStr.length >= 4) {
      const inner = matchedStr.slice(2, -2);
      elements.push(
        <strong
          key={`b-${keyIdx++}`}
          className={`font-semibold ${
            variant === 'assistant' ? 'text-foreground' : 'text-primary-foreground font-bold'
          }`}
        >
          {renderInline(inner, variant)}
        </strong>
      );
    } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*') && matchedStr.length >= 2) {
      const inner = matchedStr.slice(1, -1);
      elements.push(
        <em
          key={`i-${keyIdx++}`}
          className={`italic ${
            variant === 'assistant' ? 'text-foreground/90' : 'text-primary-foreground/90'
          }`}
        >
          {renderInline(inner, variant)}
        </em>
      );
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`') && matchedStr.length >= 2) {
      const inner = matchedStr.slice(1, -1);
      elements.push(
        <code
          key={`c-${keyIdx++}`}
          className={`px-1.5 py-0.5 rounded text-xs font-mono border ${
            variant === 'assistant'
              ? 'bg-muted text-foreground border-border/60'
              : 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30'
          }`}
        >
          {inner}
        </code>
      );
    } else if (matchedStr.startsWith('[') && matchedStr.includes('](') && matchedStr.endsWith(')')) {
      const closeBracket = matchedStr.indexOf('](');
      const linkText = matchedStr.slice(1, closeBracket);
      const rawUrl = matchedStr.slice(closeBracket + 2, -1);
      const safeUrl = sanitizeUrl(rawUrl);

      if (safeUrl) {
        elements.push(
          <a
            key={`a-${keyIdx++}`}
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline font-medium hover:opacity-80 transition-opacity ${
              variant === 'assistant' ? 'text-primary' : 'text-primary-foreground'
            }`}
          >
            {linkText}
          </a>
        );
      } else {
        // Unsafe URL protocol (e.g. javascript:), render strictly as safe text
        elements.push(linkText);
      }
    } else {
      elements.push(matchedStr);
    }

    remaining = remaining.slice(matchIndex + matchedStr.length);
  }

  return elements;
}

/**
 * Parses markdown text into block-level elements.
 */
function parseBlocks(rawContent: string): Block[] {
  const cleaned = cleanEscapedMarkdown(rawContent);
  const lines = cleaned.split(/\r?\n/);
  const blocks: Block[] = [];
  let currentList: { type: 'ul' | 'ol'; items: ListItem[] } | null = null;

  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line separates blocks
    if (!trimmed) {
      flushList();
      continue;
    }

    // Horizontal Rule: --- or *** or ___
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushList();
      blocks.push({ type: 'hr' });
      continue;
    }

    // Headings: # through ####
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      continue;
    }

    // Blockquote: > text
    const bqMatch = trimmed.match(/^>\s*(.+)$/);
    if (bqMatch) {
      flushList();
      blocks.push({
        type: 'blockquote',
        text: bqMatch[1],
      });
      continue;
    }

    // Unordered list item: * or - or +
    const ulMatch = line.match(/^(\s*)([\*\-\+])\s+(.+)$/);
    if (ulMatch) {
      const indent = ulMatch[1].length;
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push({
        text: ulMatch[3],
        isSub: indent >= 2,
      });
      continue;
    }

    // Ordered list item: 1. or 1)
    const olMatch = line.match(/^(\s*)(\d+)[\.\)]\s+(.+)$/);
    if (olMatch) {
      const indent = olMatch[1].length;
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push({
        text: olMatch[3],
        prefix: `${olMatch[2]}.`,
        isSub: indent >= 2,
      });
      continue;
    }

    // Normal paragraph line
    flushList();
    blocks.push({
      type: 'p',
      text: trimmed,
    });
  }

  flushList();
  return blocks;
}

/**
 * Pure React Markdown renderer for Travel Assistant messages.
 * Replaces escaped markdown (`**`, `---`, raw bullet tags) with clean, accessible React elements.
 * Employs zero dangerouslySetInnerHTML and rejects unsafe link schemes.
 */
export function SafeMarkdown({ content, className = '', variant = 'assistant' }: SafeMarkdownProps) {
  if (!content) return null;

  const blocks = parseBlocks(content);

  return (
    <div className={`space-y-2.5 break-words ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'hr':
            return (
              <hr
                key={`hr-${idx}`}
                className={`my-3 border-t ${
                  variant === 'assistant' ? 'border-border/70' : 'border-primary-foreground/30'
                }`}
              />
            );

          case 'heading': {
            const headingClasses =
              variant === 'assistant'
                ? 'text-primary font-semibold tracking-tight'
                : 'text-primary-foreground font-bold';

            if (block.level === 1) {
              return (
                <h3 key={`h1-${idx}`} className={`text-base sm:text-lg mt-3.5 mb-1.5 ${headingClasses}`}>
                  {renderInline(block.text, variant)}
                </h3>
              );
            }
            if (block.level === 2) {
              return (
                <h4 key={`h2-${idx}`} className={`text-sm sm:text-base mt-3 mb-1 ${headingClasses}`}>
                  {renderInline(block.text, variant)}
                </h4>
              );
            }
            return (
              <h5 key={`h3-${idx}`} className={`text-xs sm:text-sm mt-2.5 mb-1 ${headingClasses}`}>
                {renderInline(block.text, variant)}
              </h5>
            );
          }

          case 'ul':
            return (
              <ul key={`ul-${idx}`} className="my-1.5 space-y-1.5 pl-0.5">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={`ul-item-${itemIdx}`}
                    className={`flex items-start gap-2 leading-relaxed ${
                      item.isSub ? 'ml-4 text-xs opacity-90' : 'text-sm'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${
                        variant === 'assistant' ? 'bg-primary/75' : 'bg-primary-foreground/80'
                      }`}
                    />
                    <div className="flex-1">{renderInline(item.text, variant)}</div>
                  </li>
                ))}
              </ul>
            );

          case 'ol':
            return (
              <ol key={`ol-${idx}`} className="my-1.5 space-y-1.5 pl-0.5">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={`ol-item-${itemIdx}`}
                    className={`flex items-start gap-2 leading-relaxed ${
                      item.isSub ? 'ml-4 text-xs opacity-90' : 'text-sm'
                    }`}
                  >
                    <span
                      className={`font-semibold shrink-0 text-xs min-w-4 mt-0.5 ${
                        variant === 'assistant' ? 'text-primary' : 'text-primary-foreground/90'
                      }`}
                    >
                      {item.prefix || `${itemIdx + 1}.`}
                    </span>
                    <div className="flex-1">{renderInline(item.text, variant)}</div>
                  </li>
                ))}
              </ol>
            );

          case 'blockquote':
            return (
              <blockquote
                key={`bq-${idx}`}
                className={`my-2 pl-3 border-l-2 italic text-xs sm:text-sm ${
                  variant === 'assistant'
                    ? 'border-primary/50 text-muted-foreground'
                    : 'border-primary-foreground/50 text-primary-foreground/90'
                }`}
              >
                {renderInline(block.text, variant)}
              </blockquote>
            );

          case 'p':
          default:
            return (
              <p
                key={`p-${idx}`}
                className={`leading-relaxed text-sm ${
                  variant === 'assistant' ? 'text-foreground/90' : 'text-primary-foreground'
                }`}
              >
                {renderInline(block.text, variant)}
              </p>
            );
        }
      })}
    </div>
  );
}
