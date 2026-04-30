import { Button } from "@mui/material";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
};

export function ButtonWhite({
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
            variant="outlined"
            sx={{
                width: "200px",
                fontSize: "20px",
                color: "#8b1f9e",
                background: "#ffffff",
                border: "3px solid #8b1f9e",
                whiteSpace: "nowrap",
                "&:hover": {
                    color: "#ffffff",
                    background: "#c22bdd",
                    border: "3px solid #8b1f9e",
                },
            }}
        >
            {children}
        </Button>
    );
}

export default ButtonWhite;