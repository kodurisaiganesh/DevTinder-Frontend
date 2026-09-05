import { BrowserRouter, Routes,Route } from "react-router-dom"
import Body from "./components/Body"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Store from "./utils/appStore"
import Feed from "./components/Feed"
function App() {
  return (
    <>
    
    <BrowserRouter basename="/">
    <Routes>
      

      <Route path="/" element={<Body />}>
      <Route path="/" element={<Feed />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>

      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
