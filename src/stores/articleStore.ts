import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Article } from '@/types/article';

interface ArticleStore {
  articles: Article[];
  addArticle: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  getArticlesByCategory: (category: 'pabx' | 'omni') => Article[];
  getArticlesByFolderId: (folderId: string) => Article[];
  getArticleById: (id: string) => Article | undefined;
  deleteArticlesByFolderId: (folderId: string) => void;
}

export const useArticleStore = create<ArticleStore>()(
  persist(
    (set, get) => ({
      articles: [],
      addArticle: (articleData) => {
        const newArticle: Article = {
          ...articleData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ articles: [...state.articles, newArticle] }));
      },
      updateArticle: (id, articleData) => {
        set((state) => ({
          articles: state.articles.map((article) =>
            article.id === id
              ? { ...article, ...articleData, updatedAt: new Date() }
              : article
          ),
        }));
      },
      deleteArticle: (id) => {
        set((state) => ({
          articles: state.articles.filter((article) => article.id !== id),
        }));
      },
      getArticlesByCategory: (category) => {
        return get().articles.filter((article) => article.category === category);
      },
      getArticlesByFolderId: (folderId) => {
        return get().articles.filter((article) => article.folderId === folderId);
      },
      getArticleById: (id) => {
        return get().articles.find((article) => article.id === id);
      },
      deleteArticlesByFolderId: (folderId) => {
        set((state) => ({
          articles: state.articles.filter((article) => article.folderId !== folderId),
        }));
      },
    }),
    {
      name: 'knowledge-base-articles',
    }
  )
);
