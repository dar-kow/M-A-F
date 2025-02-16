import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

const Button: React.FC<ButtonProps> = ({ label, ...rest }) => {
  return <button {...rest}>{label}</button>;
};

export default React.memo(Button);
