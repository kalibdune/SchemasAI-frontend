import './App.css';
import SignUp from "./pages/SignUp/SignUp.tsx";
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from "react-router-dom";
import LogIn from "./pages/LogIn/LogIn.tsx";
import Home from "./pages/Home/Home.tsx";
import Chat from "./pages/Chat/Chat.tsx";
import Cookies from 'js-cookie';
import { useEffect } from "react";
import { ApiService } from "./utils/auth.ts";



function App() {
    return (
        <div className="flex justify-center items-center h-screen">
            <Router>
                <Routes>
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<LogIn />} />\
\
                        <Route path="/" element={<Home />} />
                        <Route path="/chat" element={<Chat />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
