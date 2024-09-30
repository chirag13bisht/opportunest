import React from 'react'
import Front from './Pages/Front/Front'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Nav from './Components/Navbar/Nav'
import { useReducer,createContext } from 'react'
import { initialState, reducer } from './Components/reducer/useReducer'
import Community from './Pages/Community/Community'
import Jobs from './Pages/Jobs/Jobs'
import Profile from './Pages/Profile/Profile'
import SavedJobs from './Pages/SavedJobs/SavedJobs'
import Circle from './Pages/Circle/Circle'

export const UserContext = createContext();

const Routing = () => {
  return (
    <div>
      
        <Routes>
         <Route path="/" element={<Front />} />
          {state ? ( // Check if user is logged in
          <>
            <Route path="/community" element={<Community />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<Jobs />} />
            <Route path="/profile/:userFirstname-userLastname/:userId" element={<Profile />} />
            <Route path="/savedjobs/:userId" element={<SavedJobs />} />
            <Route path="/mycircle" element={<Circle />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} /> // Redirect to front if logged out
        )}
        </Routes>

    </div>
  )
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

   
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
