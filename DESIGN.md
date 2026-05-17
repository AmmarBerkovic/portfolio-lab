---
name: Kinetic Lab System
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c3c7ca'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8d9195'
  outline-variant: '#43474a'
  surface-tint: '#b8c9d4'
  primary: '#b8c9d4'
  on-primary: '#23333b'
  primary-container: '#16262e'
  on-primary-container: '#7d8e97'
  inverse-primary: '#50616a'
  secondary: '#b9c8de'
  on-secondary: '#233143'
  secondary-container: '#39485a'
  on-secondary-container: '#a7b6cc'
  tertiary: '#2fd9f4'
  on-tertiary: '#00363e'
  tertiary-container: '#00282f'
  on-tertiary-container: '#0099ad'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d4e5f0'
  primary-fixed-dim: '#b8c9d4'
  on-primary-fixed: '#0d1e25'
  on-primary-fixed-variant: '#394952'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#a2eeff'
  tertiary-fixed-dim: '#2fd9f4'
  on-tertiary-fixed: '#001f25'
  on-tertiary-fixed-variant: '#004e5a'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: JetBrains Mono
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
spacing:
  unit: 4px
  gutter: 24px
  margin-edge: 40px
  container-max: 1280px
---

## Brand & Style

This design system targets a "High-Tech Laboratory" aesthetic, specifically tailored for a high-level full-stack engineer. The brand personality is precise, analytical, and highly technical, evoking the feeling of a sophisticated control interface or a high-fidelity development environment.

The design style is a hybrid of **Minimalism** and **Glassmorphism**, underpinned by a rigid **Technical Grid**. It prioritizes data density and clarity over decorative elements. Visual interest is generated through light—specifically glowing borders and subtle translucency—rather than heavy textures. The goal is an immersive, "heads-up display" (HUD) experience that feels both professional and futuristic.

## Colors

The palette follows a strict 60-30-10 distribution to maintain a focused, dark-mode environment:

*   **60% Foundation (Deep Slate-Charcoal):** Uses `#16262E` as the primary surface color and `#0F172A` for deeper backgrounds. This provides a rich, non-pure-black canvas that feels more like hardware or heavy instrumentation.
*   **30% Structure (Metallic Blues/Silvers):** Uses `#94A3B8` and similar desaturated cool tones for secondary text, borders, and grid lines. These colors mimic brushed aluminum or oxidized steel.
*   **10% Energy (Vibrant Glows):** High-energy accents are used sparingly for critical interactive elements and status indicators. The primary accent is **Electric Cyan** (`#22D3EE`), with **Electric Amber** (`#FBBF24`) for warnings/tags and **Violet** (`#A78BFA`) for specialized technical categories.

Backgrounds should utilize subtle radial gradients to simulate screen luminescence rather than flat fills.

## Typography

The typography system creates a contrast between "System Output" and "Human Content":

*   **JetBrains Mono** is the voice of the machine. It is used for headlines, technical labels, button text, and navigation items. All caps and increased letter spacing should be applied to small labels to mimic architectural blueprints.
*   **Inter** is used for body copy and long-form descriptions. Its high legibility balances the mechanical nature of the monospace font, ensuring the portfolio remains accessible and professional.

For large display headings, use a "glitch" or "flicker" entry animation to reinforce the high-tech narrative. Headlines should be styled with a subtle `text-shadow` in the accent color to simulate light emission.

## Layout & Spacing

This design system utilizes a **12-column Fixed Grid** for desktop and a **4-column Fluid Grid** for mobile. 

The layout is characterized by "Technical Scaffolding"—visible grid lines (1px width, 10% opacity) that define the boundaries of the content. Layout sections should be separated by clear horizontal rules. 

Spacing follows a strict 4px baseline grid. Elements should feel "locked-in," with consistent alignment across the horizontal and vertical axes. Use generous outer margins (`40px+`) to create a focused, centered command-center feel.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and **Luminescence** rather than traditional shadows:

1.  **Backdrop Blurs:** Elevated surfaces (like modals or floating nav) use a 12px blur with a 60% opaque slate background.
2.  **Inner Glows:** Instead of drop shadows, use `box-shadow: inset 0 0 10px ...` using the accent color at very low opacity (5-10%) to make elements appear self-illuminated.
3.  **Thin Strokes:** Containers are defined by 1px solid borders (`#94A3B8` at 20% opacity). When an element is focused or hovered, the border color transitions to the primary accent color (`#22D3EE`) with a subtle `0 0 8px` outer glow.
4.  **Scanning Lines:** A global, low-opacity CSS scanline overlay can be applied to the background to enhance the lab monitor aesthetic.

## Shapes

The shape language is **Sharp (0)**. 

To maintain the laboratory precision, avoid rounded corners entirely. Use 45-degree clipped corners (chamfered edges) for buttons or primary cards to simulate high-end military or scientific hardware. Rectangles should be perfectly crisp, reinforcing the data-driven and structural nature of the engineer's work.

## Components

*   **Buttons:** Rectangular with no radius. Primary buttons use a solid `#22D3EE` background with black text. Secondary buttons use a ghost style with a thin border that glows on hover.
*   **Cards:** Transparent backgrounds with a 1px border. Use a "Terminal Header" on cards—a small top bar containing a monospaced label and a decorative "status" dot.
*   **Technical Chips:** Small, rectangular tags using the accent colors (Cyan, Amber, Violet) with a 10% background opacity and 100% text opacity.
*   **Input Fields:** Bottom-border only or full-outline with a faint "bracket" detail at the corners. The caret should be a solid block (typical of terminals).
*   **Scrollbars:** Custom-styled to be ultra-thin (4px) in Metallic Blue, turning Cyan on interaction.
*   **Data Visualization:** Use thin lines, dot-matrix patterns, and small coordinate labels (e.g., [X:14, Y:92]) in the corners of image containers to maintain the high-fidelity technical feel.