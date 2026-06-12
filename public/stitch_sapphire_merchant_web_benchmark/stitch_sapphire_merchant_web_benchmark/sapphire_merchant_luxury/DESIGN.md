---
name: Sapphire Merchant Luxury
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
  deep-navy: '#020617'
  rich-gold: '#B38B3F'
  pale-gold: '#E5D5B7'
  sapphire-blue: '#082F49'
  ruby-red: '#7F1D1D'
  emerald-green: '#064E3B'
  stone-gray: '#F8F9FA'
typography:
  display-hero:
    fontFamily: Libre Caslon Text
    fontSize: 80px
    fontWeight: '400'
    lineHeight: 88px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  subheading:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.15em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  button-text:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
spacing:
  unit: 8px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 20px
  section-padding: 120px
---

## Brand & Style

This design system embodies the essence of a high-end boutique, focusing on the concepts of **Refinement, Expertise, and Rarity**. The brand personality is that of a "Trusted Curator"—authoritative yet inviting, providing an educational bridge between raw nature and bespoke luxury.

The visual style is **Minimalist Editorial**. It draws heavily from luxury fashion publications, utilizing expansive whitespace, a starkly elegant color palette, and high-contrast typography. The interface acts as a quiet gallery frame, stepping back to let the vibrant colors and intricate facets of the gemstones serve as the primary visual interest.

**Core Design Principles:**
- **Atmospheric Depth:** Use deep, saturated backgrounds for featured sections to evoke the mystery of the earth.
- **Precision:** Alignment and spacing are rigorous, reflecting the precision of a gem cutter.
- **Editorial Pace:** Layouts should feel like a curated magazine, with varying scales of imagery and typography to guide the eye.

## Colors

The palette is anchored by a sophisticated interplay between **Deep Navy** and **Rich Gold**. 

- **Primary (Deep Navy):** Replaces standard black for a softer, more "midnight" feel. Used for typography on light backgrounds and as the foundation for high-contrast dark sections.
- **Secondary (Gold):** Used sparingly as an accent for links, call-to-actions, and decorative dividers. It should feel metallic and "warm" rather than yellow.
- **Neutrals:** A range of near-white "Stone" tones and deep "Slate" tones provide the canvas. Pure white (#FFFFFF) is reserved for product cards and high-clarity areas.
- **Semantic Gemstone Colors:** A secondary palette of Ruby, Emerald, and Sapphire is used specifically for product categorisation and decorative backgrounds behind gem photography.

## Typography

This design system uses a classic **Serif/Sans-Serif pairing** to balance heritage with modern utility.

- **Headlines (Libre Caslon Text):** Provides an authoritative, literary feel. Use for all major section headings and product titles. For an editorial touch, use *Italics* for supporting words within headlines (e.g., "YOUR KIND OF *Extraordinary*").
- **Body & Interface (Manrope):** A refined, modern sans-serif chosen for its legibility and balanced proportions. It keeps the UI feeling "current" and accessible.
- **Hierarchy:** Maintain high contrast between headlines and body text. Large-scale hero text should be used as a primary design element, often centered with generous leading.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** on desktop and a **Fluid Grid** on mobile, emphasizing breathing room and rhythmic balance.

- **Desktop:** A 12-column grid with a max-width of 1440px. Gutters are wide (32px) to prevent the UI from feeling cramped.
- **Sectioning:** Major content sections must be separated by at least 120px of vertical space. This "whitespace-first" approach ensures that each product category feels like its own exhibition.
- **Alignment:** Use a mix of centered alignments for "Hero" moments and left-aligned text for educational content. 
- **Product Grids:** Products should be displayed in a 3-column or 4-column layout on desktop, transitioning to 1-column on mobile to maintain image detail.

## Elevation & Depth

This design system utilizes **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to maintain a flat, modern aesthetic.

- **Surface Tiers:** Use subtle shifts in background color (e.g., White to Stone-Gray) to define different sections. 
- **Borders:** Use thin (1px) borders in `Pale Gold` or a light gray to define product cards and form inputs. Avoid drop shadows entirely; instead, use a slight background color shift on hover to indicate interactivity.
- **Dark Mode Accents:** In dark sections (Deep Navy), use semi-transparent white borders (10% opacity) to create subtle definition without breaking the "void" effect.

## Shapes

The shape language is **Sharp (0px)**. 

- **Rectilinear Precision:** Buttons, cards, and input fields should have 90-degree corners. This evokes the "cut" of a diamond and suggests formal structure and architectural stability.
- **Dividers:** Use thin, horizontal lines (1px) to separate content. In decorative contexts, a short gold line (e.g., 40px wide) can be used to center-align under subheadings.
- **Photography:** Images should always be sharp-edged. Avoid any corner rounding on product imagery.

## Components

### Buttons
- **Primary:** Solid `Deep Navy` background with `White` text. Sharp corners.
- **Secondary:** Transparent background with a `Deep Navy` or `Rich Gold` 1px border.
- **Ghost:** Text only with the `→` icon. This is the preferred style for "Explore" and "Read More" links.

### Input Fields
- Underlined style or a full 1px border. Background should be `Stone-Gray` or `White`. Labels use the `label-caps` typography style placed above the field.

### Cards
- **Product Card:** No border, no shadow. The image takes the full width of the card. Text (Title and Price) is centered underneath with a `Rich Gold` divider separating the title from the price.
- **Blog Card:** Similar to product cards but uses a left-aligned layout for title and excerpt.

### Navigation
- A minimalist top bar. Navigation links are in `label-caps`. The logo should be centered to emphasize the brand's boutique nature.

### Iconography
- Use ultra-thin (1pt) stroke weights for icons. Icons should be functional and minimal (e.g., a simple magnifying glass for search, a clean bag icon for the cart).