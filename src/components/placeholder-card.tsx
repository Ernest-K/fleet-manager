import { MoveUp } from "lucide-react";

type PlaceholderCardProps = {
  text: string;
};

const PlaceholderCard = ({ text }: PlaceholderCardProps) => (
  <div className="border-border border-[1px] rounded-lg flex flex-col gap-3 justify-center items-center min-h-96">
    <MoveUp className="h-10 w-10 text-muted-foreground animate-bounce" />
    <p className="text-muted-foreground">{text}</p>
  </div>
);

export default PlaceholderCard;
