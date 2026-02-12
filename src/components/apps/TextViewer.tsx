'use client';

import type { FileNode } from '../../types';

interface TextViewerProps {
  data?: { file?: FileNode };
}

function renderMarkdown(content: string): JSX.Element[] {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListTag = listType;
      elements.push(
        <ListTag key={elements.length} className={listType === 'ul' ? 'list-disc' : 'list-decimal'}>
          {listItems.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ListTag>
      );
      listItems = [];
      listType = null;
    }
  };

  const renderInline = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const italicMatch = remaining.match(/\*(.+?)\*/);
      const codeMatch = remaining.match(/`(.+?)`/);
      const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);

      const matches = [
        boldMatch && { type: 'bold', match: boldMatch },
        italicMatch && { type: 'italic', match: italicMatch },
        codeMatch && { type: 'code', match: codeMatch },
        linkMatch && { type: 'link', match: linkMatch },
      ].filter(Boolean) as { type: string; match: RegExpMatchArray }[];

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      const first = matches.reduce((a, b) =>
        (a.match.index || 0) < (b.match.index || 0) ? a : b
      );

      if (first.match.index && first.match.index > 0) {
        parts.push(remaining.slice(0, first.match.index));
      }

      switch (first.type) {
        case 'bold':
          parts.push(<strong key={key++}>{first.match[1]}</strong>);
          break;
        case 'italic':
          parts.push(<em key={key++}>{first.match[1]}</em>);
          break;
        case 'code':
          parts.push(<code key={key++}>{first.match[1]}</code>);
          break;
        case 'link':
          parts.push(
            <a key={key++} href={first.match[2]} target="_blank" rel="noopener noreferrer">
              {first.match[1]}
            </a>
          );
          break;
      }

      remaining = remaining.slice((first.match.index || 0) + first.match[0].length);
    }

    return parts;
  };

  lines.forEach((line, index) => {
    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={index}>{renderInline(line.slice(2))}</h1>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={index}>{renderInline(line.slice(3))}</h2>);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index}>{renderInline(line.slice(4))}</h3>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listItems.push(line.slice(2));
    } else if (/^\d+\. /.test(line)) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listItems.push(line.replace(/^\d+\. /, ''));
    } else if (line.trim() === '') {
      flushList();
      elements.push(<br key={index} />);
    } else {
      flushList();
      elements.push(<p key={index}>{renderInline(line)}</p>);
    }
  });

  flushList();
  return elements;
}

export function TextViewer({ data }: TextViewerProps) {
  const file = data?.file;

  if (!file || !file.content) {
    return (
      <div className="h-full flex items-center justify-center text-warm-500">
        <p>No file to display</p>
      </div>
    );
  }

  const isMarkdown = file.type === 'markdown' || file.name.endsWith('.md');

  return (
    <div className="h-full overflow-auto p-6">
      {isMarkdown ? (
        <div className="markdown-content max-w-2xl mx-auto">
          {renderMarkdown(file.content)}
        </div>
      ) : (
        <pre className="text-warm-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
          {file.content}
        </pre>
      )}
    </div>
  );
}
