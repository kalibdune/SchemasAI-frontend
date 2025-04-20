import './App.css';
import SignUp from "./pages/SignUp/SignUp.tsx";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import LogIn from "./pages/LogIn/LogIn.tsx";
import Home from "./pages/Home/Home.tsx";
import Chat from "./pages/Chat/Chat.tsx";
import { useEffect, useState } from "react";
import { ApiService } from "./utils/auth.ts";

// Создаем экземпляр api для использования в useAuthRedirect
const api = new ApiService();

function useAuthRedirect(requireAuth: boolean = true) {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                const isAuthenticated = localStorage.getItem('isAuthenticated');

                console.log('useAuthRedirect: проверка токена =', !!accessToken,
                            'isAuthenticated =', !!isAuthenticated);

                if (requireAuth && !accessToken) {
                    navigate('/login');
                    return;
                }

                if (!requireAuth && accessToken) {
                    // Используем api для проверки валидности токена
                    try {
                        await api.getCurrentUser();
                        navigate('/');
                        return;
                    } catch (error) {
                        console.error('Токен недействителен:', error);
                        // Очищаем невалидный токен
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('isAuthenticated');
                    }
                }

                setChecked(true);
            } catch (error) {
                console.error('Ошибка авторизации:', error);
                if (requireAuth) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('isAuthenticated');
                    navigate('/login');
                }
                setChecked(true);
            }
        };

        checkAuth();
    }, [navigate, requireAuth]);

    return checked;
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
        </div>
    );
}

export default App;