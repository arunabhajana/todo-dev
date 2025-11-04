const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel.js');

// @desc    Fetch all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
});

// @desc    Fetch single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    res.json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, category, priority } = req.body;

  const task = new Task({
    title,
    description,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    category: category || 'Personal',
    priority: priority || 'medium',
    user: req.user._id,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, completed, dueDate, category, priority } = req.body;

  const task = await Task.findById(req.params.id);

  if (task) {
    task.title = title;
    task.description = description;
    task.completed = completed;
    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }
    if (category !== undefined) {
      task.category = category;
    }
    if (priority !== undefined) {
      task.priority = priority;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    await task.remove();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };