import { BrowserRouter, Routes,Route } from "react-router-dom"
import Body from "./components/Body"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Feed from "./components/Feed"
import Profile from "./components/Profile"
function App() {
  return (
    <>
    
    <BrowserRouter basename="/">
    <Routes>
      

      <Route path="/" element={<Body />}>
      <Route path="/" element={<Feed />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/profile" element={<Profile />}></Route>

      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
