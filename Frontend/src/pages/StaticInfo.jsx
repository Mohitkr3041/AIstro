import { Link } from 'react-router-dom';
import { Mail, Shield, Star, ScrollText } from 'lucide-react';
import { CosmicBackground } from '../components/ui/CosmicBackground';

const content = {
  privacy: {
    icon: Shield,
    title: 'Privacy',
    body: 'AIstro uses your authenticated account and saved birth details to generate personalized astrology reports and chart-aware chat responses. Keep sensitive personal information out of chat messages unless it is needed for your question.',
  },
  terms: {
    icon: ScrollText,
    title: 'Terms',
    body: 'AIstro offers reflective astrology guidance for personal insight. It does not provide medical, legal, financial, emergency, or professional advice. Use the app as a companion for self-reflection.',
  },
  contact: {
    icon: Mail,
    title: 'Contact',
    body: 'For product support, account recovery, or feature requests, contact the AIstro team through your configured support channel. This page is wired so the route is never broken while support tooling is finalized.',
  },
};

function StaticInfo({ type = 'privacy' }) {
  const page = content[type] || content.privacy;
  const Icon = page.icon;

  return (
    <main className="relative grid min-h-screen place-items-center p-4">
      <CosmicBackground />
      <section className="aistro-card relative z-10 max-w-2xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2">
          <Star className="h-8 w-8 fill-primary text-primary" />
          <span className="text-2xl font-display font-bold text-foreground">Aistro</span>
        </Link>
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
          <Icon className="h-7 w-7 text-white" />
        </div>
        <p className="aistro-kicker">Information</p>
        <h1 className="aistro-title mt-2 text-4xl">{page.title}</h1>
        <p className="mt-4 text-lg leading-8 text-foreground/75">{page.body}</p>
        <Link to="/" className="aistro-button-primary mt-8">Back Home</Link>
      </section>
    </main>
  );
}

export default StaticInfo;
