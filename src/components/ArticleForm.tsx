import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useArticleStore } from '@/stores/articleStore';
import { Article } from '@/types/article';
import { cn } from '@/lib/utils';

interface ArticleFormProps {
  category: 'pabx' | 'omni';
  article?: Article;
  onCancel: () => void;
}

export function ArticleForm({ category, article, onCancel }: ArticleFormProps) {
  const navigate = useNavigate();
  const { addArticle, updateArticle } = useArticleStore();
  
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [images, setImages] = useState<string[]>(article?.images || []);
  const [videos, setVideos] = useState<string[]>(article?.videos || []);
  const [newImage, setNewImage] = useState('');
  const [newVideo, setNewVideo] = useState('');

  const handleAddImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()]);
      setNewImage('');
    }
  };

  const handleAddVideo = () => {
    if (newVideo.trim()) {
      setVideos([...videos, newVideo.trim()]);
      setNewVideo('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (article) {
      updateArticle(article.id, { title, content, images, videos });
    } else {
      addArticle({ title, content, category, images, videos });
    }
    
    navigate(`/solucao/${category}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Artigo</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título..."
          required
          className="text-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite o conteúdo do artigo..."
          required
          rows={12}
          className="resize-none"
        />
      </div>

      {/* Images Section */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          Imagens
        </Label>
        
        <div className="flex gap-2">
          <Input
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="URL da imagem..."
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
          />
          <Button type="button" onClick={handleAddImage} variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Videos Section */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Video className="h-4 w-4" />
          Vídeos (YouTube, Vimeo, Google Drive ou URL direta)
        </Label>
        
        <div className="flex gap-2">
          <Input
            value={newVideo}
            onChange={(e) => setNewVideo(e.target.value)}
            placeholder="URL do vídeo..."
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVideo())}
          />
          <Button type="button" onClick={handleAddVideo} variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {videos.length > 0 && (
          <div className="space-y-2">
            {videos.map((url, index) => (
              <div key={index} className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                <Video className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm truncate flex-1">{url}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveVideo(index)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          className={cn(
            category === 'pabx' && "bg-pabx hover:bg-pabx/90",
            category === 'omni' && "bg-omni hover:bg-omni/90"
          )}
        >
          {article ? 'Salvar Alterações' : 'Criar Artigo'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
