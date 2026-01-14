import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, ArrowRight, Calendar } from "lucide-react";

export function AnnouncementBanner() {
  return (
    <section className="py-12 md:py-16 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden border">
          <div className="grid lg:grid-cols-2">
            {/* Announcement */}
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-secondary" />
                <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
                  Announcement
                </span>
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                Admissions Open for 2026-27
              </h3>
              <p className="text-muted-foreground mb-6">
                Admission open from 1st December 2025 for the academic year 2026-27 
                for Pre-Primary to Class IX. Join our family of learners and experience 
                education that nurtures excellence.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Calendar className="h-4 w-4" />
                <span>Applications now being accepted</span>
              </div>
              <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-gold">
                <Link to="/admissions">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Extra Curricular */}
            <div className="bg-primary p-8 md:p-12 text-primary-foreground">
              <h3 className="font-heading text-xl md:text-2xl font-bold mb-4">
                Extra Curricular Activities
              </h3>
              <p className="text-primary-foreground/80 mb-6">
                The School offers a variety of co-curricular activities for an all-round 
                development of a child's personality to face life's challenges better.
              </p>
              <ul className="space-y-3">
                {[
                  "In-house Computer & Music Training",
                  "Sports Day & Athletic Events",
                  "Drama, Dance & Elocution",
                  "Community Service Programs",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/activities">
                  Explore Activities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
