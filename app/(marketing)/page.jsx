import { CircleUser, Cpu, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="w-full bg-dark overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center pt-24 mb-12">
          <h1 className="text-white text-3xl md:text-5xl leading-snug md:leading-snug font-display font-bold mb-4">
            Take Control of Your <span className="text-primary">Finances</span>, Empower Your <span className="text-primary">Future</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg tracking-wide leading-relaxed">
            Are you tired of complicated finance apps that treat your personal data as just another commodity? Welcome to MoneySavvy, where your financial
            journey is all about you. Say hello to the decentralized revolution!
          </p>
        </div>

        <div className="relative aspect-[2/1] w-2/3 md:w-1/3 mx-auto animate-updown">
          <Image src="/img/illustration.webp" alt="Illustration" fill />
        </div>
      </div>

      <div className="container px-4 my-24">
        <h2 className="font-bold font-display text-3xl text-center mb-12 text-dark">Why Choose MoneySavvy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="w-12 h-12 flex items-center justify-center bg-primary-100 text-dark rounded-xl mb-3">
              <Cpu />
            </div>
            <h4 className="font-bold text-lg mb-2">Advanced Features</h4>
            <p className="text-gray-600">Redefining financial management with advanced features, MoneySavvy effortlessly guides you to financial wisdom.</p>
          </div>
          <div>
            <div className="w-12 h-12 flex items-center justify-center bg-primary-100 text-dark rounded-xl mb-3">
              <CircleUser />
            </div>
            <h4 className="font-bold text-lg mb-2">User-Centric Design</h4>
            <p className="text-gray-600">Goodbye rigid systems. MoneySavvy adapts to your preferences, putting you in control of your financial journey.</p>
          </div>
          <div>
            <div className="w-12 h-12 flex items-center justify-center bg-primary-100 text-dark rounded-xl mb-3">
              <ShieldCheck />
            </div>
            <h4 className="font-bold text-lg mb-2">Privacy, Redefined</h4>
            <p className="text-gray-600">
              MoneySavvy ensures privacy with cutting-edge web5 technology. Your financial sanctuary, fortified for peace of mind.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
