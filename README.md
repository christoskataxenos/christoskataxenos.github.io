# Christos Kataxenos - Landing Page

A personal landing page built with **Next.js**, designed to serve as a central hub linking to various sub-projects (Biography, Dev Blog, Photography).

## Features

-   **Identity Reveal Effect:** A custom hero title component that transitions from English ("Christos Kataxenos") to Greek ("Χρήστος Καταξένος") on hover using a stack-based layout to prevent layout shifts.
-   **Neon/Dark Mode Theme:** Styled with CSS Modules and global CSS variables for a consistent, modern dark aesthetic.
-   **Holographic Cards:** Interactive 3D-like hover effects for navigation links.
-   **Performance Optimized:** Uses `next/font` for Geist font loading and optimized SVG components.

## Project Structure

-   `src/app/page.js`: Main entry point.
-   `src/app/layout.js`: Root layout, fonts, and metadata.
-   `src/components/HeroTitle.js`: The isolated component for the name reveal effect.
-   `src/components/Icons.js`: Reusable SVG icons.
-   `src/components/HeroTitle.module.css`: Scoped CSS for the hero animation.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  **Open local preview:**
    Navigate to [http://localhost:3000](http://localhost:3000).

## Customization

-   **Hero Animation:** Modify `src/components/HeroTitle.module.css` to adjust the typewriter speed or blink effect.
-   **Links:** Update the `href` attributes in `src/app/page.js` to point to your actual subdomains.

## Deployment

Deployments are handled via GitHub Actions.

<!-- Forced update to trigger CI/CD -->
