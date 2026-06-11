import { Routes, Route, Navigate } from 'react-router-dom';

import PagesLayout from './layouts/PagesLayout.tsx';
import PagesLayoutAuth from './layouts/PagesLayoutAuth.tsx';

import DashboardPage from '@pages/DashboardPage';
import StatisticsParkingPage from '@pages/Statistics/ParkingStatisticsPage';
import StatisticsPlacesPage from '@pages/Statistics/ParkingSpacesStatisticsPage';
import ClientsPage from '@pages/ClientsPage';
import EventsPage from '@pages/EventsPage';
import PricesPage from '@pages/PricesPage';
import SettingsPage from '@pages/SettingsPage';
import MyCarsPage from '@pages/MyCarsPage';
import MyReservationsPage from '@pages/MyReservationsPage';
import MyPurchasesPage from '@pages/MyPurchasesPage';
import ParkingPurchasePage from '@pages/ParkingPurchasePage';
import PayParkingPage from '@pages/PayParkingPage';

import Login from '@pages/Auth/Login';
import CreateNewAccount from '@pages/Auth/CreateNewAccountPage';
import ForgotPassword from '@pages/Auth/ForgotPasswordPage';
import ResetPassword from '@pages/Auth/ResetPasswordPage';

import { ProtectedRoute } from './login/ProtectedRoute.tsx';
import { useAuthStore } from '@store/useAuthStore.tsx';

const AppRoutes = () => {
    const isAuthenticated = useAuthStore((state) => state.token !== null);

    return (
        <Routes>

            {/* ================= AUTH ================= */}
            <Route element={<PagesLayoutAuth />}>
                <Route path="/login" element={<Login />} />
                <Route path="/createnewaccount" element={<CreateNewAccount />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* ================= APP (ALL LOGGED USERS) ================= */}
            <Route element={<ProtectedRoute allowed={["ADMIN", "CLIENT"]} />}>
                <Route element={<PagesLayout />}>

                    {/* REDIRECT ROOT */}
                    <Route
                        path="/"
                        element={
                            <Navigate
                                to={isAuthenticated ? "/dashboard" : "/login"}
                                replace
                            />
                        }
                    />

                    {/* ================= ADMIN ONLY ================= */}
                    <Route element={<ProtectedRoute allowed={["ADMIN"]} />}>
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="clients" element={<ClientsPage />} />
                        <Route path="events" element={<EventsPage />} />

                        <Route path="statistics">
                            <Route index element={<Navigate to="parking" replace />} />
                            <Route path="parking" element={<StatisticsParkingPage />} />
                            <Route path="places" element={<StatisticsPlacesPage />} />
                        </Route>
                    </Route>


                    {/* ================= CLIENT ONLY ================= */}
                    <Route element={<ProtectedRoute allowed={["CLIENT"]} />}>
                        <Route path="myCars" element={<MyCarsPage />} />
                        <Route path="myPurchases" element={<MyPurchasesPage />} />
                        <Route path="myReservations" element={<MyReservationsPage />} />
                        <Route path="parkingPurchase" element={<ParkingPurchasePage />} />
                    </Route>

                    {/* ================= SHARED ================= */}
                    <Route element={<ProtectedRoute allowed={["ADMIN", "CLIENT"]} />}>
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="pricing" element={<PricesPage />} />
                        <Route path="pay-parking" element={<PayParkingPage />} />
                    </Route>

                </Route>
            </Route>

            {/* ================= FALLBACK ================= */}
            <Route
                path="*"
                element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
            />

        </Routes>
    );
};

export default AppRoutes;