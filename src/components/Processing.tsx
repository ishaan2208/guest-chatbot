"use client";

import { AiOutlineLoading } from "react-icons/ai";

export default function Processing() {
  return (
    <div className=" flex space-x-2 justify-center items-center w-full">
      <AiOutlineLoading className=" animate-spin h-5 w-5 mr-3 " />
      {/* <svg className="animate-spin h-5 w-5 mr-3 " viewBox="0 0 24 24"></svg> */}
      Processing...
      {/* <div className=" flex space-x-1">
        <span className=" animate-bounce">.</span>
        <span className=" animate-bounce">.</span>
        <span className=" animate-bounce">.</span>
      </div> */}
    </div>
  );
}
