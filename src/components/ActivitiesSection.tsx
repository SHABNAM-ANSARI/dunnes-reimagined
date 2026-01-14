import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Monitor, 
  Music, 
  Palette, 
  BookOpen, 
  Trophy, 
  HeartHandshake,
  ArrowRight 
} from "lucide-react";

const activities = [
  {
    icon: Monitor,
    title: "Computer Training",
    description: "State-of-the-art Computer Lab with Wi-Fi, Apple iPads for personalized learning, and Audio-Visual aids in all classrooms.",
  },
  {
    icon: Music,
    title: "Music Classes",
    description: "Training in Classical and Western music with Piano, Keyboard, Tabla, Sitar, Harmonium, and Guitar.",
  },
  {
    icon: Palette,
    title: "Co-curricular Activities",
    description: "Elocution, Drama, Dance, Painting, Drawing, Creative writing, and Projects for holistic development.",
  },
  {
    icon: BookOpen,
    title: "Library & Reading",
    description: "Well-equipped Library with Fiction, Drama, Prose, Poetry, and educational books with a dedicated reading room.",
  },
  {
    icon: Trophy,
    title: "Sports & Athletics",
    description: "Various sports activities with annual Sports Day featuring Athletic events, field events, and March past.",
  },
  {
    icon: HeartHandshake,
    title: "Community Service",
    description: "Students actively participate in community work and support charitable causes for Cancer and Leprosy patients.",
  },
];

export function ActivitiesSection() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            Beyond Academics
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            School Activities & Facilities
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The School offers a variety of co-curricular activities for an all-round development 
            of a child's personality to face life's challenges better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activities.map((activity, index) => (
            <Card 
              key={activity.title} 
              className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-secondary/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <activity.icon className="h-7 w-7 text-primary group-hover:text-secondary transition-colors" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {activity.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/activities">
              View All Activities
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
