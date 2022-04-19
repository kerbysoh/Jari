import { useEffect, useState } from "react"
import { getTasks, newTask, startTask, deleteTask, completeTask, editTask } from '../api/tasks'
import { useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import moment from 'moment'

const Tasks = () => {
    const { user } = useSelector((state) => state.auth)
    const [tasks, setTasks] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState('')
    const [showEditTaskModal, setShowEditTaskModal] = useState(false)
    const [showStartTaskModal, setShowStartTaskModal] = useState(false)
    const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false)
    const [showCompleteTaskModal, setShowCompleteTaskModal] = useState(false)
    const [showFilterTaskModal, setShowFilterTaskModal] = useState(false)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedTask, setSelectedTask] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [values, setValues] = useState({
      description: '',
      deadline: '',
      category: '',
      status: 'uncompleted',
      userid: user.id.toString(),
    })

    const [editValues, setEditValues] = useState({
      description: '',
      deadline: '',
      category: '',
      status: 'uncompleted',
      userid: user.id.toString(),
    })

    const filterCategories = async () => {
      try {
        const response = await getTasks(user.id)
        let set = new Set()
        response.data.map((task) => {
          return task.category.trim()
        }).forEach(
          (category) => {
            set.add(category)
          }
        )
        setCategories(Array.from(set))
      } catch (err) {
        console.log(err)
      }      
    }

    const onEditChange = (e) => {
      setEditValues({ ...editValues, [e.target.name]: e.target.value })
    }

    const onChange = (e) => {
      setValues({ ...values, [e.target.name]: e.target.value })
    }

    const onEditSubmit = async (e) => {
      e.preventDefault()
      try {
        if (editValues.description.length < 1 || editValues.description.length > 30) {
          setError("Description must be between the length of 1 and 30 characters inclusive")
          return
        }
        if (editValues.category.length < 1 || editValues.category.length > 15) {
          setError("Category must be between the length of 1 and 15 characters inclusive")
          return
        }
        const response = await editTask(editValues, selectedTask.id)
        if (response.data.routine === 'DateTimeParseError') {
          setError("Deadline is not in the correct format.")
          return
        }
        console.log(response)
        setEditValues({
          description: '',
          deadline: '',
          category: '',
          status: 'uncompleted',
          userid: user.id.toString(),
        })
        setError('')
        setShowEditTaskModal(false)
        setRefresh(!refresh)
      } catch (error) {
        console.log(error.response.data.errors[0].msg)
        setError(error.response.data.errors[0].msg)
      }
    }

    const onSubmit = async (e) => {
      e.preventDefault()
      try {
        if (values.description.length < 1 || values.description.length > 30) {
          setError("Description must be between the length of 1 and 30 characters inclusive")
          return
        }
        if (values.category.length < 1 || values.category.length > 15) {
          setError("Category must be between the length of 1 and 15 characters inclusive")
          return
        }
        const response = await newTask(values)
        if (response.data.routine === 'DateTimeParseError') {
          setError("Deadline is not in the correct format.")
          return
        }
        console.log(response)
        setValues({
          description: '',
          deadline: '',
          category: '',
          status: 'uncompleted',
          userid: user.id.toString(),
        })
        setError('')
        setShowModal(false)
        setRefresh(!refresh)
      } catch (error) {
        console.log(error.response.data.errors[0].msg)
        setError(error.response.data.errors[0].msg)
      }
    }

    useEffect(() => {
      async function fetchData() {
        try {
          const response = await getTasks(user.id)
          setTasks(response.data.sort(
            function(a,b) {
              if (new Date(a.deadline) < new Date(b.deadline)) {
                return -1
              }
              return 1
            }
          ))
        } catch (err) {
          console.log(err)
        }
      }
      fetchData()
    }, [user, refresh])

    return (
      <div class="grid grid-cols-4 gap-3 my-24">
        <div class="space-x-4">
          <div class="flex justify-center">
            <div>
              {tasks.filter(task => task.status === "uncompleted").map((item) => {
                return (
                  <div class="rounded border-4 border-purple-300 bg-white p-8 w-[20rem] my-4"> 
                    <div
                    class="text-xs inline-flex font-bold leading-sm uppercase px-3 py-1 bg-red-200 text-red-700 rounded-full">
                      {item.status}
                    </div>
                    <div
                      class="text-xs inline-flex ml-2 font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full">
                    {item.category}
                    </div>
                    <h2 class="font-bold text-2xl mt-2">
                      {item.description}
                    </h2>
                    <p class="mt-5"> 
                      Deadline:
                      <a class="font-bold">{" " + (new Date(item.deadline)).toDateString()} </a>
                    </p>
                    <div class="flex justify-end space-x-1">
                    <button onClick = {() => {
                      setShowEditTaskModal(true)
                      setSelectedTask(item)
                      setEditValues(
                        {
                          description: item.description,
                          deadline: moment(item.deadline).format('MM/DD/YYYY HH:mm'),
                          category: item.category,
                          status: item.status,
                          userid: user.id.toString(),
                        }
                      )
                    }}>
                      <svg data-tip="Edit task" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <ReactTooltip />
                    </button>  
                    <button onClick = {() => {
                      setShowStartTaskModal(true)
                      setSelectedTask(item)
                    }}>
                    <svg data-tip="Start task" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                     <ReactTooltip />
                     </button>
                     <button onClick = {() => {
                      setShowDeleteTaskModal(true)
                      setSelectedTask(item)
                    }}>
                     <svg data-tip="Delete task" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                     </svg>
                      <ReactTooltip />
                    </button>
                    </div>
                  </div>
                )
              }
              )}
            </div>
          </div>
        </div>
        <div class="flex justify-center">
            <div class>
              {tasks.filter(task => task.status === "in progress").map((item) => {
                  return (
                    <div class="bg-white border-4 border-purple-300  p-8 w-[20rem] my-4"> 
                      <div
                      class="text-xs inline-flex  font-bold leading-sm uppercase px-3 py-1 bg-orange-200 text-orange-700 rounded-full">
                        {item.status}
                      </div>
                      <div
                        class="text-xs inline-flex ml-2 font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full">
                      {item.category}
                      </div>
                      <h2 class="font-bold text-2xl mt-2">
                        {item.description}
                      </h2>
                      <p class="mt-5"> 
                        Deadline:
                        <a class="font-bold">{" " + (new Date(item.deadline)).toDateString()} </a>
                      </p>
                      <div class="flex justify-end space-x-1">
                        <button onClick = {() => {
                          setShowEditTaskModal(true)
                          setSelectedTask(item)
                          setEditValues(
                            {
                              description: item.description,
                              deadline: moment(item.deadline).format('MM/DD/YYYY HH:mm'),
                              category: item.category,
                              status: item.status,
                              userid: user.id.toString(),
                            }
                          )
                        }}>
                      <svg data-tip="Edit task" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <ReactTooltip />
                    </button>  
                      <button onClick = {() => {
                      setShowCompleteTaskModal(true)
                      setSelectedTask(item)
                       }}>
                      <svg data-tip="Complete task" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <ReactTooltip />
                      </button>
                      <button onClick = {() => {
                      setShowDeleteTaskModal(true)
                      setSelectedTask(item)
                       }}>
                      <svg data-tip="Delete task" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <ReactTooltip />
                      </button>
                      </div>
                    </div>
                  )
                }
                )}
            </div>
          </div>
          <div class="flex justify-center">
            <div class>
              {tasks.filter(task => task.status === "completed").map((item) => {
                  return (
                    <div class="border-4 border-purple-300 bg-white p-8 w-[20rem] my-4"> 
                      <div
                      class="text-xs inline-flex  font-bold leading-sm uppercase px-3 py-1 bg-green-200 text-green-700 rounded-full">
                        {item.status}
                      </div>
                      <div
                        class="text-xs inline-flex ml-2 font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full">
                      {item.category}
                      </div>
                      <h2 class="font-bold text-2xl mt-2">
                        {item.description}
                      </h2>
                      <p class="mt-5"> 
                        Deadline:
                        <a class="font-bold">{" " + (new Date(item.deadline)).toDateString()} </a>
                      </p>
                      <p class="font-light">  </p>
                      <div class="flex justify-end space-x-1">
                        <button onClick = {() => {
                        setShowEditTaskModal(true)
                        setSelectedTask(item)
                        setEditValues(
                          {
                            description: item.description,
                            deadline: moment(item.deadline).format('MM/DD/YYYY HH:mm'),
                            category: item.category,
                            status: item.status,
                            userid: user.id.toString(),
                          }
                        )
                        }}>
                        <svg data-tip="Edit task" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <ReactTooltip />
                        </button>  
                        <button onClick = {() => {
                        setShowDeleteTaskModal(true)
                        setSelectedTask(item)
                        }}>
                        <svg data-tip="Delete task" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <ReactTooltip />
                        </button>
                      </div>
                    </div>
                  )
                }
                )}
            </div>
          </div>
          <div class="flex justify-center">
            <div>
              <aside class="w-64" aria-label="Sidebar">
                <div class="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800 my-4">
                    <ul class="space-y-2">
                      <li onClick={() => setShowModal(true)}>
                          <a href="#" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square-fill" viewBox="0 0 16 16">
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
                          </svg>
                            <span class="ml-3">Add new task</span>
                          </a>
                      </li>
                      <li onClick={() => {setShowFilterTaskModal(true)
                        filterCategories()
                      }
                      }>
                          <a href="#" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filter-square-fill" viewBox="0 0 16 16">
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm.5 5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1 0-1zM4 8.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm2 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z"/>
                          </svg>
                            <span class="flex-1 ml-3 whitespace-nowrap">Filter tasks</span>
                          </a>
                      </li>
                    </ul>
                </div>
              </aside>
            </div>
          </div>
          {showDeleteTaskModal && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl w-96">
              <div className="min-w-xl border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Delete selected task
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div class="bg-white p-8 w-[20rem] h-[13rem] my-4"> 
                      <h2 class="font-bold text-2xl mt-2">
                        {selectedTask.description}
                      </h2>
                      <p class="mt-5"> 
                        Deadline:
                        <a class="font-bold">{" " + (new Date(selectedTask.deadline)).toDateString()} </a>
                      </p>
                    </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    try {
                      await deleteTask(selectedTask.id)
                      setShowDeleteTaskModal(false)
                      setRefresh(!refresh)
                    } catch (err) {
                      console.log(err)
                    }
                  }} vclass="w-full max-w-lg">
                    <div className="flex p-6 border-t border-solid border-slate-200 rounded-b justify-end space-x-4">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowDeleteTaskModal(false)}
                      >
                        Close
                      </button>
                      <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                      >
                        Confirm
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
      {showCompleteTaskModal && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl w-96">
              <div className="min-w-xl border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Complete selected task
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div class="bg-white p-8 w-[20rem] h-[13rem] my-4"> 
                      <h2 class="font-bold text-2xl mt-2">
                        {selectedTask.description}
                      </h2>
                      <p class="mt-5"> 
                        Deadline:
                        <a class="font-bold">{" " + (new Date(selectedTask.deadline)).toDateString()} </a>
                      </p>
                    </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    try {
                      await completeTask(selectedTask.id)
                      setShowCompleteTaskModal(false)
                      setRefresh(!refresh)
                    } catch (err) {
                      console.log(err)
                    }
                  }} vclass="w-full max-w-lg">
                    <div className="flex p-6 border-t border-solid border-slate-200 rounded-b justify-end space-x-4">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowCompleteTaskModal(false)}
                      >
                        Close
                      </button>
                      <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                      >
                        Confirm
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
          {showStartTaskModal && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl w-96">
              <div className="min-w-xl border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Start selected task
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div class="bg-white p-8 w-[20rem] h-[13rem] my-4"> 
                      <h2 class="font-bold text-2xl mt-2">
                        {selectedTask.description}
                      </h2>
                      <p class="mt-5"> 
                        Deadline:
                        <a class="font-bold">{" " + (new Date(selectedTask.deadline)).toDateString()} </a>
                      </p>
                    </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    try {
                      await startTask(selectedTask.id)
                      setShowStartTaskModal(false)
                      setRefresh(!refresh)
                    } catch (err) {
                      console.log(err)
                    }
                  }} vclass="w-full max-w-lg">
                    <div className="flex p-6 border-t border-solid border-slate-200 rounded-b justify-end space-x-4">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowStartTaskModal(false)}
                      >
                        Close
                      </button>
                      <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                      >
                        Confirm
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
      {showEditTaskModal && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl w-96">
              <div className="min-w-xl border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Edit task
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowEditTaskModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                  <form onSubmit={(e) => onEditSubmit(e)} vclass="w-full max-w-lg">
                    <div class="flex flex-wrap -mx-3 mb-6">
                      <div class="w-full px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                          Description (Max. 30 characters)
                        </label>
                        <input onChange={(e) => onEditChange(e)} value={editValues.description} name='description' class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="A short description of the task" />
                      </div>
                    </div>
                    <div class="flex flex-wrap -mx-3 mb-6">
                      <div class="w-full px-3">
                      <div class="relative">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                          Category (Max. 15 characters)
                        </label>
                        <input onChange={(e) => onEditChange(e)} value={editValues.category} name='category' class="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Type of task" />
                      </div>
                      </div>
                    </div>
                    <div class="flex flex-wrap -mx-3 mb-6">
                      <div class="w-full px-3">
                      <div class="relative">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                          Deadline
                        </label>
                        <input onChange={(e) => onEditChange(e)} value={editValues.deadline} name='deadline' class="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="MM/DD/YYYY HH:mm" />
                      </div>
                      </div>
                    </div>  
                    {error && <div id="alert-2" class="flex p-4 mb-4 bg-red-100 rounded-lg dark:bg-red-200" role="alert">
                      <svg class="flex-shrink-0 w-5 h-5 text-red-700 dark:text-red-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                      <div class="ml-3 text-sm font-medium text-red-700 dark:text-red-800">
                        <span>{error}</span>
                      </div>
                    </div>}
                    <div className="flex p-6 border-t border-solid border-slate-200 rounded-b justify-end space-x-4">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          setShowEditTaskModal(false)
                          setError('')
                        }
                        }
                      >
                        Close
                      </button>
                      <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                      >
                        Confirm
                      </button>
                    </div>
                  </form>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
      {showFilterTaskModal && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl w-96">
              <div className="min-w-xl border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Filter tasks
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowFilterTaskModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    console.log(selectedCategory)
                    try {
                      const response = await getTasks(user.id)
                      setTasks(response.data.filter(
                        (task) => {
                          if (selectedCategory === '') {
                            return true
                          }
                          return task.category.trim() === selectedCategory
                        }
                      ).sort(
                        function(a,b) {
                          if (new Date(a.deadline) < new Date(b.deadline)) {
                            return -1
                          }
                          return 1
                        }
                      ))
                    } catch (err) {
                      console.log(err)
                    }
                    setSelectedCategory('')
                    setShowFilterTaskModal(false)
                  }} vclass="w-full max-w-lg">
                    <div class="flex flex-wrap -mx-3 mb-6">
                      <div class="w-full px-3">
                      <div class="relative">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                          Category 
                        </label>
                        <select 
                          onChange={(e) => {
                            setSelectedCategory(e.target.value)
                          }}
                          class="form-select form-select-lg mb-3
                          appearance-none
                          block
                          w-full
                          px-4
                          py-2
                          text-xl
                          font-normal
                          text-gray-700
                          bg-white bg-clip-padding bg-no-repeat
                          border border-solid border-gray-300
                          rounded
                          transition
                          ease-in-out
                          m-0
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label=".form-select-lg example">
                            <option selected value = ''>View all</option>
                            {
                              categories.map((category) => {
                                return <option value={category}>{category}</option>
                              })
                            }
                        </select>
                      </div>
                      </div>
                    </div>
                    {error && <div id="alert-2" class="flex p-4 mb-4 bg-red-100 rounded-lg dark:bg-red-200" role="alert">
                      <svg class="flex-shrink-0 w-5 h-5 text-red-700 dark:text-red-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                      <div class="ml-3 text-sm font-medium text-red-700 dark:text-red-800">
                        <span>{error}</span>
                      </div>
                    </div>}
                    <div className="flex p-6 border-t border-solid border-slate-200 rounded-b justify-end space-x-4">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() =>  {
                          setShowFilterTaskModal(false)
                          setError('')
                        }
                        }
                      >
                        Close
                      </button>
                      <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                      >
                        Confirm
                      </button>
                    </div>
                  </form>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}  
          {showModal && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl w-96">
              <div className="min-w-xl border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Add new task
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                  <form onSubmit={(e) => onSubmit(e)} vclass="w-full max-w-lg">
                    <div class="flex flex-wrap -mx-3 mb-6">
                      <div class="w-full px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                          Description (Max. 30 characters)
                        </label>
                        <input onChange={(e) => onChange(e)} value={values.description} name='description' class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="A short description of the task" />
                      </div>
                    </div>
                    <div class="flex flex-wrap -mx-3 mb-6">
                      <div class="w-full px-3">
                      <div class="relative">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                          Category (Max. 15 characters)
                        </label>
                        <input onChange={(e) => onChange(e)} value={values.category} name='category' class="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Type of task" />
                      </div>
                      </div>
                    </div>
                    <div class="flex flex-wrap -mx-3 mb-6">
                      <div class="w-full px-3">
                      <div class="relative">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                          Deadline
                        </label>
                        <input onChange={(e) => onChange(e)} value={values.deadline} name='deadline' class="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="MM/DD/YYYY HH:mm" />
                      </div>
                      </div>
                    </div>  
                    {error && <div id="alert-2" class="flex p-4 mb-4 bg-red-100 rounded-lg dark:bg-red-200" role="alert">
                      <svg class="flex-shrink-0 w-5 h-5 text-red-700 dark:text-red-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                      <div class="ml-3 text-sm font-medium text-red-700 dark:text-red-800">
                        <span>{error}</span>
                      </div>
                    </div>}
                    <div className="flex p-6 border-t border-solid border-slate-200 rounded-b justify-end space-x-4">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() =>  {
                          setShowModal(false)
                          setError('')
                        }
                        }
                      >
                        Close
                      </button>
                      <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                      >
                        Confirm
                      </button>
                    </div>
                  </form>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    )
}

export default Tasks