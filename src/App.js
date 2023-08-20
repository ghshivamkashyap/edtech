import "./App.css";
import { Route, Routes } from "react-router-dom";
// import Navbar from "./Components/Core/Common/Navbar";
import Navbar from "./Components/Common/Navbar";
import OpenRoute from "./Components/Core/auth/OpenRoute";
// pages import
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Error from "./pages/Error";
import Forgotpassword from "./pages/Forgotpassword";
import Updatepassword from "./pages/Updatepassword";
import Varifyemail from "./pages/Varifyemail";
import About from "./pages/About";
import Contactus from "./pages/Contactus";
import Dashboard from "./pages/Dashboard";
import Myprofile from "./Components/Core/dashboard/Myprofile";
import Privateroute from "./Components/Core/auth/Privateroute";

function App() {
  return (
    <div className=" w-screen text-richblack-25 bg-richblack-900  flex flex-col font-inter ">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        {/* forgot passwrd  */}
        <Route path="forgotpassword" element={<Forgotpassword />} />
        {/* forgot passwrd  */}
        <Route path="updatepassword/:id" element={<Updatepassword />} />
        {/* forgot passwrd  */}
        <Route
          path="varifyemail"
          element={
            <OpenRoute>
              <Varifyemail />
            </OpenRoute>
          }
        />
        {/* error route  */}
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contactus />} />
        <Route
          element={
            <Privateroute>
              <Dashboard />
            </Privateroute>
          }
        >
          <Route path="dashboard/my-profile" element={<Myprofile />} />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
