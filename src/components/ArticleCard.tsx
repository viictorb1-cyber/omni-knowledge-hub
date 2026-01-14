import { Link } from 'react-router-dom';
import { FileText, Calendar, ChevronRight, Image, Video } from 'lucide-react';
import { Article } from '@/types/article';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const hasMedia = article.images.length > 0 || article.videos.length > 0;
  
  return (
    <Link 
      to={`/artigo/${article.id}`}
      className="group block bg-card rounded-xl p-6 hover:shadow-lg transition-all duration-200 border border-border hover:border-primary/30"
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-lg",
          article.category === 'pabx' ? "bg-pabx/10 text-pabx" : "bg-omni/10 text-omni"
        )}>
          <FileText className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors mb-2 truncate">
            {article.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(article.updatedAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
            </span>
            
            {hasMedia && (
              <div className="flex items-center gap-2">
                {article.images.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Image className="h-3 w-3" />
                    {article.images.length}
                  </span>
                )}
                {article.videos.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    {article.videos.length}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
