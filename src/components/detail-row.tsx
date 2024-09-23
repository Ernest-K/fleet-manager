import { LucideIcon } from "lucide-react";

type DetailRowProps = {
  Icon?: LucideIcon;
  label: string;
  value?: string;
};

const DetailRow = ({ Icon, label, value }: DetailRowProps) => (
  <div className="flex gap-6 items-center">
    {Icon && <Icon className="w-4 h-4 md:w-6 md:h-6 text-muted-foreground flex-shrink-0" />}
    <div>
      <p className="text-sm text-muted-foreground capitalize">{label}</p>
      {value ? <p className="md:text-lg">{value}</p> : <p className="md:text-lg">n/a</p>}
    </div>
  </div>
);

export default DetailRow;
