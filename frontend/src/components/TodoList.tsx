import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiLogOut, FiTrash2, FiEdit2, FiSave, FiX, FiCheckCircle } from 'react-icons/fi';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTask, setEditTask] = useState({ title: '', description: '' });
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
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask({ title: '', description: '' });
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
        body: JSON.stringify(editTask),
      });
      const data = await response.json();
      setTasks(tasks.map(task => task._id === id ? data : task));
      setEditingTask(null);
      setEditTask({ title: '', description: '' });
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 p-6">
      <div className="mx-auto w-full max-w-3xl">
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

        <div className="relative rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
          <form onSubmit={createTask} className="grid grid-cols-1 gap-3 sm:grid-cols-6">
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
              className="sm:col-span-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
            />
            <input
              type="text"
              placeholder="Task description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="sm:col-span-3 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
            />
            <button
              type="submit"
              className="sm:col-span-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-3 font-medium text-white shadow-lg transition hover:from-fuchsia-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60"
            >
              <FiPlus className="h-5 w-5" />
              Add
            </button>
          </form>
        </div>

        <div className="mt-6 space-y-3">
          {tasks.map(task => (
            <div
              key={task._id}
              className={`relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl ring-1 ring-white/10 transition ${task.completed ? 'opacity-80' : ''}`}
            >
              {editingTask === task._id ? (
                <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-6 gap-3 items-start">
                  <input
                    type="text"
                    value={editTask.title}
                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                    className="sm:col-span-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={editTask.description}
                    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                    className="sm:col-span-3 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
                    placeholder="Description"
                  />
                  <div className="sm:col-span-1 flex items-center justify-end gap-2">
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
                <div className="p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleComplete(task._id)}
                      className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border ${task.completed ? 'border-emerald-400 bg-emerald-400/20' : 'border-white/30 bg-white/10'} text-white transition`}
                      aria-label="toggle complete"
                    >
                      <FiCheckCircle className={`h-5 w-5 ${task.completed ? 'text-emerald-300' : 'text-white/70'}`} />
                    </button>
                    <div>
                      <h3 className={`text-base font-medium ${task.completed ? 'text-white/70 line-through' : 'text-white'}`}>{task.title}</h3>
                      {task.description && (
                        <p className={`text-sm ${task.completed ? 'text-white/50 line-through' : 'text-white/80'}`}>{task.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingTask(task._id);
                        setEditTask({ title: task.title, description: task.description });
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-purple-300/60"
                    >
                      <FiEdit2 className="h-5 w-5" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/15 px-3 py-2 text-rose-100 hover:bg-rose-400/25 focus:outline-none focus:ring-2 focus:ring-rose-300/50"
                    >
                      <FiTrash2 className="h-5 w-5" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoList;