import React from "react";
import { MeteorsFx } from "./fx/meteorsFx";

interface CardProps {
  title: string;
  description: string;
}

export const Card: React.FC<CardProps> = ({ title, description }) => {
  return (
    <div className="relative shadow-xl bg-gray-900 border border-gray-600  px-4 py-8 overflow-hidden rounded-2xl flex flex-col justify-end items-start z-20">
      <h1 className="font-bold text-xl text-white mb-4 relative z-50">
        {title}
      </h1>

      <p className="font-normal text-base text-slate-400 mb-4 relative z-50">
        {description}
      </p>

      <button className="border px-4 py-1 rounded-lg  border-gray-500 text-gray-300">
        Explore
      </button>

      {/* edit meteors opaticy fron tailwind.config */}
      <MeteorsFx number={20} />
    </div>
  );
};
