# 0xj4an — Personal Portfolio

An interactive 3D galaxy-themed portfolio built with Next.js 15, React Three Fiber, and Framer Motion. Navigate through spiral arms to explore sections about governance work, experience, projects, and more.

## Tech Stack

- Next.js 15 + React 19
- TypeScript
- Three.js + React Three Fiber + Drei
- Framer Motion
- Tailwind CSS v4
- Web3Forms (contact form)

## Features

- 3D galaxy with 6 spiral arms, each ending in an interactive planet
- Central star (0xj4an) with custom GLSL plasma shader
- Orbiting moons for sub-sections (Experience, Recommendations)
- Galactic dust particles, comets, asteroids, and spaceships
- Post-processing vignette effect
- Responsive modal system for content viewing
- Contact form via Web3Forms API

## Getting Started

```bash
git clone https://github.com/0xj4an/personal_website.git
cd personal_website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    page.tsx          # 3D scene, planet positions, galaxy layout
  components/
    Section.tsx       # Planet rendering, shaders, moon orbits
    GalacticDust.tsx  # Spiral arm particle system
    About.tsx         # Profile, social links, metrics
    Biography.tsx     # Journey/background
    Governance.tsx    # Celo governance proposals (23 CGPs)
    Experience.tsx    # Events timeline
    Speaker.tsx       # Speaking engagements
    Projects.tsx      # Project cards
    Studies.tsx       # Education
    Contact.tsx       # Contact form
    Modal.tsx         # Content modal overlay
    ShootingStars.tsx # Shooting star animations
    Asteroid.tsx      # Asteroid field
    Comet.tsx         # Comet trails
    Spaceship.tsx     # Traversing spaceships
    FloatingElement.tsx # Nebula clouds
    LoadingScreen.tsx # Loading animation
public/
  Assets/             # Profile images
```

## Galaxy Layout

6 spiral arms at 60 degrees apart, using the Archimedean spiral formula:

```text
r = 2.5 + t * 7
theta = armOffset + t * 1.3
```

| Arm | Color | Planet |
| --- | ----- | ------ |
| 0 | Teal | My Journey |
| 1 | Cyan | Contact |
| 2 | Gold | Studies |
| 3 | Green | Experience (3 moons) |
| 4 | Lime | Recommendations (8 moons) |
| 5 | Pink | Projects |

## Deployment

Deploy on Vercel or any platform supporting Next.js.

## License

MIT
