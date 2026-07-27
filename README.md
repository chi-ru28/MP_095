<div align="center">
  
# 🌌 Ascendra

**AI-Powered Adventure Game for Personalized Skill Development**

[![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen?style=for-the-badge)](https://github.com/chi-ru28/MP_095)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0--alpha-orange?style=for-the-badge)]()

[![Unity](https://img.shields.io/badge/Unity-6_URP-black?style=for-the-badge&logo=unity)](https://unity.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)

</div>

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Project Goals](#-project-goals)
- [Current MVP Status](#-current-mvp-status)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Technology Stack](#️-technology-stack)
- [System Requirements](#-system-requirements)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [API Documentation](#-api-documentation)
- [Database Strategy](#️-database-strategy)
- [AI Workflow](#-ai-workflow)
- [Security](#️-security)
- [Development Workflow](#-development-workflow)
- [Team Structure](#-team-structure)
- [Roadmap](#️-roadmap)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [Coding Standards](#-coding-standards)
- [Testing](#-testing)
- [Deployment](#️-deployment)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 📖 Overview

**Ascendra** is an AI-powered educational adventure game that transforms learning into an immersive space exploration experience.

Instead of solving ordinary quiz questions, players explore mysterious planets, ancient ruins, alien civilizations, and hidden temples. Every challenge encountered is generated dynamically by AI, seamlessly blending education with cinematic gameplay. 

The AI continuously analyzes player performance in real-time, tailoring personalized missions across critical domains:
- 🧠 **Logical Reasoning & Aptitude**
- 🧮 **Mathematics & Data Interpretation**
- 🗣️ **English & Communication Skills**
- 💡 **Critical Thinking & Problem Solving**
- 🌍 **General Knowledge**
- 👔 **Interview Preparation**

Players earn XP, Coins, Achievements, and Knowledge Crystals, unlocking new planets and defeating AI Guardians on their journey to become the ultimate AI Champion.

---

## 🎯 Project Goals

- Make learning engaging through gameplay.
- Personalize challenges with AI.
- Build a scalable web-based educational platform.
- Demonstrate modern software architecture.

---

## 🚧 Current MVP Status

### ✅ Completed
- Project setup & Repository structure
- Clean Architecture backend scaffolding
- PostgreSQL & Prisma integration
- Google OAuth authentication & JWT issuance
- Redis rate limiting and caching

### 🔄 In Progress
- LangGraph AI Engine (FastAPI)
- Dynamic task generation pipelines

### 📅 Planned
- Core Unity gameplay hooks
- React Web Hub integration
- Photon Fusion Multiplayer

---

## ✨ Features

<details>
<summary><b>🎮 Gameplay</b></summary>
<br>

- **Dynamic Exploration**: Explore beautifully rendered Unity 6 URP environments.
- **Narrative-Driven Missions**: Engage with lore-rich quests tailored to your skill level.
- **Guardian Battles**: Face off against AI-generated boss challenges.
</details>

<details>
<summary><b>🤖 AI Features</b></summary>
<br>

- **Dynamic Task Generation**: Google Gemini + LangGraph generates unique challenges on the fly.
- **Adaptive Difficulty Engine**: The AI adjusts the complexity based on real-time player confidence scores.
- **Intelligent Evaluation**: Instant, semantic feedback on open-ended answers.
</details>

<details>
<summary><b>🔐 Authentication & Security</b></summary>
<br>

- **Google OAuth**: Frictionless, secure onboarding.
- **Stateless JWT**: Secure API authorization.
- **Anti-Cheat Mechanics**: Focus-loss detection and server-side validation.
- **Rate Limiting**: Redis-backed token bucket to protect endpoints.
</details>

<details>
<summary><b>🏆 Gamification</b></summary>
<br>

- **Progression Systems**: XP, Coins, and Dynamic Ranks.
- **Inventory Management**: Collect Cosmetic items, Relics, and Titles.
- **Streaks & Leaderboards**: Daily login bonuses and competitive ranking.
</details>

<details>
<summary><b>⚙️ Backend & Performance</b></summary>
<br>

- **Modular Monolith**: Clean Architecture separating Node.js API Gateway and Python AI Engine.
- **Prisma ORM**: Type-safe PostgreSQL migrations and queries.
- **Redis Caching**: Ultra-fast leaderboard and rate-limit processing.
</details>

<details>
<summary><b>🚀 Future Features</b></summary>
<br>

- **Photon Fusion Multiplayer**: Co-op missions and real-time PvP tournaments.
- **Dynamic Themes**: Seasonal events and new galactic sectors.
</details>

---

## 📸 Screenshots

| Splash Screen | Main Menu | Landing Zone |
| :---: | :---: | :---: |
| ![Splash Screen](docs/images/splash-screen.png) | ![Main Menu](docs/images/main-menu.png) | ![Landing Zone](docs/images/landing-zone.png) |

| Research Station | Mission Screen | Inventory |
| :---: | :---: | :---: |
| ![Research Station](docs/images/research-station.png) | ![Mission Screen](docs/images/mission-screen.png) | ![Inventory](docs/images/inventory.png) |

| Leaderboard |
| :---: |
| ![Leaderboard](docs/images/leaderboard.png) |

---

## 🏗️ Architecture

Ascendra utilizes a **Modular Monolith with Service-Oriented Separation**.

```mermaid
graph TD
    Client[🎮 Unity WebGL Client] <-->|REST API| NodeGateway[🟩 Node.js API Gateway]
    WebHub[⚛️ React Web Hub] <-->|REST API| NodeGateway
    
    NodeGateway <-->|Reads/Writes| DB[(🐘 PostgreSQL Neon)]
    NodeGateway <-->|Caches/Rate Limits| Redis[(🟥 Redis)]
    
    NodeGateway <-->|Internal API| FastAPI[⚡ FastAPI AI Engine]
    FastAPI <-->|Orchestrates| LangGraph[🕸️ LangGraph]
    LangGraph <-->|Prompts| Gemini[🧠 Google Gemini API]
```

- **Unity**: Game rendering, physics, and client-side gameplay logic.
- **React**: Web portal for profile management and authentication before mounting WebGL.
- **Node API Gateway**: Handles Auth, DB reads/writes, Leaderboards, and forwards AI requests.
- **FastAPI**: Dedicated Python microservice for heavy AI operations.
- **PostgreSQL**: Relational database for transactional user data.
- **Redis**: In-memory store for leaderboards and rate limiting.
- **Gemini**: The core LLM powering dynamic content generation.

---

## 📁 Folder Structure

```text
ascendra/
├── ai-engine/             # FastAPI Python service (LangGraph + Gemini)
├── backend-node/          # Express.js API Gateway (DDD Architecture)
│   ├── prisma/            # Database schemas & migrations
│   └── src/               # Application source code
├── docs/                  # Global architecture & design documents
├── packages/              # Shared types, linting, and utilities
└── frontend/          # React + Vite Web Hub
```

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| **Frontend** | React, Vite, HTML5, CSS3, JavaScript |
| **Game Client** | Unity 6, URP, WebGL |
| **Backend** | Node.js, Express.js, TypeScript, Prisma |
| **AI Engine** | FastAPI, Python, LangGraph, Google Gemini API |
| **Database & Cache** | PostgreSQL (Neon), Redis |
| **Authentication** | Google OAuth, JWT |
| **Deployment** | Firebase Hosting, Render, Neon, Cloudflare |
| **Version Control**| Git, GitHub |

---

## 💻 System Requirements

- **Node.js**: v20.0.0+
- **Python**: v3.11.0+
- **Unity**: 6.0+ (URP)
- **RAM**: 16GB+ (Development) / 8GB+ (Client)
- **OS**: Windows 10/11, macOS, Linux
- **Browser**: Modern WebGL2 compatible browser (Chrome, Firefox, Edge)

---

## ⚡ Quick Start

```bash
git clone https://github.com/chi-ru28/MP_095.git

cd backend-node
npm install

cd ../ai-engine
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt

cd ../frontend
npm install
```

---

## 📥 Detailed Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/chi-ru28/MP_095.git
   cd MP_095
   ```

2. **Install Web Frontend**:
   ```bash
   cd frontend
   npm install
   ```

3. **Install Node Backend**:
   ```bash
   cd backend-node
   npm install
   npx prisma generate
   ```

4. **Install AI Engine**:
   ```bash
   cd ai-engine
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

5. **Unity Setup**:
   Open the `game-client` folder in Unity Hub (Ensure Unity 6 is installed).

---

## 🔐 Environment Variables

Create `.env` files in the respective directories based on the `.env.example` templates.

<details>
<summary><b>Node Backend (.env)</b></summary>
<br>

```env
PORT=3000
DATABASE_URL="postgresql://user:pass@ep-rest-of-url.neon.tech/ascendra"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secure-jwt-secret"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
AI_ENGINE_URL="http://localhost:8000"
```
</details>

<details>
<summary><b>FastAPI Engine (.env)</b></summary>
<br>

```env
PORT=8000
GEMINI_API_KEY="your-google-gemini-api-key"
```
</details>

---

## 🚀 Running the Project

Run these services concurrently in separate terminal windows:

**Node Backend**:
```bash
cd backend-node
npm run dev
```

**FastAPI Engine**:
```bash
cd ai-engine
source venv/bin/activate
uvicorn main:app --reload
```

**React Frontend**:
```bash
cd frontend
npm run dev
```

---

## 📚 API Documentation

The Node.js Gateway provides full OpenAPI 3.0 documentation.

- **Swagger UI**: Available at `http://localhost:3000/api-docs` during development.
- **Versioning**: All API routes are strictly versioned under `/api/v1/`.

---

## 🗄️ Database Strategy

- **PostgreSQL (Neon)**: Chosen for its serverless architecture, scaling automatically with traffic. Stores relational data (`Users`, `Profiles`, `TaskHistory`, `Inventory`).
- **Prisma**: Provides a heavily typed ORM experience, ensuring database queries are safe and migrations are predictable.
- **Redis**: Implements rapid-access memory for daily leaderboards and token-bucket API rate limiting.

---

## 🧠 AI Workflow

```mermaid
sequenceDiagram
    participant Player
    participant Node as Node Gateway
    participant Fast as FastAPI Engine
    participant LLM as Google Gemini

    Player->>Node: POST /mission/generate {theme}
    Node->>Fast: Forward Request + Player Stats
    Fast->>LLM: LangGraph Task Generation Prompt
    LLM-->>Fast: JSON Mission Data
    Fast-->>Node: Scenario & Difficulty
    Node-->>Player: Mission UI
```

1. **Difficulty Engine**: Analyzes past `TaskHistory` to calculate a dynamic confidence score.
2. **Task Generator**: LangGraph orchestrates nodes to prompt Gemini, ensuring the output aligns with the requested theme and calculated difficulty.
3. **Evaluation Engine**: A separate LangGraph pipeline semantically compares the player's natural language answer against the ideal solution.

---

## 🛡️ Security

Ascendra strictly adheres to OWASP guidelines:
- **Authentication**: Stateless JWT issuance via Google OAuth prevents password storage liability.
- **Rate Limiting**: Strict Redis-backed limits on `/auth` endpoints.
- **Helmet**: Secures Express HTTP headers.
- **Validation**: Strict `Zod` payload validation ensures malformed data is rejected before hitting controllers.
- **Anti-Cheat**: Frontend heartbeat monitors and window focus-loss penalties.

---

## 🤝 Development Workflow

- **Branch Strategy**: Git Flow. `main` for production, `dev` for integration, `feature/name` for development.
- **Commit Convention**: Conventional Commits (e.g., `feat: added redis limiter`, `fix: task generation bug`).
- **Pull Requests**: Require at least one peer review.
- **Code Reviews**: Focus on architecture compliance, performance impact, and security.

---

## 👥 Team Structure

Ascendra is developed by a dedicated 4-person team:

- **Developer A**: Unity Game Client Lead (URP, WebGL, UI Toolkit).
- **Developer B**: Backend Architecture Lead (Node.js, Prisma, Security).
- **Developer C**: AI & Systems Engineer (FastAPI, LangGraph, Gemini Prompts).
- **Developer D**: DevOps & Frontend Lead (React Hub, CI/CD, Infrastructure).

---

## 🗺️ Roadmap

- [x] **Phase 0**: System Architecture & Planning
- [x] **Phase 1-3 (Completed)**: API Gateway, Auth, DB scaffolding.
- [ ] **Phase 4-5 (Upcoming)**: LangGraph AI Engine & Core Unity Gameplay.
- [ ] **Phase 6-8 (Future)**: Photon Multiplayer, Advanced Optimization, Production Deployment.

---

## 📑 Documentation

Explore our comprehensive internal documentation:
- [Game Design Document (GDD)](docs/game_design_document.md)
- [Software Requirements Specification (SRS)](docs/software_requirements_specification.md)
- [System Architecture](docs/system_architecture.md)
- [Folder Architecture](docs/folder_architecture.md)
- [Database Design](docs/database_design.md)
- [API Specification](docs/api_specification.md)
- [Implementation Roadmap](docs/implementation_plan.md)

---

## 📝 Contributing

We follow a strict enterprise contribution guideline. Before submitting a PR:
1. Check the existing Issues.
2. Ensure you pass all unit tests and linting (`npm run lint`).
3. Follow the Conventional Commits specification.
4. Update the Swagger docs if you modify API routes.

---

## 📏 Coding Standards

- **TypeScript**: Strict mode enabled. Use interfaces over types. Prefer early returns.
- **Python**: PEP-8 compliant. Use `Pydantic` for all I/O boundary models.
- **Unity C#**: PascalCase for Methods/Classes, camelCase for local variables, `_camelCase` for private fields.
- **Formatting**: Enforced via Prettier and Black.

---

## 🧪 Testing

- **Unit Testing**: Jest (Node) / PyTest (Python).
- **API Testing**: Postman collections included in `/docs/postman`.
- **Unity**: Play Mode & Edit Mode tests via Unity Test Framework.
- **Performance**: Artillery for load testing the Node Gateway.

---

## ☁️ Deployment

- **Web Hub**: Firebase Hosting (Global Edge CDN).
- **Node & FastAPI Services**: Render (Containerized Docker environments).
- **Database**: Neon Serverless PostgreSQL.
- **Cache**: Upstash Serverless Redis.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

Powered by:
- [Unity](https://unity.com/)
- [Google Gemini](https://deepmind.google/technologies/gemini/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Express](https://expressjs.com/)
- [React](https://react.dev/)
- [Neon](https://neon.tech/)
- [Redis](https://redis.io/)
- [Photon Fusion](https://www.photonengine.com/fusion)

---
<div align="center">
  <i>"Learn beyond boundaries. Explore beyond the stars."</i>
</div>
