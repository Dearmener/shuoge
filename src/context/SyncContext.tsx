import React, { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '../services/storage';

interface SyncContextType {
  getData: (key: string) => Promise<any>;
  setData: (key: string, value: any) => Promise<void>;
  removeData: (key: string) => Promise<void>;
}

const SyncContext = createContext<SyncContextType | null>(null);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syncState, setSyncState] = useState<{ [key: string]: any }>({});

  const getData = async (key: string) => {
    try {
      const data = await storageService.getData(key);
      setSyncState(prev => ({ ...prev, [key]: data }));
      return data;
    } catch (error) {
      console.error('Error getting data:', error);
      throw error;
    }
  };

  const setData = async (key: string, value: any) => {
    try {
      await storageService.saveData(key, value);
      setSyncState(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error setting data:', error);
      throw error;
    }
  };

  const removeData = async (key: string) => {
    try {
      await storageService.removeData(key);
      setSyncState(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  };

  useEffect(() => {
    // 监听数据更新
    const unsubscribeCallbacks: (() => void)[] = [];

    Object.keys(syncState).forEach(key => {
      const unsubscribe = storageService.onDataUpdate(key, (newData) => {
        setSyncState(prev => ({ ...prev, [key]: newData }));
      });
      unsubscribeCallbacks.push(unsubscribe);
    });

    return () => {
      unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    };
  }, [syncState]);

  return (
    <SyncContext.Provider value={{ getData, setData, removeData }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
