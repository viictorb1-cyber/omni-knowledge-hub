import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFolderStore } from '@/stores/folderStore';
import { Folder } from '@/types/article';
import { cn } from '@/lib/utils';

interface FolderFormProps {
  category: 'pabx' | 'omni';
  folder?: Folder;
  onCancel: () => void;
  onSuccess: () => void;
}

export function FolderForm({ category, folder, onCancel, onSuccess }: FolderFormProps) {
  const { addFolder, updateFolder } = useFolderStore();
  const [name, setName] = useState('');

  useEffect(() => {
    if (folder) {
      setName(folder.name);
    }
  }, [folder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (folder) {
      updateFolder(folder.id, { name });
    } else {
      addFolder({ name, category });
    }
    
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="folderName">Nome da Pasta</Label>
        <Input
          id="folderName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite o nome da pasta..."
          required
          autoFocus
        />
      </div>

      <div className="flex gap-3">
        <Button 
          type="submit" 
          className={cn(
            category === 'pabx' && "bg-pabx hover:bg-pabx/90",
            category === 'omni' && "bg-omni hover:bg-omni/90"
          )}
        >
          {folder ? 'Salvar' : 'Criar Pasta'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
