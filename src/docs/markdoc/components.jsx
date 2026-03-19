import { createContext, useContext } from 'react';

const OrderedListContext = createContext(null);

function Heading({ id, level, children }) {
  const Tag = `h${level}`;
  const classes = {
    2: 'text-heading-large text-default mt-10 mb-4 scroll-mt-[20px]',
    3: 'text-heading-medium text-default mt-8 mb-3 scroll-mt-[20px]',
  };
  return <Tag id={id} className={classes[level] || ''}>{children}</Tag>;
}

function Paragraph({ children }) {
  return <p className="text-body-medium mb-4">{children}</p>;
}

function List({ ordered, children }) {
  if (ordered) {
    return (
      <OrderedListContext.Provider value={true}>
        <ol className="space-y-3 text-body-medium mb-4 list-none pl-0" style={{ counterReset: 'list-counter' }}>{children}</ol>
      </OrderedListContext.Provider>
    );
  }
  return <ul className="list-disc pl-5 space-y-2 text-body-medium mb-4 marker:text-neutral-200">{children}</ul>;
}

function ListItem({ children }) {
  const isOrdered = useContext(OrderedListContext);
  if (isOrdered) {
    return (
      <li className="flex items-start gap-3" style={{ counterIncrement: 'list-counter' }}>
        <span className="shrink-0 size-5 rounded-full bg-neutral-50 text-default text-label-small flex items-center justify-center mt-0.5 before:content-[counter(list-counter)]" />
        <span>{children}</span>
      </li>
    );
  }
  return <li>{children}</li>;
}

function Strong({ children }) {
  return <strong className="font-semibold text-default">{children}</strong>;
}

function InlineCode({ content }) {
  return <code className="text-monospace-small bg-offset border border-border rounded-md px-1.5 py-0.5">{content}</code>;
}

function DocLink({ href = '#', children }) {
  return (
    <a
      href={href}
      className="text-docs-accent font-semibold hover:text-docs-accent-hover transition-colors"
    >
      {children}
    </a>
  );
}

const CALLOUT_STYLES = {
  note:                { border: 'border-l-neutral-300',  label: 'Note',                labelColor: 'text-neutral-700' },
  caution:             { border: 'border-l-yellow-400',   label: 'Caution',             labelColor: 'text-yellow-700' },
  warning:             { border: 'border-l-[#e61947]',    label: 'Warning',             labelColor: 'text-critical' },
  'private-preview':   { border: 'border-l-[#7cd548]',    label: 'Private preview',     labelColor: 'text-success' },
  'public-preview':    { border: 'border-l-[#7cd548]',    label: 'Public preview',      labelColor: 'text-success' },
};

function InfoCallout({ type = 'note', title, children }) {
  const style = CALLOUT_STYLES[type] || CALLOUT_STYLES.note;
  const displayTitle = title || style.label;
  return (
    <div className={`border-l-4 ${style.border} pl-3`}>
      {displayTitle && (
        <div className={`text-label-small-emphasized ${style.labelColor} mb-1`}>{displayTitle}</div>
      )}
      <div className="text-default [&_p]:text-body-small">{children}</div>
    </div>
  );
}

function CodeBlock({ language, children }) {
  return (
    <pre className="bg-[#1a2652] border border-border rounded-lg p-4 mb-4 overflow-x-auto text-body-small text-white">
      <code>{children}</code>
    </pre>
  );
}

const components = {
  Heading,
  Paragraph,
  List,
  ListItem,
  Strong,
  InlineCode,
  DocLink,
  InfoCallout,
  CodeBlock,
};

export default components;
