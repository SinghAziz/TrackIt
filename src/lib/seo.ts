// Public product facts only. Never serialize account or browser-local data here.
export const site = {
  name: "TrackIt",
  origin: "https://trackit.harazizsingh.com",
  title: "TrackIt — Student Assignment Planner & Deadline Tracker",
  description:
    "TrackIt helps students organize assignments, prioritize deadlines, and plan study sessions with a browser-local, rule-based Study Copilot.",
  category: "EducationalApplication",
  features: [
    "Assignment tracking",
    "Deadline prioritization",
    "Rule-based study planning",
    "Browser-local storage",
  ],
};

export const faqs = [
  {
    question: "What is TrackIt?",
    answer:
      "TrackIt is a student assignment planner that brings deadlines, task priorities, and study plans together in one browser-based workspace.",
  },
  {
    question: "Do I need an account to use TrackIt?",
    answer:
      "No. TrackIt works without an account or paid API. Open the dashboard to start planning assignments.",
  },
  {
    question: "Where does TrackIt save my assignments?",
    answer:
      "Assignments are saved in this browser’s local storage. There is no cloud sync. Other browsers have separate workspaces, and clearing browser data removes saved assignments.",
  },
  {
    question: "Does Study Copilot use a live AI model?",
    answer:
      "Study Copilot uses browser-side rules to add assignments, suggest priorities, and create study plans. It does not run a live language model or send scheduled notifications.",
  },
];

// Escaping '<' prevents embedded data from closing an HTML script element.
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function pageHead({
  title = site.title,
  description = site.description,
  path = "/",
  index = true,
  home = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  index?: boolean;
  home?: boolean;
} = {}) {
  const url = new URL(path, site.origin).href;
  const image = `${site.origin}/social-card.png`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${site.origin}/#website`,
      url: `${site.origin}/`,
      name: site.name,
      inLanguage: "en",
      about: { "@id": `${site.origin}/#application` },
    },
    {
      "@type": "WebApplication",
      "@id": `${site.origin}/#application`,
      name: site.name,
      url: `${site.origin}/`,
      description: site.description,
      applicationCategory: site.category,
      operatingSystem: "Web browser",
      featureList: site.features,
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: "en",
      isPartOf: { "@id": `${site.origin}/#website` },
      about: { "@id": `${site.origin}/#application` },
    },
  ];
  if (home)
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      isPartOf: { "@id": `${url}#webpage` },
      mainEntity: faqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  return {
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "robots",
        content: index
          ? "index, follow, max-image-preview:large"
          : "noindex, follow",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: site.name },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: `${site.name} — ${site.features[0]}`,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      {
        name: "twitter:image:alt",
        content: `${site.name} — ${site.features[0]}`,
      },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: index
      ? [
          {
            type: "application/ld+json",
            children: serializeJsonLd({
              "@context": "https://schema.org",
              "@graph": graph,
            }),
          },
        ]
      : [],
  };
}
