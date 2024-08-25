import React, { ButtonHTMLAttributes, ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

type LoadingButtonProps = ComponentProps<"button"> & {
  label: string;
  loadingLabel?: string;
  isLoading: boolean;
  className?: string;
};

function LoadingButton({ label, loadingLabel, isLoading, className, ...buttonProps }: LoadingButtonProps) {
  return (
    <Button className={className} {...buttonProps}>
      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading && loadingLabel ? loadingLabel : label}
    </Button>
  );
}

export default LoadingButton;
