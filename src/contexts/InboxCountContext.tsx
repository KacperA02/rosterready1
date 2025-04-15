import { createContext, useContext, useState, ReactNode } from 'react';

interface InboxCountContextProps {
  totalInboxCount: number;
  setTotalInboxCount: React.Dispatch<React.SetStateAction<number>>;
}

const InboxCountContext = createContext<InboxCountContextProps | undefined>(undefined);

export const useInboxCount = (): InboxCountContextProps => {
  const context = useContext(InboxCountContext);
  if (!context) {
    throw new Error('useInboxCount must be used within a InboxCountProvider');
  }
  return context;
};

interface InboxCountProviderProps {
  children: ReactNode;
}

export const InboxCountProvider = ({ children }: InboxCountProviderProps) => {
  const [totalInboxCount, setTotalInboxCount] = useState(0);

  return (
    <InboxCountContext.Provider value={{ totalInboxCount, setTotalInboxCount }}>
      {children}
    </InboxCountContext.Provider>
  );
};
