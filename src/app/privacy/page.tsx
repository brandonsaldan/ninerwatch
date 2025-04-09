"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/dashboard/header";
import Footer from "@/components/dashboard/footer";
import Link from "next/link";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", icon: "🔒", title: "Overview", color: "blue" },
    {
      id: "collection",
      icon: "📊",
      title: "Information We Collect",
      color: "indigo",
    },
    {
      id: "usage",
      icon: "🔍",
      title: "How We Use Information",
      color: "green",
    },
    { id: "cookies", icon: "🍪", title: "Cookies", color: "yellow" },
    { id: "sharing", icon: "🔄", title: "Data Sharing", color: "pink" },
    { id: "security", icon: "🛡️", title: "Data Security", color: "red" },
    { id: "contact", icon: "📨", title: "Contact Us", color: "blue" },
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
                Your information is valued and protected
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We respect your privacy and are committed to protecting your
              personal information. Learn how we collect, use and safeguard your
              data.
            </p>
            <div className="flex flex-wrap gap-3 mt-8 justify-center">
              <Link href="/terms">
                <Button
                  variant="outline"
                  className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20"
                >
                  Terms of Service
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
                    🔒
                  </div>
                </div>
                <div className="md:w-3/4 space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">
                    Overview
                  </h2>
                  <p className="text-lg">
                    NinerWatch is committed to protecting your privacy. This
                    Privacy Policy explains how we collect, use, and safeguard
                    information when you use our website and services.
                  </p>
                  <div className="flex items-center p-4 bg-gradient-to-r from-[#ff4b66]/10 to-[#ff4b66]/5 rounded-lg shadow-sm border border-[#ff4b66]/20">
                    <div className="text-2xl mr-4 text-[#ff4b66]">⚠️</div>
                    <p className="text-[#ff4b66]">
                      <strong>IMPORTANT:</strong> NinerWatch is not affiliated
                      with or endorsed by UNC Charlotte. This is an unofficial
                      service created to aggregate and display publicly
                      available campus safety information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="collection" className="mb-12 scroll-mt-24">
          <div className="rounded-xl overflow-hidden backdrop-blur-sm shadow-md">
            <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-600/5 px-6 py-4 border-b border-indigo-500/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-xl text-indigo-500">
                  📊
                </div>
                <h2 className="text-2xl font-bold">Information We Collect</h2>
              </div>
            </div>
            <div className="bg-black/20 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
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
                        <rect
                          x="2"
                          y="3"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium">
                      Automatically Collected Information
                    </h3>
                  </div>
                  <p>
                    When you visit NinerWatch, we automatically collect certain
                    information about your device and your interaction with our
                    website.
                  </p>
                  <div className="bg-gradient-to-r from-black/30 to-black/10 rounded-lg p-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs">
                          →
                        </div>
                        Device information (browser type, operating system, IP
                        address)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs">
                          →
                        </div>
                        Usage data (pages visited, time spent on pages)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs">
                          →
                        </div>
                        Referral source (how you found our website)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs">
                          →
                        </div>
                        General location information (city/region level only)
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
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
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium">
                      User-Provided Information
                    </h3>
                  </div>
                  <p>
                    NinerWatch allows anonymous comments on incident reports.
                    When you post a comment, we collect:
                  </p>
                  <div className="bg-gradient-to-r from-black/30 to-black/10 rounded-lg p-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs">
                          →
                        </div>
                        Your comment text
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs">
                          →
                        </div>
                        A randomly generated anonymous identifier
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs">
                          →
                        </div>
                        Timestamp of when the comment was posted
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs">
                          →
                        </div>
                        Voting actions (stored locally on your device)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-black/20 rounded-lg">
                <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
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
                  We do not collect personal information such as names, email
                  addresses, or account information. All user participation is
                  anonymous.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="usage" className="mb-12 scroll-mt-24">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="sticky top-24 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-xl p-6 shadow-md backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center text-4xl text-green-500 mb-4">
                    🔍
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    How We Use Your Information
                  </h2>
                  <p className="text-muted-foreground">
                    We use collected information for specific purposes that help
                    us improve your experience while keeping your data secure.
                  </p>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-black/20 border-green-500/20 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">
                        01
                      </div>
                      <span>Service Provision</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We use collected data to provide and maintain the
                      NinerWatch service, ensuring that all features function
                      properly for users.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-green-500/20 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">
                        02
                      </div>
                      <span>User Experience</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We optimize our website performance and user experience
                      based on how visitors interact with our platform.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-green-500/20 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">
                        03
                      </div>
                      <span>Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We monitor and analyze usage patterns and trends to
                      improve content and service delivery across the platform.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-green-500/20 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">
                        04
                      </div>
                      <span>Security</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We prevent and address technical issues and security
                      concerns to ensure a safe browsing environment.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-green-500/20 shadow-md hover:shadow-lg transition-shadow sm:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">
                        05
                      </div>
                      <span>Community Content</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We display user-generated content (comments) on incident
                      reports to facilitate community discussion and information
                      sharing about campus safety events.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <div id="cookies" className="mb-12 scroll-mt-24">
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-yellow-500/5 blur-3xl"></div>
            <Card className="border-yellow-500/20 shadow-xl bg-black/20 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-transparent border-b border-yellow-500/10">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-2xl text-yellow-500 mr-4">
                    🍪
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      Cookies and Similar Technologies
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      How we use cookies to enhance your experience
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-6">
                  NinerWatch uses cookies and similar tracking technologies to
                  track activity on our website and store certain information.
                  Cookies are files with a small amount of data that may include
                  an anonymous unique identifier.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded-lg p-4 border border-yellow-500/10 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-yellow-500/10 blur-xl"></div>
                    <h3 className="text-yellow-500 font-medium mb-2 text-sm">
                      Essential Cookies
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Necessary for the website to function properly
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded-lg p-4 border border-yellow-500/10 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-yellow-500/10 blur-xl"></div>
                    <h3 className="text-yellow-500 font-medium mb-2 text-sm">
                      Preference Cookies
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Remember your preferences and settings
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded-lg p-4 border border-yellow-500/10 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-yellow-500/10 blur-xl"></div>
                    <h3 className="text-yellow-500 font-medium mb-2 text-sm">
                      Analytics Cookies
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Help us understand how visitors interact with our website
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded-lg p-4 border border-yellow-500/10 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-yellow-500/10 blur-xl"></div>
                    <h3 className="text-yellow-500 font-medium mb-2 text-sm">
                      Local Storage
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Store comment vote information on your device
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-secondary/30 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-500 mr-3 mt-1 flex-shrink-0"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <p className="text-sm">
                    You can instruct your browser to refuse all cookies or to
                    indicate when a cookie is being sent. However, some features
                    of the site may not function properly without cookies.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div id="sharing" className="mb-12 scroll-mt-24">
          <div className="rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-pink-500/10 to-pink-500/5 p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-pink-500/20 flex items-center justify-center text-3xl text-pink-500 mb-4">
                    🔄
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-2">
                    Data Sharing and Disclosure
                  </h2>
                  <div className="flex gap-2 flex-wrap justify-center">
                    <span className="inline-block px-3 py-1 bg-pink-500/10 text-pink-500 rounded-full text-xs">
                      Third Parties
                    </span>
                    <span className="inline-block px-3 py-1 bg-pink-500/10 text-pink-500 rounded-full text-xs">
                      Legal Compliance
                    </span>
                    <span className="inline-block px-3 py-1 bg-pink-500/10 text-pink-500 rounded-full text-xs">
                      Service Providers
                    </span>
                  </div>
                </div>
                <div className="md:w-2/3 md:pl-6 md:border-l border-pink-500/20">
                  <div className="space-y-4">
                    <p>
                      We do not sell, trade, or otherwise transfer your
                      information to outside parties except in the following
                      circumstances:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start bg-black/30 p-4 rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 text-xs mr-3 mt-0.5">
                          1
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">
                            Service Providers
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Third-party companies who assist us in operating our
                            website (analytics, hosting, etc.) may process your
                            data as needed to provide their services.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start bg-black/30 p-4 rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 text-xs mr-3 mt-0.5">
                          2
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">
                            Legal Requirements
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            When we believe release is appropriate to comply
                            with the law, enforce our site policies, or protect
                            our or others' rights, property, or safety.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start bg-black/30 p-4 rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 text-xs mr-3 mt-0.5">
                          3
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">
                            Business Transfers
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            If we are involved in a merger, acquisition, or
                            asset sale, in which case user data may be
                            transferred as a business asset.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-pink-500/10 p-4 rounded-lg border border-pink-500/20">
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
                          <path d="M11 17.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zm2 0a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0z"></path>
                          <path d="M12.75 7.75V12h4.25"></path>
                          <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                        <h3 className="font-medium">Public Comments Notice</h3>
                      </div>
                      <p className="text-sm">
                        Public comments posted on incident reports are visible
                        to all website visitors.
                        <span className="text-pink-500 font-medium">
                          {" "}
                          Do not include sensitive or personal information in
                          your comments.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden bg-gradient-to-r from-orange-500/10 to-orange-500/5 p-6 backdrop-blur-sm shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center text-xl text-orange-500">
                  📡
                </div>
                <h2 className="text-xl font-bold">Third-Party Services</h2>
              </div>
              <div className="space-y-4">
                <p>
                  NinerWatch uses the following third-party services to help
                  operate our website:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/30 p-3 rounded-lg flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 text-sm">
                      SB
                    </div>
                    <span className="text-sm">Supabase</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 text-sm">
                      V
                    </div>
                    <span className="text-sm">Vercel</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 text-sm">
                      LF
                    </div>
                    <span className="text-sm">Leaflet</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 text-sm">
                      GA
                    </div>
                    <span className="text-sm">Google Analytics</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  These third parties have their own privacy policies governing
                  how they use information. We recommend reviewing their privacy
                  policies to understand how they process your data.
                </p>
              </div>
            </div>

            <div
              id="security"
              className="scroll-mt-24 rounded-xl overflow-hidden bg-gradient-to-r from-red-500/10 to-red-500/5 p-6 backdrop-blur-sm shadow-md"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center text-xl text-red-500">
                  🛡️
                </div>
                <h2 className="text-xl font-bold">Data Security</h2>
              </div>
              <div className="space-y-4">
                <p>
                  We implement reasonable security measures to maintain the
                  safety of your information. However, no method of transmission
                  over the Internet or electronic storage is 100% secure, and we
                  cannot guarantee absolute security.
                </p>
                <div className="relative">
                  <div className="absolute -z-10 top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-xl"></div>
                  <div className="bg-black/30 border border-red-500/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
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
                        className="text-red-500"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <h3 className="font-medium text-sm">
                        Data Breach Protocol
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      In the event of a data breach that affects user
                      information, we will make reasonable efforts to notify
                      affected users in accordance with applicable laws.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-xl overflow-hidden bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 p-6 backdrop-blur-sm shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-xl text-cyan-500">
                👤
              </div>
              <h2 className="text-xl font-bold">Anonymous Nature of Service</h2>
            </div>
            <div className="space-y-4">
              <p>
                NinerWatch is designed to be anonymous. We do not require users
                to create accounts or provide personally identifiable
                information to view content or post comments.
              </p>
              <div className="relative bg-black/20 p-4 rounded-lg overflow-hidden">
                <div className="absolute -z-10 top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl"></div>
                <p className="text-sm">
                  The anonymous identifiers used for comments are generated
                  randomly and are not connected to your real identity. However,
                  be aware that information you voluntarily disclose in comments
                  could potentially identify you.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden bg-gradient-to-r from-purple-500/10 to-purple-500/5 p-6 backdrop-blur-sm shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-xl text-purple-500">
                🧒
              </div>
              <h2 className="text-xl font-bold">Children's Privacy</h2>
            </div>
            <div className="space-y-4">
              <p>
                NinerWatch is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13.
              </p>
              <div className="relative bg-black/20 p-4 rounded-lg overflow-hidden">
                <div className="absolute -z-10 top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-xl"></div>
                <p className="text-sm">
                  If you are a parent or guardian and believe your child has
                  provided us with personal information, please contact us, and
                  we will delete such information.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <Card className="border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-lg">
                  📝
                </div>
                <span>Changes to This Privacy Policy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last Updated" date.
                </p>
                <div className="bg-black/20 p-4 rounded-lg flex items-center gap-3 border border-indigo-500/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
                  <p className="text-sm">
                    You are advised to review this Privacy Policy periodically
                    for any changes. Changes to this Privacy Policy are
                    effective when they are posted on this page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div id="contact" className="scroll-mt-24 mb-12">
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-500/10 via-[#ff4b66]/5 to-blue-500/10 border border-border p-8 backdrop-blur-sm shadow-md">
            <div className="absolute -z-10 top-20 left-40 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute -z-10 bottom-10 right-20 w-32 h-32 bg-[#ff4b66]/5 rounded-full blur-3xl"></div>
            <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl text-blue-500 mb-4">
                📨
              </div>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="mb-6">
                If you have any questions about this Privacy Policy, please
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
                  <span className="font-mono">privacy@ninerwatch.org</span>
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
