import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { FolderCard } from '@/components/FolderCard';
import { FolderForm } from '@/components/FolderForm';
import { useFolderStore } from '@/stores/folderStore';
import { useArticleStore } from '@/stores/articleStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Plus, Phone, MessageSquare, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Folder } from '@/types/article';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const SolutionPage = () => {
  const { category } = useParams<{ category: 'pabx' | 'omni' }>();
  const { folders, deleteFolder } = useFolderStore();
  const { deleteArticlesByFolderId } = useArticleStore();
  const [showForm, setShowForm] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | undefined>();
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categoryFolders = useMemo(() => {
    let filtered = folders.filter(f => f.category === category);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(query)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [folders, category, searchQuery]);

  const isPabx = category === 'pabx';
  const Icon = isPabx ? Phone : MessageSquare;
  const title = isPabx ? 'PABX' : 'Omni';
  const description = isPabx 
    ? 'Documentação e guias da solução de telefonia PABX'
    : 'Documentação e guias da plataforma Omnichannel';

  if (!category || (category !== 'pabx' && category !== 'omni')) {
    return <div>Categoria não encontrada</div>;
  }

  const handleEdit = (folder: Folder) => {
    setEditingFolder(folder);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeleteFolderId(id);
  };

  const confirmDelete = () => {
    if (deleteFolderId) {
      deleteArticlesByFolderId(deleteFolderId);
      deleteFolder(deleteFolderId);
      setDeleteFolderId(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFolder(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFolder(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} />
      
      <main className="container mx-auto px-6 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para soluções
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-4 rounded-xl",
              isPabx ? "bg-pabx/10 text-pabx" : "bg-omni/10 text-omni"
            )}>
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
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
              Nova Pasta
            </Button>
          )}
        </div>

        {showForm ? (
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-6">
              {editingFolder ? 'Editar Pasta' : 'Criar Nova Pasta'}
            </h2>
            <FolderForm 
              category={category}
              folder={editingFolder}
              onCancel={handleFormCancel}
              onSuccess={handleFormSuccess}
            />
          </div>
        ) : (
          <>
            {categoryFolders.length === 0 ? (
              <div className="text-center py-16">
                <div className={cn(
                  "inline-flex p-6 rounded-full mb-6",
                  isPabx ? "bg-pabx/10" : "bg-omni/10"
                )}>
                  <FolderOpen className={cn(
                    "h-12 w-12",
                    isPabx ? "text-pabx" : "text-omni"
                  )} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhuma pasta encontrada
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? 'Tente buscar por outros termos.' 
                    : 'Comece criando a primeira pasta desta categoria.'}
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className={cn(
                      isPabx ? "bg-pabx hover:bg-pabx/90" : "bg-omni hover:bg-omni/90"
                    )}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Pasta
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryFolders.map(folder => (
                  <FolderCard 
                    key={folder.id} 
                    folder={folder}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <AlertDialog open={!!deleteFolderId} onOpenChange={() => setDeleteFolderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pasta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. Todos os artigos dentro desta pasta também serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SolutionPage;
