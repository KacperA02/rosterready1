import { createContext, useContext, useState, ReactNode } from 'react';

type RefreshPage = 'notifications' | 'user' | 'invitations';

interface GlobalRefreshContextProps {
  pageToRefresh: { page: RefreshPage; key: number } | null;
  setPageToRefresh: React.Dispatch<React.SetStateAction<{ page: RefreshPage; key: number } | null>>;
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
  const [pageToRefresh, setPageToRefresh] = useState<{ page: RefreshPage; key: number } | null>(null);

  return (
    <GlobalRefreshContext.Provider value={{ pageToRefresh, setPageToRefresh }}>
      {children}
    </GlobalRefreshContext.Provider>
  );
};
