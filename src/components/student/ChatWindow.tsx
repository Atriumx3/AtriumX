import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { Conversation, Message, Profile } from '../../services/dataService';
import { sendMessage } from '../../services/dataService';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../services/supabaseClient';

const PHONE_REGEX = /(\d[\s-]?){7,}/g;

function sanitizeMessage(content: string) {
  return content.replace(PHONE_REGEX, '[Phone number hidden — please keep communication in-app]');
}

interface ChatWindowProps {
  conversation: Conversation;
  otherUser: Profile;
  listingTitle: string;
}

export default function ChatWindow({ conversation, otherUser, listingTitle }: ChatWindowProps) {
  const { currentUser } = useApp();
  const [messages, setMessages] = useState<Message[]>(conversation.messages || []);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    if (!supabase || !('channel' in supabase)) return;
    const channel = supabase
      .channel('messages:' + conversation.id)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: 'conversation_id=eq.' + conversation.id,
      }, (payload) => {
        setMessages(prev => {
          const exists = prev.some(m => m.id === payload.new.id);
          if (exists) return prev;
          return [...prev, payload.new as Message];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversation.id]);

  const handleSend = async () => {
    if (!input.trim() || !currentUser) return;
    const { message } = await sendMessage(conversation.id, currentUser.id, input.trim());
    if (message) {
      setMessages(prev => [...prev, message]);
    }
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 pb-24">
        {messages.map(msg => {
          const isMine = msg.sender_id === currentUser?.id;
          const displayContent = isMine ? msg.content : sanitizeMessage(msg.content);

          return (
            <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2 text-sm ${
                  isMine
                    ? 'bg-teal-primary text-cream rounded-2xl rounded-br-sm'
                    : 'bg-slate-card border border-slate-border text-cream rounded-2xl rounded-bl-sm'
                }`}
              >
                {displayContent.includes('[Phone number hidden') ? (
                  <span className="text-status-warning italic text-xs">{displayContent}</span>
                ) : (
                  displayContent
                )}
              </div>
              <span className="text-cream-muted text-xs mt-1 px-1">
                {new Date(msg.sent_at).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-deep border-t border-slate-border px-4 py-3 max-w-md mx-auto flex items-center gap-3 z-40">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-slate-card border border-slate-border rounded-xl px-4 py-2 text-cream text-sm placeholder:text-cream-muted focus:outline-none focus:border-teal-light"
        />
        <button onClick={handleSend} className="text-ember">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
