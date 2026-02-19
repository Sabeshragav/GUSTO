'use client';

import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useDesktop } from '../../contexts/DesktopContext';
import { useAchievements } from '../../contexts/AchievementsContext';
import { fileSystem, findFileById, findFileByPath } from '../../data/filesystem';
import type { FileNode } from '../../types';

interface TerminalLine {
  type: 'input' | 'output';
  content: string;
  isAscii?: boolean;
}

const ASCII_COFFEE = `
    ( (
     ) )
  .______.
  |      |]
  \\      /
   \`----'
`;

const ASCII_NEOFETCH = `
       .:'          visitor@gusto
     .'             ------------------
    ::              OS: Gusto OS 1.0
   :::              Host: The Internet
  ::::              Kernel: React 18
  ::::              Shell: Gusto Term
  ::::              Resolution: Dynamic
   ::::::           Theme: Warm Gray
    '::::::::       CPU: Imagination Core
      ::::::::      RAM: Infinite Potential
         ':::
          .::       Built for Gusto 2026
         :::
`;

export function Terminal() {
  const { openApp, openFile, setMatrixMode, setPartyMode, closeWindow } = useDesktop();
  const { unlockAchievement } = useAchievements();
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to Gusto OS Terminal' },
    { type: 'output', content: 'Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState('/Desktop');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getCurrentFolder = (): FileNode => {
    if (currentPath === '/Desktop') return fileSystem;
    const pathWithoutDesktop = currentPath.replace('/Desktop/', '').replace('/Desktop', '');
    if (!pathWithoutDesktop) return fileSystem;
    return findFileByPath(pathWithoutDesktop) || fileSystem;
  };

  const addOutput = (content: string, isAscii = false) => {
    setLines((prev) => [...prev, { type: 'output', content, isAscii }]);
  };

  const commands: Record<string, (args: string[]) => void> = {
    help: () => {
      addOutput(`
Available Commands:
  help          - Show this help message
  about         - About Gusto '26
  events        - List all symposium events
  rules         - View event rules
  register      - Register for events
  transport     - Transport information
  contact       - Contact the organizers
  open <name>   - Open an app (events, rules, register, etc.)
  ls            - List contents of current directory
  cd <folder>   - Change directory
  cat <file>    - Display file contents
  clear         - Clear the terminal
  minesweeper   - Play a game
  neofetch      - Display system info
  matrix        - Enter the matrix
  party         - Celebrate!
  exit          - Close terminal
      `);
      unlockAchievement('help-actually');
    },

    about: () => {
      addOutput(`
Gusto '26 is a National Level Technical Symposium organized by the 
Department of Information Technology at Government College of Engineering, Erode.

Join us for a day of innovation, competition, and fun!
      `);
    },

    events: () => {
      openApp('events');
      addOutput('Opening Events Explorer...');
    },

    rules: () => {
      openApp('rules');
      addOutput('Opening Rules...');
    },

    register: () => {
      openApp('register');
      addOutput('Opening Registration...');
    },

    transport: () => {
      openApp('transport');
      addOutput('Opening Transport Info...');
    },

    contact: () => {
      openApp('contact');
      addOutput('Opening Contact Info...');
    },

    projects: () => {
      addOutput('Projects? We are building the future here at Gusto!');
      addOutput('Check out our "events" to see what we are up to.');
    },

    open: (args) => {
      const target = args.join(' ').toLowerCase();
      if (!target) {
        addOutput('Usage: open <name>');
        return;
      }

      const appMap: Record<string, string> = {
        finder: 'finder',
        terminal: 'terminal',
        email: 'email',
        mail: 'email',
        minesweeper: 'minesweeper',
        game: 'minesweeper',
        trash: 'trash',
        events: 'events',
        rules: 'rules',
        register: 'register',
        transport: 'transport',
        contact: 'contact',
        spotify: 'spotify',
        calendar: 'calendar',
      };

      if (appMap[target]) {
        openApp(appMap[target]);
        addOutput(`Opening ${target}...`);
        return;
      }

      // Fallback for file system based opening if needed, or simple error
      addOutput(`Cannot find app "${target}". Try "events", "rules", "register", etc.`);
    },

    ls: () => {
      const folder = getCurrentFolder();
      if (folder.children) {
        const items = folder.children.map((c) => {
          const suffix = c.type === 'folder' ? '/' : '';
          return `  ${c.name}${suffix}`;
        });
        addOutput(items.join('\n'));
      } else {
        addOutput('No items in this directory.');
      }
    },

    cd: (args) => {
      const target = args.join(' ');
      if (!target || target === '~' || target === '/') {
        setCurrentPath('/Desktop');
        return;
      }

      if (target === '..') {
        const parts = currentPath.split('/').filter(Boolean);
        if (parts.length > 1) {
          parts.pop();
          setCurrentPath('/' + parts.join('/'));
        }
        return;
      }

      const currentFolder = getCurrentFolder();
      const targetFolder = currentFolder.children?.find(
        (c) => c.name.toLowerCase() === target.toLowerCase() && c.type === 'folder'
      );

      if (targetFolder) {
        setCurrentPath(`${currentPath}/${targetFolder.name}`);
      } else {
        addOutput(`cd: no such directory: ${target}`);
      }
    },

    cat: (args) => {
      const filename = args.join(' ');
      if (!filename) {
        addOutput('Usage: cat <filename>');
        return;
      }

      const currentFolder = getCurrentFolder();
      const file = currentFolder.children?.find(
        (c) => c.name.toLowerCase() === filename.toLowerCase()
      );

      if (file && file.content) {
        addOutput(file.content);
      } else if (file && file.type === 'folder') {
        addOutput(`cat: ${filename}: Is a directory`);
      } else {
        addOutput(`cat: ${filename}: No such file`);
      }
    },

    pwd: () => {
      addOutput(currentPath);
    },

    whoami: () => {
      addOutput("A participant of Gusto '26!");
    },

    clear: () => {
      setLines([]);
    },

    cv: () => {
      addOutput('CV? You don\'t need a CV here, just your skills!');
      addOutput('Try "register" to sign up for events.');
    },

    resume: () => {
      addOutput('Resume? You don\'t need a resume here, just your skills!');
      addOutput('Try "register" to sign up for events.');
    },

    email: () => {
      openApp('email');
      addOutput('Opening Mail...');
    },

    minesweeper: () => {
      openApp('minesweeper');
      addOutput('Starting Minesweeper... Good luck!');
    },



    neofetch: () => {
      addOutput(ASCII_NEOFETCH, true);
    },

    coffee: () => {
      addOutput(ASCII_COFFEE, true);
      addOutput('Taking a coffee break...');
      addOutput("You deserve it!");
    },

    matrix: () => {
      addOutput('Entering the Matrix...');
      setTimeout(() => setMatrixMode(true), 500);
    },

    party: () => {
      addOutput('Time to celebrate!');
      setTimeout(() => setPartyMode(true), 300);
    },

    sudo: () => {
      addOutput('Nice try! This Gusto-2026 runs on good vibes, not root access.');
    },

    rm: (args) => {
      addOutput('Permission denied. Please be careful!');
    },

    exit: () => {
      addOutput('Goodbye!');
      setTimeout(() => closeWindow('terminal'), 500);
    },

    secret: () => {
      addOutput('There are hidden things here...');
      addOutput('Try different commands, click around...');
    },

    hello: () => {
      addOutput(`
  _   _      _ _       _
 | | | | ___| | | ___ | |
 | |_| |/ _ \\ | |/ _ \\| |
 |  _  |  __/ | | (_) |_|
 |_| |_|\\___|_|_|\\___/(_)

 Welcome to Gusto '26!
      `, true);
    },

    echo: (args) => {
      addOutput(args.join(' '));
    },

    date: () => {
      addOutput(new Date().toString());
    },

    uptime: () => {
      addOutput('Gusto OS has been running since you opened this tab.');
    },
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setLines((prev) => [...prev, { type: 'input', content: `${getPrompt()} ${trimmed}` }]);
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const [command, ...args] = trimmed.split(' ');
    const cmdLower = command.toLowerCase();

    if (commands[cmdLower]) {
      commands[cmdLower](args);
      unlockAchievement('command-line-curious');
    } else {
      addOutput(`Command not found: ${command}. Type "help" for available commands.`);
    }

    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentFolder = getCurrentFolder();
      const partial = input.split(' ').pop()?.toLowerCase() || '';
      const matches = currentFolder.children?.filter((c) =>
        c.name.toLowerCase().startsWith(partial)
      );
      if (matches && matches.length === 1) {
        const parts = input.split(' ');
        parts[parts.length - 1] = matches[0].name;
        setInput(parts.join(' '));
      }
    }
  };

  const getPrompt = () => {
    const shortPath = currentPath.replace('/Desktop', '~');
    return `visitor@gusto ${shortPath} $`;
  };

  return (
    <div
      className="h-full bg-[#1e1e1e] text-[#f0f0f0] font-mono text-sm flex flex-col"
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-auto p-4">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`${line.type === 'input' ? 'text-warm-400' : 'text-warm-300'} ${line.isAscii ? 'whitespace-pre' : 'whitespace-pre-wrap'
              } leading-relaxed`}
          >
            {line.content}
          </div>
        ))}
      </div>
      <form
        className="flex items-center gap-2 px-3 py-2 bg-[#151515] border-t border-white/10"
        onSubmit={(e) => { e.preventDefault(); handleCommand(input); }}
      >
        <span className="text-warm-500 text-xs shrink-0 hidden sm:inline">{getPrompt()}</span>
        <span className="text-warm-500 text-xs shrink-0 sm:hidden">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setTimeout(() => {
              inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
          }}
          className="flex-1 bg-transparent outline-none text-warm-200 caret-warm-400 min-w-0 text-base"
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          enterKeyHint="send"
          placeholder="Type a command..."
        />
        <button
          type="submit"
          className="shrink-0 px-3 py-1.5 bg-warm-700 hover:bg-warm-600 active:bg-warm-500 text-warm-200 text-xs font-semibold rounded-lg transition-colors"
        >
          Run
        </button>
      </form>
    </div>
  );
}

