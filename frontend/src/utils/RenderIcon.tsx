import React from "react";

const renderIcon = (icon: string | undefined) => {
    return <img src={icon} alt="icon" style={{width: 20, height: 20}}/>;
};

export default renderIcon;