"use client";
import { NextPage } from "next";
import dynamic from "next/dynamic";

const DynamicGameComponent = dynamic(
  () => import("@/components/breakoutgamecomponent"),
  {
    ssr: false,
    loading: () => <></>,
  }
);

const BreakOutGamePage: NextPage = () => {
  return <DynamicGameComponent />;
};

export default BreakOutGamePage;
