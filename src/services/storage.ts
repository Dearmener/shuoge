import axios from 'axios';

interface SyncData {
  key: string;
  lastModified: string;
}

class StorageService {
  private baseUrl: string = '/api/storage';
  private syncInterval: number = 5000; // 5 seconds
  private lastSyncTime: { [key: string]: string } = {};

  constructor() {
    // 启动定期同步
    this.startSync();
  }

  private async startSync() {
    setInterval(async () => {
      await this.syncData();
    }, this.syncInterval);
  }

  private async syncData() {
    try {
      const response = await axios.get<SyncData[]>(`${this.baseUrl}/sync`);
      const serverData = response.data;

      for (const item of serverData) {
        // 如果服务器数据比本地新，则更新本地数据
        if (!this.lastSyncTime[item.key] || new Date(item.lastModified) > new Date(this.lastSyncTime[item.key])) {
          const data = await this.getData(item.key);
          this.lastSyncTime[item.key] = item.lastModified;
          // 触发数据更新事件
          window.dispatchEvent(new CustomEvent('storage-update', {
            detail: { key: item.key, data }
          }));
        }
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  }

  async saveData(key: string, data: any): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/save`, {
        key,
        data
      });
      // 更新同步时间
      this.lastSyncTime[key] = new Date().toISOString();
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  }

  async getData(key: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/get/${key}`);
      return response.data;
    } catch (error) {
      console.error('Error getting data:', error);
      throw error;
    }
  }

  async removeData(key: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/delete/${key}`);
      delete this.lastSyncTime[key];
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }

  // 监听数据更新
  onDataUpdate(key: string, callback: (data: any) => void) {
    const handler = (event: CustomEvent) => {
      if (event.detail.key === key) {
        callback(event.detail.data);
      }
    };
    window.addEventListener('storage-update', handler as EventListener);
    return () => window.removeEventListener('storage-update', handler as EventListener);
  }
}

export const storageService = new StorageService();
