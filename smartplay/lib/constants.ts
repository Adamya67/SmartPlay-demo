import type { AppRole } from "@/types/domain";

export const siteNavigation = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const marketingStats = [
  { label: "Weekly sessions supported", value: "12k+" },
  { label: "Budget-friendly meal ideas", value: "150+" },
  { label: "Coach feedback workflows", value: "24/7" },
  { label: "Youth-first readiness tracking", value: "1 app" },
];

export const marketingFeatures = [
  {
    title: "Performance, wellness, and mindset in one place",
    description:
      "Training load, nutrition, recovery, mental prep, and video review work together instead of living in separate apps.",
  },
  {
    title: "Built for youth soccer athletes",
    description:
      "From weak-foot reps to match-day readiness, every module is tuned for soccer development and student-athlete realities.",
  },
  {
    title: "Elite tools without elite-resource assumptions",
    description:
      "Low-cost meals, equipment-light drills, and train-at-home plans keep the product useful for under-resourced players.",
  },
];

export const testimonials = [
  {
    name: "Anonymous athlete",
    role: "Varsity winger",
    quote:
      "This is the first app that makes my sessions, meals, and mindset check-ins feel connected instead of random.",
  },
  {
    name: "Anonymous coach",
    role: "Club coach",
    quote:
      "The readiness view and video review tools help me coach smarter without burying families in expensive software.",
  },
  {
    name: "Anonymous parent",
    role: "Parent",
    quote:
      "I can see the big picture without micromanaging. It helps me support recovery and nutrition in a useful way.",
  },
];

export const pricingPlans = [
  {
    name: "Athlete",
    price: "$12/mo",
    description:
      "Athlete access includes a 14-day free trial, then $12/month for the live Player Membership.",
    features: [
      "14-day free trial",
      "Training dashboard",
      "Nutrition + wellness tracking",
      "Mental performance tools",
      "Shareable recruiting profile",
    ],
  },
  {
    name: "Team",
    price: "$69",
    description:
      "Estimated coach/team pricing for future rollout. Not a live checkout plan yet.",
    features: [
      "Coach dashboard",
      "Team analytics",
      "Drill assignments",
      "Video review comments",
    ],
  },
  {
    name: "Community",
    price: "Custom",
    description:
      "Estimated program pricing for schools, nonprofits, and access-focused deployments.",
    features: [
      "Parent visibility",
      "Admin reporting",
      "Implementation support",
      "Access-first program setup",
    ],
  },
];

export const faqItems = [
  {
    question: "Is SmartPlay only for elite-club athletes?",
    answer:
      "No. SmartPlay is designed for athletes who need practical, high-value guidance whether they train at home, with a school team, or in community programs.",
  },
  {
    question: "Do coaches and parents see the same data?",
    answer:
      "No. Coach and parent views are permission-aware. Coaches get development tools, while parents get supportive monitoring and schedule visibility.",
  },
  {
    question: "Can this work without wearables?",
    answer:
      "Yes. The MVP is intentionally useful with simple logging, wellness check-ins, video uploads, and trend-based AI insights.",
  },
];

export const roleNavigation: Record<
  AppRole,
  Array<{ label: string; href: string }>
> = {
  athlete: [
    { label: "Dashboard", href: "/app/dashboard" },
    { label: "Sessions", href: "/app/sessions" },
    { label: "Analytics", href: "/app/analytics" },
    { label: "Goals", href: "/app/goals" },
    { label: "Nutrition", href: "/app/nutrition" },
    { label: "Wellness", href: "/app/wellness" },
    { label: "Mental", href: "/app/mental" },
    { label: "Videos", href: "/app/videos" },
    { label: "Calendar", href: "/app/calendar" },
    { label: "Profile", href: "/app/profile" },
    { label: "Settings", href: "/app/settings" },
  ],
  coach: [
    { label: "Overview", href: "/app/coach" },
    { label: "Team", href: "/app/coach/team" },
    { label: "Plans", href: "/app/coach/plans" },
    { label: "Reviews", href: "/app/coach/reviews" },
  ],
  parent: [
    { label: "Overview", href: "/app/parent" },
    { label: "Athlete", href: "/app/parent/athlete/user-athlete-maya" },
  ],
  admin: [{ label: "Admin", href: "/app/admin" }],
};
