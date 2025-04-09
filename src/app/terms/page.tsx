"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/dashboard/header";
import Footer from "@/components/dashboard/footer";
import Link from "next/link";

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", icon: "📋", title: "Overview", color: "blue" },
    { id: "acceptance", icon: "✅", title: "Acceptance", color: "green" },
    { id: "unofficial", icon: "🚩", title: "Unofficial Status", color: "red" },
    { id: "datasources", icon: "🔍", title: "Data Sources", color: "indigo" },
    { id: "disclaimer", icon: "⚠️", title: "Disclaimer", color: "yellow" },
    { id: "content", icon: "💬", title: "User Content", color: "pink" },
    { id: "privacy", icon: "🔒", title: "Privacy", color: "orange" },
    { id: "prohibited", icon: "⛔", title: "Prohibited Uses", color: "red" },
    { id: "modifications", icon: "📱", title: "Modifications", color: "cyan" },
    {
      id: "intellectual",
      icon: "©️",
      title: "Intellectual Property",
      color: "purple",
    },
    { id: "academic", icon: "🎓", title: "Academic Freedom", color: "green" },
    {
      id: "indemnification",
      icon: "🛡️",
      title: "Indemnification",
      color: "blue",
    },
    { id: "severability", icon: "⚖️", title: "Severability", color: "purple" },
    { id: "legal", icon: "⚖️", title: "Legal", color: "purple" },
    { id: "contact", icon: "📨", title: "Contact", color: "blue" },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      const currentSection = sections.find((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          return (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          );
        }
        return false;
      });

      if (currentSection && currentSection.id !== activeSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50 hidden lg:block">
        <div className="bg-black/60 backdrop-blur-md border border-border rounded-lg p-2 shadow-xl">
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex flex-col items-center justify-center w-10 h-10 rounded-md transition-all ${
                  activeSection === section.id
                    ? `bg-${section.color}-500/20 text-${section.color}-500`
                    : "hover:bg-secondary/30"
                }`}
                title={section.title}
              >
                <span>{section.icon}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[#ff4b66]/5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10 animate-gradient"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-1 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="text-sm bg-blue-500/20 px-4 py-1 rounded-full text-blue-500">
                User agreement and legal guidelines
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Please read these terms carefully before using NinerWatch. By
              accessing our service, you agree to be bound by these conditions.
            </p>
            <div className="flex flex-wrap gap-3 mt-8 justify-center">
              <Link href="/privacy">
                <Button
                  variant="outline"
                  className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20"
                >
                  Privacy Policy
                </Button>
              </Link>
              <Link href="/">
                <Button variant="secondary">Return to Dashboard</Button>
              </Link>
            </div>
            <div className="text-sm text-muted-foreground mt-8 inline-flex items-center">
              <span className="mr-2">Last Updated: April 8, 2025</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>
          </div>
        </div>
        <div className="absolute left-0 bottom-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="lg:hidden mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2 w-max">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap ${
                  activeSection === section.id
                    ? `bg-${section.color}-500/20 text-${section.color}-500`
                    : "bg-secondary/20 hover:bg-secondary/30"
                }`}
              >
                <span>{section.icon}</span>
                <span className="text-sm">{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div id="overview" className="mb-12 scroll-mt-24">
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/5"></div>
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/4 flex justify-center">
                  <div className="h-32 w-32 rounded-xl flex items-center justify-center text-5xl bg-blue-500/20 text-blue-500 shadow-lg">
                    📋
                  </div>
                </div>
                <div className="md:w-3/4 space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">
                    Overview
                  </h2>
                  <p className="text-lg">
                    Welcome to NinerWatch, an independently developed platform
                    designed to aggregate and display publicly available campus
                    safety incidents at UNC Charlotte. By accessing or using
                    NinerWatch, you agree to be bound by these Terms of Service.
                  </p>
                  <div className="flex items-center p-4 bg-gradient-to-r from-[#ff4b66]/10 to-[#ff4b66]/5 rounded-lg shadow-sm border border-[#ff4b66]/20">
                    <div className="text-2xl mr-4 text-[#ff4b66]">⚠️</div>
                    <p className="text-[#ff4b66]">
                      <strong>IMPORTANT:</strong> NinerWatch is not affiliated
                      with, endorsed by, sponsored by, or officially connected
                      to UNC Charlotte or any of its departments, offices, or
                      representatives. This is an independent project created by
                      a student developer exercising their right to academic
                      freedom and free speech.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="acceptance" className="mb-12 scroll-mt-24">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="sticky top-24 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-xl p-6 shadow-md backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center text-4xl text-green-500 mb-4">
                    ✅
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    Acceptance of Terms
                  </h2>
                  <p className="text-muted-foreground">
                    By using NinerWatch, you acknowledge and agree to these
                    terms and conditions.
                  </p>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="space-y-6">
                <div className="bg-black/20 p-6 rounded-xl backdrop-blur-sm">
                  <p className="mb-4">
                    By accessing or using NinerWatch, you acknowledge that you
                    have read, understood, and agree to be bound by these Terms
                    of Service. If you do not agree to these terms, you should
                    not use NinerWatch.
                  </p>
                  <div className="bg-gradient-to-r from-black/30 to-black/10 p-4 rounded-lg border border-green-500/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm font-medium">
                        Modifications to Terms
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We reserve the right to modify these terms at any time.
                      Changes will be effective immediately upon posting to the
                      website. Your continued use of NinerWatch after any
                      changes indicates your acceptance of the modified terms.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 p-5 rounded-xl border border-green-500/10 relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-full blur-xl"></div>
                    <h3 className="flex items-center gap-2 font-medium mb-2">
                      <div className="h-6 w-6 flex items-center justify-center rounded-full bg-green-500/20 text-green-500 text-xs">
                        1
                      </div>
                      Account Creation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      No account is required to use NinerWatch. All user
                      participation in discussions is anonymous.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 p-5 rounded-xl border border-green-500/10 relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-full blur-xl"></div>
                    <h3 className="flex items-center gap-2 font-medium mb-2">
                      <div className="h-6 w-6 flex items-center justify-center rounded-full bg-green-500/20 text-green-500 text-xs">
                        2
                      </div>
                      Eligibility
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You must be at least 13 years old to use NinerWatch. By
                      using the service, you confirm you meet this requirement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="unofficial" className="mb-12 scroll-mt-24">
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/5 blur-3xl"></div>
            <Card className="border-red-500/20 shadow-xl bg-black/20 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-red-500/10 to-transparent border-b border-red-500/10">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center text-2xl text-red-500 mr-4">
                    🚩
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      Unofficial Status Declaration
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Important information about the relationship between
                      NinerWatch and UNC Charlotte
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="h-28 w-28 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-4xl text-red-500">
                      📢
                    </div>
                  </div>
                  <div className="md:w-3/4 space-y-4">
                    <p>
                      NinerWatch is an independently developed project created
                      by a student developer exercising their constitutional
                      right to free speech and academic inquiry. It is designed
                      to present publicly available information about campus
                      safety in an accessible format for educational and
                      informational purposes.
                    </p>

                    <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20 font-medium">
                      <p className="text-red-500">
                        NinerWatch is not affiliated with, endorsed by,
                        sponsored by, or officially connected to the University
                        of North Carolina at Charlotte, its administration, any
                        of its departments, offices, or representatives. Any
                        references to UNC Charlotte or use of university-related
                        terms are made strictly for descriptive and
                        informational purposes and do not imply any official
                        relationship.
                      </p>
                    </div>

                    <p>
                      Any actions taken against the developer of NinerWatch or
                      against the service itself by the University for
                      aggregating, displaying, or commenting on publicly
                      available information would potentially constitute an
                      infringement upon the developer&apos;s established
                      constitutional rights to free speech, free expression, and
                      academic freedom.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="bg-black/30 p-3 rounded-lg flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm">
                          Protected academic expression
                        </span>
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm">
                          Personal, non-institutional project
                        </span>
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm">
                          No official university endorsement
                        </span>
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm">
                          Uses only publicly available data
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div id="datasources" className="mb-12 scroll-mt-24">
          <div className="rounded-xl overflow-hidden backdrop-blur-sm shadow-md">
            <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-600/5 px-6 py-4 border-b border-indigo-500/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-xl text-indigo-500">
                  🔍
                </div>
                <h2 className="text-2xl font-bold">Data Sources</h2>
              </div>
            </div>
            <div className="bg-black/20 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p>
                    NinerWatch aggregates information from publicly available
                    sources, primarily the UNC Charlotte Police
                    Department&apos;s published police logs and other public
                    domain information. We make reasonable efforts to ensure
                    that information is accurate, but we cannot guarantee the
                    accuracy, completeness, or timeliness of information
                    presented.
                  </p>
                  <div className="bg-gradient-to-r from-black/30 to-black/10 rounded-lg p-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs">
                          →
                        </div>
                        Official police logs and reports published online
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs">
                          →
                        </div>
                        Public campus safety announcements and notices
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs">
                          →
                        </div>
                        NinerAlerts and emergency notifications in the public
                        domain
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs">
                          →
                        </div>
                        Publicly available news articles and reports
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                    <div className="absolute -z-10 top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl"></div>
                    <h3 className="text-lg font-medium mb-2 text-indigo-500">
                      Information Processing
                    </h3>
                    <p className="text-sm">
                      Information is processed automatically from PDFs and other
                      public documents published by campus authorities. This
                      service does not access, use, or distribute any
                      privileged, private, confidential, or sensitive
                      information. All data processed by NinerWatch is already
                      in the public domain and freely accessible to any member
                      of the public.
                    </p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-indigo-500"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <h3 className="font-medium text-sm">
                        Legal Right to Access and Use
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The developer of NinerWatch has the legal right to access,
                      process, display, and comment on publicly available
                      information as protected by the First Amendment and
                      principles of academic freedom. No licensing, permission,
                      or authorization is required from the University to
                      utilize public information for educational or
                      informational purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="disclaimer" className="mb-12 scroll-mt-24">
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-yellow-500/5 blur-3xl"></div>
            <Card className="border-yellow-500/20 shadow-xl bg-black/20 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-transparent border-b border-yellow-500/10">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-2xl text-yellow-500 mr-4">
                    ⚠️
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      Important Disclaimer
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please read this section carefully
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="h-28 w-28 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-4xl text-yellow-500">
                      📢
                    </div>
                  </div>
                  <div className="md:w-3/4 space-y-4">
                    <p>
                      NinerWatch is provided &quot;as is&quot; without
                      warranties of any kind, either express or implied. We do
                      not warrant that the service will be uninterrupted or
                      error-free, that defects will be corrected, or that the
                      site or servers are free of viruses or other harmful
                      components.
                    </p>

                    <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                      <p className="font-medium text-yellow-500 mb-2">
                        NinerWatch is not an emergency service. For emergencies,
                        always call 911 or contact the UNC Charlotte Police
                        Department directly.
                      </p>
                      <p className="text-sm">
                        Information provided through NinerWatch should not be
                        relied upon for personal safety or security decisions.
                        Always verify information through official university
                        channels during emergency situations.
                      </p>
                    </div>

                    <p>
                      In no event shall NinerWatch, its developer, contributors,
                      or affiliates be liable for any direct, indirect,
                      incidental, special, or consequential damages arising out
                      of or in any way connected with:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="bg-black/30 p-3 rounded-lg flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line
                              x1="4.93"
                              y1="4.93"
                              x2="19.07"
                              y2="19.07"
                            ></line>
                          </svg>
                        </div>
                        <span className="text-sm">
                          Use of or inability to use this service
                        </span>
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line
                              x1="4.93"
                              y1="4.93"
                              x2="19.07"
                              y2="19.07"
                            ></line>
                          </svg>
                        </div>
                        <span className="text-sm">
                          Accuracy of information displayed
                        </span>
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line
                              x1="4.93"
                              y1="4.93"
                              x2="19.07"
                              y2="19.07"
                            ></line>
                          </svg>
                        </div>
                        <span className="text-sm">
                          Actions taken based on information provided
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-black/30 rounded-lg">
                      <p className="text-yellow-500 font-medium">
                        Non-liability Clause:
                      </p>
                      <p className="text-sm mt-2">
                        The developer of NinerWatch expressly disclaims any
                        liability for academic or disciplinary actions taken by
                        the University or any of its representatives against
                        users or the developer for accessing, viewing,
                        discussing, or otherwise interacting with publicly
                        available information through this service. Any such
                        actions could potentially represent an infringement upon
                        constitutionally protected rights of free speech and
                        academic freedom.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div id="content" className="mb-12 scroll-mt-24">
          <div className="rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-pink-500/10 to-pink-500/5 p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-pink-500/20 flex items-center justify-center text-3xl text-pink-500 mb-4">
                    💬
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-2">
                    User-Generated Content
                  </h2>
                  <div className="flex gap-2 flex-wrap justify-center">
                    <span className="inline-block px-3 py-1 bg-pink-500/10 text-pink-500 rounded-full text-xs">
                      Comments
                    </span>
                    <span className="inline-block px-3 py-1 bg-pink-500/10 text-pink-500 rounded-full text-xs">
                      Discussions
                    </span>
                    <span className="inline-block px-3 py-1 bg-pink-500/10 text-pink-500 rounded-full text-xs">
                      Community Guidelines
                    </span>
                  </div>
                </div>
                <div className="md:w-2/3 md:pl-6 md:border-l border-pink-500/20">
                  <div className="space-y-4">
                    <p>
                      NinerWatch allows users to contribute anonymous comments
                      and discussion on reported incidents. By submitting
                      content, you grant NinerWatch a non-exclusive,
                      royalty-free, perpetual, irrevocable right to use,
                      reproduce, modify, adapt, publish, translate, and
                      distribute such content.
                    </p>
                    <p>
                      You are solely responsible for content you submit. You
                      agree not to post content that:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center text-sm bg-secondary/20 p-2 rounded-md">
                        <span className="text-pink-500 mr-2">•</span> Is false,
                        misleading, or defamatory
                      </div>
                      <div className="flex items-center text-sm bg-secondary/20 p-2 rounded-md">
                        <span className="text-pink-500 mr-2">•</span> Infringes
                        on rights of others
                      </div>
                      <div className="flex items-center text-sm bg-secondary/20 p-2 rounded-md">
                        <span className="text-pink-500 mr-2">•</span> Contains
                        personal information
                      </div>
                      <div className="flex items-center text-sm bg-secondary/20 p-2 rounded-md">
                        <span className="text-pink-500 mr-2">•</span> Is
                        threatening or abusive
                      </div>
                      <div className="flex items-center text-sm bg-secondary/20 p-2 rounded-md">
                        <span className="text-pink-500 mr-2">•</span> Interferes
                        with investigations
                      </div>
                      <div className="flex items-center text-sm bg-secondary/20 p-2 rounded-md">
                        <span className="text-pink-500 mr-2">•</span> Promotes
                        discrimination
                      </div>
                      <div className="flex items-center text-sm bg-secondary/20 p-2 rounded-md">
                        <span className="text-pink-500 mr-2">•</span>{" "}
                        Impersonates any person or entity
                      </div>
                      <div className="flex items-center text-sm bg-secondary/20 p-2 rounded-md">
                        <span className="text-pink-500 mr-2">•</span> Violates
                        any applicable laws
                      </div>
                    </div>

                    <div className="bg-pink-500/10 p-4 rounded-lg border border-pink-500/20 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-pink-500"
                        >
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                        <h3 className="font-medium">
                          Content Moderation and Protected Speech
                        </h3>
                      </div>
                      <p className="text-sm">
                        While we reserve the right to remove content that
                        violates these standards, we recognize and respect all
                        users&apos; right to engage in constitutionally
                        protected speech, including criticism of institutional
                        policies, public figures, or campus safety practices.
                        NinerWatch promotes open dialogue while maintaining
                        community standards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="privacy" className="mb-12 scroll-mt-24">
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500/10 to-transparent p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center text-xl text-orange-500 mr-3">
                🔒
              </div>
              <h2 className="text-xl font-bold">Privacy</h2>
            </div>
            <div className="p-6 bg-black/20">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 hidden sm:block">
                  <div className="h-24 w-24 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-3xl text-orange-500">
                    👁️‍🗨️
                  </div>
                </div>
                <div className="space-y-3">
                  <p>
                    Please review our{" "}
                    <Link
                      href="/privacy"
                      className="text-orange-500 hover:underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    for information on how we collect, use, and protect your
                    data. Our Privacy Policy is incorporated into these Terms of
                    Service by reference.
                  </p>
                  <div className="bg-black/30 p-4 rounded-lg border border-orange-500/10">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-orange-500"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      NinerWatch is designed to be anonymous. No personal
                      information is collected when using the service. The
                      service deliberately avoids collecting any information
                      that could identify individual users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div id="prohibited" className="scroll-mt-24">
            <Card className="border-red-500/20 shadow h-full">
              <CardHeader className="bg-gradient-to-r from-red-500/10 to-transparent">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-red-500">⛔</span> Prohibited Uses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <p className="text-sm text-muted-foreground">
                  You agree not to use NinerWatch to:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span> Harass, stalk,
                    or intimidate any individual or group
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span> Engage in or
                    promote any illegal activity
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span> Collect
                    personal data about other users without consent
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span> Impersonate any
                    person or entity, including university officials
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span> Upload or
                    transmit malicious code
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span> Interfere with
                    the service or connected networks
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div id="modifications" className="scroll-mt-24">
            <Card className="border-cyan-500/20 shadow h-full">
              <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-transparent">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-cyan-500">📱</span> Modifications to
                  Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="relative">
                  <div className="absolute -z-10 top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-xl"></div>
                  <p className="text-sm">
                    We reserve the right at any time to modify or discontinue,
                    temporarily or permanently, the service (or any part
                    thereof) with or without notice. You agree that we shall not
                    be liable to you or to any third party for any modification,
                    suspension, or discontinuance of the service.
                  </p>
                </div>
                <div className="bg-black/30 p-3 rounded-lg mt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500 text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <span className="text-xs font-medium">Service Updates</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The service may evolve over time with new features or
                    changes to existing functionality to better serve the
                    community&apos;s need for transparency and information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div id="intellectual" className="scroll-mt-24">
            <Card className="border-purple-500/20 shadow h-full">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-purple-500">©️</span> Intellectual
                  Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="relative">
                  <div className="absolute -z-10 top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>
                  <p className="text-sm">
                    NinerWatch respects intellectual property rights and expects
                    users to do the same. The service, its original content,
                    features, and functionality are owned by the developer and
                    are protected by copyright, trademark, and other
                    intellectual property laws.
                  </p>
                </div>
                <div className="bg-black/30 p-3 rounded-lg mt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                        <line x1="6" y1="1" x2="6" y2="4"></line>
                        <line x1="10" y1="1" x2="10" y2="4"></line>
                        <line x1="14" y1="1" x2="14" y2="4"></line>
                      </svg>
                    </div>
                    <span className="text-xs font-medium">
                      Fair Use & Public Information
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The processing and display of publicly available information
                    falls under fair use provisions and constitutes protected
                    speech. No claim to ownership is made over public records or
                    information published by the University.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div id="academic" className="mb-12 scroll-mt-24">
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-green-500/5 blur-3xl"></div>
            <Card className="border-green-500/20 shadow-xl bg-black/20 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-transparent border-b border-green-500/10">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl text-green-500 mr-4">
                    🎓
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      Academic Freedom and Free Speech
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Protection of constitutional rights in the academic
                      context
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p>
                    NinerWatch was created by a student developer exercising
                    their rights to academic freedom and free expression. The
                    collection, analysis, and discussion of publicly available
                    campus safety information constitutes protected speech and
                    academic inquiry as recognized by U.S. courts and academic
                    institutions.
                  </p>

                  <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 p-5 rounded-xl border border-green-500/10 relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-full blur-xl"></div>
                    <h3 className="flex items-center gap-2 font-medium mb-2">
                      <div className="h-6 w-6 flex items-center justify-center rounded-full bg-green-500/20 text-green-500 text-xs">
                        1
                      </div>
                      Institutional Retaliation Protection
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Any attempt by the University or its representatives to
                      penalize, discipline, or retaliate against the developer
                      or users of NinerWatch for accessing, displaying, or
                      discussing publicly available information may potentially
                      constitute an infringement of protected free speech rights
                      and academic freedom.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 p-5 rounded-xl border border-green-500/10 relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-full blur-xl"></div>
                    <h3 className="flex items-center gap-2 font-medium mb-2">
                      <div className="h-6 w-6 flex items-center justify-center rounded-full bg-green-500/20 text-green-500 text-xs">
                        2
                      </div>
                      Protected Academic Activities
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Activities such as data analysis, visualization of public
                      information, community discussion, and software
                      development for educational and informational purposes are
                      recognized as protected forms of academic inquiry and
                      exercise of free speech rights.
                    </p>
                  </div>

                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <p className="font-medium text-green-500">
                      This project constitutes protected academic expression,
                      and users and the developer maintain their rights to
                      access, analyze, and discuss publicly available
                      information without institutional interference or
                      reprisal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div id="indemnification" className="mb-12 scroll-mt-24">
          <div className="rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-blue-500/20 flex items-center justify-center text-3xl text-blue-500 mb-4">
                    🛡️
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-2">
                    Indemnification
                  </h2>
                </div>
                <div className="md:w-2/3 md:pl-6 md:border-l border-blue-500/20">
                  <div className="space-y-4">
                    <p>
                      You agree to defend, indemnify, and hold harmless
                      NinerWatch, its developer, contributors, and affiliates
                      from and against any claims, liabilities, damages,
                      judgments, awards, losses, costs, expenses, or fees
                      (including reasonable attorneys&apos; fees) arising out of
                      or relating to your violation of these Terms of Service or
                      your use of the service.
                    </p>

                    <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-500"
                        >
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                        <h3 className="font-medium">Reciprocal Protection</h3>
                      </div>
                      <p className="text-sm">
                        Similarly, the developer and maintainers of NinerWatch
                        will make reasonable efforts to protect users from undue
                        harassment, threats, or retaliatory actions resulting
                        from their legitimate use of this service for
                        educational and informational purposes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="severability" className="mb-12 scroll-mt-24">
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500/10 to-transparent p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-xl text-purple-500 mr-3">
                ⚖️
              </div>
              <h2 className="text-xl font-bold">Severability</h2>
            </div>
            <div className="p-6 bg-black/20">
              <div className="space-y-3">
                <p>
                  If any provision of these Terms of Service is found to be
                  unenforceable or invalid, that provision will be limited or
                  eliminated to the minimum extent necessary so that the Terms
                  of Service will otherwise remain in full force and effect and
                  enforceable.
                </p>
                <div className="bg-black/30 p-4 rounded-lg border border-purple-500/10">
                  <p className="text-sm">
                    The invalidity of any particular provision shall not affect
                    other provisions of this agreement, which shall continue in
                    full force and effect. This ensures that even if a court
                    were to find certain provisions unenforceable, the remaining
                    terms would continue to protect both users and the
                    developer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="legal" className="mb-12 scroll-mt-24">
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-3xl"></div>
            <Card className="border-purple-500/20 shadow-xl bg-black/20 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent border-b border-purple-500/10">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl text-purple-500 mr-4">
                    ⚖️
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Governing Law</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Legal jurisdiction and dispute resolution
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p>
                    These Terms of Service shall be governed by the laws of the
                    State of North Carolina, without regard to its conflict of
                    law provisions. This agreement is further protected by
                    applicable federal laws governing free speech, academic
                    freedom, and access to public information.
                  </p>

                  <div className="bg-gradient-to-r from-black/30 to-black/10 p-4 rounded-lg">
                    <p className="mb-2 font-medium">Dispute Resolution:</p>
                    <p className="text-sm text-muted-foreground">
                      You agree to submit to the personal and exclusive
                      jurisdiction of the courts located within Mecklenburg
                      County, North Carolina, for the resolution of any disputes
                      arising from these Terms of Service. If legal action is
                      instituted, the prevailing party shall be entitled to
                      recover from the other party its reasonable
                      attorney&apos;s fees and costs incurred in such action.
                    </p>
                  </div>

                  <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                    <p className="font-medium text-purple-500">
                      Constitutional Protections:
                    </p>
                    <p className="text-sm mt-2">
                      These Terms of Service shall be interpreted in accordance
                      with and benefiting from the protections afforded by the
                      First Amendment of the United States Constitution and
                      relevant state constitutional provisions protecting free
                      speech, academic freedom, and the right to access and
                      discuss public information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div id="contact" className="scroll-mt-24 mb-12">
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-500/10 via-[#ff4b66]/5 to-blue-500/10 border border-border p-8 backdrop-blur-sm shadow-md">
            <div className="absolute -z-10 top-20 left-40 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute -z-10 bottom-10 right-20 w-32 h-32 bg-[#ff4b66]/5 rounded-full blur-3xl"></div>
            <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl text-blue-500 mb-4">
                📨
              </div>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="mb-6">
                If you have any questions about these Terms of Service, please
                contact us at the email address below.
              </p>
              <div className="relative">
                <div className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-500/10 to-[#ff4b66]/10 blur-sm"></div>
                <div className="relative bg-black/40 border border-border px-6 py-3 rounded-full inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-500 mr-3"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className="font-mono">support@ninerwatch.org</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-gradient-to-r from-blue-500/20 to-[#ff4b66]/20 hover:from-blue-500/30 hover:to-[#ff4b66]/30 transition-all px-6 py-3 rounded-full inline-flex items-center gap-2 border border-blue-500/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
            Back to Top
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
