import { Link } from 'react-router-dom';
import { LucideIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SolutionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  articleCount: number;
  href: string;
  variant: 'pabx' | 'omni';
}

export function SolutionCard({ 
  title, 
  description, 
  icon: Icon, 
  articleCount, 
  href,
  variant 
}: SolutionCardProps) {
  return (
    <Link 
      to={href}
      className={cn(
        "group relative block p-8 rounded-2xl transition-all duration-300",
        "bg-card hover:shadow-xl hover:-translate-y-1",
        "border-2 border-transparent",
        variant === 'pabx' && "hover:border-pabx",
        variant === 'omni' && "hover:border-omni"
      )}
    >
      <div className={cn(
        "inline-flex p-4 rounded-xl mb-6",
        variant === 'pabx' && "bg-pabx/10 text-pabx",
        variant === 'omni' && "bg-omni/10 text-omni"
      )}>
        <Icon className="h-8 w-8" />
      </div>
      
      <h3 className="text-2xl font-bold text-card-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {articleCount} {articleCount === 1 ? 'artigo' : 'artigos'}
        </span>
        <span className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors",
          variant === 'pabx' && "text-pabx group-hover:text-pabx",
          variant === 'omni' && "text-omni group-hover:text-omni"
        )}>
          Acessar
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
