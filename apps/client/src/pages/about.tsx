import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { CheckCircle, Mail, Users, BarChart, Clock } from "lucide-react"

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Newsletter Hub</h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're on a mission to empower creators and businesses to connect with their audience through high-quality,
              engaging newsletters.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                Newsletter Hub is a comprehensive platform designed to streamline the creation, management, and
                distribution of newsletters and articles. We believe in empowering writers, creators, and businesses to
                connect with their audience through high-quality, engaging content.
              </p>
              <p className="text-lg mb-6 text-muted-foreground">
                Our goal is to provide the tools and resources needed to create professional newsletters without the
                technical hassle, allowing you to focus on what matters most - your content.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold mb-1">Simplify Newsletter Creation</h3>
                    <p className="text-muted-foreground">
                      Make it easy for anyone to create beautiful, engaging newsletters
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold mb-1">Empower Content Creators</h3>
                    <p className="text-muted-foreground">
                      Give creators the tools they need to reach and grow their audience
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold mb-1">Foster Meaningful Connections</h3>
                    <p className="text-muted-foreground">
                      Help businesses and creators build lasting relationships with their subscribers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <Mail className="text-primary mb-4" size={28} />
              <h3 className="text-xl font-semibold mb-2">Newsletter Creation</h3>
              <p className="text-muted-foreground">Easy-to-use tools for creating beautiful, responsive newsletters</p>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm">
              <Users className="text-primary mb-4" size={28} />
              <h3 className="text-xl font-semibold mb-2">Subscriber Management</h3>
              <p className="text-muted-foreground">Organize and manage your subscribers with powerful tools</p>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm">
              <BarChart className="text-primary mb-4" size={28} />
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-muted-foreground">Track performance and engagement with detailed analytics</p>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm">
              <Clock className="text-primary mb-4" size={28} />
              <h3 className="text-xl font-semibold mb-2">Scheduling</h3>
              <p className="text-muted-foreground">Schedule and automate your newsletter delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-white rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Whether you're a solo creator, a small business, or a large organization, Newsletter Hub has the tools you
              need to create engaging newsletters that resonate with your audience.
            </p>
            <Link to="/auth/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

