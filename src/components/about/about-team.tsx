"use client";

import { AboutContainer } from "@/components/about/about-container";
import { FadeIn, Stagger, StaggerItem } from "@/components/about/fade-in";
import { SectionTitle } from "@/components/about/section-title";
import { TeamCard } from "@/components/about/team-card";
import { aboutTeam, aboutTeamIntro } from "@/data/about-content";

export function AboutTeam() {
  return (
    <section className="bg-white py-8 md:py-10 lg:py-12" aria-labelledby="team-heading">
      <AboutContainer>
        <FadeIn className="mb-5 md:mb-6">
          <SectionTitle
            as="h2"
            id="team-heading"
            title="Our Team"
            align="center"
            subtitle={aboutTeamIntro}
          />
        </FadeIn>

        <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {aboutTeam.map((member) => (
            <StaggerItem key={member.id}>
              <TeamCard member={member} />
            </StaggerItem>
          ))}
        </Stagger>
      </AboutContainer>
    </section>
  );
}
