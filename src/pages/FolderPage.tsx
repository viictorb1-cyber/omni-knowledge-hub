import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ArticleCard } from '@/components/ArticleCard';
import { ArticleForm } from '@/components/ArticleForm';
import { useFolderStore } from '@/stores/folderStore';
import { useArticleStore } from '@/stores/articleStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Plus, FolderOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const FolderPage = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const { getFolderById } = useFolderStore();
  const { articles } = useArticleStore();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const folder = folderId ? getFolderById(folderId) : undefined;

  const folderArticles = useMemo(() => {
    if (!folderId) return [];
    
    let filtered = articles.filter(a => a.folderId === folderId);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [articles, folderId, searchQuery]);

  if (!folder) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Pasta não encontrada</h1>
          <Button onClick={() => navigate('/')}>Voltar para Home</Button>
        </div>
      </div>
    );
  }

  const isPabx = folder.category === 'pabx';

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} />
      
      <main className="container mx-auto px-6 py-8">
        <Link 
          to={`/solucao/${folder.category}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para {isPabx ? 'PABX' : 'Omni'}
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-4 rounded-xl",
              isPabx ? "bg-pabx/10 text-pabx" : "bg-omni/10 text-omni"
            )}>
              <FolderOpen className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{folder.name}</h1>
              <p className="text-muted-foreground">
                {folderArticles.length} {folderArticles.length === 1 ? 'artigo' : 'artigos'}
              </p>
            </div>
          </div>
          
          {!showForm && (
            <Button 
              onClick={() => setShowForm(true)}
              className={cn(
                isPabx ? "bg-pabx hover:bg-pabx/90" : "bg-omni hover:bg-omni/90"
              )}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Artigo
            </Button>
          )}
        </div>

        {showForm ? (
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-6">Criar Novo Artigo</h2>
            <ArticleForm 
              category={folder.category}
              folderId={folder.id}
              onCancel={() => setShowForm(false)} 
            />
          </div>
        ) : (
          <>
            {folderArticles.length === 0 ? (
              <div className="text-center py-16">
                <div className={cn(
                  "inline-flex p-6 rounded-full mb-6",
                  isPabx ? "bg-pabx/10" : "bg-omni/10"
                )}>
                  <FileText className={cn(
                    "h-12 w-12",
                    isPabx ? "text-pabx" : "text-omni"
                  )} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum artigo encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? 'Tente buscar por outros termos.' 
                    : 'Comece criando o primeiro artigo desta pasta.'}
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className={cn(
                      isPabx ? "bg-pabx hover:bg-pabx/90" : "bg-omni hover:bg-omni/90"
                    )}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Artigo
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {folderArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default FolderPage;
