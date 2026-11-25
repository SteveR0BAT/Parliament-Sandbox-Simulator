import { AppShell } from "@/components/AppShell";

const applicationStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Parliament Sandbox Simulator",
  url: "https://stever0bat.github.io/Parliament-Sandbox-Simulator/",
  description: "Design a custom parliament with parties, factions, coalitions, independent MPs, more than 100 ideologies and configurable parliamentary voting rules.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Home() {
  return (
    <>
      <div id="simulator">
        <AppShell />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(applicationStructuredData).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
