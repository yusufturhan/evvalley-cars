import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Always start with Home
  const allItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...items
  ];

  return (
    <nav className="flex mb-4 overflow-x-auto no-scrollbar whitespace-nowrap py-2" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {allItems.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            )}
            {item.href && index < allItems.length - 1 ? (
              <Link
                href={item.href}
                className={`inline-flex items-center text-sm font-medium ${
                  index === 0 ? 'text-gray-700 hover:text-primary' : 'text-gray-700 hover:text-primary'
                }`}
              >
                {index === 0 && <Home className="w-4 h-4 mr-2" />}
                {item.label}
              </Link>
            ) : (
              <span className="inline-flex items-center text-sm font-medium text-gray-500">
                {index === 0 && <Home className="w-4 h-4 mr-2" />}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      
      {/* JSON-LD for Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: allItems.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.label,
              item: item.href ? `https://www.evvalley.com${item.href}` : undefined,
            })),
          }),
        }}
      />
    </nav>
  );
}
