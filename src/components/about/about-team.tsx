"use client";

import { AboutContainer } from "@/components/about/about-container";
import { FadeIn, Stagger, StaggerItem } from "@/components/about/fade-in";
import { SectionTitle } from "@/components/about/section-title";
import { TeamCard } from "@/components/about/team-card";
import type { AboutTeamSection } from "@/lib/about/team";

export function AboutTeam({ section }: { section: AboutTeamSection }) {
  return (
    <section className="bg-white py-8 md:py-10 lg:py-12" aria-labelledby="team-heading">
      <AboutContainer>
        <FadeIn className="mb-5 md:mb-6">
          <SectionTitle
            as="h2"
            id="team-heading"
            title={section.title}
            align="center"
            subtitle={section.intro}
          />
        </FadeIn>

        <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {section.members.map((member) => (
            <StaggerItem key={member.id}>
              <TeamCard member={member} />
            </StaggerItem>
          ))}
        </Stagger>
      </AboutContainer>
    </section>
  );
}
