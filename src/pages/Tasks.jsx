import { useState, useEffect } from 'react';
import TodoModal from '../components/todotask/TodoModal';
import TodoList from '../components/todotask/TodoList';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useAuth } from '../context/AuthContext'
import { taskAPI } from '../webservice/api'
import { twClasses } from '../utils/twclasses';

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { user } = useAuth()

  // Fetch expenses from API
  const fetchTask = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await taskAPI.getTasks()

      if (response.success) {
        setTasks(response.data)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    if (user) {
      fetchTask();
    }
  }, [user])

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

  const handleSaveTask = async (taskData) => {

    try {
      setLoading(true)
      setError('')

      let response

      if (selectedTask) {
        // Update existing expense
        response = await taskAPI.updateTask(selectedTask._id, taskData)
      } else {
        // Add new expense
        response = await taskAPI.createTask(taskData)
      }

      if (response.success) {
        setIsModalOpen(false)
        setSelectedTask(null)
        fetchTask() // Refresh the list
      }
    } catch (error) {
      console.error('Error saving expense:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }

  }

  const handleConfirmDelete = async (task) => {
    try {
      setLoading(true)
      setError('')

      const response = await taskAPI.deleteTask(task._id)

      if (response.success) {
        setIsDeleteModalOpen(false)
        setSelectedTask(null)
        fetchTask() // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }

  }


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={twClasses.loading.spinner}></div>
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
          className="bg-blue-600 hover:bg-blue-700 text-sm text-white font-medium py-1 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring focus:ring-blue-500 mt-4 lg:mt-0 flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add New Task</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}


      {/* Tasks List */}
      <TodoList
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
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
        item={selectedTask}
        loading={loading}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  )
}

export default Tasks;