---
name: Precision Presence
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-code:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-gap: 16px
---

## Brand & Style
The design system is engineered for reliability, efficiency, and professional trust. It targets administrators in corporate sectors and educational institutions who require a frictionless, authoritative tool for attendance tracking. 

The visual style is **Corporate Modern with a Minimalist lean**. It prioritizes high-legibility and functional clarity through generous whitespace and a systematic application of depth. The interface avoids unnecessary decoration, ensuring that the primary action—scanning and verification—is never obstructed. The emotional response is one of calm competence and institutional stability.

## Colors
The palette is anchored by "Deep Navy" (Primary) for text and structural navigation to project authority. "Professional Blue" (Secondary) serves as the primary action color, guiding users toward interactive elements and buttons. 

Success states are handled by a vibrant Emerald Green, critical for immediate visual confirmation during QR scans. The background uses a "Cool Slate" light gray to reduce eye strain and provide a cleaner canvas than pure white. Contrast ratios must adhere to WCAG AA standards to ensure accessibility in various lighting conditions, such as classrooms or brightly lit lobbies.

## Typography
This design system utilizes **Inter** for all functional roles due to its exceptional legibility and neutral, systematic character. 

Hierarchy is established through weight and scale rather than color. Large display titles are reserved for dashboard overviews and success screens. Body copy is set at 16px to ensure readability for users of all ages. For technical identifiers (like QR string backups), a monospaced font is used to prevent character confusion. Use uppercase for labels to create a distinct visual separation from body content.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a base-8 spacing scale. On desktop, a 12-column grid is used for management dashboards, while mobile views transition to a single-column stack optimized for one-handed operation.

The scanning interface should use a "Safe Zone" layout, centering the camera view within the middle 60% of the screen height to ensure ergonomic positioning. Content cards should have a consistent internal padding of 24px (3 units) to maintain a spacious, premium feel. Reflow rules should prioritize data tables collapsing into descriptive cards on mobile devices.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and **Ambient Shadows**. The design avoids heavy shadows in favor of subtle, 10% opacity blurs that lift cards slightly off the neutral background.

- **Level 0 (Base):** Neutral background (#F8FAFC).
- **Level 1 (Cards):** White surface with a 1px border (#E2E8F0) and a soft 4px blur shadow.
- **Level 2 (Modals/Active):** White surface with a 12px blur shadow, used for temporary overlays or scanning frames.

This approach creates a clear "stack" of information, where the most interactive elements appear physically closer to the user.

## Shapes
The shape language uses **Rounded** geometry (8px base radius). This strikes a balance between the precision of a corporate tool and the approachability of a modern mobile app. 

QR scanning frames should utilize slightly more pronounced corners (16px) to frame the square code effectively. Interactive elements like buttons and input fields follow the 8px standard, while smaller chips or status indicators use a full pill-shape for immediate differentiation.

## Components
- **Buttons:** Large (minimum 48px height) for touch-friendliness. Primary buttons use the Secondary Blue with white text. Ghost buttons are used for secondary actions to maintain hierarchy.
- **Scanning Frame:** A high-contrast square overlay with "corner brackets" in Primary Blue. It should feature a subtle "pulse" animation when a code is detected.
- **Cards:** Used for all dashboard statistics. They must include a clear Title, a large Data Point (Headline-lg), and a small trend indicator.
- **Input Fields:** Outlined style with a 1px border. The border thickens to 2px and changes to Professional Blue on focus.
- **Attendance Chips:** Small, pill-shaped badges (e.g., "Present", "Late", "Absent") using the success, warning, and error colors with low-opacity backgrounds for a soft but legible look.
- **Data Lists:** For long attendance logs, use zebra-striping or thin dividers (#F1F5F9) to maintain vertical rhythm.
