import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Monitor, 
  Music, 
  Palette, 
  BookOpen, 
  Trophy, 
  HeartHandshake,
  Wifi,
  Laptop,
  GraduationCap
} from "lucide-react";

const activities = [
  {
    icon: Monitor,
    title: "In-house Computer Training",
    description: "The school possesses state-of-the-art Computer Lab with round the clock Wi-Fi internet Browsing/Surfing facility in the entire school premises.",
    features: [
      "Wi-Fi enabled campus",
      "Apple iPads for personalized learning",
      "Audio-Visual aids in all classrooms",
      "Modern computer laboratory"
    ]
  },
  {
    icon: Music,
    title: "In-house Music Classes",
    description: "The school is equipped with musical instruments. Training in Classical and Western music is an integral part of the curriculum.",
    features: [
      "Piano & Keyboard",
      "Tabla (Percussion)",
      "Sitar & Harmonium",
      "Guitar classes"
    ]
  },
  {
    icon: Palette,
    title: "Co-curricular Activities",
    description: "Students regularly participate in various creative activities for holistic development.",
    features: [
      "Elocution & Drama",
      "Dance performances",
      "Painting & Drawing",
      "Creative writing & Projects"
    ]
  },
  {
    icon: BookOpen,
    title: "Library & Reading Room",
    description: "The school has a well-equipped Library with a dedicated reading room to encourage a love for reading.",
    features: [
      "Fiction & Drama",
      "Prose & Poetry",
      "Educational books",
      "General knowledge resources"
    ]
  },
  {
    icon: Trophy,
    title: "Sports & Athletics",
    description: "We believe that a healthy mind lives in a healthy body. All students are encouraged to participate in sports.",
    features: [
      "Various sports activities",
      "Annual Sports Day",
      "Athletic events",
      "March past competitions"
    ]
  },
  {
    icon: HeartHandshake,
    title: "Community Service",
    description: "Students actively participate in community work, improving the quality of life for people in the vicinity.",
    features: [
      "Community outreach programs",
      "Support for Cancer patients",
      "Support for Leprosy patients",
      "Charity initiatives"
    ]
  }
];

const Activities = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              School Activities
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Beyond academics - nurturing well-rounded individuals through diverse activities
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-12 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-muted-foreground">
                The School offers a variety of co-curricular activities for an all-round development 
                of a child's personality to face life's challenges better.
              </p>
            </div>
          </div>
        </section>

        {/* Activities Grid */}
        <section className="py-16 md:py-24 bg-gradient-section">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activities.map((activity) => (
                <Card key={activity.title} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-primary p-6 md:p-8 md:w-1/3 flex items-center justify-center">
                        <activity.icon className="h-16 w-16 text-secondary" />
                      </div>
                      <div className="p-6 md:p-8 md:w-2/3">
                        <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                          {activity.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {activity.description}
                        </p>
                        <ul className="grid grid-cols-2 gap-2">
                          {activity.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities Highlight */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
                Modern Facilities
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                State-of-the-Art Infrastructure
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Wifi className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">Wi-Fi Campus</h3>
                <p className="text-sm text-muted-foreground">
                  Round the clock internet facility throughout the school premises
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Laptop className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">Smart Classrooms</h3>
                <p className="text-sm text-muted-foreground">
                  Audio-Visual aids available in all classrooms for interactive learning
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">Qualified Staff</h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated and well-qualified teaching staff committed to excellence
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Activities;
