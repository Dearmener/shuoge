const mongoose = require('mongoose');

const foodEntrySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    required: false
  },
  recommendedBy: {
    type: String,
    required: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;  // 保持 id 字段
      delete ret._id;    // 删除 _id
      delete ret.__v;    // 删除版本字段
      return ret;
    }
  }
});

// 添加索引
foodEntrySchema.index({ id: 1 }, { unique: true });
foodEntrySchema.index({ date: -1 });

const FoodEntry = mongoose.model('FoodEntry', foodEntrySchema);

module.exports = FoodEntry;
