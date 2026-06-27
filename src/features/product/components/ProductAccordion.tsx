import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { Product } from '../../../data/products';

interface ProductAccordionProps {
  product: Product;
  openAccordion: string | null;
  setOpenAccordion: (id: string | null) => void;
}

export function ProductAccordion({
  product,
  openAccordion,
  setOpenAccordion,
}: ProductAccordionProps) {
  const accordionItems = [
    { id: 'description', label: 'Description', content: product.description },
    { id: 'features', label: 'Features', content: null },
    { id: 'specifications', label: 'Specifications', content: null },
  ];

  return (
    <div className="divide-y divide-border border-t border-border">
      {accordionItems.map((item) => (
        <div key={item.id}>
          <button
            onClick={() =>
              setOpenAccordion(openAccordion === item.id ? null : item.id)
            }
            className="flex items-center justify-between w-full py-4 font-sans text-sm font-semibold text-foreground tracking-wide"
          >
            {item.label}
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                openAccordion === item.id ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openAccordion === item.id && (
            <div className="pb-5">
              {item.id === 'features' ? (
                <ul className="space-y-2">
                  {product.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2.5 font-sans text-sm text-muted-foreground"
                    >
                      <span className="w-1 h-1 bg-muted-foreground mt-2 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              ) : item.id === 'specifications' ? (
                product.specs && product.specs.length > 0 ? (
                  <ul className="space-y-2">
                    {product.specs.map((spec) => (
                      <li key={spec} className="flex items-start gap-2.5 font-sans text-sm text-muted-foreground">
                        <span className="w-1 h-1 bg-muted-foreground mt-2 shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-sans text-sm text-muted-foreground">Specifications coming soon.</p>
                )
              ) : (
                <div className="font-sans text-sm text-muted-foreground leading-relaxed space-y-3">
                  {item.content?.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
