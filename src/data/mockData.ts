
export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  status: 'published' | 'draft' | 'archived';
  categories: string[];
  views: number;
  readTime: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  topCategories: { name: string; count: number }[];
  recentActivity: { action: string; date: string; item: string }[];
}

// Mock Posts
export const posts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    excerpt: 'Learn the basics of React and how to build your first component.',
    content: 'React is a popular JavaScript library for building user interfaces...',
    author: 'Jane Smith',
    date: '2023-04-15',
    status: 'published',
    categories: ['React', 'Frontend'],
    views: 1245,
    readTime: 5
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    excerpt: 'Explore advanced TypeScript patterns for better type safety.',
    content: 'TypeScript offers powerful type checking capabilities...',
    author: 'John Doe',
    date: '2023-04-10',
    status: 'published',
    categories: ['TypeScript', 'Programming'],
    views: 932,
    readTime: 8
  },
  {
    id: '3',
    title: 'CSS Grid Layout Explained',
    excerpt: 'A comprehensive guide to CSS Grid Layout and how to use it.',
    content: 'CSS Grid Layout is a two-dimensional layout system...',
    author: 'Mark Johnson',
    date: '2023-04-05',
    status: 'draft',
    categories: ['CSS', 'Web Design'],
    views: 0,
    readTime: 6
  },
  {
    id: '4',
    title: 'The Future of JavaScript',
    excerpt: 'What\'s coming next in JavaScript and how to prepare.',
    content: 'JavaScript continues to evolve with new features...',
    author: 'Sarah Williams',
    date: '2023-03-28',
    status: 'published',
    categories: ['JavaScript', 'Programming'],
    views: 1567,
    readTime: 7
  },
  {
    id: '5',
    title: 'Responsive Design Best Practices',
    excerpt: 'Learn how to create responsive designs that work on all devices.',
    content: 'Responsive web design is an approach to web design...',
    author: 'Alex Chen',
    date: '2023-03-20',
    status: 'archived',
    categories: ['Web Design', 'CSS'],
    views: 2103,
    readTime: 9
  },
  {
    id: '6',
    title: 'Optimizing React Performance',
    excerpt: 'Tips and tricks for making your React applications faster.',
    content: 'Performance optimization is crucial for modern web applications...',
    author: 'Jane Smith',
    date: '2023-03-15',
    status: 'published',
    categories: ['React', 'Performance'],
    views: 1836,
    readTime: 10
  }
];

// Mock Categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'React',
    slug: 'react',
    description: 'Everything about React.js',
    count: 12
  },
  {
    id: '2',
    name: 'JavaScript',
    slug: 'javascript',
    description: 'JavaScript tips and tricks',
    count: 18
  },
  {
    id: '3',
    name: 'CSS',
    slug: 'css',
    description: 'CSS styling and design',
    count: 9
  },
  {
    id: '4',
    name: 'TypeScript',
    slug: 'typescript',
    description: 'TypeScript tutorials and guides',
    count: 7
  },
  {
    id: '5',
    name: 'Web Design',
    slug: 'web-design',
    description: 'Web design principles and practices',
    count: 5
  },
  {
    id: '6',
    name: 'Frontend',
    slug: 'frontend',
    description: 'Frontend development topics',
    count: 15
  },
  {
    id: '7',
    name: 'Programming',
    slug: 'programming',
    description: 'General programming concepts',
    count: 10
  },
  {
    id: '8',
    name: 'Performance',
    slug: 'performance',
    description: 'Web performance optimization',
    count: 6
  }
];

// Mock Stats
export const stats: Stats = {
  totalPosts: 36,
  publishedPosts: 24,
  draftPosts: 8,
  totalViews: 45392,
  topCategories: [
    { name: 'JavaScript', count: 18 },
    { name: 'Frontend', count: 15 },
    { name: 'React', count: 12 },
    { name: 'Programming', count: 10 }
  ],
  recentActivity: [
    { action: 'Published', date: '2023-04-15', item: 'Getting Started with React' },
    { action: 'Edited', date: '2023-04-14', item: 'Advanced TypeScript Patterns' },
    { action: 'Created', date: '2023-04-13', item: 'CSS Grid Layout Explained' },
    { action: 'Archived', date: '2023-04-12', item: 'Web Accessibility Basics' },
    { action: 'Published', date: '2023-04-10', item: 'Advanced TypeScript Patterns' }
  ]
};
