import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Conversation } from '../../types/conversation';
import { PriorityBadge } from '../common/PriorityBadge';
import { SentimentBadge } from '../common/SentimentBadge';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { ArrowRight, Clock } from 'lucide-react';

interface ConversationCardProps {
  conversation: Conversation;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({ conversation }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/conversations/${conversation.id}`)}
      className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-brand-blue/40 rounded-xl p-4 transition-all duration-200 cursor-pointer group hover:shadow-glow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">{conversation.id}</span>
            <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 capitalize">
              {conversation.channel}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white mt-1 group-hover:text-brand-blue transition-colors">
            {conversation.customer_name}
          </h4>
          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{conversation.issue}</p>
        </div>

        <RiskBadge level={conversation.security_risk} size="sm" />
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800/80">
        <PriorityBadge priority={conversation.priority} />
        <SentimentBadge sentiment={conversation.sentiment} />
        <StatusBadge status={conversation.status} />

        <div className="ml-auto flex items-center gap-1 text-[11px] font-mono text-slate-500">
          <Clock size={11} />
          <span>{conversation.updated_at}</span>
        </div>
      </div>
    </div>
  );
};
