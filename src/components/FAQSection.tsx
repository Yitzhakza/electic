interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQSection({ items, title = 'שאלות נפוצות' }: FAQSectionProps) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mb-6" />
      <div className="space-y-3">
        {items.map((item, i) => (
          <details key={i} className="group bg-white rounded-xl border border-border/50 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-medium text-sm hover:bg-gray-50 transition-colors list-none">
              <span>{item.question}</span>
              <svg className="h-5 w-5 text-muted shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-4 text-sm text-muted leading-relaxed border-t border-border/50 pt-3">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
