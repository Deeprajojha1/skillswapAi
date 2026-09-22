import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  ArrowRight,
  Briefcase,
  CalendarCheck,
  CreditCard,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import Button from '../../components/ui/Button.jsx';
import { selectCurrentUser } from '../../app/store/slices/authSlice.js';
import { ROUTES, USER_ROLES } from '../../lib/constants.js';
import { useRoleSwitch } from '../../hooks/useRoleSwitch.js';

const STEPS = [
  { icon: Search, title: 'Discover', description: 'Browse gigs by category, search by skill, and compare creators.' },
  { icon: CalendarCheck, title: 'Book', description: 'Send a booking request with your requirements and deadline.' },
  { icon: CreditCard, title: 'Pay securely', description: 'Pay only once a creator accepts — the price is locked in upfront.' },
  { icon: Sparkles, title: 'Get it delivered', description: 'Track progress and mark the booking complete when you’re happy.' },
];

const FEATURES = [
  { icon: Zap, title: 'Realtime updates', description: 'Booking and payment status update instantly, no refreshing.' },
  { icon: ShieldCheck, title: 'Protected bookings', description: 'A clear state machine keeps every booking accountable end to end.' },
  { icon: Briefcase, title: 'Built for creators', description: 'Publish gigs, manage requests, and grow your client base.' },
];

export default function Landing() {
  const user = useSelector(selectCurrentUser);
  const isCreator = user?.role === USER_ROLES.CREATOR;
  const switchRole = useRoleSwitch();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-indigo-50 via-white to-white">
        <PageContainer className="flex flex-col items-center py-16 text-center sm:py-24">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
          >
            <Sparkles className="h-3.5 w-3.5" /> A Creator Gig Marketplace
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl"
          >
            Hire skilled creators. <span className="text-indigo-600">Get real work done.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg"
          >
            SkillSwap connects clients with creators for design, development, writing, video, and more —
            with transparent pricing and a booking flow you can actually trust.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link to={ROUTES.marketplace}>
              <Button size="lg" icon={Search} fullWidth>
                Explore the marketplace
              </Button>
            </Link>
            {!isCreator ? (
              <Button
                size="lg"
                variant="secondary"
                icon={ArrowRight}
                fullWidth
                onClick={() => switchRole(USER_ROLES.CREATOR)}
              >
                Become a creator
              </Button>
            ) : null}
          </motion.div>
        </PageContainer>
      </section>

      <PageContainer className="py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
          <p className="mt-2 text-sm text-slate-500">From discovery to delivery, in four simple steps.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <step.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </PageContainer>

      <section className="border-y border-slate-200 bg-slate-50">
        <PageContainer className="py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <feature.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      <PageContainer className="flex flex-col items-center gap-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Ready to get started?</h2>
        <p className="max-w-md text-sm text-slate-500">
          Join SkillSwap today — whether you&apos;re hiring talent or offering your own skills.
        </p>
        <Link to={ROUTES.marketplace}>
          <Button size="lg" icon={ArrowRight}>
            Go to marketplace
          </Button>
        </Link>
      </PageContainer>
    </div>
  );
}
