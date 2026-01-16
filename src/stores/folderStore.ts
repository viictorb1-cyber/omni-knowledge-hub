import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Folder } from '@/types/article';

interface FolderStore {
  folders: Folder[];
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFolder: (id: string, folder: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  getFoldersByCategory: (category: 'pabx' | 'omni') => Folder[];
  getFolderById: (id: string) => Folder | undefined;
}

export const useFolderStore = create<FolderStore>()(
  persist(
    (set, get) => ({
      folders: [],
      addFolder: (folderData) => {
        const newFolder: Folder = {
          ...folderData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ folders: [...state.folders, newFolder] }));
      },
      updateFolder: (id, folderData) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id
              ? { ...folder, ...folderData, updatedAt: new Date() }
              : folder
          ),
        }));
      },
      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
        }));
      },
      getFoldersByCategory: (category) => {
        return get().folders.filter((folder) => folder.category === category);
      },
      getFolderById: (id) => {
        return get().folders.find((folder) => folder.id === id);
      },
    }),
    {
      name: 'knowledge-base-folders',
    }
  )
);
