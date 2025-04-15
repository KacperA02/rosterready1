import { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalRefreshContextProps {
  pageToRefresh: 'notifications' | 'user' | null;
  setPageToRefresh: React.Dispatch<React.SetStateAction<'notifications' | 'user' | null>>;
}

const GlobalRefreshContext = createContext<GlobalRefreshContextProps | undefined>(undefined);

export const useGlobalRefresh = (): GlobalRefreshContextProps => {
  const context = useContext(GlobalRefreshContext);
  if (!context) {
    throw new Error('useGlobalRefresh must be used within a GlobalRefreshProvider');
  }
  return context;
};

interface GlobalRefreshProviderProps {
  children: ReactNode;
}

export const GlobalRefreshProvider = ({ children }: GlobalRefreshProviderProps) => {
  const [pageToRefresh, setPageToRefresh] = useState<'notifications' | 'user' | null>(null);

  return (
    <GlobalRefreshContext.Provider value={{ pageToRefresh, setPageToRefresh }}>
      {children}
    </GlobalRefreshContext.Provider>
  );
};
