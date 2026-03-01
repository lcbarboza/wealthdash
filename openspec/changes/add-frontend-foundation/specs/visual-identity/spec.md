## ADDED Requirements

### Requirement: Tailwind CSS Integration
The `apps/web` workspace MUST use Tailwind CSS v4 for utility-first styling, configured via CSS-based `@theme` directives.

#### Scenario: Tailwind utility classes work in components
- **GIVEN** Tailwind CSS is installed and configured in `apps/web`
- **WHEN** a React component uses Tailwind utility classes (e.g., `className="text-lg font-bold"`)
- **THEN** the corresponding styles MUST be applied in the rendered output

#### Scenario: CSS-first configuration
- **GIVEN** Tailwind CSS v4 is installed
- **WHEN** a developer inspects the styling configuration
- **THEN** theme customizations MUST be defined using `@theme` directives in CSS files rather than a JavaScript config file

### Requirement: Color Palette
The application MUST define a color palette suitable for a financial dashboard, exposed as Tailwind theme tokens and CSS custom properties.

#### Scenario: Brand and semantic colors defined
- **GIVEN** the application CSS with `@theme` configuration
- **WHEN** a developer inspects the available color tokens
- **THEN** the following color groups MUST be defined: primary, neutral, success (gains/positive), danger (losses/negative), and warning

#### Scenario: Colors accessible as CSS custom properties
- **GIVEN** the Tailwind theme is loaded
- **WHEN** styles are compiled
- **THEN** each color token MUST be available as a CSS custom property (e.g., `--color-primary-500`)

### Requirement: Typography Scale
The application MUST define a typography scale that ensures readability for financial data and dashboard content.

#### Scenario: Font family defined
- **GIVEN** the application CSS theme
- **WHEN** a developer inspects the font-family tokens
- **THEN** a sans-serif font stack MUST be defined with Inter as the preferred font, falling back to system UI fonts

#### Scenario: Font sizes cover dashboard needs
- **GIVEN** the typography scale
- **WHEN** a developer inspects available text size utilities
- **THEN** sizes from small labels (xs) through large headings (3xl or above) MUST be available via Tailwind utilities

### Requirement: Spacing and Layout Tokens
The application MUST define consistent spacing and border-radius tokens for layout uniformity.

#### Scenario: Spacing scale defined
- **GIVEN** the Tailwind theme configuration
- **WHEN** a developer uses spacing utilities (padding, margin, gap)
- **THEN** the default Tailwind spacing scale MUST be available

#### Scenario: Border radius tokens defined
- **GIVEN** the Tailwind theme configuration
- **WHEN** a developer inspects border-radius utilities
- **THEN** named radius tokens (sm, md, lg, xl) MUST be available for consistent component rounding
