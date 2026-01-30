import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnquiryForm } from "@/components/EnquiryForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
const Contact = () => {
  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-8">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                    Get in Touch
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Whether you have questions about admissions, curriculum, or anything else, 
                    our team is ready to answer all your questions.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                      <a href="tel:8527665593" className="text-muted-foreground hover:text-secondary transition-colors">+91 7020981168
                    </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <a href="mailto:dunnesschool@gmail.com" className="text-muted-foreground hover:text-secondary transition-colors">
                        dunnesschool@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Office Hours</h4>
                      <p className="text-muted-foreground">Monday - Saturday
8:00 AM - 4:00 PM<br />
                        8:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Campuses */}
                <div className="pt-6 border-t">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Our Campuses</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="font-semibold text-foreground text-sm">Primary & Secondary</h5>
                        <p className="text-xs text-muted-foreground">
                          Nathalal Parekh Marg, Admiralty House Wodehouse Road, Colaba Mumbai-400005
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="font-semibold text-foreground text-sm">Pre-Primary</h5>
                        <p className="text-xs text-muted-foreground">
                          K. R. Cama Oriental Institute Building, Opp. Lion Gate, Near Kala Ghoda, Mumbai - 400023
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enquiry Form */}
              <div className="lg:col-span-2">
                <div className="bg-muted/30 rounded-2xl p-8 md:p-10 border">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                    Send an Enquiry
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Fill out the form below and we'll get back to you shortly.
                  </p>
                  <EnquiryForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-gradient-section">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Find Us on the Map
              </h2>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border h-[400px]">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.1234567890123!2d72.8308!3d18.9167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1c73a0d5555%3A0x1234567890abcdef!2sColaba%2C%20Mumbai%2C%20Maharashtra%20400005!5e0!3m2!1sen!2sin!4v1234567890123" width="100%" height="100%" style={{
              border: 0
            }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Dunne's Institute Location" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default Contact;
