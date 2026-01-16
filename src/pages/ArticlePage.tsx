import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { VideoEmbed } from '@/components/VideoEmbed';
import { ArticleForm } from '@/components/ArticleForm';
import { useArticleStore } from '@/stores/articleStore';
import { useFolderStore } from '@/stores/folderStore';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, Edit, Trash2, Calendar, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticleById, deleteArticle } = useArticleStore();
  const { getFolderById } = useFolderStore();
  const [isEditing, setIsEditing] = useState(false);

  const article = getArticleById(id || '');
  const folder = article ? getFolderById(article.folderId) : undefined;

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header showSearch={false} />
        <main className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
          <Link to="/" className="text-primary hover:underline">
            Voltar para a página inicial
          </Link>
        </main>
      </div>
    );
  }

  const isPabx = article.category === 'pabx';

  const handleDelete = () => {
    deleteArticle(article.id);
    navigate(`/pasta/${article.folderId}`);
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-background">
        <Header showSearch={false} />
        <main className="container mx-auto px-6 py-8">
          <Link 
            to={`/pasta/${article.folderId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para {folder?.name || 'pasta'}
          </Link>
          
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-6">Editar Artigo</h2>
            <ArticleForm 
              category={article.category}
              folderId={article.folderId}
              article={article}
              onCancel={() => setIsEditing(false)} 
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />
      
      <main className="container mx-auto px-6 py-8">
        <Link 
          to={`/pasta/${article.folderId}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para {folder?.name || 'pasta'}
        </Link>

        <article className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-border">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isPabx ? "bg-pabx/10 text-pabx" : "bg-omni/10 text-omni"
                )}>
                  <FolderOpen className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-sm font-medium px-3 py-1 rounded-full",
                  isPabx ? "bg-pabx/10 text-pabx" : "bg-omni/10 text-omni"
                )}>
                  {folder?.name || (isPabx ? 'PABX' : 'Omni')}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir artigo?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. O artigo será permanentemente removido.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Atualizado em {format(new Date(article.updatedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="prose prose-neutral max-w-none mb-8">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {article.content}
              </div>
            </div>

            {/* Images */}
            {article.images.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Imagens</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.images.map((url, index) => (
                    <a 
                      key={index} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img 
                        src={url} 
                        alt={`Imagem ${index + 1}`}
                        className="w-full rounded-lg border border-border hover:shadow-lg transition-shadow cursor-pointer"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {article.videos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Vídeos</h3>
                <div className="space-y-6">
                  {article.videos.map((url, index) => (
                    <div key={index}>
                      {url.startsWith('data:') ? (
                        <video 
                          src={url}
                          controls
                          className="w-full rounded-lg border border-border"
                        />
                      ) : (
                        <VideoEmbed url={url} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
};

export default ArticlePage;
