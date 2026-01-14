import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Camera } from "lucide-react";

const Gallery = () => {
  // Placeholder gallery items - can be expanded with actual school images
  const galleryCategories = [
    {
      title: "Campus Life",
      description: "Experience our vibrant school environment"
    },
    {
      title: "Sports Day",
      description: "Annual athletic events and celebrations"
    },
    {
      title: "Cultural Programs",
      description: "Drama, dance, and music performances"
    },
    {
      title: "Academic Events",
      description: "Science exhibitions and academic achievements"
    },
    {
      title: "Celebrations",
      description: "Festivals and special occasions"
    },
    {
      title: "Community Service",
      description: "Our students giving back to society"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Photo Gallery
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Glimpses of life at Dunne's Institute - where memories are made
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
                Our Moments
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Life at Dunne's Institute
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryCategories.map((category, index) => (
                <div 
                  key={category.title}
                  className="group relative aspect-[4/3] bg-muted rounded-xl overflow-hidden cursor-pointer"
                >
                  {/* Placeholder background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="h-16 w-16 text-primary/30" />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                    <h3 className="font-heading text-xl font-bold mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-primary-foreground/80">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="mt-12 text-center">
              <p className="text-muted-foreground text-sm">
                More photos coming soon. Stay tuned for updates!
              </p>
            </div>
          </div>
        </section>

        {/* Historical Note */}
        <section className="py-16 bg-gradient-section">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                Preserving Our Heritage
              </h2>
              <p className="text-muted-foreground">
                With over 75 years of history, Dunne's Institute has countless memories 
                captured through generations. Our gallery showcases the journey of academic 
                excellence and holistic development that defines our institution.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
