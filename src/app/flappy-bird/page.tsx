"use client";
import { NextPage } from "next";
import { useEffect, useCallback, useState } from "react";
import Phaser, { Game, Scenes, Types } from "phaser";
import GameScenes from "@/components/scenes/flappy-bird/gamescene";
import BootScene from "@/components/scenes/flappy-bird/bootscene";
import MainMenuScene from "@/components/scenes/flappy-bird/mainmenuscene";

const GamePage: NextPage = () => {
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    const config: Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: "gamecontainer",
      width: 390,
      height: 600,
      scene: [BootScene, MainMenuScene, GameScenes],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
        },
      },
      backgroundColor: "#98d687",
      render: { pixelArt: true, antialias: true },
    };
    if (!game) {
      const game = new Game(config);
      setGame(game);
    }
  }, []);

  return <div id="gamecontainer" key="gamecontainer"></div>;
};

export default GamePage;
