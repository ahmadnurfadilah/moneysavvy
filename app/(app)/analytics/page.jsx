"use client";

import Image from "next/image";

export default function Page() {
  return (
    <>
      <div className="w-full bg-dark h-16 flex items-start mb-5">
        <div className="container px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-white text-xl font-bold">Analytics</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 text-center mt-20">
        <div className="relative w-1/2 md:w-1/3 mx-auto aspect-square">
          <Image src="/img/build.webp" alt="Build" fill />
        </div>
        <h2 className="font-bold text-2xl mt-4 mb-2">Coming Very Soon</h2>
        <p className="text-gray-500">We are preparing it for you in the near future</p>
      </div>
    </>
  );
}
