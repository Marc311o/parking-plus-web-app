import { Button } from "@mui/material";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
};

export function ButtonPurple({
                                 children,
                                 onClick,
                                 type = "button",
                                 disabled = false,
                             }: Props) {
    return (
        <Button
            type={type}
            onClick={onClick}
            disabled={disabled}
            variant="contained"
            sx={{
                color: "#f3f4f6",
                background: "linear-gradient(135deg, #c22bdd, #8b1f9e)",
                border: "none",
                "&:hover": {
                    color: "#c22bdd",
                    background: "#ffffff",
                    border: "3px solid #c22bdd",
                },
            }}
        >
            {children}
        </Button>
    );
}

export default ButtonPurple;