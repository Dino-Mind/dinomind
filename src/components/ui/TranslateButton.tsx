import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./button";
import { Languages } from "lucide-react";

type TranslateButtonProps = {
  onTranslate: (lang: string) => void;
};

export const TranslateButton: React.FC<TranslateButtonProps> = ({
  onTranslate,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent px-2 py-1 text-xs rounded-md shadow transition border border-primary-xPrimary hover:border-primary-xSecondary">
          <Languages size={12} />
          Translate
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-primary-xBackground text-white p-2 rounded-md shadow-md border-primary-xPrimary">
        <DropdownMenuItem asChild>
          <Button
            onClick={() => onTranslate("es")}
            className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition bg-primary-xBackgroundCard"
          >
            Spanish 🇪🇸
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            onClick={() => onTranslate("ko")}
            className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition bg-primary-xBackgroundCard"
          >
            japanese 🇯🇵
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            onClick={() => onTranslate("tr")}
            className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition bg-primary-xBackgroundCard"
          >
            Turkish 🇹🇷
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
