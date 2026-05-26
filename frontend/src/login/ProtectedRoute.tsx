import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";

type Props = {
    allowed: ("ADMIN" | "CLIENT")[];
};

export const ProtectedRoute = ({ allowed }: Props) => {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin = user?.isOperator === true;
    const role: "ADMIN" | "CLIENT" = isAdmin ? "ADMIN" : "CLIENT";

    if (!allowed.includes(role)) {
        const fallback = role === "CLIENT" ? "/parkingPurchase" : "/dashboard";
        return <Navigate to={fallback} replace />;
    }

    return <Outlet />;
};