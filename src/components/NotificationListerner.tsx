import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; 
import { useGlobalRefresh } from "@/contexts/GlobalRefreshContext";
const NotificationListener = () => {
  const { token, loading } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const { setPageToRefresh } = useGlobalRefresh();

  const handleMessage = (message: string) => {
    console.log("🧠 WebSocket message received:", message);
    setMessage(message); 
    setPageToRefresh('notifications'); 
  };

  const { isConnected } = useWebSocket(!loading ? token : null, handleMessage);

  
  useEffect(() => {
    if (isConnected) {
      console.log("WebSocket connected");
    } else {
      console.log("WebSocket disconnected");
    }
  }, [isConnected]);

  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null); 
      }, 10000); // 10 seconds

      return () => clearTimeout(timer); 
    }
  }, [message]);

  return (
    <div>
      {/* Render alert if there's a message */}
      {message && (
        <Alert className="bg-blue-500 text-white"> 
          <AlertTitle>New Notification</AlertTitle>
          <AlertDescription className="text-black">{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default NotificationListener;
