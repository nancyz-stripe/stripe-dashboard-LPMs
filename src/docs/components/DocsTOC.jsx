import { useState, useEffect } from 'react';

export default function DocsTOC({ items = [] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top <= b.boundingClientRect.top ? a : b
          );
          setActiveId(topmost.target.id);
        }
      },
      { rootMargin: '-20px 0px -66% 0px', threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="w-[200px] shrink-0 hidden xl:block">
      <div className="sticky top-10">
        <div className="text-[12px] font-semibold text-default uppercase tracking-wider mb-3">
          On this page
        </div>
        <nav className="space-y-0">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block py-1 text-label-medium transition-colors ${
                activeId === item.id
                  ? 'text-docs-accent font-medium'
                  : 'text-default'
              } ${item.depth === 2 ? 'ml-0' : 'ml-3'}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
