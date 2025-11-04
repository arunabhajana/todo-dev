const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    category: {
      type: String,
      required: false,
      default: 'Personal',
    },
    priority: {
      type: String,
      required: false,
      default: 'medium',
      enum: ['high', 'medium', 'low'],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;