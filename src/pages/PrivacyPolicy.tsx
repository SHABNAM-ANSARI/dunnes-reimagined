import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-secondary" />
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-primary-foreground/70 text-sm">Dunne's Institute Parent Portal</p>
            <p className="text-primary-foreground/60 text-xs mt-2">Last Updated: March 2026</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
          <p className="text-muted-foreground mb-8 leading-relaxed">
            At Dunne's Institute, we prioritize the privacy of our students and parents. This Privacy Policy outlines how we collect and safeguard your information within our school application.
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">1. Information Collection</h2>
              <p className="text-muted-foreground mb-3">We only collect essential student data required for academic purposes, such as:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Student Name and Roll Number.</li>
                <li>Academic Grades and Attendance Records.</li>
                <li>Teacher-Parent communication logs.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-3">The information is used solely to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Provide access to the Parent Portal.</li>
                <li>Generate automated academic results.</li>
                <li>Send school-related notices and assignments.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">3. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to ensure that your data is protected against unauthorized access. We do not sell or share student data with any third-party marketing agencies.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">4. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our application is designed for educational use by parents and guardians. We comply with all local regulations regarding the digital privacy of minors.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">5. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For any queries regarding your data, please contact the school administration at{" "}
                <a href="mailto:dunnesschool@gmail.com" className="text-primary hover:text-secondary transition-colors font-medium inline-flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  dunnesschool@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
