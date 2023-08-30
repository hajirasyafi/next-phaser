"use client";
import { NextPage } from "next";
import dynamic from "next/dynamic";

const DynamicGameComponent = dynamic(
  () => import("@/components/gamescomponents/knightgamecomponent"),
  {
    ssr: false,
    loading: () => <></>,
  }
);

const KnightPage: NextPage = () => {
  return <DynamicGameComponent />;
};

export default KnightPage;
