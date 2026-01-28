import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <div className="text-2xl font-bold">DesignCase AI</div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-4">
          AI-Powered Design Case Studies
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Transform your design files into compelling case studies with the power
          of AI. Upload, analyze, and publish in minutes.
        </p>
        <div className="flex gap-4">
          <Link href="/signup">
            <Button size="lg">Start Free</Button>
          </Link>
          <Link href="https://github.com/designcase-ai/designcase-ai">
            <Button size="lg" variant="outline">
              View on GitHub
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Preview */}
      <section className="bg-muted px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Upload or Import',
                description:
                  'Upload design files or import directly from Figma.',
              },
              {
                title: 'AI Analysis',
                description:
                  'Automatic AI analysis of colors, typography, and components.',
              },
              {
                title: '3D Showcase',
                description:
                  'Publish case studies in immersive 3D templates.',
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6 bg-card rounded-lg">
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-12 text-center text-muted-foreground">
        <p>
          © 2024 DesignCase AI. Open source and free to use.{' '}
          <Link href="https://github.com" className="underline hover:text-foreground">
            GitHub
          </Link>
        </p>
      </footer>
    </main>
  );
}
