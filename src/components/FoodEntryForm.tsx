import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MapPin, Star, User, Calendar, Image, MessageSquare, DollarSign } from 'lucide-react';
import type { FoodEntryFormData } from '../types';
import 'react-day-picker/dist/style.css';

interface Props {
  onSubmit: (data: FoodEntryFormData) => void;
  onCancel: () => void;
}

export const FoodEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [averageCost, setAverageCost] = useState<string>('');
  const [review, setReview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [recommendedBy, setRecommendedBy] = useState('');
  const [visitDate, setVisitDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentDate = visitDate || new Date();
    console.log('Form visit date:', currentDate);
    
    onSubmit({
      name,
      location,
      rating,
      average_cost: averageCost ? Number(averageCost) : null,
      review: review || null,
      imageUrl: imageUrl || null,
      recommended_by: recommendedBy || null,
      visitDate: currentDate,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-0 sm:p-4 z-[9999] overflow-y-auto min-h-screen">
      <div className="bg-white w-full sm:rounded-lg sm:max-w-md relative my-0 sm:my-8 min-h-screen sm:min-h-0">
        {/* 头部 */}
        <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-center">添加美食记录</h2>
        </div>

        {/* 表单内容 */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {/* 名称输入 */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  美食名称
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Star className="h-5 w-5 text-orange-500" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2 sm:py-3 text-base sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="输入美食名称"
                  />
                </div>
              </div>

              {/* 地点输入 */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  餐厅位置
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-orange-500" />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2 sm:py-3 text-base sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="输入餐厅位置"
                  />
                </div>
              </div>

              {/* 评分和人均价格 */}
              <div className="grid grid-cols-2 gap-4">
                {/* 评分输入 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    评分
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="block w-full pl-3 pr-10 py-2 sm:py-3 text-base sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} 星
                      </option>
                    ))}
                  </select>
                </div>

                {/* 人均价格输入 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    人均价格
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-orange-500" />
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={averageCost}
                      onChange={(e) => setAverageCost(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 sm:py-3 text-base sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="¥"
                    />
                  </div>
                </div>
              </div>

              {/* 日期选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  就餐日期
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="block w-full pl-3 pr-10 py-2 sm:py-3 text-base sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-left"
                  >
                    {format(visitDate, 'yyyy-MM-dd')}
                  </button>
                  {showDatePicker && (
                    <div className="absolute z-20 mt-1 bg-white shadow-lg rounded-lg p-2 border border-gray-200">
                      <DayPicker
                        mode="single"
                        selected={visitDate}
                        onSelect={(date) => {
                          setVisitDate(date || new Date());
                          setShowDatePicker(false);
                        }}
                        locale={zhCN}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 推荐人输入 */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  推荐人
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-orange-500" />
                  </div>
                  <input
                    type="text"
                    value={recommendedBy}
                    onChange={(e) => setRecommendedBy(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 sm:py-3 text-base sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="输入推荐人（可选）"
                  />
                </div>
              </div>

              {/* 点评输入 */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  美食点评
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute top-3 left-3 text-orange-500">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={4}
                    className="block w-full pl-10 pr-3 py-2 sm:py-3 text-base sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="分享你的美食体验（可选）"
                  />
                </div>
              </div>
            </div>

            {/* 按钮组 */}
            <div className="sticky bottom-0 bg-white p-4 sm:p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-600 text-base sm:text-sm rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-base sm:text-sm rounded-md hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
              >
                保存美食记录
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};