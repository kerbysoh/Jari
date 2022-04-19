import axios from 'axios'
axios.defaults.withCredentials = true

export async function getTasks(userid) {
   return await axios.get(
    'http://localhost:5000/get-tasks', {
      params: {
        id: userid
      }
    }
  )
}

export async function newTask(task) {
  return await axios.post(
   'http://localhost:5000/tasks', task
 )
}

export async function startTask(taskid) {
  return await axios.put(
   'http://localhost:5000/start-task', {
     id: taskid
  }
 )
}

export async function deleteTask(taskid) {
  return await axios.put(
   'http://localhost:5000/delete-task', {
     id: taskid
  }
 )
}

export async function completeTask(taskid) {
  return await axios.put(
   'http://localhost:5000/complete-task', {
     id: taskid
  }
 )
}

export async function editTask(task, id) {
  return await axios.put(
   'http://localhost:5000/edit-task', {
     task: task,
     id: id
  }
 )
}


