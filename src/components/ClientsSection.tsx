import React from 'react';
import westgoldLogo from '../assets/clients/westgold-logo.png';
import northernStarLogo from '../assets/clients/northern-star-logo.png';
import evolutionMiningLogo from '../assets/clients/evolution-mining-logo.png';
import makoMiningLogo from '../assets/clients/mako-mining-logo.png';
import barmincoLogo from '../assets/clients/barminco-logo.png';
import vaultMineralsLogo from '../assets/clients/vault-minerals-logo.png';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';

const ClientsSection: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [isPaused, setIsPaused] = React.useState(false);

  const clients = [
    { name: 'Westgold', logo: westgoldLogo, url: 'https://www.westgold.com.au' },
    { name: 'Northern Star Resources', logo: northernStarLogo, url: 'https://www.nsrltd.com' },
    { name: 'Evolution Mining', logo: evolutionMiningLogo, url: 'https://www.evolutionmining.com.au' },
    { name: 'Mako Mining', logo: makoMiningLogo, url: 'https://www.makominingcorp.com' },
    { name: 'Barminco', logo: barmincoLogo, url: 'https://www.barminco.com.au' },
    { name: 'Vault Minerals', logo: vaultMineralsLogo, url: 'https://www.vaultminerals.com.au' }
  ];

  React.useEffect(() => {
    if (!api || isPaused) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [api, isPaused]);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
            Some of Our Clients
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by leading mining companies across the region
          </p>
        </div>
        
        <Carousel
          setApi={setApi}
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {clients.map((client, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <a 
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg h-32 group"
                >
                  <img 
                    src={client.logo} 
                    alt={`${client.name} logo`}
                    className="max-w-full h-auto max-h-16 object-contain transition-all duration-300 group-hover:scale-105"
                  />
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default ClientsSection;
