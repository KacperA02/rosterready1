import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  CalendarDays,
  UserCheck,
  BarChart,
  Sparkles,
  BadgeCheck,
  Bell
} from "lucide-react";

const features = [
  {
    icon: <Sparkles className="text-primary shrink-0 mt-1" />,
    title: "AI-Powered Scheduling",
    description:
      "Build your ideal shift templates, then let the system auto-generate a schedule based on user availability and expertise.",
  },
  {
    icon: <UserCheck className="text-primary shrink-0 mt-1" />,
    title: "Availability Approval",
    description:
      "Users submit their availability, and the employer can approve or deny their shift requests—ensuring clear communication for everyone involved.",
  },
  {
    icon: <BadgeCheck className="text-primary shrink-0 mt-1" />,
    title: "Skill-Based Assignments",
    description:
      "Assign shifts only to qualified users. Each shift and user can have associated skill tags to ensure the right people are scheduled.",
  },
  {
    icon: <BarChart className="text-primary shrink-0 mt-1" />,
    title: "Insightful Reporting",
    description:
      "Export shift rosters and access statistics for attendance, fulfillment rates, and user participation.",
  },
  {
    icon: <CalendarDays className="text-primary shrink-0 mt-1" />,
    title: "Calendar Interface",
    description:
      "Easily view and manage shifts in a responsive calendar interface.",
  },
  {
	icon: <Bell className="text-primary shrink-0 mt-1" />, 
	title: "Real-Time Notifications",
	description:
	  "Be notified wherever you are about new availability, changes to your roster, and shift updates—keeping everyone in the loop in real-time.",
  },
];

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative">
      {!isAuthenticated && (
        <div className="fixed top-4 left-4 z-50 bg-zinc-300 rounded">
          <Button variant="default" size="lg" asChild className="text-black text-lg">
            <a href="/login">Login</a>
          </Button>
        </div>
      )}

      <div className="container mx-auto p-6 space-y-12">
        <section className="text-center space-y-4">
          <motion.h1
            className="text-4xl md:text-6xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Automate Your Schedule. Reclaim Your Time.
          </motion.h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Say goodbye to back-and-forth emails. Let our smart scheduling assistant find the best times—fast.
          </p>
          {!isAuthenticated && (
            <Button variant="default" className="mt-4" asChild>
              <a href="/login">Free To Use! Want to see it in action?</a>
            </Button>
          )}
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">🚀 Some of its exciting features</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out transform">
                  <CardContent className="p-6 flex gap-4 items-start text-lg">
                    {feature.icon}
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">💡 Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 text-lg">
                  Our solution is simple yet powerful, integrating with existing tools and providing real-time reporting.
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-lg">
                  No more manual scheduling! Let AI handle the heavy lifting, ensuring shifts are optimized for your team.
                </CardContent>
              </Card>
            </div>
          </section>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">📽️ Walkthrough Video</h3>
              <div className="aspect-video p-0 overflow-hidden rounded-xl">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/"
                  title="Product Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          <section className="text-center mt-12">
            <h3 className="text-3xl font-semibold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-6 text-muted-foreground">
              Join thousands of companies using our scheduling tool. Get started today and see the difference!
            </p>
            <Button variant="default" size="lg" asChild>
              <a href="/login">Start Your Free Trial</a>
            </Button>
          </section>
        </section>
      </div>
    </div>
  );
};

export default Home;
