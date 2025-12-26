export function buildFaqJsonLd(
  items: { question: string; answer: string }[],
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

