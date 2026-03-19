const config = {
  nodes: {
    heading: {
      render: 'Heading',
      attributes: {
        id: { type: String },
        level: { type: Number, required: true },
      },
    },
    paragraph: {
      render: 'Paragraph',
    },
    list: {
      render: 'List',
      attributes: {
        ordered: { type: Boolean, default: false },
      },
    },
    item: {
      render: 'ListItem',
    },
    link: {
      render: 'DocLink',
      attributes: {
        href: { type: String, default: '#' },
      },
    },
    strong: {
      render: 'Strong',
    },
    code: {
      render: 'InlineCode',
      attributes: {
        content: { type: String },
      },
    },
    fence: {
      render: 'CodeBlock',
      attributes: {
        language: { type: String },
        content: { type: String },
      },
    },
  },
  tags: {
    callout: {
      render: 'InfoCallout',
      attributes: {
        type: { type: String, default: 'note' },
        title: { type: String },
      },
      children: ['heading', 'paragraph', 'hr', 'image', 'table', 'tag', 'fence', 'blockquote', 'list', 'item'],
    },
    link: {
      render: 'DocLink',
      attributes: {
        href: { type: String, default: '#' },
      },
      children: ['inline'],
    },
  },
};

export default config;
