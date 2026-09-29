// ============================================================
// DEMO CONTEXT & SIMULATION CONTROLS
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface DemoContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  apiFailureStatus: Record<string, boolean>;
  toggleApiFailure: (system: string) => Promise<void>;
  simulateStatus: (applicationId: string, action: 'verify' | 'approve' | 'sanction' | 'disburse') => Promise<void>;
  resetDemoData: () => Promise<void>;
  lastActionMessage: string | null;
  refreshKey: number;
  triggerRefresh: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [apiFailureStatus, setApiFailureStatus] = useState<Record<string, boolean>>({});
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const fetchApiStatus = async () => {
    try {
      const res = await api.getApiStatus();
      if (res.success && res.data) {
        setApiFailureStatus(res.data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchApiStatus();
  }, []);

  const toggleDemoMode = () => setIsDemoMode(!isDemoMode);

  const toggleApiFailure = async (system: string) => {
    const currentState = !!apiFailureStatus[system];
    const newState = !currentState;
    try {
      await api.toggleApiFailure(system, newState);
      setApiFailureStatus(prev => ({ ...prev, [system]: newState }));
      setLastActionMessage(`${system} API failure simulation: ${newState ? 'ENABLED (Requests will fail)' : 'DISABLED (Normal operation)'}`);
      triggerRefresh();
    } catch {
      setLastActionMessage('Failed to toggle API simulation');
    }
  };

  const simulateStatus = async (applicationId: string, action: 'verify' | 'approve' | 'sanction' | 'disburse') => {
    try {
      await api.simulateStatus(applicationId, action);
      const actionNames = {
        verify: 'State Verification Completed',
        approve: 'MoTA Approval Granted',
        sanction: 'Sanction Order Generated (₹18,000)',
        disburse: 'Direct Benefit Transfer (DBT) Credited'
      };
      setLastActionMessage(`Simulated: ${actionNames[action]} for ${applicationId}`);
      triggerRefresh();
    } catch {
      setLastActionMessage('Failed to execute simulation');
    }
  };

  const resetDemoData = async () => {
    try {
      await api.resetDemoData();
      setLastActionMessage('Demo data reset to initial state.');
      triggerRefresh();
    } catch {
      setLastActionMessage('Failed to reset demo data');
    }
  };

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      toggleDemoMode,
      apiFailureStatus,
      toggleApiFailure,
      simulateStatus,
      resetDemoData,
      lastActionMessage,
      refreshKey,
      triggerRefresh
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within a DemoProvider');
  return context;
};
