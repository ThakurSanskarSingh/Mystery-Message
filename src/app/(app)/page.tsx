'use client'
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { LockKeyhole, MessageSquare, Shield, LucideIcon } from 'lucide-react';
import messages from '@/messages.json'
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}


 


interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="p-6 rounded-lg bg-black/40 backdrop-blur-sm border border-[#00DF9A]/20 hover:border-[#00DF9A]/40 transition-all hover:transform hover:scale-105 duration-300">
    <Icon className="w-8 h-8 mb-4 text-[#00DF9A]" />
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-sm text-gray-300">{description}</p>
  </div>
);

// const messages = [
//   {
//     title: "Anonymous Appreciation",
//     content: "Thank you for making our workplace better every day!"
//   },
//   {
//     title: "Honest Feedback",
//     content: "Your innovative approach has transformed our team dynamics."
//   },
//   {
//     title: "Secret Message",
//     content: "Your kindness doesn't go unnoticed. Keep spreading positivity!"
//   }
// ];

const Page = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-16 space-y-6 mt-8">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-6xl font-bold text-[#00DF9A] animate-pulse">
              Mystery Message
            </h1>
            <div className="absolute -inset-1 bg-[#00DF9A]/20 blur-xl"></div>
          </div>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in">
            Where secrets find their voice and stories remain anonymous
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <FeatureCard 
              icon={LockKeyhole}
              title="100% Anonymous"
              description="Share your thoughts freely without revealing your identity"
            />
            <FeatureCard 
              icon={Shield}
              title="Secure & Private"
              description="Your messages are protected and completely confidential"
            />
            <FeatureCard 
              icon={MessageSquare}
              title="Express Freely"
              description="Send honest feedback, confessions, or appreciation"
            />
          </div>
        </section>

        <div className="w-full max-w-4xl mx-auto backdrop-blur-lg bg-black/40 p-8 rounded-2xl border border-[#00DF9A]/20">
          <h2 className="text-2xl font-semibold text-center mb-8 text-[#00DF9A]">
            Recent Mysteries
          </h2>
          <Carousel 
            plugins={[Autoplay({delay: 3000})]} 
            className="w-full max-w-md mx-auto"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <Card className="bg-black/60 border border-[#00DF9A]/20">
                    <CardHeader className="text-[#00DF9A] font-medium">
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-lg font-medium text-gray-200">
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-[#00DF9A]/10 hover:bg-[#00DF9A]/20 border-0 text-[#00DF9A]" />
            <CarouselNext className="bg-[#00DF9A]/10 hover:bg-[#00DF9A]/20 border-0 text-[#00DF9A]" />
          </Carousel>
        </div>
      </div>
    </main>
  );
};

export default Page;