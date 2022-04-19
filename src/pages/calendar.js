import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getTasks } from '../api/tasks'
import { fetchProtectedInfo, onLogout } from '../api/auth'
import Layout from '../components/layout'
import { unauthenticateUser } from '../redux/slices/authSlice'
import { useSelector } from 'react-redux'
import CalendarComponent from 'react-awesome-calendar';


const Calendar = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)
  const [protectedData, setProtectedData] = useState(null)
  const [events, setEvents] = useState([
  ])

  const logout = async () => {
    try {
      await onLogout()
      dispatch(unauthenticateUser())
      localStorage.removeItem('isAuth')
    } catch (error) {
      console.log(error.response)
    }
  }

  const protectedInfo = async () => {
    try {
      const { data } = await fetchProtectedInfo()
      setProtectedData(data.info)

      setLoading(false)
    } catch (error) {
      logout()
    }
  }

  useEffect(() => {
    protectedInfo()
    async function fetchData() {
        try {
          const response = await getTasks(user.id)
          setEvents(response.data.map((task) => {
              if (task.status === "completed") {             
                return {
                    id: task.id,
                    color: 'rgb(34 197 94)',
                    from: task.deadline,
                    to: task.deadline,
                    title: task.description
                }
              }
              if (task.status === "uncompleted") {             
                return {
                    id: task.id,
                    color: '#fd3153',
                    from: task.deadline,
                    to: task.deadline,
                    title: task.description
                }
              }
              return {
                id: task.id,
                color: 'rgb(249 115 22)',
                from: task.deadline,
                to: task.deadline,
                title: task.description
            }        
          }))
        } catch (err) {
          console.log(err)
        }
      }
    fetchData()
  }, [])

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div class="bg-purple-100">
      <Layout>
          <div class="flex bg-white m-10">
            <CalendarComponent events={events}/>
          </div>
      </Layout>
    </div>
  )
}

export default Calendar