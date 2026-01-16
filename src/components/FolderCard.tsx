import { Link } from 'react-router-dom';
import { Folder as FolderIcon, FileText, Trash2, Edit2 } from 'lucide-react';
import { Folder } from '@/types/article';
import { useArticleStore } from '@/stores/articleStore';
import { cn } from '@/lib/utils';

interface FolderCardProps {
  folder: Folder;
  onEdit: (folder: Folder) => void;
  onDelete: (id: string) => void;
}

export function FolderCard({ folder, onEdit, onDelete }: FolderCardProps) {
  const { articles } = useArticleStore();
  const articleCount = articles.filter(a => a.folderId === folder.id).length;
  const isPabx = folder.category === 'pabx';

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-4">
        <Link 
          to={`/pasta/${folder.id}`}
          className="flex items-start gap-4 flex-1 min-w-0"
        >
          <div className={cn(
            "p-3 rounded-lg shrink-0",
            isPabx ? "bg-pabx/10 text-pabx" : "bg-omni/10 text-omni"
          )}>
            <FolderIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {folder.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <FileText className="h-3.5 w-3.5" />
              <span>{articleCount} {articleCount === 1 ? 'artigo' : 'artigos'}</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit(folder);
            }}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            title="Editar pasta"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(folder.id);
            }}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            title="Excluir pasta"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
