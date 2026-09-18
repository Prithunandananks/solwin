import React from 'react';
import { Conversation, Message } from '../../types/conversation';
import { Mail, MessageCircle, Phone, Smartphone, Share2, FileText, User, Bot, Paperclip } from 'lucide-react';

interface ConversationTimelineProps {
  conversation: Conversation;
  onAttachmentClick?: (attachment: NonNullable<Message['attachments']>[0]) => void;
}

export const ConversationTimeline: React.FC<ConversationTimelineProps> = ({
  conversation,
  onAttachmentClick,
}) => {
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail size={14} className="text-blue-400" />;
      case 'chat':
        return <MessageCircle size={14} className="text-emerald-400" />;
      case 'phone':
        return <Phone size={14} className="text-amber-400" />;
      case 'sms':
        return <Smartphone size={14} className="text-purple-400" />;
      case 'social':
        return <Share2 size={14} className="text-cyan-400" />;
      default:
        return <FileText size={14} className="text-slate-400" />;
    }
  };

  const messages = conversation.messages || [];

  return (
    <div className="space-y-6">
      {/* Customer Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-bold font-mono text-sm shadow-sm">
            {conversation.customer_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-sans">{conversation.customer_name}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
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

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 shadow-sm">
            {getChannelIcon(conversation.channel)}
            <span className="capitalize">{conversation.channel}</span>
          </div>
          <span className="text-xs font-mono text-slate-400">{conversation.updated_at}</span>
        </div>
      </div>

      {/* Message Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
            Timeline Messages ({messages.length})
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">No messages recorded in this conversation.</div>
        ) : (
          messages.map((msg) => {
            const isCustomer = msg.sender === 'customer';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${
                  isCustomer ? 'mr-auto' : 'ml-auto flex-row-reverse'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-xs font-medium shadow-sm ${
                    isCustomer
                      ? 'bg-slate-100 border border-slate-200 text-slate-700'
                      : 'bg-slate-900 text-white shadow-sm'
                  }`}
                >
                  {isCustomer ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className={`flex items-center gap-2 text-xs font-mono ${isCustomer ? '' : 'justify-end'}`}>
                    <span className="font-semibold text-slate-800">{msg.sender_name}</span>
                    <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isCustomer
                        ? 'bg-white border border-slate-200 text-slate-800'
                        : 'bg-slate-50 border border-slate-200 text-slate-900'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>

                    {/* Attachments inside message */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3.5 pt-3.5 border-t border-slate-200 space-y-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
                          Attachments ({msg.attachments.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {msg.attachments.map((att) => (
                            <button
                              key={att.id}
                              onClick={() => onAttachmentClick?.(att)}
                              className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 transition-all shadow-sm"
                            >
                              <Paperclip size={13} className="text-slate-600" />
                              <span className="font-medium">{att.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({Math.round(att.size / 1024)} KB)
                              </span>
                              {att.scan_status === 'suspicious' && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                                  Flagged IOC
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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
