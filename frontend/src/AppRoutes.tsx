import {Routes, Route} from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from '@pages/DashboardPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout/>}>
                <Route index element={<DashboardPage/>}/>
            </Route>
        </Routes>
    );
};

export default AppRoutes;