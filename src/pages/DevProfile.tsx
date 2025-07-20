
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ExternalLink, Code, Database, Smartphone } from "lucide-react";

const DevProfile = () => {
  const skills = [
    "React", "TypeScript", "Node.js", "Python", "MongoDB", "PostgreSQL",
    "Tailwind CSS", "Express.js", "Next.js", "Docker", "AWS", "Git"
  ];

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with payment integration and admin dashboard",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "#"
    },
    {
      title: "Restaurant Management System",
      description: "Complete restaurant management with POS, inventory, and customer management",
      tech: ["React", "Express.js", "PostgreSQL", "Socket.io"],
      link: "#"
    },
    {
      title: "Social Media App",
      description: "Real-time social media platform with chat functionality",
      tech: ["React Native", "Firebase", "Redux", "WebRTC"],
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen py-16">
      {/* Hero Section */}
      <section className="px-4 mb-16">
        <div className="container mx-auto text-center">
          <h1 className="font-great-vibes text-6xl font-bold text-royal-gold mb-6">
            Developer Profile
          </h1>
          <p className="font-playfair text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Meet the developer behind Dine 24's digital experience
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="card-royal lg:col-span-1">
            <CardHeader className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-royal-gradient rounded-full flex items-center justify-center">
                <Code className="h-16 w-16 text-black" />
              </div>
              <CardTitle className="text-royal-subtitle">Bhavya Reddy Mamidala</CardTitle>
              <p className="text-muted-foreground">Full Stack Developer</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="icon" className="royal-border">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="royal-border">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="royal-border">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  bhavyareddy.mamidala@gmail.com
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-royal lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-royal-subtitle">About Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Passionate full-stack developer with expertise in modern web technologies and 
                a keen eye for user experience design. I specialize in creating robust, 
                scalable applications that solve real-world problems.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Dine 24 project showcases my ability to combine elegant frontend design 
                with powerful backend functionality, creating a seamless digital experience 
                for restaurant management and customer engagement.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <Code className="h-8 w-8 text-royal-gold mx-auto mb-2" />
                  <h4 className="font-semibold">Frontend</h4>
                  <p className="text-sm text-muted-foreground">React, TypeScript, Tailwind</p>
                </div>
                <div className="text-center">
                  <Database className="h-8 w-8 text-royal-gold mx-auto mb-2" />
                  <h4 className="font-semibold">Backend</h4>
                  <p className="text-sm text-muted-foreground">Node.js, Python, Databases</p>
                </div>
                <div className="text-center">
                  <Smartphone className="h-8 w-8 text-royal-gold mx-auto mb-2" />
                  <h4 className="font-semibold">Mobile</h4>
                  <p className="text-sm text-muted-foreground">React Native, Flutter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Section */}
        <Card className="card-royal mb-16">
          <CardHeader>
            <CardTitle className="text-royal-subtitle">Technical Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="border-royal-gold text-royal-gold">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <div className="mb-16">
          <h2 className="text-royal-title text-center mb-12">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="card-royal hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-royal-subtitle">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((tech, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full royal-border">
                    View Project <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <Card className="card-royal text-center">
          <CardHeader>
            <CardTitle className="text-royal-subtitle">Let's Work Together</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Interested in collaborating on a project or need a custom web application? 
              I'd love to hear about your ideas and help bring them to life.
            </p>
            <Button className="btn-royal">
              Get In Touch <Mail className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevProfile;
