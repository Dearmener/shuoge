import React from 'react';
import { MapPin, Star, User, Calendar, Trash2, Utensils } from 'lucide-react';
import type { FoodEntry } from '../types';

interface Props {
  entry: FoodEntry;
  onDelete: () => void;
}

export const FoodEntryCard: React.FC<Props> = ({ entry, onDelete }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return '日期无效';
      }
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '日期无效';
    }
  };

  console.log('Card entry data:', entry); // 添加日志

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        {entry.imageUrl ? (
          <img
            src={entry.imageUrl}
            alt={entry.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
            <Utensils className="w-16 h-16 text-orange-300" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          {entry.recommended_by && (
            <div className="bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg font-medium shadow-md flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm truncate max-w-[120px]">{entry.recommended_by}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{entry.name}</h3>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="删除"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{entry.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
            <span className="text-sm">{formatDate(entry.visit_date)}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Star className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
            <span className="text-sm">评分: {entry.rating}</span>
          </div>

          {entry.review && (
            <div className="mt-3 p-3 bg-orange-50 rounded-lg">
              <p className="text-gray-700 text-sm line-clamp-3 italic">
                "{entry.review}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
