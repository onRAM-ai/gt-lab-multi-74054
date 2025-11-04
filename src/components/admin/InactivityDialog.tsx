
import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface InactivityDialogProps {
  open: boolean;
  onStayActive: () => void;
  onLogout: () => void;
  countdown?: number; // seconds until auto-logout
}

const InactivityDialog: React.FC<InactivityDialogProps> = ({
  open,
  onStayActive,
  onLogout,
  countdown = 30,
}) => {
  const [timeLeft, setTimeLeft] = useState(countdown);

  useEffect(() => {
    if (!open) {
      setTimeLeft(countdown);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, countdown, onLogout]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Session Timeout Warning
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-2">
            <div>
              You've been inactive for a while. For security reasons, you will be 
              automatically logged out in:
            </div>
            <div className="text-2xl font-bold text-red-600">
              {timeLeft} seconds
            </div>
            <div className="text-sm text-gray-500">
              Click "Stay Active" to continue your session.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onLogout}
            className="w-full sm:w-auto"
          >
            Logout Now
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onStayActive}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          >
            Stay Active
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InactivityDialog;
