import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Camera, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GalleryPhoto {
  id: string;
  title: string | null;
  description: string | null;
  url: string;
  created_at: string;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

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

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-pulse text-muted-foreground">Loading photos...</div>
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Photos coming soon. Stay tuned!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative aspect-[4/3] bg-muted rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title || "Gallery photo"}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Content */}
                    {photo.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <h3 className="font-heading text-xl font-bold mb-1">
                          {photo.title}
                        </h3>
                        {photo.description && (
                          <p className="text-sm text-primary-foreground/80">
                            {photo.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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

      {/* Photo Lightbox */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selectedPhoto && (
            <div className="relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title || "Gallery photo"}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              {selectedPhoto.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                  <h3 className="text-white font-heading text-xl font-bold">
                    {selectedPhoto.title}
                  </h3>
                  {selectedPhoto.description && (
                    <p className="text-white/80 text-sm mt-1">
                      {selectedPhoto.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;