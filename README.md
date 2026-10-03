# PeriodicPortal - Interactive Periodic Table Lab

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-3b82f6?style=for-the-badge&logo=vercel&logoColor=white)](https://periodictable-phi-one.vercel.app)

**PeriodicPortal** is a modern, highly interactive, and responsive educational web application designed for students and educators to explore the 118 chemical elements of the periodic table. 

It combines rich aesthetics (neon glowing elements, glassmorphism, responsive grid structures) with active learning tools, a 3D atomic orbital viewer, comparison metrics, trend graphs, gamified progression systems, and a simulated chemistry AI chatbot.

👉 **Live Hosted Version (Firebase):** [https://periodic-table-b0e79.web.app](https://periodic-table-b0e79.web.app)

---

## 🌟 Key Features

### 1. Interactive IUPAC Periodic Table
* **Full 118 Elements**: Clean 18x10 grid with dedicated Lanthanide and Actinide block layouts at the bottom.
* **Hover Inspection Panel**: Hovering over any element card previews key properties (atomic number, mass, name, phase, group) in the grid's center console.
* **Smart Filter & Search**: Search by symbol, name, or atomic number. Filter by Phase (Solid, Liquid, Gas, Synthetic), Group, Period, or categories (like Halogens or Alkali Metals).

### 2. 3D Atomic Bohr Viewer
* Renders a real-time, interactive 3D Bohr orbital model using raw **Three.js** inside React.
* Interactive zoom, pan, and rotate controls to inspect the nucleus (protons and neutrons) and circulating electrons along tilted orbital shells.
* Embedded directly inside the element details view.

### 3. Multi-Element Comparison Drawer
* Select up to 3 elements for side-by-side comparison.
* View tabular comparisons of properties such as atomic mass, phase, melting/boiling points, density, electronegativity, electron configurations, and discovery history.

### 4. Interactive Learning Hub & Trends
* **Trend Visualization**: Area charts (powered by **Recharts**) mapping properties (Electronegativity, Atomic Radius, Ionization Energy, Electron Affinity) across atomic numbers.
* **Study Guides**: Collapsible study guides for key topics (Periodic Trends, Atomic Structure, Chemical Bonding, and Electron Configurations).

### 5. Gamified Quiz & Element Unlocking Game
* **Multiple MCQ Modes**: Quizzes including "Guess the Element", "Guess the Symbol", and "Atomic Number Challenge" with timers and score trackers.
* **Unlocked Elements Game**: Start with only Hydrogen and Helium. Challenge yourself to answer element identification riddles to gain XP, level up, earn custom badges (like *Transition Titan*), and unlock more elements.

### 6. Simulated Chemistry AI Assistant
* Dedicated chatbot interface loaded with detailed chemical explanations.
* Ask questions like *"Why is Fluorine so reactive?"*, *"Compare Sodium and Potassium"*, or *"Tell me about Gold"* and receive formatted educational replies.

### 7. Custom settings
* Configurable settings menu to toggle **Atomic Mass** visibility, enable/disable **Neon Card Glows**, and reset laboratory progress.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 19 + TypeScript + Vite
* **Styling**: Tailwind CSS v4 (Class-based dark mode, custom neon `@theme` classes, and `@utility` glassmorphism card components)
* **Graphics**: Three.js (WebGL 3D Rendering)
* **Charts**: Recharts (SVG Data Visualizations)
* **Icons**: Lucide React
* **Animations**: Framer Motion

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* `npm` or `yarn`

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/codexanjan/periodictable.git
   cd periodictable
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server locally:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

### Building for Production
1. Compile and minify:
   ```bash
   npm run build
   ```
   The static distribution files will be generated in the `dist/` directory.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [Anjan Shetty](https://github.com/codexanjan)

[![GitHub](https://img.shields.io/badge/GitHub-codexanjan-181717?style=flat&logo=github)](https://github.com/codexanjan)

</div>
