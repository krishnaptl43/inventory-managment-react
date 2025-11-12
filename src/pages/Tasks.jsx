import { useState, useEffect } from 'react'
import TodoModal from '../components/TodoModal'
import TodoList from '../components/TodoList'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('inventory-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
    setLoading(false)
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('inventory-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleAddTask = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = (task) => {
    setSelectedTask(task)
    setIsDeleteModalOpen(true)
  }

  const handleSaveTask = (taskData) => {
    if (selectedTask) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
          : task
      ))
    } else {
      // Add new task
      const newTask = {
        id: Date.now(),
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setTasks(prev => [newTask, ...prev])
    }
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  const handleConfirmDelete = (task) => {
    setTasks(prev => prev.filter(t => t.id !== task.id))
    setIsDeleteModalOpen(false)
    setSelectedTask(null)
  }

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ))
  }

  const filters = [
    { key: 'all', label: 'All Tasks', count: tasks.length },
    { key: 'active', label: 'Active', count: tasks.filter(t => t.status !== 'completed').length },
    { key: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
    { key: 'high', label: 'High Priority', count: tasks.filter(t => t.priority === 'high').length },
    { key: 'medium', label: 'Medium Priority', count: tasks.filter(t => t.priority === 'medium').length },
    { key: 'low', label: 'Low Priority', count: tasks.filter(t => t.priority === 'low').length },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">Manage your tasks and to-do items</p>
        </div>
        
        <button 
          onClick={handleAddTask}
          className="bg-blue-600 hover:bg-blue-700 text-sm text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring focus:ring-blue-500 mt-4 lg:mt-0 flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((filterItem) => (
            <button
              key={filterItem.key}
              onClick={() => setFilter(filterItem.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterItem.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterItem.label} ({filterItem.count})
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <TodoList
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
        filter={filter}
      />

      {/* Modals */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTask(null)
        }}
        task={selectedTask}
        onSave={handleSaveTask}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedTask(null)
        }}
        onConfirm={handleConfirmDelete}
        product={selectedTask}
      />
    </div>
  )
}

export default Tasks;