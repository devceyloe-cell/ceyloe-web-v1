import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Birthstones: Find the Gemstone That Tells Your Story — Ceyloe",
  description:
    "Discover the meaning and beauty of birthstones — from January garnet to December zircon. Find the gemstone that's uniquely yours.",
};

const GOLD = "#C09A4A";
const NAVY = "#004B69";

interface MonthEntry {
  month: string;
  stone: string;
  colour: string;
  accent: string;
  tagline: string;
  body: string;
}

const months: MonthEntry[] = [
  {
    month: "January",
    stone: "Garnet",
    colour: "bg-rose-900",
    accent: "border-rose-800",
    tagline: "Think garnet is only dark red? Think again.",
    body: "While rich red is its most familiar colour, the garnet family also includes beautiful greens, warm oranges and pinkish-red tones. For January birthdays, there may be far more choice than you imagined.",
  },
  {
    month: "February",
    stone: "Amethyst",
    colour: "bg-purple-700",
    accent: "border-purple-600",
    tagline: "A little piece of purple magic.",
    body: "From delicate lavender to intense violet, amethyst is instantly recognisable for its beautiful purple colour. Whether you prefer something soft and romantic or rich and dramatic, February's birthstone has plenty of personality.",
  },
  {
    month: "March",
    stone: "Aquamarine",
    colour: "bg-sky-400",
    accent: "border-sky-400",
    tagline: "The colour of clear water and open skies.",
    body: "Aquamarine ranges from delicate pale blue to beautiful blue-green tones, giving it a fresh, peaceful appearance. It's an elegant choice for anyone drawn to softer, understated colour.",
  },
  {
    month: "April",
    stone: "Diamond",
    colour: "bg-slate-200",
    accent: "border-slate-300",
    tagline: "Some classics never lose their magic.",
    body: "Brilliant, durable and unmistakably timeless, diamond has become one of the world's most treasured gemstones. Whether worn alone or paired with coloured gemstones, April's birthstone has a way of making almost any piece feel special.",
  },
  {
    month: "May",
    stone: "Emerald",
    colour: "bg-emerald-600",
    accent: "border-emerald-500",
    tagline: "There is no mistaking that green.",
    body: "Emerald has been treasured for centuries for its captivating colour and unmistakable character. Natural emeralds often have their own internal features and variations — little reminders that they were created by nature, not a machine.",
  },
  {
    month: "June",
    stone: "Pearl · Alexandrite · Moonstone",
    colour: "bg-pink-100",
    accent: "border-pink-200",
    tagline: "June gets three very different choices.",
    body: "Pearls offer beautiful natural lustre. Moonstone seems to glow from within. And alexandrite is famous for appearing different in changing light. Three birthstones. Three completely different personalities. Which one would you choose?",
  },
  {
    month: "July",
    stone: "Ruby",
    colour: "bg-red-600",
    accent: "border-red-500",
    tagline: "Bold, passionate and impossible to ignore.",
    body: "Ruby is famous for its rich red colour — but here's something you may not know: ruby and sapphire belong to the same mineral family, corundum. Red corundum is called ruby, while the other colours are generally known as sapphire. Nature is clever, isn't it?",
  },
  {
    month: "August",
    stone: "Peridot · Spinel · Sardonyx",
    colour: "bg-lime-500",
    accent: "border-lime-400",
    tagline: "August is full of colour.",
    body: "Peridot brings vibrant green, sardonyx has distinctive bands of colour, and spinel can occur naturally in an extraordinary range of shades. If you're an August baby who loves something different, you have plenty to explore.",
  },
  {
    month: "September",
    stone: "Sapphire",
    colour: "bg-blue-700",
    accent: "border-blue-600",
    tagline: "Blue? Yes. But that's only the beginning.",
    body: "Natural sapphires can be blue, pink, yellow, green, teal, purple and many beautiful shades in between. Some even display more than one colour within the same stone. That's one reason sapphire is so fascinating — you can follow tradition while still choosing something that feels completely individual. And yes, September babies may have won the birthstone lottery. 😉",
  },
  {
    month: "October",
    stone: "Opal · Tourmaline",
    colour: "bg-orange-400",
    accent: "border-orange-300",
    tagline: "For people who can't choose just one colour.",
    body: "Opal is famous for flashes of colour that seem to appear as the stone moves, while tourmaline comes in an incredible variety of shades — including beautiful multi-coloured stones. October's birthstones definitely don't do boring.",
  },
  {
    month: "November",
    stone: "Topaz · Citrine",
    colour: "bg-amber-400",
    accent: "border-amber-300",
    tagline: "Warm, golden and full of sunshine.",
    body: "Topaz comes in several beautiful colours, while citrine is loved for its golden-yellow to warm orange tones. They're wonderful choices for jewellery with a bright, warm personality.",
  },
  {
    month: "December",
    stone: "Turquoise · Tanzanite · Zircon",
    colour: "bg-teal-500",
    accent: "border-teal-400",
    tagline: "December finishes the year beautifully.",
    body: "Turquoise brings its unmistakable blue-green colour, tanzanite offers striking blue-violet tones, and natural zircon is admired for its brilliance and fire. And one little gemstone fact worth knowing: natural zircon is not cubic zirconia. They're completely different materials.",
  },
];

export default function BirthstonesPage() {
  return (
    <div className="bg-[#FAFAF8]">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="border-b border-[#E8E2D8] bg-white">
        <Container className="py-10 md:py-14">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#999999]">
            <Link href="/journal" className="transition-colors hover:text-[#C09A4A]">
              Education
            </Link>
            <span>/</span>
            <span style={{ color: GOLD }}>Birthstones</span>
          </nav>

          <div className="mx-auto max-w-3xl">
            <p
              className="font-manrope text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: GOLD }}
            >
              Education · 8 min read
            </p>

            <h1
              className="font-caslon mt-4 text-4xl font-light leading-tight md:text-5xl"
              style={{ color: NAVY }}
            >
              Birthstones: Find the Gemstone{" "}
              <span className="italic" style={{ color: GOLD }}>
                That Tells Your Story
              </span>
            </h1>

            <p className="font-manrope mt-6 text-base leading-relaxed text-[#555555] md:text-lg">
              Did you know your birthstone may come in a colour you never expected?
            </p>

            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#555555]">
              <p>
                Sapphires aren't only blue. Garnets aren't only red. And some gemstones can even
                appear to change colour in different light.
              </p>
              <p>
                For centuries, birthstones have connected gemstones with the months of the year.
                Today, they offer something even more personal — a beautiful way to celebrate you,
                someone you love, or a moment you never want to forget.
              </p>
              <p>
                At{" "}
                <span className="font-semibold" style={{ color: NAVY }}>
                  Ceyloe Natural Gemstones
                </span>
                , we love natural stones because no two are exactly alike. Each has its own colour,
                character and story.
              </p>
              <p className="font-caslon text-xl italic" style={{ color: GOLD }}>
                So, what's yours?
              </p>
            </div>

            {/* Hero image */}
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden">
              <Image
                src="/images/journal/education-birthstones.jpg"
                alt="Ceyloe birthstones chart — gemstone for each month of the year"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </div>
        </Container>
      </div>

      {/* ── Month Grid ─────────────────────────────────────────────────── */}
      <Container className="py-14 md:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {months.map((entry) => (
            <div
              key={entry.month}
              className={`flex flex-col overflow-hidden border bg-white shadow-sm transition hover:shadow-md ${entry.accent}`}
            >
              {/* Colour swatch */}
              <div className={`h-2 w-full ${entry.colour}`} />

              <div className="flex flex-1 flex-col gap-3 p-5">
                {/* Month + Stone */}
                <div>
                  <p
                    className="font-manrope text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: GOLD }}
                  >
                    {entry.month}
                  </p>
                  <h2
                    className="font-caslon mt-1 text-xl font-light leading-snug"
                    style={{ color: NAVY }}
                  >
                    {entry.stone}
                  </h2>
                </div>

                {/* Divider */}
                <div className="h-px w-10 bg-[#E8E2D8]" />

                {/* Tagline */}
                <p className="font-caslon text-[15px] italic text-[#444444]">{entry.tagline}</p>

                {/* Body */}
                <p className="font-manrope flex-1 text-[13px] leading-relaxed text-[#666666]">
                  {entry.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* ── "Doesn't Have to Follow the Rules" section ─────────────────── */}
      <div className="border-y border-[#E8E2D8] bg-white">
        <Container className="py-14 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="font-manrope text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: GOLD }}
            >
              Our Favourite Part
            </p>
            <h2
              className="font-caslon mt-4 text-3xl font-light leading-tight md:text-4xl"
              style={{ color: NAVY }}
            >
              Your Birthstone Doesn't Have to{" "}
              <span className="italic" style={{ color: GOLD }}>
                Follow the Rules
              </span>
            </h2>
            <div className="font-manrope mt-8 space-y-5 text-left text-[15px] leading-relaxed text-[#555555]">
              <p>
                You don't actually need to choose a gemstone simply because a list says it belongs
                to your birth month.
              </p>
              <p>
                Maybe you're a September baby who falls in love with an emerald. Maybe your child's
                birthstone becomes more meaningful to you than your own. Or perhaps you see one
                particular sapphire and simply can't stop thinking about it.
              </p>
              <p className="font-semibold" style={{ color: NAVY }}>
                That's what makes natural gemstones special.
              </p>
              <p>
                Two stones can have the same name and similar specifications and still look
                completely different. Colour, tone, cut and natural characteristics give each one
                its own personality.
              </p>
              <p className="font-caslon text-xl italic" style={{ color: GOLD }}>
                Sometimes you don't really choose the gemstone. You see it — and somehow you just know.
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <Container className="py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="font-manrope text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: GOLD }}
          >
            Find Your Birthstone at Ceyloe
          </p>
          <h2
            className="font-caslon mt-4 text-3xl font-light leading-tight md:text-4xl"
            style={{ color: NAVY }}
          >
            Which birthstone are you?
          </h2>
          <p className="font-manrope mt-6 text-[15px] leading-relaxed text-[#555555]">
            A birthstone can celebrate your birthday, your children, an anniversary, a new beginning
            or someone you never want to forget. At Ceyloe Natural Gemstones, we carefully select
            natural gemstones for their beauty, character and individuality.
          </p>
          <p className="font-manrope mt-3 text-[15px] leading-relaxed text-[#555555]">
            Choose a loose gemstone to treasure, or let us create a bespoke piece of jewellery
            around the stone that captured your attention.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/gemstones"
              className="font-manrope inline-flex min-h-[48px] min-w-[220px] items-center justify-center gap-2 px-8 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: NAVY }}
            >
              Explore Gemstones
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/book"
              className="font-manrope inline-flex min-h-[48px] min-w-[220px] items-center justify-center gap-2 border px-8 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors hover:border-[#C09A4A] hover:text-[#C09A4A]"
              style={{ borderColor: "#C09A4A", color: GOLD }}
            >
              Book a Consultation
            </Link>
          </div>

          {/* Back link */}
          <Link
            href="/journal"
            className="font-manrope mt-8 inline-block text-[12px] uppercase tracking-[0.14em] text-[#999999] transition-colors hover:text-[#C09A4A]"
          >
            ← Back to Education
          </Link>
        </div>
      </Container>
    </div>
  );
}
