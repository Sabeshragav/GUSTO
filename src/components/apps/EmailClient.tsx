'use client';

import { useState, useEffect } from 'react';
import { Inbox, Star, Send, Trash2, Archive, StarOff } from 'lucide-react';
import { useAchievements } from '../../contexts/AchievementsContext';
import { emails } from '../../data/filesystem';
import type { Email } from '../../types';

const folders = [
  { id: 'inbox', name: 'Inbox', icon: Inbox, count: emails.length },
  { id: 'starred', name: 'Starred', icon: Star, count: emails.filter((e) => e.isStarred).length },
  { id: 'sent', name: 'Sent', icon: Send, count: 0 },
  { id: 'archive', name: 'Archive', icon: Archive, count: 0 },
  { id: 'trash', name: 'Trash', icon: Trash2, count: 0 },
];

export function EmailClient() {
  const { unlockAchievement } = useAchievements();
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails[0] || null);
  const [emailState, setEmailState] = useState<Email[]>(emails);

  useEffect(() => {
    unlockAchievement('reference-check');
  }, [unlockAchievement]);

  const toggleStar = (emailId: string) => {
    setEmailState((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isStarred: !e.isStarred } : e))
    );
  };

  const markAsRead = (emailId: string) => {
    setEmailState((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isRead: true } : e))
    );
  };

  const getFilteredEmails = () => {
    if (selectedFolder === 'starred') {
      return emailState.filter((e) => e.isStarred);
    }
    if (selectedFolder === 'inbox') {
      return emailState;
    }
    return [];
  };

  const filteredEmails = getFilteredEmails();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-warm-600',
      'bg-warm-500',
      'bg-warm-700',
      'bg-warm-800',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex h-full">
      <div className="w-52 bg-desktop-surface/50 border-r border-warm-800/30 p-3">
        <div className="space-y-1">
          {folders.map((folder) => {
            const Icon = folder.icon;
            const isActive = selectedFolder === folder.id;
            const count = folder.id === 'starred'
              ? emailState.filter((e) => e.isStarred).length
              : folder.count;

            return (
              <button
                key={folder.id}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                  isActive
                    ? 'bg-warm-700/40 text-warm-200'
                    : 'text-warm-400 hover:bg-warm-700/20 hover:text-warm-300'
                }`}
                onClick={() => setSelectedFolder(folder.id)}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} />
                  <span>{folder.name}</span>
                </div>
                {count > 0 && (
                  <span className="text-xs text-warm-500">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-72 border-r border-warm-800/30 flex flex-col">
        <div className="p-3 border-b border-warm-800/30">
          <h2 className="text-sm font-medium text-warm-200 capitalize">{selectedFolder}</h2>
          <p className="text-xs text-warm-500 mt-0.5">
            {filteredEmails.length} {filteredEmails.length === 1 ? 'message' : 'messages'}
          </p>
        </div>
        <div className="flex-1 overflow-auto">
          {filteredEmails.length > 0 ? (
            filteredEmails.map((email) => {
              const currentEmail = emailState.find((e) => e.id === email.id) || email;
              return (
                <button
                  key={email.id}
                  className={`w-full p-3 text-left border-b border-warm-800/20 transition-colors ${
                    selectedEmail?.id === email.id
                      ? 'bg-warm-700/40'
                      : 'hover:bg-warm-700/20'
                  }`}
                  onClick={() => {
                    setSelectedEmail(email);
                    markAsRead(email.id);
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-8 h-8 rounded-full ${getAvatarColor(email.from)} flex items-center justify-center text-xs text-warm-100 flex-shrink-0`}
                    >
                      {getInitials(email.from)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm truncate ${
                            !currentEmail.isRead ? 'font-semibold text-warm-200' : 'text-warm-300'
                          }`}
                        >
                          {email.from}
                        </span>
                        <span className="text-xs text-warm-500 flex-shrink-0">
                          {formatDate(email.date)}
                        </span>
                      </div>
                      <p
                        className={`text-xs truncate mt-0.5 ${
                          !currentEmail.isRead ? 'text-warm-300' : 'text-warm-500'
                        }`}
                      >
                        {email.subject}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-warm-500 text-sm">
              No messages in this folder
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <>
            <div className="p-4 border-b border-warm-800/30">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${getAvatarColor(selectedEmail.from)} flex items-center justify-center text-sm text-warm-100`}
                  >
                    {getInitials(selectedEmail.from)}
                  </div>
                  <div>
                    <h3 className="text-warm-200 font-medium">{selectedEmail.from}</h3>
                    <p className="text-xs text-warm-500">{selectedEmail.fromEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1.5 rounded hover:bg-warm-700/30 transition-colors"
                    onClick={() => toggleStar(selectedEmail.id)}
                  >
                    {emailState.find((e) => e.id === selectedEmail.id)?.isStarred ? (
                      <Star size={18} className="text-warm-400 fill-warm-400" />
                    ) : (
                      <StarOff size={18} className="text-warm-500" />
                    )}
                  </button>
                  <span className="text-xs text-warm-500">
                    {new Date(selectedEmail.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <h2 className="text-lg text-warm-200 mt-4">{selectedEmail.subject}</h2>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="text-warm-300 leading-relaxed whitespace-pre-wrap">
                {selectedEmail.body}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-warm-500">
            <p>Select a message to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
