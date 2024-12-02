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
      <DropdownMenuTrigger>
        <Button className="bg-transparent border-none text-white px-2 py-1 text-xs rounded-md shadow transition  bg-gray-800 hover:bg-gray-600">
          <Languages size={12} />
          Translate
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-primary-100 text-white p-2 rounded-md shadow-md">
        <DropdownMenuItem>
          <Button
            onClick={() => onTranslate("es")}
            className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition bg-gray-800 hover:bg-gray-600"
          >
            Spanish
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onTranslate("ko")}>
          <Button
            onClick={() => onTranslate("ko")}
            className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition bg-gray-800 hover:bg-gray-600"
          >
            Korean
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onTranslate("tr")}>
          <Button
            onClick={() => onTranslate("tr")}
            className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition bg-gray-800 hover:bg-gray-600"
          >
            Turkish
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
