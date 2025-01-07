import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Utensils, Plus, X } from 'lucide-react';
import { FoodEntryForm } from './components/FoodEntryForm';
import { FoodEntryCard } from './components/FoodEntryCard';
import type { FoodEntry, FoodEntryFormData } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3331';

function App() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch(`${API_URL}/api/food-entries`);
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      const data = await response.json();
      console.log('Fetched entries:', data.data);
      setEntries(data.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleSubmit = async (formData: FoodEntryFormData) => {
    try {
      const id = uuidv4();
      const visitDate = formData.visitDate ? formData.visitDate.toISOString().split('T')[0] : null;
      console.log('Visit date:', visitDate); // 添加日志
      
      const submitData = {
        id,
        name: formData.name,
        location: formData.location,
        rating: formData.rating,
        review: formData.review || null,
        imageUrl: formData.imageUrl || null,
        recommendedBy: formData.recommended_by || null,
        visitDate: visitDate,  
      };
      
      console.log('Submitting data:', submitData);
      
      const response = await fetch(`${API_URL}/api/food-entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error(`Failed to create entry: ${errorData}`);
      }

      await fetchEntries();
      setShowForm(false);
    } catch (error) {
      console.error('Error details:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/food-entries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      await fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Utensils className="h-8 w-8" />
              <h1 className="text-3xl font-bold">硕哥精选</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-white text-orange-600 px-4 py-2 rounded-full hover:bg-orange-50 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>添加美食</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Form Modal */}
        {showForm && (
          <FoodEntryForm 
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Food Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <FoodEntryCard
              key={entry.id}
              entry={entry}
              onDelete={() => handleDelete(entry.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {entries.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">还没有美食记录</h3>
            <p className="text-gray-500">点击"添加美食"开始记录你的美食之旅</p>
          </div>
        )}
      </main>

      {/* Footer */}
     
    </div>
  );
}

export default App;
