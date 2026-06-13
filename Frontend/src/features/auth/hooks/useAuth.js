import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext);

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const userData = await login({ email, password });
            setUser(userData);
            localStorage.setItem('@RNAuth:user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (payload) => {
        setLoading(true);
        try {
            const userData = await register(payload);
            setUser(userData);
            localStorage.setItem('@RNAuth:user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('@RNAuth:user');
            setLoading(false);
        }
    };

    const fetchMe = async () => {
        setLoading(true);
        try {
            const userData = await getMe();
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('GetMe error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { user, setUser, loading, setLoading, handleLogin, handleRegister, handleLogout, fetchMe };
};
    