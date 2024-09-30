import React, { useContext,useEffect } from 'react'
import Front from './Pages/Front/Front'
import { BrowserRouter,Route,Routes,Navigate} from 'react-router-dom'
import Nav from './Components/Navbar/Nav'
import { useReducer,createContext } from 'react'
import { initialState, reducer } from './Components/reducer/useReducer'
import Community from './Pages/Community/Community'
import Jobs from './Pages/Jobs/Jobs'
import Profile from './Pages/Profile/Profile'
import SavedJobs from './Pages/SavedJobs/SavedJobs'
import Circle from './Pages/Circle/Circle'
import axios from './Utils/axiosConfig'

export const UserContext = createContext();

const Routing = () => {
  const { state } = useContext(UserContext);
  return (
    <div>
      
        <Routes>
         <Route path="/" element={<Front/>}/>
          {state ? (
          <>
            <Route path="/community" element={<Community/>}/>
            <Route path="/jobs" element={<Jobs/>}/>
            <Route path="/jobs/:id" element={<Jobs/>}/>
            <Route path="/profile/:userFirstname-userLastname/:userId" element={<Profile/>}/>
            <Route path="/savedjobs/:userId" element={<SavedJobs/>}/>
            <Route path="/mycircle" element={<Circle/>}/>
          </>
        ) : (
          <Route path="*" element={<Navigate to="/"/>}/>
        )}
        </Routes>

    </div>
  )
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    // Function to check authentication status
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/protected'); // Adjust the endpoint as needed
        if (res.status === 200) {
          dispatch({ type: 'USER', payload: { isAuthenticated: true, user: res.data.user } });
        }
      } catch (error) {
        dispatch({ type: 'USER', payload: { isAuthenticated: false, user: null } });
      }
    };

    checkAuth();
  }, [dispatch]);


   
    return (

        <>
            <BrowserRouter>
                <UserContext.Provider value={{ state, dispatch }}>
                        <Nav/>
                        <Routing />
                </UserContext.Provider>


            </BrowserRouter>


        </>
    )
  }

export default App;
