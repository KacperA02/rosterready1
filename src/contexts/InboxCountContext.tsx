import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchPendingInvitations } from '@/pages/Inbox/services/TeamReq';
import { fetchTeamAvailabilities } from '@/pages/Inbox/services/AvailbilityReq';

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
  const [totalInboxCount, setTotalInboxCount] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invites, teamAvails] = await Promise.all([
          fetchPendingInvitations(),
          fetchTeamAvailabilities(),
        ]);

        // Calculate the total inbox count
        const totalCount = (invites?.length || 0) + (teamAvails?.filter((avail) => !avail.approved)?.length || 0);
        setTotalInboxCount(totalCount); 
      } catch (err) {
        console.error('Error fetching inbox data', err);
      }
    };

    
    fetchData();
  }, []); 

  return (
    <InboxCountContext.Provider value={{ totalInboxCount, setTotalInboxCount }}>
      {children}
    </InboxCountContext.Provider>
  );
};
