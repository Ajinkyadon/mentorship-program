# Module 10: Next.js — React Ka Supercharged Version

> **Target Audience:** Working professionals jo full-stack development seekh rahe hain  
> **Prerequisites:** React basics (components, hooks, state)  
> **Style:** Hinglish explanations, production-ready code  
> **Time Required:** ~15-18 hours

---

## 1. Why Next.js — Plain React Se Kya Problems Tha?

### Analogy: Thela vs Restaurant

Plain React = **Thela** — khana banao, khud serve karo, khud hi sab handle karo. Simple hai, lekin zyada customers aaye toh problem.

Next.js = **Restaurant** — kitchen (server), menu (routing), waiter (data fetching), sab pre-organized hai. Scaling asan, SEO ready, performance optimized.

### Plain React ke Problems

```
Problem 1: SEO ❌
─────────────────
Browser React app download karta hai
→ JavaScript run karta hai
→ Tab HTML generate hota hai
→ Jab tak Google bot page crawl karta hai, HTML empty hota hai
→ SEO kharab hota hai

Problem 2: Performance ❌
─────────────────────────
User ko dikhne se pehle:
1. HTML download (empty)
2. React bundle download (bhara hua, ~1MB+)
3. JavaScript parse + execute
4. Data fetch
5. Re-render
→ Slow First Contentful Paint (FCP)

Problem 3: Routing Setup ❌
───────────────────────────
react-router-dom manually setup karo
Nested routes manually configure karo

Problem 4: API Backend ❌
──────────────────────────
Alag Express server chahiye
CORS setup karo
Deploy separately karo
```

### Next.js Solutions

```
✓ SSR (Server-Side Rendering): Server pe HTML ready → SEO perfect
✓ SSG (Static Site Generation): Build time pe HTML bana do → Ultra fast
✓ File-based routing: folder = route, koi config nahi
✓ API Routes: Same project mein backend bhi
✓ Image optimization: Automatic WebP, lazy loading
✓ Code splitting: Sirf zaroorat ka code load
```

---

## 2. App Router vs Pages Router

### Pages Router (Next.js 12 aur pehle) — Purana tarika
```
pages/
  index.js          → /
  about.js          → /about
  blog/[id].js      → /blog/123
  api/users.js      → /api/users  (API endpoint)
```

### App Router (Next.js 13.4+ aur 2024 mein recommended) — Naya tarika
```
app/
  page.tsx          → /
  layout.tsx        → Root layout (har page pe wrap hota hai)
  about/
    page.tsx        → /about
  blog/
    [id]/
      page.tsx      → /blog/123
  api/
    users/
      route.ts      → /api/users (API endpoint)
```

### 2024 Mein Konsa Use Karein?
```
New projects → App Router (React Server Components, better performance)
Existing Pages Router projects → migrate karo slowly, dono sath kaam karte hain
```

---

## 3. File-Based Routing — Folder = Route

### Setup
```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app
cd my-app
npm run dev  # localhost:3000 pe chalega
```

### Special Files
```
app/
├── layout.tsx        # Root layout — sab pages ko wrap karta hai
├── page.tsx          # Home page (/)
├── loading.tsx       # Loading UI (Suspense fallback)
├── error.tsx         # Error boundary
├── not-found.tsx     # 404 page
├── globals.css
│
├── about/
│   └── page.tsx      # /about
│
├── blog/
│   ├── page.tsx      # /blog (blog list)
│   └── [slug]/       # Dynamic route
│       ├── page.tsx  # /blog/my-post
│       └── loading.tsx
│
├── dashboard/
│   ├── layout.tsx    # Dashboard ka apna layout (sidebar etc)
│   ├── page.tsx      # /dashboard
│   └── settings/
│       └── page.tsx  # /dashboard/settings
│
└── api/
    └── users/
        └── route.ts  # /api/users
```

### layout.tsx — Root Layout
```tsx
// app/layout.tsx — Sabse bahar ka wrapper, ek baar render hota hai
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

// Google font — automatically optimize karta hai Next.js
const inter = Inter({ subsets: ['latin'] });

// Default metadata — har page pe apply hota hai
export const metadata: Metadata = {
    title: {
        default: 'My App',
        template: '%s | My App',  // page title → "About | My App"
    },
    description: 'A full-stack Next.js application',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    {children}  {/* Har page yahan render hoga */}
                </main>
            </body>
        </html>
    );
}
```

### loading.tsx — Loading State
```tsx
// app/blog/loading.tsx — Blog page load hote waqt dikhega
// Automatically Suspense mein wrap hota hai
export default function BlogLoading() {
    return (
        <div className="space-y-4">
            {/* Skeleton UI */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
            ))}
        </div>
    );
}
```

### error.tsx — Error Boundary
```tsx
// app/error.tsx — Koi bhi unhandled error yahan aata hai
'use client'; // Error boundaries client component hote hain

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;  // retry karne ka function
}) {
    useEffect(() => {
        // Error logging service (Sentry etc.)
        console.error('App error:', error);
    }, [error]);

    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-600">Kuch galat ho gaya!</h2>
            <p className="text-gray-600 mt-2">{error.message}</p>
            <button
                onClick={reset}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
            >
                Dobara try karo
            </button>
        </div>
    );
}
```

### Dynamic Routes
```tsx
// app/blog/[slug]/page.tsx
// URL: /blog/my-first-post → slug = "my-first-post"

// Params type
type Props = {
    params: { slug: string };
    searchParams: { [key: string]: string | undefined };  // ?page=2
};

export default async function BlogPost({ params, searchParams }: Props) {
    const post = await fetchPost(params.slug);

    if (!post) {
        notFound();  // 404 page dikhao — app/not-found.tsx
    }

    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </article>
    );
}

// Static paths pre-generate karo (SSG ke liye)
export async function generateStaticParams() {
    const posts = await fetchAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
}
```

---

## 4. Server Components vs Client Components

### Mental Model — Sabse Important Concept

```
Server Components (Default in App Router)
─────────────────────────────────────────
• Server pe run hote hain
• Client ko sirf HTML milta hai — koi JavaScript nahi
• Direct database access kar sakte hain
• async/await use kar sakte hain
• useState, useEffect, event handlers NAHI use kar sakte
• Faster, SEO friendly

Client Components ('use client' directive)
──────────────────────────────────────────
• Browser pe run hote hain
• Interactive hote hain — buttons, forms, animations
• useState, useEffect, event handlers use kar sakte hain
• Database directly access NAHI kar sakte (browser pe code chalta hai!)
• LocalStorage, cookies access kar sakte hain
```

### Kab Kya Use Karein?

```
Server Component use karo jab:        Client Component use karo jab:
✓ Data fetch karna hai                ✓ Button click handler chahiye
✓ Database query karna hai            ✓ useState/useEffect chahiye
✓ Sensitive data (API keys)           ✓ Browser APIs (localStorage)
✓ Static content                      ✓ Real-time updates (WebSocket)
✓ SEO important hai                   ✓ User interactions
```

### Code Example
```tsx
// app/products/page.tsx — Server Component (DEFAULT, 'use client' nahi hai)
import { ProductCard } from '@/components/ProductCard';
import { AddToCartButton } from '@/components/AddToCartButton';

// Direct database access — server pe hota hai, client ko pata nahi chalta
async function getProducts() {
    // Yahan fetch, database query, ya kuch bhi kar sakte ho
    const res = await fetch('https://api.example.com/products', {
        cache: 'no-store',  // Fresh data har baar
    });
    return res.json();
}

export default async function ProductsPage() {
    // async/await directly — server component mein allowed hai!
    const products = await getProducts();

    return (
        <div className="grid grid-cols-3 gap-4">
            {products.map((product) => (
                <div key={product.id}>
                    {/* ProductCard — Server Component — static content */}
                    <ProductCard product={product} />

                    {/* AddToCartButton — Client Component — interactive */}
                    <AddToCartButton productId={product.id} />
                </div>
            ))}
        </div>
    );
}
```

```tsx
// components/AddToCartButton.tsx — Client Component
'use client'; // Yeh directive likhna ZAROOR hai top pe

import { useState } from 'react';

type Props = { productId: number };

export function AddToCartButton({ productId }: Props) {
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);

    async function handleAddToCart() {
        setLoading(true);
        try {
            await fetch('/api/cart', {
                method: 'POST',
                body: JSON.stringify({ productId }),
                headers: { 'Content-Type': 'application/json' },
            });
            setAdded(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={loading || added}
            className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
            {added ? '✓ Cart Mein Hai' : loading ? 'Adding...' : 'Cart Mein Daalo'}
        </button>
    );
}
```

---

## 5. Data Fetching — Server Components Mein

```tsx
// app/posts/page.tsx

// Cache options:
// cache: 'force-cache'  → hamesha cache se (SSG jaisa)
// cache: 'no-store'     → kabhi cache mat karo (SSR jaisa)
// next: { revalidate: 60 } → 60 seconds baad fresh data (ISR jaisa)

// SSG behavior — build time pe data fetch, cache forever
async function getStaticData() {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        cache: 'force-cache',
    });
    if (!res.ok) throw new Error('Data nahi mila');
    return res.json();
}

// ISR behavior — 60 seconds baad revalidate
async function getRevalidatedData() {
    const res = await fetch('https://api.example.com/posts', {
        next: { revalidate: 60 },  // 60 second mein stale ho jaayega
    });
    return res.json();
}

// SSR behavior — har request pe fresh
async function getFreshData() {
    const res = await fetch('https://api.example.com/posts', {
        cache: 'no-store',  // Ya: next: { revalidate: 0 }
    });
    return res.json();
}

export default async function PostsPage() {
    const posts = await getStaticData();

    return (
        <ul>
            {posts.slice(0, 10).map((post: any) => (
                <li key={post.id} className="border-b py-2">
                    <h3 className="font-bold">{post.title}</h3>
                    <p className="text-gray-600 text-sm">{post.body}</p>
                </li>
            ))}
        </ul>
    );
}
```

### Parallel Data Fetching
```tsx
// app/dashboard/page.tsx
// Dono fetches parallel chalenge — zyada fast!
export default async function Dashboard() {
    // Sequential (GALAT — slow):
    // const user = await fetchUser();
    // const orders = await fetchOrders(); // pehle user ka wait karega

    // Parallel (SAHI — fast):
    const [user, orders, stats] = await Promise.all([
        fetchUser(),
        fetchOrders(),
        fetchStats(),
    ]);

    return (
        <div>
            <h1>Welcome, {user.name}</h1>
            <p>Total Orders: {orders.length}</p>
            <p>Revenue: ₹{stats.revenue}</p>
        </div>
    );
}
```

---

## 6. SSR vs SSG vs ISR

```
SSR (Server-Side Rendering)
───────────────────────────
Kab: Har user request pe server fresh HTML banata hai
Use case: User-specific data (dashboard, profile)
          Real-time data (stock prices)
Code: cache: 'no-store' ya cookies/headers access

SSG (Static Site Generation)
─────────────────────────────
Kab: Build time pe sab HTML ready ho jaata hai
Use case: Blog posts, marketing pages, docs
          Data jo rarely change hota hai
Code: cache: 'force-cache' (default)

ISR (Incremental Static Regeneration)
──────────────────────────────────────
Kab: Static page + periodic update
Use case: Product catalog, news articles
          Data jo kaafi frequently change ho lekin real-time zaroor nahi
Code: next: { revalidate: 60 }
```

```tsx
// SSR Example — user-specific page
// app/profile/page.tsx
import { cookies } from 'next/headers';

export default async function ProfilePage() {
    // cookies() ya headers() access karna automatically SSR force karta hai
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) redirect('/login');

    const user = await fetchUserFromToken(token);

    return <div>Welcome, {user.name}</div>;
}

// SSG Example — blog post
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
    const posts = await getAllPostSlugs();
    return posts.map((slug) => ({ slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug); // Cached at build time
    return <article>{post.content}</article>;
}

// ISR Example — product page
// app/products/[id]/page.tsx
export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await fetch(`/api/products/${params.id}`, {
        next: { revalidate: 300 }, // 5 minute mein refresh
    }).then(r => r.json());

    return <div>{product.name} — ₹{product.price}</div>;
}
```

---

## 7. API Routes — route.ts

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // apna db connection

// GET /api/users
export async function GET(request: NextRequest) {
    try {
        // Query params
        const searchParams = request.nextUrl.searchParams;
        const page = Number(searchParams.get('page') ?? 1);
        const limit = Number(searchParams.get('limit') ?? 10);

        const users = await db.user.findMany({
            skip: (page - 1) * limit,
            take: limit,
            select: { id: true, name: true, email: true, city: true }, // password nahi!
        });

        return NextResponse.json({
            data: users,
            page,
            limit,
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Users load nahi hue' },
            { status: 500 }
        );
    }
}

// POST /api/users
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email aur password required hai' },
                { status: 400 }
            );
        }

        // Password hash karo (kabhi plain text nahi!)
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await db.user.create({
            data: { name, email, passwordHash: hashedPassword },
            select: { id: true, name: true, email: true }, // password return mat karo
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002') { // Prisma unique constraint violation
            return NextResponse.json(
                { error: 'Yeh email already registered hai' },
                { status: 409 }
            );
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// app/api/users/[id]/route.ts — Dynamic API route
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await db.user.findUnique({
        where: { id: Number(params.id) },
    });

    if (!user) {
        return NextResponse.json({ error: 'User nahi mila' }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const body = await request.json();
    const updated = await db.user.update({
        where: { id: Number(params.id) },
        data: body,
    });
    return NextResponse.json(updated);
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    await db.user.delete({ where: { id: Number(params.id) } });
    return new NextResponse(null, { status: 204 });
}
```

### Middleware
```tsx
// middleware.ts — Root pe (next.config ke paas)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const pathname = request.nextUrl.pathname;

    // Protected routes
    const protectedPaths = ['/dashboard', '/profile', '/api/users'];
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    if (isProtected && !token) {
        // API request hai toh JSON error, warna redirect
        if (pathname.startsWith('/api')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/api/:path*'],
};
```

---

## 8. Next.js Image Component

```tsx
// components/ProductImage.tsx
import Image from 'next/image';

export function ProductImage({ src, alt, name }: { src: string; alt: string; name: string }) {
    return (
        <div className="relative">
            {/* Next.js Image — automatic optimization */}
            <Image
                src={src}
                alt={alt}
                width={400}   // required (ya fill prop use karo)
                height={300}
                // Optimization features:
                priority={false}       // false = lazy load (default) — viewport mein aane pe load
                placeholder="blur"     // blurred preview jab tak load ho
                blurDataURL="data:image/jpeg;base64,/9j..."  // tiny base64 image
                sizes="(max-width: 768px) 100vw, 400px"  // responsive hints
                className="rounded-lg object-cover"
                onError={(e) => {
                    // Image load fail ho toh fallback
                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                }}
            />
        </div>
    );
}

// Fill mode — parent container ko fill karta hai
export function HeroBanner() {
    return (
        <div className="relative w-full h-96">
            <Image
                src="/hero.jpg"
                alt="Hero Banner"
                fill                   // parent ko fill karta hai
                priority               // LCP image — preload karo (above the fold)
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h1 className="text-white text-4xl font-bold">Welcome!</h1>
            </div>
        </div>
    );
}
```

### next.config.js — External Images Allow Karna
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',  // Unsplash images allow karo
            },
            {
                protocol: 'https',
                hostname: '**.amazonaws.com',      // S3 buckets
            },
        ],
    },
};

module.exports = nextConfig;
```

---

## 9. Metadata API — SEO

```tsx
// app/blog/[slug]/page.tsx — Dynamic Metadata

import type { Metadata } from 'next';

type Props = { params: { slug: string } };

// Static metadata (simple pages ke liye)
export const metadata: Metadata = {
    title: 'Blog',
    description: 'Our latest articles',
};

// Dynamic metadata (dynamic pages ke liye)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await fetchPost(params.slug);

    if (!post) {
        return { title: 'Post Nahi Mila' };
    }

    return {
        title: post.title,  // layout.tsx mein template se: "Post Title | My App"
        description: post.excerpt,
        authors: [{ name: post.author }],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [
                {
                    url: post.coverImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            type: 'article',
            publishedTime: post.publishedAt,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage],
        },
        // Canonical URL — duplicate content problem se bachao
        alternates: {
            canonical: `https://myapp.com/blog/${params.slug}`,
        },
    };
}
```

---

## 10. Environment Variables

```bash
# .env.local — Development ke liye (git mein mat dalo!)
# .env.production — Production ke liye

# Server-only variables (browser pe accessible NAHI)
DATABASE_URL=postgresql://...
JWT_SECRET=super-secret-key-123
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...

# Client-side variables (NEXT_PUBLIC_ prefix lagao)
# DHYAN: Yeh browser pe visible hote hain — secrets mat dalo!
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIza...
```

```tsx
// Server Component ya API Route mein — server-only vars accessible hain
async function sendEmail() {
    const apiKey = process.env.SENDGRID_API_KEY; // Works fine server pe
    // ...
}

// Client Component mein — sirf NEXT_PUBLIC_ vars accessible hain
'use client';
function PaymentForm() {
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY; // OK
    const dbUrl = process.env.DATABASE_URL; // undefined hoga — browser pe nahi milega!
}

// Type safety ke liye — env.ts file banao
// lib/env.ts
function getEnvVar(name: string, required = true): string {
    const value = process.env[name];
    if (!value && required) {
        throw new Error(`Environment variable ${name} set nahi hai!`);
    }
    return value ?? '';
}

export const env = {
    databaseUrl: getEnvVar('DATABASE_URL'),
    jwtSecret: getEnvVar('JWT_SECRET'),
    nextPublicAppUrl: getEnvVar('NEXT_PUBLIC_APP_URL'),
};
```

---

## 11. Authentication with NextAuth.js (Auth.js)

### Setup
```bash
npm install next-auth@beta @auth/prisma-adapter
```

### auth.ts — Configuration
```typescript
// auth.ts (root pe)
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),

    providers: [
        // Google login
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        // Email + Password login
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.passwordHash) return null;

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordHash
                );

                if (!isValid) return null;

                return { id: String(user.id), name: user.name, email: user.email };
            },
        }),
    ],

    session: { strategy: 'jwt' },

    callbacks: {
        // JWT mein extra data add karo
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        // Session mein extra data add karo
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },

    pages: {
        signIn: '/login',    // Custom login page
        error: '/auth/error',
    },
});
```

### API Route — Auth Handler
```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

### Login Page
```tsx
// app/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,  // Hum manually handle karenge
        });

        if (result?.error) {
            setError('Email ya password galat hai');
        } else {
            router.push('/dashboard');
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Login Karo</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                    Login
                </button>
            </form>

            <div className="mt-4">
                <button
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    className="w-full border py-2 rounded flex items-center justify-center gap-2"
                >
                    Google se Login Karo
                </button>
            </div>
        </div>
    );
}
```

### Protected Routes — Server Component
```tsx
// app/dashboard/page.tsx — Protected Server Component
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    // Server pe session check karo
    const session = await auth();

    if (!session) {
        redirect('/login'); // Login nahi hai toh redirect
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session.user?.name}!</p>
            <p>Email: {session.user?.email}</p>
        </div>
    );
}
```

---

## 12. Deployment to Vercel

### Steps
```bash
# 1. GitHub pe push karo
git add .
git commit -m "Next.js app ready"
git push origin main

# 2. vercel.com pe jaao → New Project → GitHub se import
# 3. Framework: Next.js (automatically detect hota hai)
# 4. Environment Variables add karo (Settings → Environment Variables)
# 5. Deploy!
```

### Environment Variables on Vercel
```
Settings → Environment Variables mein add karo:
- DATABASE_URL        → Production DB (Neon.tech ya PlanetScale)
- NEXTAUTH_SECRET     → Random string (openssl rand -base64 32)
- NEXTAUTH_URL        → https://yourdomain.vercel.app
- GOOGLE_CLIENT_ID    → Google Console se
- GOOGLE_CLIENT_SECRET → Google Console se
```

### Preview Deployments
```
Har PR pe automatic preview deployment milta hai:
main branch → Production (yourdomain.com)
feature/xyz branch → Preview (xyz-yourdomain.vercel.app)

Team members preview URL pe test kar sakte hain merge se pehle!
```

### vercel.json — Advanced Config
```json
{
  "functions": {
    "app/api/**": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

---

## 13. Performance — Streaming aur Suspense

### Streaming — Page Ko Parts Mein Bhejo
```tsx
// app/dashboard/page.tsx — Streaming with Suspense
import { Suspense } from 'react';
import { UserProfile } from './UserProfile';
import { OrderList } from './OrderList';
import { StatsCards } from './StatsCards';

// Bina Streaming: Sabse slow component ka wait karo phir page bhejo
// Streaming se: Jab jab component ready ho, bhejo — user tezi se content dekhta hai

export default function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>

            {/* Stats fast load hoti hain */}
            <Suspense fallback={<StatsLoading />}>
                <StatsCards />  {/* Ek second mein load */}
            </Suspense>

            {/* Profile thodi der leti hai */}
            <Suspense fallback={<ProfileSkeleton />}>
                <UserProfile />  {/* 2 second mein load */}
            </Suspense>

            {/* Orders sabse slow */}
            <Suspense fallback={<OrderSkeleton />}>
                <OrderList />  {/* 3 second mein load */}
            </Suspense>
        </div>
    );
}

// Bina Streaming: 3 second wait phir sab ek saath dikhe
// Streaming se: 1 second mein stats, 2 mein profile, 3 mein orders — progressive!
```

### Parallel Streaming — Alag Suspense Boundaries
```tsx
// components/StatsCards.tsx — Server Component
async function getStats() {
    await new Promise(r => setTimeout(r, 1000)); // Simulate slow query
    return { users: 1250, orders: 3400, revenue: 125000 };
}

export async function StatsCards() {
    const stats = await getStats(); // Server pe fetch, client ko HTML bhejo

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
                <p className="text-2xl font-bold">{stats.users}</p>
                <p className="text-gray-600">Total Users</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
                <p className="text-2xl font-bold">{stats.orders}</p>
                <p className="text-gray-600">Orders</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
                <p className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</p>
                <p className="text-gray-600">Revenue</p>
            </div>
        </div>
    );
}
```

### Server Actions — Form Submit Without API Route
```tsx
// app/contact/page.tsx — Server Action
import { revalidatePath } from 'next/cache';

// Server Action — 'use server' directive
async function submitContactForm(formData: FormData) {
    'use server'; // Yeh function server pe run hoga

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Database mein save karo — directly! API route ki zaroorat nahi
    await prisma.contactMessage.create({
        data: { name, email, message },
    });

    // Page refresh karo
    revalidatePath('/contact');
}

export default function ContactPage() {
    return (
        <form action={submitContactForm} className="space-y-4 max-w-md">
            <input name="name" placeholder="Aapka naam" className="w-full border p-2 rounded" required />
            <input name="email" type="email" placeholder="Email" className="w-full border p-2 rounded" required />
            <textarea name="message" placeholder="Message" rows={4} className="w-full border p-2 rounded" required />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                Bhejo
            </button>
        </form>
    );
}
```

---

## Interview Q&A

**Q1: Next.js use karne ke kya fayde hain plain React ke mukable?**  
A: SEO ke liye SSR/SSG, file-based routing (react-router ki zaroorat nahi), built-in API routes (alag backend nahi), image optimization, automatic code splitting, aur Vercel pe easy deployment.

**Q2: App Router aur Pages Router mein kya fark hai?**  
A: App Router (Next.js 13.4+) React Server Components support karta hai, layouts nested ho sakte hain, loading/error boundaries per-route hain. Pages Router mein `getServerSideProps`/`getStaticProps` use hote hain. 2024 mein new projects ke liye App Router recommended hai.

**Q3: Server Component aur Client Component mein kab kya choose karein?**  
A: Server Component — data fetching, database access, sensitive keys, SEO content. Client Component — event handlers, useState/useEffect, browser APIs (localStorage), user interactions.

**Q4: SSR, SSG, ISR mein kya fark hai?**  
A: SSR har request pe fresh HTML banata hai (user-specific data). SSG build time pe HTML banata hai (blogs, docs). ISR static + periodic revalidation (product pages). Cache option se control hota hai.

**Q5: Middleware kya hota hai Next.js mein?**  
A: Middleware route handler se pehle run hota hai — authentication, redirects, request modification ke liye. `middleware.ts` root pe banate hain, `matcher` se routes specify karte hain.

**Q6: NEXT_PUBLIC_ prefix kab lagate hain?**  
A: Jab environment variable browser (client-side) pe bhi access karna ho. Bina prefix ke variables sirf server pe accessible hain — API keys, DB URLs kabhi NEXT_PUBLIC_ nahi karna chahiye!

---

## Assignment

### Task 1: Blog Platform Banao
Pages:
- `/` — Latest 6 posts (SSG, revalidate every hour)
- `/blog` — All posts with search + pagination (SSR)
- `/blog/[slug]` — Individual post with dynamic metadata
- `/blog/[slug]/loading.tsx` — Skeleton UI

### Task 2: Authentication Add Karo
- Google OAuth aur email/password login
- `/dashboard` page protect karo (middleware se)
- User profile page banao

### Task 3: API Routes
- `GET /api/posts` — pagination + search filter support
- `POST /api/posts` — auth check karo (Admin only)
- `PUT /api/posts/[id]` — Update post
- `DELETE /api/posts/[id]` — Soft delete

### Task 4: Performance
- Suspense boundaries add karo Dashboard pe
- Image component use karo with placeholder blur
- Lighthouse score 90+ le aao (Performance, SEO, Accessibility)

### Bonus
- Server Actions se comment system banao
- Dark mode toggle karo (localStorage persist)
- `next-intl` se Hindi/English language switching

---

*Next Module: 11-system-design.md — Scalable Architecture Patterns*
