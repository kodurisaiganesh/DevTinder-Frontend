import { BrowserRouter, Routes,Route } from "react-router-dom"
import Body from "./components/Body"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Feed from "./components/Feed"
import Profile from "./components/Profile"
import Connections from "./components/Connections"
import Requests from "./components/Requests"
import Chat from "./components/Chat"
import Messages from "./components/Messages"
import ConnectionProfile from "./components/ConnectionProfile"
import PublicLayout from "./components/PublicLayout"
function App() {
  return (
    <>
    
    <BrowserRouter basename="/">
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Route>

      <Route path="/" element={<Body />}>
      <Route index element={<Feed />}></Route>
      <Route path="profile" element={<Profile />}></Route>
      <Route path="connections" element={<Connections />}></Route>
      <Route path="requests" element={<Requests />}></Route>
      <Route path="chat/:userId" element={<Chat />}></Route>
      <Route path="messages" element={<Messages />}></Route>
      <Route path="connection/:userId" element={<ConnectionProfile />}></Route>




      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
