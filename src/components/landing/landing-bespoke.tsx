import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { stitchImages } from "@/config/stitch-images";

export function LandingBespoke() {
  return (
    <section className="bg-[#141414] py-10 text-white md:py-12">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden bg-black lg:mx-0 lg:max-w-none lg:aspect-[5/4]">
            <Image
              src={stitchImages.bespokeRing}
              alt="Bespoke sapphire and diamond ring handcrafted by Ceyloe"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>

          <div className="lg:pl-2 xl:pl-6">
            <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.28em] text-rich-gold">
              Bespoke Jewellery
            </p>

            <h2 className="font-caslon mt-3 text-2xl font-normal leading-[1.15] !text-white md:text-3xl">
              Your Vision. Our
              <br />
              Craftsmanship.
            </h2>

            <p className="font-manrope mt-5 max-w-sm text-sm leading-relaxed text-white/85">
              From concept to creation, we design and craft bespoke jewellery that is as unique as
              your story.
            </p>

            <Link
              href="/custom-jewelry"
              className="btn-stitch-gold mt-6 inline-flex px-8 py-3 font-manrope text-[10px] font-bold uppercase tracking-[0.14em]"
            >
              Explore Bespoke Jewellery
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
