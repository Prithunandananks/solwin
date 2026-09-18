import React from 'react';
import { Conversation } from '../../types/conversation';
import { Mail, MessageCircle, Phone, Smartphone, Share2, FileText, User, Bot } from 'lucide-react';

interface ConversationTimelineProps {
  conversation: Conversation;
}

export const ConversationTimeline: React.FC<ConversationTimelineProps> = ({
  conversation,
}) => {
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail size={14} className="text-cyan-500 dark:text-cyan-400" />;
      case 'chat':
        return <MessageCircle size={14} className="text-emerald-500 dark:text-emerald-400" />;
      case 'phone':
        return <Phone size={14} className="text-amber-500 dark:text-amber-400" />;
      case 'sms':
        return <Smartphone size={14} className="text-purple-500 dark:text-purple-400" />;
      case 'social':
        return <Share2 size={14} className="text-pink-500 dark:text-pink-400" />;
      default:
        return <FileText size={14} className="text-slate-400" />;
    }
  };

  const messages = conversation.messages || [];

  return (
    <div className="space-y-6">
      {/* Customer Header Info */}
      <div className="bg-surface rounded-2xl border border-surface-border p-5 flex flex-wrap items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/30 flex items-center justify-center text-blue-700 dark:text-brand-cyan font-bold font-mono text-sm shadow-sm">
            {conversation.customer_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
              {conversation.customer_name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
              {conversation.customer_email && <span>{conversation.customer_email}</span>}
              {conversation.customer_phone && (
                <>
                  <span>•</span>
                  <span>{conversation.customer_phone}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-surface-elevated/70 border border-slate-200 dark:border-surface-border text-xs font-mono">
            {getChannelIcon(conversation.channel)}
            <span className="uppercase text-slate-700 dark:text-slate-300 font-semibold">{conversation.channel}</span>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-slate-400 block">Created</span>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{conversation.created_at}</span>
          </div>
        </div>
      </div>

      {/* Message Timeline */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-surface-border bg-surface text-slate-500 text-xs font-mono">
            No message history available for this record.
          </div>
        ) : (
          messages.map((msg) => {
            const isCustomer = msg.sender === 'customer';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3.5 ${isCustomer ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Sender Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${
                    isCustomer
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      : 'bg-cyan-500 text-slate-950 font-mono'
                  }`}
                >
                  {isCustomer ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Message Bubble Container */}
                <div className={`max-w-2xl space-y-1.5 ${isCustomer ? 'items-start' : 'items-end'}`}>
                  <div className={`flex items-center gap-2 text-xs ${isCustomer ? 'flex-row' : 'flex-row-reverse'}`}>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{msg.sender_name}</span>
                    <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  {/* Chat Bubbles: Soft backgrounds specified in requirements */}
                  {/* Customer: bg-slate-50 border-slate-100 */}
                  {/* Agent: bg-blue-50 border-blue-100 */}
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed shadow-card border ${
                      isCustomer
                        ? 'bg-slate-50 dark:bg-surface-card border-slate-200 dark:border-surface-border text-slate-800 dark:text-slate-200'
                        : 'bg-blue-50 dark:bg-surface-elevated border-blue-100 dark:border-brand-cyan/20 text-blue-950 dark:text-slate-100'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
