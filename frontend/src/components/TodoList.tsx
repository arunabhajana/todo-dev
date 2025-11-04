import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiLogOut, FiTrash2, FiEdit2, FiSave, FiX, FiCheckCircle, FiSearch, FiCalendar, FiTag, FiFlag, FiClock } from 'react-icons/fi';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
}

type FilterType = 'all' | 'today' | 'upcoming';

const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    dueDate: '', 
    category: 'Personal', 
    priority: 'medium' as 'high' | 'medium' | 'low'
  });
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTask, setEditTask] = useState({ 
    title: '', 
    description: '', 
    dueDate: '', 
    category: 'Personal', 
    priority: 'medium' as 'high' | 'medium' | 'low'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          ...newTask,
          dueDate: newTask.dueDate || undefined,
        }),
      });
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask({ 
        title: '', 
        description: '', 
        dueDate: '', 
        category: 'Personal', 
        priority: 'medium' 
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          ...editTask,
          dueDate: editTask.dueDate || undefined,
        }),
      });
      const data = await response.json();
      setTasks(tasks.map(task => task._id === id ? data : task));
      setEditingTask(null);
      setEditTask({ 
        title: '', 
        description: '', 
        dueDate: '', 
        category: 'Personal', 
        priority: 'medium' 
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find(t => t._id === id);
    if (task) {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ ...task, completed: !task.completed }),
        });
        const data = await response.json();
        setTasks(tasks.map(t => t._id === id ? data : t));
      } catch (error) {
        console.error('Error toggling task:', error);
      }
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (taskDate.getTime() === today.getTime()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      year: taskDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !tasks.find(t => t._id === editingTask)?.completed;
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date filter
    if (activeFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate >= today && taskDate < tomorrow;
      });
    } else if (activeFilter === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate >= today;
      });
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority || 'medium'];
      const bPriority = priorityOrder[b.priority || 'medium'];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  }, [tasks, searchQuery, activeFilter, editingTask]);

  const getPriorityColor = (priority?: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-rose-500/20 text-rose-200 border-rose-400/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-200 border-amber-400/30';
      case 'low':
        return 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30';
      default:
        return 'bg-amber-500/20 text-amber-200 border-amber-400/30';
    }
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'Work': 'bg-blue-500/20 text-blue-200 border-blue-400/30',
      'Personal': 'bg-purple-500/20 text-purple-200 border-purple-400/30',
      'Shopping': 'bg-pink-500/20 text-pink-200 border-pink-400/30',
      'Health': 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
      'Other': 'bg-gray-500/20 text-gray-200 border-gray-400/30',
    };
    return colors[category || 'Personal'] || colors['Other'];
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 p-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white/95 tracking-tight">Your Tasks</h1>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-md transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60"
          >
            <FiLogOut className="h-5 w-5" />
            Logout
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl shadow-xl ring-1 ring-white/10">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-4 flex gap-2 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-xl shadow-xl ring-1 ring-white/10">
          {(['all', 'today', 'upcoming'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition capitalize ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {filter === 'all' ? 'All Tasks' : filter === 'today' ? 'Today' : 'Upcoming'}
            </button>
          ))}
        </div>

        {/* Create Task Form */}
        <div className="relative rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl shadow-2xl ring-1 ring-white/10 mb-6">
          <form onSubmit={createTask} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
              />
              <input
                type="datetime-local"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60 [color-scheme:dark]"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Task description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                  ))}
                </select>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
                >
                  <option value="low" className="bg-gray-800">Low</option>
                  <option value="medium" className="bg-gray-800">Medium</option>
                  <option value="high" className="bg-gray-800">High</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-3 font-medium text-white shadow-lg transition hover:from-fuchsia-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60"
            >
              <FiPlus className="h-5 w-5" />
              Add Task
            </button>
          </form>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl shadow-xl ring-1 ring-white/10 text-center">
              <p className="text-white/70">No tasks found. {searchQuery ? 'Try a different search.' : 'Create your first task!'}</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task._id}
                className={`relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl ring-1 ring-white/10 transition ${task.completed ? 'opacity-80' : ''} ${isOverdue(task.dueDate) ? 'ring-2 ring-rose-400/50' : ''}`}
              >
                {editingTask === task._id ? (
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        value={editTask.title}
                        onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                        className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
                        placeholder="Title"
                      />
                      <input
                        type="datetime-local"
                        value={editTask.dueDate ? new Date(editTask.dueDate).toISOString().slice(0, 16) : ''}
                        onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                        className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60 [color-scheme:dark]"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        value={editTask.description}
                        onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                        className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
                        placeholder="Description"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={editTask.category}
                          onChange={(e) => setEditTask({ ...editTask, category: e.target.value })}
                          className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                          ))}
                        </select>
                        <select
                          value={editTask.priority}
                          onChange={(e) => setEditTask({ ...editTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                          className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
                        >
                          <option value="low" className="bg-gray-800">Low</option>
                          <option value="medium" className="bg-gray-800">Medium</option>
                          <option value="high" className="bg-gray-800">High</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => updateTask(task._id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/15 px-4 py-2 text-emerald-100 hover:bg-emerald-400/25 focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
                      >
                        <FiSave className="h-5 w-5" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTask(null)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-purple-300/60"
                      >
                        <FiX className="h-5 w-5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => toggleComplete(task._id)}
                          className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border ${task.completed ? 'border-emerald-400 bg-emerald-400/20' : 'border-white/30 bg-white/10'} text-white transition`}
                          aria-label="toggle complete"
                        >
                          <FiCheckCircle className={`h-5 w-5 ${task.completed ? 'text-emerald-300' : 'text-white/70'}`} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-base font-medium ${task.completed ? 'text-white/70 line-through' : 'text-white'}`}>{task.title}</h3>
                          {task.description && (
                            <p className={`text-sm mt-1 ${task.completed ? 'text-white/50 line-through' : 'text-white/80'}`}>{task.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            {task.dueDate && (
                              <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${isOverdue(task.dueDate) && !task.completed ? 'bg-rose-500/20 text-rose-200 border-rose-400/30' : 'bg-white/10 text-white/80 border-white/20'}`}>
                                <FiClock className="h-3.5 w-3.5" />
                                {formatDateTime(task.dueDate)}
                              </span>
                            )}
                            {task.category && (
                              <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${getCategoryColor(task.category)}`}>
                                <FiTag className="h-3.5 w-3.5" />
                                {task.category}
                              </span>
                            )}
                            {task.priority && (
                              <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                                <FiFlag className="h-3.5 w-3.5" />
                                {task.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 sm:ml-4">
                        <button
                          onClick={() => {
                            setEditingTask(task._id);
                            setEditTask({ 
                              title: task.title, 
                              description: task.description || '', 
                              dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
                              category: task.category || 'Personal',
                              priority: task.priority || 'medium'
                            });
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-purple-300/60"
                        >
                          <FiEdit2 className="h-5 w-5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/15 px-3 py-2 text-rose-100 hover:bg-rose-400/25 focus:outline-none focus:ring-2 focus:ring-rose-300/50"
                        >
                          <FiTrash2 className="h-5 w-5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
