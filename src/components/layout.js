import Navbar from './navbar'

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className='justify-center min-h-screen'>{children}</div>
    </div>
  )
}

export default Layout