import { FC } from "react";
import { Button } from "./button";

type NavbarButtonProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    title: string;
    onClick?: () => void;
  };

export const NavbarButton: FC<NavbarButtonProps> = ({ icon: Icon, title, onClick }) => {
    return (
      <Button
        variant="ghost" // Use the `ghost` variant for minimal styling
        className="flex flex-col items-center w-full text-white hover:bg-blue-60 hover:text-blue-300 h-[55px]"
        onClick={onClick}
            >
        <Icon className="w-20 h-20" />
        <span className="text-xs mt-1">{title}</span>
      </Button>
    );
  };