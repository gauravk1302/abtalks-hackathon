import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// .env.local load karo (Next.js isko khud load karta hai, standalone script ke liye manually karna padta hai)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI .env.local mein nahi mili");
}

// ---- Schema (inline rakha hai taaki script standalone chal sake) ----
const ChallengeTaskSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, index: true },
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["completed", "pending", "running", "review", "missed"],
      default: "pending",
    },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
  },
  { timestamps: true }
);

ChallengeTaskSchema.index({ category: 1, day: 1 }, { unique: true });

const ChallengeTask =
  mongoose.models.ChallengeTask ||
  mongoose.model("ChallengeTask", ChallengeTaskSchema);

// ---- 60-day content — har category ke titles/descriptions ----
type DayContent = { title: string; description: string };

const dsa: DayContent[] = [
  { title: "Arrays & Time Complexity", description: "Basics of Big-O; solve linear search and two-sum brute force." },
  { title: "Two Pointers Technique", description: "Solve pair sum in sorted array and reverse array problems." },
  { title: "Sliding Window Basics", description: "Fixed-size window: maximum sum subarray of size k." },
  { title: "Sliding Window Variable", description: "Longest substring without repeating characters." },
  { title: "Hashing Fundamentals", description: "Frequency counting with HashMap/Set; solve duplicate detection." },
  { title: "Prefix Sum", description: "Range sum queries and subarray sum equals K." },
  { title: "Strings Basics", description: "Palindrome checks, string reversal, anagram detection." },
  { title: "Sorting Algorithms", description: "Implement bubble sort, merge sort, and quicksort from scratch." },
  { title: "Binary Search", description: "Search in sorted array and rotated sorted array." },
  { title: "Matrix Problems", description: "Rotate matrix, spiral traversal, search in 2D matrix." },
  { title: "Recursion Basics", description: "Factorial, Fibonacci, and power function using recursion." },
  { title: "Backtracking Intro", description: "Generate subsets and permutations of an array." },
  { title: "Linked List Basics", description: "Implement a singly linked list with insert/delete." },
  { title: "Linked List Reversal", description: "Reverse a linked list iteratively and recursively." },
  { title: "Fast & Slow Pointers", description: "Detect a cycle in a linked list, find the middle node." },
  { title: "Stack Fundamentals", description: "Implement a stack; solve the valid parentheses problem." },
  { title: "Queue & Deque", description: "Implement a queue using stacks; sliding window maximum." },
  { title: "Monotonic Stack", description: "Next greater element and daily temperatures problem." },
  { title: "Trees Basics", description: "Binary tree traversals — inorder, preorder, postorder." },
  { title: "Tree BFS/DFS", description: "Level order traversal and depth of a binary tree." },
  { title: "Binary Search Trees", description: "Insert, search, and delete operations in a BST." },
  { title: "BST Validation", description: "Validate a BST and find the kth smallest element." },
  { title: "Heaps Intro", description: "Implement a min-heap and max-heap from scratch." },
  { title: "Heap Applications", description: "Kth largest element and merge k sorted lists." },
  { title: "Graphs Basics", description: "Graph representation using adjacency list and matrix." },
  { title: "Graph BFS", description: "Implement BFS traversal; shortest path in an unweighted graph." },
  { title: "Graph DFS", description: "Implement DFS; detect a cycle in directed/undirected graphs." },
  { title: "Union-Find", description: "Disjoint set union and number of connected components." },
  { title: "Topological Sort", description: "Course schedule problem using Kahn's algorithm." },
  { title: "Dijkstra's Algorithm", description: "Shortest path in a weighted graph." },
  { title: "DP Basics", description: "Fibonacci with memoization and the climbing stairs problem." },
  { title: "DP 1D", description: "House robber and coin change problems." },
  { title: "DP 2D", description: "Unique paths and longest common subsequence." },
  { title: "Knapsack Problems", description: "0/1 knapsack and unbounded knapsack." },
  { title: "DP on Strings", description: "Edit distance and longest palindromic substring." },
  { title: "Greedy Algorithms", description: "Activity selection and fractional knapsack problem." },
  { title: "Interval Problems", description: "Merge intervals, insert interval, and meeting rooms." },
  { title: "Trie Data Structure", description: "Implement a trie for prefix search and autocomplete." },
  { title: "Bit Manipulation", description: "XOR tricks, single number, and counting set bits." },
  { title: "Math for DSA", description: "GCD/LCM, sieve of Eratosthenes, and modular exponentiation." },
  { title: "Advanced Graphs", description: "Bellman-Ford and Floyd-Warshall algorithms." },
  { title: "Minimum Spanning Tree", description: "Kruskal's and Prim's algorithm." },
  { title: "Advanced DP", description: "Palindrome partitioning and matrix chain multiplication." },
  { title: "Segment Trees", description: "Range queries with a segment tree implementation." },
  { title: "Binary Indexed Tree", description: "Fenwick tree for prefix sum updates." },
  { title: "Sliding Window Advanced", description: "Minimum window substring and longest repeating replacement." },
  { title: "Two Heaps Pattern", description: "Find the median from a data stream." },
  { title: "Backtracking Advanced", description: "N-Queens problem and Sudoku solver." },
  { title: "Graph Advanced 2", description: "Clone graph and word ladder problem." },
  { title: "String Matching", description: "KMP algorithm and Rabin-Karp pattern matching." },
  { title: "Design Problems", description: "LRU Cache and LFU Cache implementation." },
  { title: "Array Advanced", description: "Kadane's algorithm and trapping rain water." },
  { title: "Tree Advanced", description: "Lowest common ancestor and diameter of a binary tree." },
  { title: "DP on Trees", description: "House robber III and binary tree cameras." },
  { title: "Mixed Practice 1", description: "Solve 3 medium-level mixed-topic problems." },
  { title: "Mixed Practice 2", description: "Solve 3 hard-level mixed-topic problems." },
  { title: "Mock Contest 1", description: "Timed contest simulating real interview problems." },
  { title: "Mock Contest 2", description: "Timed contest with a graph and DP focus." },
  { title: "Revision Day", description: "Revise weak topics identified from the past 58 days." },
  { title: "Final Assessment", description: "Comprehensive test covering all major DSA topics." },
];

const development: DayContent[] = [
  { title: "HTML Fundamentals", description: "Semantic tags, forms, and accessibility basics." },
  { title: "CSS Fundamentals", description: "Box model and flexbox layout basics." },
  { title: "CSS Grid", description: "Build a responsive grid-based layout." },
  { title: "Responsive Design", description: "Media queries and mobile-first design principles." },
  { title: "JavaScript Basics", description: "Variables, data types, and operators." },
  { title: "JS Functions & Scope", description: "Closures, hoisting, and scope chains." },
  { title: "DOM Manipulation", description: "Select and manipulate elements dynamically." },
  { title: "Events & Listeners", description: "Handle click, form, and keyboard events." },
  { title: "Async JavaScript", description: "Promises, async/await, and the fetch API." },
  { title: "ES6+ Features", description: "Destructuring, spread/rest, and arrow functions." },
  { title: "Git & GitHub", description: "Branching, commits, and pull request workflow." },
  { title: "Project: Landing Page", description: "Build and deploy a static landing page." },
  { title: "React Basics", description: "Components, JSX, and props." },
  { title: "React State", description: "useState and controlled components." },
  { title: "React Effects", description: "useEffect and side-effect handling." },
  { title: "React Hooks Advanced", description: "useRef, useMemo, and useCallback." },
  { title: "React Router", description: "Client-side routing with React Router." },
  { title: "Context API", description: "Global state management without external libraries." },
  { title: "Forms in React", description: "Form validation and controlled inputs." },
  { title: "Project: Todo App", description: "Build a full-featured todo app in React." },
  { title: "Tailwind CSS", description: "Utility-first styling and responsive design." },
  { title: "Component Libraries", description: "Using shadcn/ui or similar component systems." },
  { title: "Next.js Basics", description: "File-based routing and pages." },
  { title: "Next.js App Router", description: "Layouts, server components, and routing." },
  { title: "Data Fetching in Next.js", description: "Server-side fetching and caching strategies." },
  { title: "API Routes", description: "Building backend endpoints inside Next.js." },
  { title: "Node.js Basics", description: "Modules, npm, and the event loop." },
  { title: "Express.js Basics", description: "Building a REST API with Express." },
  { title: "REST API Design", description: "Designing clean, RESTful endpoints." },
  { title: "Project: Blog API", description: "Build a CRUD API for a blogging platform." },
  { title: "Databases Intro", description: "SQL vs NoSQL fundamentals." },
  { title: "MongoDB Basics", description: "Collections, documents, and queries." },
  { title: "Mongoose ODM", description: "Schemas, models, and validation." },
  { title: "SQL Basics", description: "Writing SELECT, JOIN, and aggregate queries." },
  { title: "Authentication Basics", description: "Sessions vs tokens and password hashing." },
  { title: "JWT Authentication", description: "Implementing token-based auth flows." },
  { title: "OAuth & Social Login", description: "Google/GitHub login with NextAuth." },
  { title: "Authorization & Roles", description: "Role-based access control implementation." },
  { title: "File Uploads", description: "Handling image/file uploads with Cloudinary." },
  { title: "Project: Auth System", description: "Build a full authentication system." },
  { title: "Testing Basics", description: "Unit testing with Jest." },
  { title: "Testing React", description: "Component testing with React Testing Library." },
  { title: "TypeScript Basics", description: "Types, interfaces, and generics." },
  { title: "TypeScript in React", description: "Typing props, state, and hooks." },
  { title: "Performance Optimization", description: "Lazy loading, code splitting, and memoization." },
  { title: "SEO Fundamentals", description: "Meta tags, sitemaps, and structured data." },
  { title: "Accessibility (a11y)", description: "ARIA roles and keyboard navigation." },
  { title: "Docker Basics", description: "Containerizing a Node.js application." },
  { title: "CI/CD Basics", description: "Automating deployment with GitHub Actions." },
  { title: "Deployment", description: "Deploying to Vercel, Render, or Railway." },
  { title: "WebSockets", description: "Real-time communication with Socket.io." },
  { title: "Project: Chat App", description: "Build a real-time chat application." },
  { title: "State Management", description: "Redux or Zustand for complex app state." },
  { title: "GraphQL Basics", description: "Queries, mutations, and schema design." },
  { title: "Caching Strategies", description: "Redis caching for API responses." },
  { title: "Microservices Intro", description: "Splitting a monolith into services." },
  { title: "Web Security", description: "XSS, CSRF, and secure headers." },
  { title: "Project: Full-Stack App", description: "Combine everything into one project." },
  { title: "Code Review Practice", description: "Refactor and review a peer's codebase." },
  { title: "Portfolio Polish", description: "Deploy and document all 60-day projects." },
];

const systemDesign: DayContent[] = [
  { title: "What is System Design", description: "Functional vs non-functional requirements overview." },
  { title: "Client-Server Model", description: "Basics of requests, responses, and APIs." },
  { title: "Networking Basics", description: "TCP/IP, DNS, and HTTP fundamentals." },
  { title: "Scalability Basics", description: "Vertical vs horizontal scaling concepts." },
  { title: "Load Balancing", description: "Load balancer types and algorithms." },
  { title: "Caching Fundamentals", description: "Cache-aside and write-through strategies." },
  { title: "CDN & Edge", description: "Content delivery networks and edge caching." },
  { title: "Database Basics", description: "Relational vs NoSQL trade-offs." },
  { title: "Database Indexing", description: "How indexes speed up queries." },
  { title: "Database Replication", description: "Master-slave and multi-master replication." },
  { title: "Database Sharding", description: "Horizontal partitioning strategies." },
  { title: "CAP Theorem", description: "Consistency, availability, and partition tolerance trade-offs." },
  { title: "Consistency Models", description: "Strong vs eventual consistency." },
  { title: "Message Queues", description: "Kafka/RabbitMQ basics for async processing." },
  { title: "Pub-Sub Systems", description: "Event-driven architecture fundamentals." },
  { title: "API Gateway", description: "Routing, rate limiting, and auth at the gateway." },
  { title: "Rate Limiting", description: "Token bucket and sliding window algorithms." },
  { title: "Microservices Basics", description: "Benefits and trade-offs of microservices." },
  { title: "Service Discovery", description: "How microservices find each other." },
  { title: "Case Study: URL Shortener", description: "Design a scalable URL shortening service." },
  { title: "Case Study: Pastebin", description: "Design a text-sharing service like Pastebin." },
  { title: "Consistent Hashing", description: "Distributing data across nodes evenly." },
  { title: "Case Study: Rate Limiter", description: "Design a distributed rate limiter." },
  { title: "Case Study: Chat App", description: "Design a scalable real-time chat system." },
  { title: "Case Study: News Feed", description: "Design a social media news feed." },
  { title: "Fan-out Strategies", description: "Push vs pull models for feed generation." },
  { title: "Case Study: Notification System", description: "Design a push notification service." },
  { title: "Case Study: Search Autocomplete", description: "Design a typeahead suggestion system." },
  { title: "Case Study: File Storage", description: "Design a system like Google Drive." },
  { title: "Case Study: Video Streaming", description: "Design a service like YouTube." },
  { title: "Case Study: Ride Sharing", description: "Design a system like Uber." },
  { title: "Case Study: E-commerce", description: "Design an online shopping platform." },
  { title: "Case Study: Payment System", description: "Design a secure payment processing flow." },
  { title: "Idempotency", description: "Ensuring safe retries in distributed systems." },
  { title: "Distributed Locks", description: "Preventing race conditions across services." },
  { title: "Leader Election", description: "Consensus basics with Raft/Paxos overview." },
  { title: "Data Partitioning", description: "Range-based vs hash-based partitioning." },
  { title: "Monitoring & Logging", description: "Observability with metrics, logs, and traces." },
  { title: "Health Checks & Failover", description: "Detecting and recovering from failures." },
  { title: "Case Study: Web Crawler", description: "Design a distributed web crawler." },
  { title: "Case Study: Leaderboard", description: "Design a real-time gaming leaderboard." },
  { title: "Case Study: Metrics System", description: "Design a time-series metrics platform." },
  { title: "Case Study: Ticket Booking", description: "Design a movie/event booking system." },
  { title: "Case Study: Food Delivery", description: "Design a system like Swiggy or Zomato." },
  { title: "Case Study: Dropbox", description: "Design a file sync and storage service." },
  { title: "Case Study: Instagram", description: "Design a photo-sharing social platform." },
  { title: "Case Study: WhatsApp", description: "Design an end-to-end messaging system." },
  { title: "Case Study: Twitter/X", description: "Design a microblogging platform." },
  { title: "Security in System Design", description: "Encryption, auth, and secure APIs." },
  { title: "Data Backup & Recovery", description: "Designing for disaster recovery." },
  { title: "Multi-Region Architecture", description: "Designing globally distributed systems." },
  { title: "Cost Optimization", description: "Trade-offs between performance and cost." },
  { title: "Capacity Estimation", description: "Back-of-envelope calculations for scale." },
  { title: "Trade-off Discussions", description: "SQL vs NoSQL decision frameworks." },
  { title: "Mock Interview 1", description: "Practice a full system design interview." },
  { title: "Mock Interview 2", description: "Practice designing a system end-to-end." },
  { title: "Review Weak Areas", description: "Revisit topics that felt unclear." },
  { title: "Read Real Architectures", description: "Study a real company's engineering blog." },
  { title: "Design Doc Practice", description: "Write a formal system design document." },
  { title: "Final Mock Interview", description: "Simulate a complete design interview." },
];

const mern: DayContent[] = [
  { title: "MongoDB Basics", description: "CRUD operations and BSON data types." },
  { title: "MongoDB Queries", description: "Filtering, projection, and sorting documents." },
  { title: "MongoDB Aggregation", description: "Aggregation pipeline basics." },
  { title: "Mongoose Schemas", description: "Defining schemas and validation rules." },
  { title: "Mongoose Relationships", description: "References and population between collections." },
  { title: "Express Basics", description: "Routing and middleware fundamentals." },
  { title: "Express Middleware", description: "Custom middleware and error handling." },
  { title: "Express + MongoDB", description: "Connecting Express to MongoDB with Mongoose." },
  { title: "REST API Design", description: "Structuring clean, RESTful routes." },
  { title: "CRUD API Project", description: "Build a complete CRUD API." },
  { title: "React Fundamentals", description: "Components, props, and JSX recap." },
  { title: "React State Management", description: "useState and lifting state up." },
  { title: "React + Axios", description: "Fetching data from your Express API." },
  { title: "React Forms", description: "Building and validating forms." },
  { title: "React Router Setup", description: "Client-side routing for the MERN app." },
  { title: "Project: Task Manager", description: "Build a full-stack task manager app." },
  { title: "User Schema Design", description: "Designing a User model with Mongoose." },
  { title: "Password Hashing", description: "Using bcrypt for secure password storage." },
  { title: "JWT Auth Backend", description: "Issue and verify JWT tokens." },
  { title: "JWT Auth Frontend", description: "Store and use tokens in React." },
  { title: "Protected Routes", description: "Restrict access to authenticated users." },
  { title: "Refresh Tokens", description: "Implementing a token refresh flow." },
  { title: "NextAuth Integration", description: "Social login with Google/GitHub." },
  { title: "Role-Based Access", description: "Admin vs user permissions." },
  { title: "File Uploads Backend", description: "Multer and Cloudinary integration." },
  { title: "File Uploads Frontend", description: "Image upload UI and preview." },
  { title: "Project: Auth Starter", description: "Build a reusable auth starter kit." },
  { title: "State with Context API", description: "Global state without Redux." },
  { title: "Zustand/Redux Basics", description: "Managing complex app state." },
  { title: "Error Handling Patterns", description: "Consistent API error responses." },
  { title: "Pagination", description: "Implementing paginated API responses." },
  { title: "Search & Filtering", description: "Query-based search endpoints." },
  { title: "Real-time with Socket.io", description: "Setting up WebSocket connections." },
  { title: "Project: Chat Feature", description: "Add real-time chat to your app." },
  { title: "Notifications System", description: "In-app notification schema and delivery." },
  { title: "Email Integration", description: "Sending emails with Nodemailer." },
  { title: "Environment Config", description: "Managing secrets and env variables safely." },
  { title: "Testing APIs", description: "Testing Express routes with Jest/Supertest." },
  { title: "Testing React Components", description: "Component testing basics." },
  { title: "Project: E-commerce Backend", description: "Build product and order APIs." },
  { title: "Payment Integration", description: "Stripe/Razorpay checkout flow." },
  { title: "Cart & Checkout UI", description: "Build the shopping cart experience." },
  { title: "Admin Dashboard", description: "CRUD interface for managing data." },
  { title: "Data Validation", description: "Zod/Joi for request validation." },
  { title: "Rate Limiting API", description: "Protecting APIs from abuse." },
  { title: "Caching with Redis", description: "Speeding up repeated queries." },
  { title: "Logging & Monitoring", description: "Structured logging for debugging." },
  { title: "Docker for MERN", description: "Containerizing frontend and backend." },
  { title: "CI/CD Setup", description: "Automated testing and deployment pipeline." },
  { title: "Deployment: Backend", description: "Deploy the Express API to Render/Railway." },
  { title: "Deployment: Frontend", description: "Deploy the React/Next app to Vercel." },
  { title: "Custom Domain & SSL", description: "Connecting a domain to your app." },
  { title: "Performance Tuning", description: "Optimizing MongoDB queries and indexes." },
  { title: "SEO for MERN Apps", description: "Meta tags and server rendering basics." },
  { title: "Security Hardening", description: "Helmet, CORS, and sanitization." },
  { title: "Project: Social App", description: "Build a mini social media clone." },
  { title: "Code Review & Refactor", description: "Clean up and refactor your codebase." },
  { title: "Documentation", description: "Write API docs and a README." },
  { title: "Final Project Polish", description: "Bug fixes and a UI polish pass." },
  { title: "Deploy & Showcase", description: "Final deployment and portfolio write-up." },
];

const categories: Record<string, DayContent[]> = {
  dsa,
  development,
  "system-design": systemDesign,
  mern,
};

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const ops: mongoose.AnyBulkWriteOperation[] = [];

  for (const [category, days] of Object.entries(categories)) {
    days.forEach((content, index) => {
      const day = index + 1;
      ops.push({
        updateOne: {
          filter: { category, day },
          update: {
            $setOnInsert: {
              category,
              day,
              title: content.title,
              description: content.description,
              status: "pending",
            },
          },
          upsert: true,
        },
      });
    });
  }

  const result = await ChallengeTask.bulkWrite(ops);
  console.log(`Seed complete: ${result.upsertedCount} new, ${result.matchedCount} already existed`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});