import { MessageCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AlertCircle, CreditCard, Key, MessageSquare } from 'lucide-react';

interface Props {
  category: MessageCategory;
  className?: string;
}

export function ClassificationBadge({ category, className }: Props) {
  const styles = {
    Urgent: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      icon: AlertCircle
    },
    Transactional: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      icon: CreditCard
    },
    OTP: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      icon: Key
    },
    Other: {
      bg: 'bg-zinc-500/10',
      text: 'text-zinc-400',
      icon: MessageSquare
    }
  };

  const current = styles[category];
  const Icon = current.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold",
      current.bg,
      current.text,
      className
    )}>
      <Icon size={12} />
      {category}
    </div>
  );
}