import {Routes, Route, Navigate} from 'react-router-dom';
import PagesLayout from './layouts/PagesLayout.tsx';
import DashboardPage from '@pages/DashboardPage';
import StatisticsParkingPage from '@pages/Statistics/ParkingStatisticsPage';
import StatisticsPlacesPage from '@pages/Statistics/ParkingSpacesStatisticsPage';
import ClientsPage from '@pages/ClientsPage';
import EventsPage from '@pages/EventsPage';
import PricesPage from '@pages/PricesPage';
import SettingsPage from '@pages/SettingsPage';

const AppRoutes = () => {
    //TODO: Implement separate pages and layouts depending on user role (admin, client)
    return (
        <Routes>
            <Route path="/" element={<PagesLayout/>}>
                <Route path="statistics">
                    <Route index element={<Navigate to="parking" replace/>}/>
                    <Route path="parking" element={<StatisticsParkingPage/>}/>
                    <Route path="places" element={<StatisticsPlacesPage/>}/>
                </Route>

                <Route path="dashboard" element={<DashboardPage/>}/>
                <Route path="clients" element={<ClientsPage/>}/>
                <Route path="events" element={<EventsPage/>}/>
                <Route path="prices" element={<PricesPage/>}/>

                <Route path="settings" element={<SettingsPage/>}/>
            </Route>
        </Routes>
    );
};

export default AppRoutes;