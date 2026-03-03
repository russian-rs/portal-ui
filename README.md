# Portal UI

[![License: GNU GPL v3](https://img.shields.io/badge/License-GNU-yellow.svg)](https://opensource.org/license/gpl-3-0)
[![Security Checks](https://github.com/russian-rs/portal-ui/actions/workflows/security-checks.yml/badge.svg)](https://github.com/russian-rs/portal-ui/actions/workflows/security-checks.yml)

A modern volunteer management portal frontend built with React, TypeScript, and Mantine UI. This application provides a comprehensive interface for managing volunteers, applications, reports, and organizational programs.

## Features

- **Volunteer Management** - Profiles with contracts, program/project assignments, and mentor relationships
- **Application Processing** - Multi-stage workflow for new volunteers and contract prolongations
- **Weekly Reports** - Time tracking with tasks, file attachments, and reviewer feedback
- **Heatmap Visualization** - Year view of hours worked vs required with deficit/surplus indicators
- **Programs & Projects** - Hierarchical structure for organizing volunteer activities
- **SSO Integration** - OAuth2/OIDC authentication via Authentik
- **Multi-language Support** - Russian, Serbian, and English
- **Role-based Access** - 18 roles including Volunteer, Mentor, Coordinator, Admin
- **Dark/Light Theme** - Full theme support via Mantine
- **PDF Export** - Contracts, reports, and activity summaries

## Tech Stack

- **Framework:** React 18 with TypeScript
- **UI Library:** [Mantine](https://mantine.dev/) v7
- **State Management:** React Query + React Context
- **Routing:** React Router v7
- **Forms:** Mantine Form + Zod validation
- **Styling:** SCSS Modules + Styled Components
- **Build Tool:** Vite
- **Icons:** Tabler Icons
- **Charts:** Recharts
- **Rich Text:** TipTap Editor

## Prerequisites

- Node.js 20+
- npm 10+
- Access to the [Portal Backend](https://github.com/russian-rs/portal-backend) API

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/russian-rs/portal-ui.git
   cd portal-ui
   ```

2. **Configure npm for the API package**

   The project uses a generated API client from the backend. Create a GitHub personal access token with `read:packages` scope at [GitHub Settings](https://github.com/settings/tokens).

   ```bash
   export GITHUB_RUSSIAN_RS_NPM_TOKEN=your_token_here
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Configuration

### Backend API

By default, the development server proxies API requests. To change the backend URL, edit `vite.config.mts`:

```typescript
const apiTarget = "http://localhost:8081"  // Local backend
// or
const apiTarget = "https://your-backend.example.com/api"  // Remote backend
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_RUSSIAN_RS_NPM_TOKEN` | GitHub token for npm package access |

## Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # TypeScript check + production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── app/                    # Application setup
│   ├── providers/          # React Context providers
│   ├── router/             # Route configuration
│   └── styles/             # Global styles
├── pages/                  # Feature pages
│   ├── applications/       # Application management
│   ├── profile/            # User profile
│   ├── reports/            # Report management
│   ├── heatmap/            # Activity visualization
│   └── ...
├── shared/
│   ├── api/                # API service layer
│   ├── ui/                 # Reusable components
│   ├── hooks/              # Custom React hooks
│   ├── http/               # Axios HTTP clients
│   ├── locales/            # i18n translations
│   ├── constants/          # App constants
│   └── utils/              # Utility functions
└── assets/                 # Static assets
```

## Development

### Code Style

- ESLint + Prettier for code formatting
- TypeScript strict mode enabled
- Path alias: `src/*` maps to `./src/*`

### Git Workflow

All changes must go through Pull Requests:

- Branch naming: `feature/` or `bugfix/` prefix + issue number + description
  - Example: `feature/23-notes-in-application`
- PR naming: prefix + issue number + description
  - Example: `feature/23 Add notes to applications`

### Adding New Features

1. Create components in the appropriate `pages/` directory
2. Add reusable UI components to `shared/ui/`
3. Add API calls to `shared/api/`
4. Add translations to all locale files in `shared/locales/`

## Security

Security checks run automatically in CI on every pull request and push to `main`/`develop`:

- **Pre-commit security scan** - secrets, large files, certificates, backup files, gitleaks patterns
- **NPM audit** - dependency vulnerability check (critical/high level)

Manual security scan:

```bash
./scripts/security-check.sh
```

## Related Projects

- [Portal Backend](https://github.com/russian-rs/portal-backend) - Kotlin/Spring Boot backend API

## License

This project is licensed under the GNU GPL v3 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built by [Russian Diaspora in Serbia](https://russian.rs) for managing volunteer programs and community activities.
