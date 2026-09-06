import { BrowserRouter, Routes,Route } from "react-router-dom"
import Body from "./components/Body"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Feed from "./components/Feed"
import Profile from "./components/Profile"
import Connections from "./components/Connections"
import Requests from "./components/Requests"
function App() {
  return (
    <>
    
    <BrowserRouter basename="/">
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>

      <Route path="/" element={<Body />}>
      <Route index element={<Feed />}></Route>
      <Route path="profile" element={<Profile />}></Route>
      <Route path="connections" element={<Connections />}></Route>
      <Route path="requests" element={<Requests />}></Route>




      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
