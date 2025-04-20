import './App.css';
import SignUp from "./pages/SignUp/SignUp.tsx";
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from "react-router-dom";
import LogIn from "./pages/LogIn/LogIn.tsx";
import Home from "./pages/Home/Home.tsx";
import Chat from "./pages/Chat/Chat.tsx";
import Cookies from 'js-cookie';
import { useEffect } from "react";
import { ApiService } from "./utils/auth.ts";

const api = new ApiService();

function useAuthRedirect(requireAuth: boolean = true) {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const accessToken = Cookies.get('access_token');

                if (requireAuth && !accessToken) throw new Error("No token");
                if (!requireAuth && accessToken) throw new Error("Already authenticated");

                if (accessToken) {
                    await api.getCurrentUser();
                    if (!requireAuth) navigate('/');
                }
            } catch (error) {
                if (requireAuth) {
                    Cookies.remove('access_token');
                    Cookies.remove('refresh_token');
                    navigate('/login');
                }
            }
        };

        checkAuth();
    }, [navigate, requireAuth]);
}

function ProtectedRoute() {
    useAuthRedirect();
    return <Outlet />;
}

function AuthRoute() {
    useAuthRedirect(false);
    return <Outlet />;
}

function App() {
    return (
        <div className="flex justify-center items-center h-screen">
            <Router>
                <Routes>
                    <Route element={<AuthRoute />}>
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<LogIn />} />
                    </Route>

                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/chat" element={<Chat />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
