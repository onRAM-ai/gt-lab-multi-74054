
import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface PortfolioProps {
  language: 'en' | 'es';
}

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
  media_type: string;
}

const Portfolio: React.FC<PortfolioProps> = ({ language }) => {
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState('');

  const content = {
    en: {
      title: 'Our Portfolio',
      subtitle: 'See our creative promotional solutions in action - Latest from @kreativetheory',
      viewProject: 'View on Instagram',
      enterToken: 'Enter Instagram Access Token',
      loadPosts: 'Load Posts',
      tokenPlaceholder: 'Paste your Instagram Basic Display API token here...',
      tokenHelper: 'Get your token from developers.facebook.com/apps',
    },
    es: {
      title: 'Nuestro Portafolio',
      subtitle: 'Ve nuestras soluciones promocionales creativas en acción - Últimos de @kreativetheory',
      viewProject: 'Ver en Instagram',
      enterToken: 'Ingresa Token de Instagram',
      loadPosts: 'Cargar Posts',
      tokenPlaceholder: 'Pega tu token de Instagram Basic Display API aquí...',
      tokenHelper: 'Obtén tu token desde developers.facebook.com/apps',
    }
  };

  const fetchInstagramPosts = async () => {
    if (!accessToken) return;
    
    setIsLoading(true);
    try {
      console.log('Fetching Instagram posts...');
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,media_url,permalink,caption,media_type&limit=6&access_token=${accessToken}`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('Instagram posts fetched:', data);
        setInstagramPosts(data.data || []);
      } else {
        console.error('Error fetching Instagram posts:', response.status);
        // Fallback para posts mock em caso de erro
        setInstagramPosts(mockPosts);
      }
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      // Fallback para posts mock em caso de erro
      setInstagramPosts(mockPosts);
    } finally {
      setIsLoading(false);
    }
  };

  // Posts mock como fallback
  const mockPosts: InstagramPost[] = [
    {
      id: '1',
      media_url: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=500',
      permalink: 'https://instagram.com/kreativetheory',
      caption: 'Corporate Event Package - Complete branded package for annual corporate events',
      media_type: 'IMAGE'
    },
    {
      id: '2',
      media_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      permalink: 'https://instagram.com/kreativetheory',
      caption: 'Startup Branding Kit - Modern promotional items for tech startups',
      media_type: 'IMAGE'
    },
    {
      id: '3',
      media_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500',
      permalink: 'https://instagram.com/kreativetheory',
      caption: 'Trade Show Giveaways - Eye-catching promotional items',
      media_type: 'IMAGE'
    },
    {
      id: '4',
      media_url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=500',
      permalink: 'https://instagram.com/kreativetheory',
      caption: 'Employee Recognition Awards - Custom trophies and plaques',
      media_type: 'IMAGE'
    },
    {
      id: '5',
      media_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
      permalink: 'https://instagram.com/kreativetheory',
      caption: 'Restaurant Branded Merchandise - Complete staff uniform line',
      media_type: 'IMAGE'
    },
    {
      id: '6',
      media_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
      permalink: 'https://instagram.com/kreativetheory',
      caption: 'Health & Wellness Campaign - Eco-friendly water bottles',
      media_type: 'IMAGE'
    }
  ];

  useEffect(() => {
    // Carregar token do localStorage se existir
    const savedToken = localStorage.getItem('instagram_token');
    if (savedToken) {
      setAccessToken(savedToken);
    } else {
      // Se não há token, usar posts mock
      setInstagramPosts(mockPosts);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchInstagramPosts();
    }
  }, [accessToken]);

  const handleTokenSubmit = () => {
    if (accessToken) {
      localStorage.setItem('instagram_token', accessToken);
      fetchInstagramPosts();
    }
  };

  const postsToShow = instagramPosts.length > 0 ? instagramPosts : mockPosts;

  return (
    <section id="portfolio" className="relative py-32 overflow-hidden">
      {/* Dynamic orange gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400"></div>
      
      {/* Animated flowing elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-48 -right-48 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/3 right-1/5 w-64 h-64 bg-orange-300/15 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-1/5 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse delay-1200"></div>
      </div>

      {/* Dynamic lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-6 animate-slide-right"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/30 to-transparent transform -rotate-6 animate-slide-left"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            <span className="block">{content[language].title.split(' ').slice(0, 1).join(' ')}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-100">
              {content[language].title.split(' ').slice(1).join(' ')}
            </span>
          </h2>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed mb-8">
            {content[language].subtitle}
          </p>

          {/* Token Input Section */}
          {!localStorage.getItem('instagram_token') && (
            <div className="max-w-md mx-auto mb-8 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <h3 className="text-white text-lg font-semibold mb-4">{content[language].enterToken}</h3>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder={content[language].tokenPlaceholder}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 mb-3"
              />
              <p className="text-orange-100 text-sm mb-4">{content[language].tokenHelper}</p>
              <button
                onClick={handleTokenSubmit}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:from-yellow-300 hover:to-orange-300 transition-all duration-300"
              >
                {content[language].loadPosts}
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center mb-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Loading Instagram posts...</p>
          </div>
        )}

        {/* Enhanced Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {postsToShow.slice(0, 6).map((post, index) => (
            <div
              key={post.id}
              className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden hover:shadow-orange-500/25 transition-all duration-500 transform hover:-translate-y-6 border border-white/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image container with overlay effects */}
              <div className="relative overflow-hidden">
                <img
                  src={post.media_url}
                  alt={post.caption || 'Instagram post'}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating action button */}
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 shadow-lg hover:bg-white"
                >
                  <ExternalLink className="w-5 h-5 text-gray-700" />
                </a>

                {/* Instagram badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm rounded-full px-4 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-4 group-hover:translate-y-0">
                  <span className="text-white text-sm font-bold">@kreativetheory</span>
                </div>
              </div>

              {/* Content section */}
              <div className="p-8 relative">
                <p className="text-orange-100 leading-relaxed group-hover:text-white transition-colors duration-300 line-clamp-3">
                  {post.caption || `${content[language].viewProject} - Creative promotional solution`}
                </p>

                {/* View button */}
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 text-yellow-300 hover:text-white transition-colors duration-300 font-semibold"
                >
                  {content[language].viewProject}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>

                {/* Animated bottom accent */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-yellow-300 to-orange-300 group-hover:w-full transition-all duration-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
