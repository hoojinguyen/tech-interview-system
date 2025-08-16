import { db } from './connection';
import { roles, roadmaps, topics, questions, topicQuestions } from './schema';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed roles
    console.log('📝 Seeding roles...');
    const [frontendRole, backendRole, fullstackRole] = await db.insert(roles).values([
      {
        name: 'Frontend Developer',
        description: 'Specializes in user interface and user experience development',
        technologies: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'CSS', 'HTML']
      },
      {
        name: 'Backend Developer',
        description: 'Focuses on server-side logic, databases, and API development',
        technologies: ['Node.js', 'Python', 'Java', 'Go', 'PostgreSQL', 'MongoDB', 'Redis']
      },
      {
        name: 'Full Stack Developer',
        description: 'Works on both frontend and backend development',
        technologies: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'MongoDB']
      }
    ]).returning();

    // Seed roadmaps
    console.log('🗺️ Seeding roadmaps...');
    const [frontendJuniorRoadmap, frontendSeniorRoadmap, backendSeniorRoadmap] = await db.insert(roadmaps).values([
      {
        roleId: frontendRole.id,
        level: 'junior',
        title: 'Junior Frontend Developer Learning Path',
        description: 'Essential skills and knowledge for junior frontend developers',
        estimatedHours: 120,
        prerequisites: ['Basic HTML/CSS', 'JavaScript fundamentals']
      },
      {
        roleId: frontendRole.id,
        level: 'senior',
        title: 'Senior Frontend Developer Learning Path',
        description: 'Advanced frontend development concepts and leadership skills',
        estimatedHours: 200,
        prerequisites: ['3+ years frontend experience', 'React/Vue expertise', 'State management']
      },
      {
        roleId: backendRole.id,
        level: 'senior',
        title: 'Senior Backend Developer Learning Path',
        description: 'Advanced backend architecture and system design',
        estimatedHours: 180,
        prerequisites: ['5+ years backend experience', 'Database design', 'API development']
      }
    ]).returning();

    // Seed topics for frontend junior roadmap
    console.log('📚 Seeding topics...');
    const frontendTopics = await db.insert(topics).values([
      {
        roadmapId: frontendJuniorRoadmap.id,
        title: 'JavaScript Fundamentals',
        description: 'Core JavaScript concepts including variables, functions, and async programming',
        order: 1,
        resources: [
          { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'documentation' },
          { title: 'JavaScript.info', url: 'https://javascript.info/', type: 'tutorial' }
        ]
      },
      {
        roadmapId: frontendJuniorRoadmap.id,
        title: 'React Basics',
        description: 'Introduction to React components, JSX, and state management',
        order: 2,
        resources: [
          { title: 'React Official Tutorial', url: 'https://react.dev/learn', type: 'tutorial' },
          { title: 'React Hooks Guide', url: 'https://react.dev/reference/react', type: 'documentation' }
        ]
      },
      {
        roadmapId: frontendJuniorRoadmap.id,
        title: 'CSS and Styling',
        description: 'Modern CSS techniques, Flexbox, Grid, and responsive design',
        order: 3,
        resources: [
          { title: 'CSS Grid Guide', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', type: 'article' },
          { title: 'Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'article' }
        ]
      }
    ]).returning();

    // Seed sample questions
    console.log('❓ Seeding questions...');
    const sampleQuestions = await db.insert(questions).values([
      {
        title: 'Implement a debounce function',
        content: 'Write a function that limits the rate at which a function can fire. The function should delay invoking func until after wait milliseconds have elapsed since the last time the debounced function was invoked.',
        type: 'coding',
        difficulty: 'medium',
        technologies: ['JavaScript', 'TypeScript'],
        roles: ['Frontend Developer', 'Full Stack Developer'],
        companies: ['Google', 'Facebook', 'Amazon'],
        tags: ['functions', 'closures', 'timing'],
        solution: {
          explanation: 'A debounce function delays the execution of a function until a certain amount of time has passed since it was last called.',
          codeExamples: [
            {
              language: 'javascript',
              code: `function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
              explanation: 'Basic debounce implementation using setTimeout'
            }
          ],
          timeComplexity: 'O(1)',
          spaceComplexity: 'O(1)',
          alternativeApproaches: ['Using requestAnimationFrame for UI updates', 'Immediate execution variant']
        },
        rating: '4.5',
        ratingCount: 128,
        submittedBy: 'system',
        isApproved: true
      },
      {
        title: 'Explain React Virtual DOM',
        content: 'What is the Virtual DOM in React? How does it work and what are its benefits compared to direct DOM manipulation?',
        type: 'conceptual',
        difficulty: 'easy',
        technologies: ['React', 'JavaScript'],
        roles: ['Frontend Developer', 'Full Stack Developer'],
        companies: ['Facebook', 'Netflix', 'Airbnb'],
        tags: ['react', 'virtual-dom', 'performance'],
        solution: {
          explanation: 'The Virtual DOM is a JavaScript representation of the actual DOM. React uses it to optimize updates by comparing (diffing) the virtual representation with the previous version.',
          codeExamples: [
            {
              language: 'javascript',
              code: `// Virtual DOM representation
const virtualElement = {
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: { children: 'Hello World' }
      }
    ]
  }
};`,
              explanation: 'Example of how React represents DOM elements in JavaScript objects'
            }
          ],
          timeComplexity: 'O(n) for diffing',
          spaceComplexity: 'O(n) for virtual tree',
          alternativeApproaches: ['Direct DOM manipulation', 'Other virtual DOM libraries like Vue.js']
        },
        rating: '4.7',
        ratingCount: 89,
        submittedBy: 'system',
        isApproved: true
      },
      {
        title: 'Design a URL Shortener',
        content: 'Design a URL shortening service like bit.ly. Consider the system architecture, database design, and how you would handle high traffic.',
        type: 'system-design',
        difficulty: 'hard',
        technologies: ['System Design', 'Databases', 'Caching'],
        roles: ['Backend Developer', 'Full Stack Developer'],
        companies: ['Google', 'Amazon', 'Microsoft'],
        tags: ['system-design', 'scalability', 'databases'],
        solution: {
          explanation: 'A URL shortener requires careful consideration of encoding algorithms, database design, caching strategies, and handling high read/write ratios.',
          codeExamples: [
            {
              language: 'python',
              code: `import hashlib
import base64

def generate_short_url(long_url, counter):
    # Simple base62 encoding approach
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    result = ""
    while counter > 0:
        result = chars[counter % 62] + result
        counter //= 62
    return result or "0"`,
              explanation: 'Base62 encoding for generating short URLs'
            }
          ],
          timeComplexity: 'O(1) for encoding/decoding',
          spaceComplexity: 'O(n) for storage',
          alternativeApproaches: ['MD5 hashing with collision handling', 'UUID-based approaches', 'Custom encoding schemes']
        },
        rating: '4.8',
        ratingCount: 156,
        submittedBy: 'system',
        isApproved: true
      }
    ]).returning();

    // Link questions to topics
    console.log('🔗 Linking questions to topics...');
    await db.insert(topicQuestions).values([
      { topicId: frontendTopics[0].id, questionId: sampleQuestions[0].id }, // JS fundamentals -> debounce
      { topicId: frontendTopics[1].id, questionId: sampleQuestions[1].id }, // React basics -> Virtual DOM
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Seeded:
    - ${3} roles
    - ${3} roadmaps  
    - ${3} topics
    - ${3} questions
    - ${2} topic-question relationships`);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.main) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedDatabase };