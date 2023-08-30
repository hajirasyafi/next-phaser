"use client";
import { NextPage } from "next";
import dynamic from "next/dynamic";

const DynamicGameComponent = dynamic(
  () => import("@/components/gamescomponents/cutegirlgamecomponent"),
  {
    ssr: false,
    loading: () => <></>,
  }
);

const CuteGirlPage: NextPage = () => {
  return <DynamicGameComponent />;
};

export default CuteGirlPage;
