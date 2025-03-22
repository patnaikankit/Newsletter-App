"use client"

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useAuth } from "../hooks/useAuth";
import { useNewsletter } from "../hooks/useNewsletter";
import { LoadingSpinner } from "../components/loading-spinner";
import { ArrowRight, Mail, Users, Zap, BookOpen, Sparkles } from "lucide-react";

interface Newsletter {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  authorName: string;
}

export default function Home() {
  const { user } = useAuth();
  const { getNewsletters } = useNewsletter();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const data = await getNewsletters();
        setNewsletters(data);
      } catch (error) {
        console.error("Failed to fetch newsletters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, [getNewsletters]);

  return (
    <div>
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold">Create Newsletters That Connect</h1>
        <p className="text-lg text-gray-600 mt-4">
          The all-in-one platform for creating, managing, and distributing newsletters.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          {user ? (
            <Link to="/newsletter/create">
              <Button>Create Your Newsletter</Button>
            </Link>
          ) : (
            <Link to="/auth/signup">
              <Button>Get Started for Free</Button>
            </Link>
          )}
          <Link to="/about">
            <Button variant="outline">Learn More</Button>
          </Link>
        </div>
      </section>

      <section className="py-20 bg-gray-100 dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Why Choose Newsletter Hub?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { icon: Mail, title: "Easy Creation", desc: "Create newsletters easily." },
            { icon: Users, title: "Subscriber Management", desc: "Manage your audience." },
            { icon: Zap, title: "Automated Delivery", desc: "Schedule and send newsletters." },
            { icon: BookOpen, title: "Rich Content", desc: "Engage with rich media." },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg"
            >
              <feature.icon className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold mt-4 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-6">Featured Newsletters</h2>
        {loading ? (
          <LoadingSpinner />
        ) : newsletters.length === 0 ? (
          <div className="text-center text-gray-600">No newsletters available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsletters.map((newsletter) => (
              <Card key={newsletter.id} className="p-6">
                <h3 className="text-xl font-semibold">{newsletter.title}</h3>
                <p className="text-gray-600 mt-2 line-clamp-2">{newsletter.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">By {newsletter.authorName}</span>
                  <Link to={`/newsletter/${newsletter.id}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
