import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AttendEase - Timetable Management System",
  description:
    "AttendEase is an advanced timetable management system designed for batch scheduling. View detailed schedules, optimize academic activities, and stay organized with ease.",
  keywords:
    "timetable management system, batch scheduling, academic schedules, resource allocation, lectures, tutorials, academic management, AttendEase, weekly schedules, optimized scheduling",
  openGraph: {
    title: "AttendEase - Simplify Your Academic Scheduling",
    description:
      "AttendEase helps manage batch schedules, lectures, and academic activities with ease. View detailed schedules and stay on top of your weekly plans.",
    url: "https://attendease-psi.vercel.app/",
    type: "website",
    images: [
      {
        url: "https://lh3.googleusercontent.com/gg/AJxt1KPiP-0D96FcgxoPFTwUUnUPvyZLHMtknnK58A2WmRxE3ghhmkyGK8xqUY8bIkvU5sqm8CjIuznLZsNrIKpRO_cbWmcpQqBTGkfZi73NFhDD8tkbr6oiGoUprQyBB2s1BtGy_2kDh4SuZ3M21azSRK-iaW8QdaftY62AUvyRQMzT9-RcE7U",
        width: 1200,
        height: 630,
        alt: "AttendEase - Timetable Management System",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta Tags for SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content="Your Name or Team Name" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:type" content={metadata.openGraph.type} />
        {metadata.openGraph.images.map((image, index) => (
          <meta
            key={index}
            property="og:image"
            content={image.url}
            width={image.width}
            height={image.height}
            alt={image.alt}
          />
        ))}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.openGraph.title} />
        <meta
          name="twitter:description"
          content={metadata.openGraph.description}
        />
        <meta name="twitter:image" content={metadata.openGraph.images[0].url} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Structured Data for Rich Results */}
        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "AttendEase",
              url: "https://yourwebsite.com",
              logo: "https://yourwebsite.com/logo.png",
              description:
                "AttendEase is a comprehensive timetable management system for managing academic schedules across batches and days. Ideal for lectures, tutorials, and project tracking.",
              sameAs: [
                "https://facebook.com/yourpage",
                "https://twitter.com/yourprofile",
                "https://linkedin.com/in/yourprofile",
              ],
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Academic Way",
                addressLocality: "Your City",
                addressRegion: "Your State",
                postalCode: "12345",
                addressCountry: "Your Country",
              },
            }),
          }}
        /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <div style={{ overflowY: "scroll", height: "100vh" }}>{children}</div>
      </body>
    </html>
  );
}
