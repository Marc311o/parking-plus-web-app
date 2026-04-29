import {Routes, Route, Navigate} from 'react-router-dom';
import PagesLayout from './layouts/PagesLayout.tsx';
import PagesLayoutAuth from "./layouts/PagesLayoutAuth.tsx";
import DashboardPage from '@pages/DashboardPage';
import StatisticsParkingPage from '@pages/Statistics/ParkingStatisticsPage';
import StatisticsPlacesPage from '@pages/Statistics/ParkingSpacesStatisticsPage';
import ClientsPage from '@pages/ClientsPage';
import EventsPage from '@pages/EventsPage';
import PricesPage from '@pages/PricesPage';
import SettingsPage from '@pages/SettingsPage';
import Login from '@pages/Auth/Login';
import CreateNewAccount from '@pages/Auth/CreateNewAccountPage';
import ForgotPassword from '@pages/Auth/ForgotPasswordPage';
import ResetPassword from '@pages/Auth/ResetPasswordPage';
import {ProtectedRoute} from "./login/ProtectedRoute.tsx";
import {useAuthStore} from "./store/useAuthStore.tsx";


const AppRoutes = () => {
    //TODO: Implement separate pages and layouts depending on user role (admin, client)

    const isAuthenticated = useAuthStore((state) => state.token !== null);

    return (
        <Routes>

            <Route element={<PagesLayoutAuth/>}>
                <Route path="/login" element={<Login/>}/>
                <Route path="/createnewaccount" element={<CreateNewAccount/>}/>
                <Route path="/forgotpassword" element={<ForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
            </Route>


            <Route element={<ProtectedRoute/>}>
                <Route element={<PagesLayout/>}>
                    <Route path="/" element={<Navigate to="/dashboard"/>}/>

                    <Route path="statistics">
                        <Route index element={<Navigate to="parking" replace/>}/>
                        <Route path="parking" element={<StatisticsParkingPage/>}/>
                        <Route path="places" element={<StatisticsPlacesPage/>}/>
                    </Route>

                    <Route path="dashboard" element={<DashboardPage/>}/>
                    <Route path="clients" element={<ClientsPage/>}/>
                    <Route path="events" element={<EventsPage/>}/>
                    <Route path="pricing" element={<PricesPage/>}/>
                    <Route path="settings" element={<SettingsPage/>}/>
                </Route>
            </Route>

            {/*DEFAULT*/}
            <Route
                path="/"
                element={
                    <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
                }
            />
            <Route path="*" element={<Navigate to="/" replace/>}/>

        </Routes>
    );
};

export default AppRoutes;