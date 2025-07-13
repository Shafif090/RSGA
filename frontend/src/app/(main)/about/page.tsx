"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  Eye,
  Heart,
  Users,
  Trophy,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
} from "lucide-react";

const teamMembers = [
  {
    name: "Dracula bhai",
    role: "Moderator",
    bio: "Passionate about sports analytics and community building. Leading RSGA with vision and dedication.",
    avatar: "/placeholder.svg?height=120&width=120",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    name: "Mona Lisa bhai",
    role: "President",
    bio: "Strategic leader focused on expanding RSGA's reach and impact in the sports community.",
    avatar: "/placeholder.svg?height=120&width=120",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    name: "Alex Rahman",
    role: "Technical Director",
    bio: "Expert in sports technology and data analysis, driving innovation in athletic performance.",
    avatar: "/placeholder.svg?height=120&width=120",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    name: "Sarah Khan",
    role: "Community Manager",
    bio: "Building bridges between athletes, schools, and sports enthusiasts across the region.",
    avatar: "/placeholder.svg?height=120&width=120",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
];

const stats = [
  { label: "Active Schools", value: "50+", icon: Users },
  { label: "Student Athletes", value: "1000+", icon: Trophy },
  { label: "Events Hosted", value: "20+", icon: BarChart3 },
  { label: "Years of Excellence", value: "3+", icon: Target },
];

const achievements = [
  "Regional Sports Excellence Award 2023",
  "Best Digital Sports Platform 2022",
  "Community Impact Recognition 2021",
  "Innovation in Sports Analytics 2020",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#131314] text-white">
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-black bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent mb-6">
            ABOUT RSGA
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Regional Sports & Gaming Analytics is a pioneering platform
            dedicated to revolutionizing sports performance through data-driven
            insights and community engagement.
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-white">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                To empower athletes and sports communities through innovative
                analytics, fostering excellence and creating opportunities for
                growth in competitive sports.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-white">
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                To become the leading sports analytics platform in the region,
                connecting athletes, schools, and communities through
                data-driven insights.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-white">
                Our Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                Excellence, integrity, innovation, and community. We believe in
                fair play, continuous improvement, and building lasting
                relationships in sports.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10 mb-16">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Our Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-[#809bc8]">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {member.name}
                  </h3>
                  <Badge className="bg-gradient-to-r from-[#809bc8] to-[#a76fb8] text-white mb-3">
                    {member.role}
                  </Badge>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#809bc8] text-[#809bc8] hover:bg-[#809bc8] hover:text-white p-2 bg-transparent">
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#809bc8] text-[#809bc8] hover:bg-[#809bc8] hover:text-white p-2 bg-transparent">
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#809bc8] text-[#809bc8] hover:bg-[#809bc8] hover:text-white p-2 bg-transparent">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10 mb-16">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Our Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-full"></div>
                  <span className="text-gray-300">{achievement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Get In Touch
            </CardTitle>
            <p className="text-gray-300 text-center">
              {
                "Ready to join our community or have questions? We'd love to hear from you!"
              }
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Email Us</h3>
                <p className="text-gray-300">contact@rsga.com</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Call Us</h3>
                <p className="text-gray-300">+880-1234-567890</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Visit Us</h3>
                <p className="text-gray-300">Dhaka, Bangladesh</p>
              </div>
            </div>

            <div className="text-center">
              <Button className="bg-gradient-to-r from-[#809bc8] to-[#a76fb8] hover:from-[#7088b5] hover:to-[#9660a5] text-white px-8 py-3">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
