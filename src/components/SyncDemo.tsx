import React, { useEffect, useState } from 'react';
import { useSync } from '../context/SyncContext';

export const SyncDemo: React.FC = () => {
  const { getData, setData } = useSync();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // 初始加载数据
    const loadData = async () => {
      try {
        const savedCount = await getData('counter');
        if (savedCount !== null) {
          setCount(savedCount);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [getData]);

  const handleIncrement = async () => {
    const newCount = count + 1;
    setCount(newCount);
    try {
      await setData('counter', newCount);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    // <div className="p-4">
    //   <h2 className="text-xl font-bold mb-4">同步计数器示例</h2>
    //   <div className="flex items-center gap-4">
    //     <span className="text-lg">计数: {count}</span>
    //     <button
    //       onClick={handleIncrement}
    //       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    //     >
    //       增加
    //     </button>
    //   </div>
    //   <p className="mt-2 text-sm text-gray-600">
    //     在其他标签页或浏览器中打开此页面，数据会自动同步
    //   </p>
    // </div>
  );
};
