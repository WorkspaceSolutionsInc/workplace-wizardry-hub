
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  content: string;
}

export const InfoTooltip = ({ content }: InfoTooltipProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        className="p-0 h-auto hover:bg-transparent text-[#474a4f]/60 hover:text-[#474a4f]"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent 
      className="max-w-[300px] text-sm bg-white text-[#474a4f] border border-[#474a4f]/10 p-3 shadow-lg"
    >
      {content}
    </TooltipContent>
  </Tooltip>
);
