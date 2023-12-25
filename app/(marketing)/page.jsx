import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full bg-dark">
      <div className="max-w-4xl mx-auto px-4 text-center pt-24 mb-12">
        <h1 className="text-white text-5xl leading-snug font-display font-bold mb-4">Take Control of Your <span className="text-primary">Finances</span>, Empower Your <span className="text-primary">Future</span></h1>
        <p className="text-white/70 text-lg tracking-wide leading-relaxed">Are you tired of complicated finance apps that treat your personal data as just another commodity? Welcome to MoneySavvy, where your financial journey is all about you. Say hello to the decentralized revolution!</p>
      </div>

      <div className="relative aspect-[2/1] w-2/3 md:w-1/3 mx-auto">
        <Image src="/img/illustration.webp" alt="Illustration" fill />
      </div>
    </div>
  );
}
