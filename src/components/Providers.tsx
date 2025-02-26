"use client";

import { ReactNode } from "react";
import { Toaster as Sooner } from "sonner";
import { Toaster } from "./ui/toaster";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Sooner position="top-center" />
      <Toaster />

      {children}
    </>
  );
};
