import { useSelector,useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { Logout } from "../actions/userActions"
import {jwtDecode} from 'jwt-decode'
import { clearBlogs } from "../actions/blogActions"
export const Navbar=()=>{
  const dispatch=useDispatch()
    const user=useSelector((state)=>state.user)
    let token
    if(localStorage.getItem('token'))
    {token=jwtDecode(localStorage.getItem('token'))}
    const handleLogout=()=>{
      localStorage.removeItem('token')
      dispatch(clearBlogs())
      dispatch(Logout())
    }
    return <div className="navLinks">
        <li>
        <Link to="/">Home</Link>
      </li>
      {localStorage.getItem('token')?<>
       {token.role!=='user'&& <li>
        <Link to="/blogs">Blogs</Link>
      </li>}
      {token.role==='admin'&&<li>
        <Link to={'/users'}>Users</Link>
        </li>}
        <li>
        <Link to="/login" onClick={handleLogout}>Logout</Link>
      </li>
      
      </>:<>
      <li>
        <Link to={'/login'}>Login</Link>
        </li>
        <li>
        <Link to={'/register'}>Register</Link>
      </li>
      </>}
      

    </div>
}