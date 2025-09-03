
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen py-16">
      {/* Hero Section */}
      <section className="px-4 mb-16">
        <div className="container mx-auto text-center">
          <h1 className="font-great-vibes text-6xl font-bold text-royal-gold mb-6">
            Contact Us
          </h1>
          <p className="font-playfair text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you. Reach out for reservations, inquiries, or just to say hello.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="card-royal">
              <CardHeader>
                <CardTitle className="text-royal-subtitle flex items-center">
                  <MapPin className="h-6 w-6 text-royal-gold mr-2" />
                  Visit Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dine 24, Kothapet<br />
                  Hyderabad, Telangana<br />
                  India
                </p>
              </CardContent>
            </Card>

            <Card className="card-royal">
              <CardHeader>
                <CardTitle className="text-royal-subtitle flex items-center">
                  <Phone className="h-6 w-6 text-royal-gold mr-2" />
                  Call Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  +91 91333 35476<br />
                  Available 24/7 for reservations
                </p>
              </CardContent>
            </Card>

            <Card className="card-royal">
              <CardHeader>
                <CardTitle className="text-royal-subtitle flex items-center">
                  <Mail className="h-6 w-6 text-royal-gold mr-2" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  bhavyareddy.mamidala@gmail.com<br />
                  We'll get back to you within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card className="card-royal">
              <CardHeader>
                <CardTitle className="text-royal-subtitle flex items-center">
                  <Clock className="h-6 w-6 text-royal-gold mr-2" />
                  Opening Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>11:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday - Sunday</span>
                    <span>10:00 AM - 12:00 AM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="card-royal">
  <CardHeader>
    <CardTitle className="text-royal-subtitle">Send us a Message</CardTitle>
  </CardHeader>
  <CardContent>
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const subject = (form.elements.namedItem("subject") as HTMLInputElement).value;
        const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

        if (!name || !email || !subject || !message) {
          alert("⚠️ All fields are required.");
          return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
          alert("⚠️ Please enter a valid email address.");
          return;
        }

        alert("✅ Message sent successfully!");
        form.reset();
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input name="name" placeholder="Your Name" className="royal-border" required />
        <Input name="email" placeholder="Your Email" type="email" className="royal-border" required />
      </div>
      <Input name="subject" placeholder="Subject" className="royal-border" required />
      <Textarea
        name="message"
        placeholder="Your Message"
        className="royal-border min-h-32"
        rows={4}
        required
      />
      <Button type="submit" className="btn-royal w-full">
        Send Message <Send className="ml-2 h-4 w-4" />
      </Button>
    </form>
  </CardContent>
</Card>
       
        </div>
      </div>
    </div>
  );
};

export default Contact;
