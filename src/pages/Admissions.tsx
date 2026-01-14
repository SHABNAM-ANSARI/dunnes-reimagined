import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  GraduationCap,
  BookOpen,
  Users
} from "lucide-react";

const admissionSteps = [
  {
    step: 1,
    title: "Submit Enquiry",
    description: "Fill out the enquiry form with your details and questions about admission."
  },
  {
    step: 2,
    title: "School Visit",
    description: "Schedule a visit to our campus to experience our facilities and environment."
  },
  {
    step: 3,
    title: "Application Form",
    description: "Collect and submit the admission application form with required documents."
  },
  {
    step: 4,
    title: "Interview & Assessment",
    description: "Attend the scheduled interview/assessment for your child."
  },
  {
    step: 5,
    title: "Confirmation",
    description: "Upon selection, complete the admission formalities and fee payment."
  }
];

const documents = [
  "Birth Certificate (Original & Copy)",
  "Aadhaar Card of Student",
  "Passport Size Photographs (4)",
  "Transfer Certificate (if applicable)",
  "Previous School Report Card",
  "Parent's ID Proof",
  "Address Proof",
  "Caste Certificate (if applicable)"
];

const Admissions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Admissions
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Begin your child's journey to excellence with Dunne's Institute
            </p>
          </div>
        </section>

        {/* Admission Open Banner */}
        <section className="py-12 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="bg-card rounded-xl p-8 shadow-lg border flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Calendar className="h-7 w-7 text-secondary" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    Admissions Open for 2026-27
                  </h3>
                  <p className="text-muted-foreground">
                    From 1st December 2025 for Pre-Primary to Class IX
                  </p>
                </div>
              </div>
              <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-gold">
                <Link to="/contact">
                  Enquire Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Classes Offered */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
                Our Programs
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Classes We Offer
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-heading">Pre-Primary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>Play Group</li>
                    <li>Nursery</li>
                    <li>Junior Kindergarten</li>
                    <li>Senior Kindergarten</li>
                  </ul>
                  <p className="mt-4 text-xs text-secondary font-semibold">
                    Kala Ghoda Campus
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="font-heading">Primary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>Standard 1</li>
                    <li>Standard 2</li>
                    <li>Standard 3</li>
                    <li>Standard 4 & 5</li>
                  </ul>
                  <p className="mt-4 text-xs text-secondary font-semibold">
                    Colaba Campus
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-heading">Secondary (ICSE)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>Standard 6 & 7</li>
                    <li>Standard 8</li>
                    <li>Standard 9</li>
                    <li>Standard 10 (ICSE Board)</li>
                  </ul>
                  <p className="mt-4 text-xs text-secondary font-semibold">
                    Colaba Campus
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Admission Process */}
        <section className="py-16 md:py-24 bg-gradient-section">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
                How to Apply
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Admission Process
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
                
                <div className="space-y-8">
                  {admissionSteps.map((step, index) => (
                    <div key={step.step} className="flex gap-6 items-start">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading text-xl font-bold flex-shrink-0 z-10">
                        {step.step}
                      </div>
                      <div className="bg-card rounded-xl p-6 shadow-md border flex-1">
                        <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Required Documents */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
                  Be Prepared
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Required Documents
                </h2>
                <p className="text-muted-foreground mb-8">
                  Please ensure you have the following documents ready for the admission process. 
                  Original documents are required for verification.
                </p>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/contact">
                    <FileText className="mr-2 h-4 w-4" />
                    Submit Enquiry
                  </Link>
                </Button>
              </div>

              <div className="bg-muted rounded-xl p-8">
                <ul className="space-y-4">
                  {documents.map((doc) => (
                    <li key={doc} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="text-foreground">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Admissions;
