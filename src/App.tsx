import './App.css';
import SignUp from "./pages/SignUp/SignUp.tsx";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LogIn from "./pages/LogIn/LogIn.tsx";
import Home from "./pages/Home/Home.tsx";
import Chat from "./pages/Chat/Chat.tsx";
import Cookies from 'js-cookie';
import {useEffect} from "react";

function useAuthRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = Cookies.get('access_token');
        const refreshToken = Cookies.get('refresh_token');

        if (!accessToken || !refreshToken) {
            navigate('/login');
        }
    }, [navigate]);

    return null;
}

function App() {
    useAuthRedirect();

    return (
        <div className="flex justify-center items-center h-screen">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/chat" element={<Chat />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
