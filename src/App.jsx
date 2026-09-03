import { BrowserRouter, Routes,Route } from "react-router-dom"
import Navbar from "./Navbar"
import Body from "./Body"
import Login from "./Login"
import Signup from "./Signup"

function App() {
  return (
    <>
    <BrowserRouter basename="/">
    <Routes>
      <Route path="/" element={<Body />}>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      


      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
