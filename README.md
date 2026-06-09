# Club Registration (Frontend)

A single-page app that lets a person register as a club member by filling out a registration form. It is the frontend for the **Club API** backend — it fetches a club's form and its membership types, walks the user through a short wizard, validates the input in the browser, and submits the registration.

## Overview

The app renders a club's registration form as a 3-step wizard:

1. **Membership** — pick one of the membership types offered by the form.
2. **Contact** — fill in personal details (name, email, phone, date of birth).
3. **Review** — check everything and submit.

On load it resolves a `clubId`, fetches `GET /clubs/{clubId}/forms` to get the form title and member types, and on submit it POSTs to `/clubs/{clubId}/forms/{formId}/registrations`. The user can step backwards freely, but stepping forward is blocked until the current step's fields pass validation. After a successful submit a confirmation message is shown. If something is wrong the user gets an instant feedback. 

## Features

- **Fetch the form** - `http://localhost:5173/?clubId=britsport` by adding the clubId to the url the form is fetched right away. This is done so that if more clubs are registered one can register for different ones. In this solution it is assumed that the registration link is sent to the users from an admin. see furture developments for mor thought on this. 
- **Multi-step wizard** - step indicators with click-to-navigate, forward navigation gated by per-step validation Form and Wizard.
- **Client-side validation** — required fields and a basic email check via a small `useForm` hook.
- **Typed API access** — request/response types are generated from the backend's OpenAPI spec, so the API contract is type-checked at build time.
- **Themed UI** — Tailwind CSS v4 with custom color tokens defined in the index.css.
- **Toasts & icons** — Radix UI primitives (e.g. animated toasts) and Phosphor icons.
- **Configurable club** — `clubId` comes from a `?clubId=` query param, then `VITE_CLUB_ID`, then a `"demo-club"` fallback.

## Prerequisites

- Node.js 20+ (LTS recommended — Vite 8 and the `@types/node` 24 typings target a current Node).
- npm (a `package-lock.json` is committed).
- The **Club API** backend running and reachable (defaults to `http://localhost:8080`).

## Getting Started

### Installation

```bash
# Clone the repository
git clone [https://github.com/username/clubadmin.git](https://github.com/Heidibr/clubRegistration.git)
cd clubadmin

# Install dependencies
npm install
```

### Running

```bash
# With Docker
make up
# or
make dev
# or
npm run dev
```

The dev server starts on `http://localhost:5173` and expects the backend on `http://localhost:8080`. (The backend's CORS is configured to allow this dev origin.)

To go straight to the form of the given club. fo to `http://localhost:5173/?clubId=britsport`. 

To preview a production build locally:

```bash
make build
make preview
```

## Configuration

Configuration is done through Vite environment variables in a `.env` file. Variables must be prefixed with `VITE_` to be exposed to the client.

| Variable            | Description                                  | Default                 |
| ------------------- | -------------------------------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Base URL of the Club API backend             | `http://localhost:8080` |
| `VITE_CLUB_ID`      | Default club to load when no `?clubId=` given | `britsport`             |

You can also override the club at runtime via the URL, e.g. `http://localhost:5173/?clubId=britsport`.

## Scripts

The Makefile wraps the npm scripts for convenience:

| Make target      | npm script         | Description                                     |
| ---------------- | ------------------ | ----------------------------------------------- |
|`make up`|`docker compose up --build`|Start the app with docker|
|`make down`|`docker compose down`|Stop the app with docker|
| `make dev`       | `npm run dev`      | Start the Vite dev server                       |
| `make build`     | `npm run build`    | Type-check (`tsc -b`) and build to `dist/`      |
| `make lint`      | `npm run lint`     | Run ESLint                                      |
| `make preview`   | `npm run preview`  | Serve the production build locally              |
| `make api-types` | `npm run api:types`| Regenerate API types from `openapi.yaml`        |
| `make test`      | `cd tests && npm test` | Run the Playwright end-to-end tests         |

## Testing

End-to-end tests use [Playwright](https://playwright.dev) and are **self-contained
in [tests/](tests/)** — that folder has its own `package.json`, config, and specs.
Install its dependencies once, then run the suite:

A happy-scenarios added for now. Future development would include more test to validate that the error handling works as expected. 

```bash
# From the project root: 
make test
# or
cd tests
npm install   #first time only
npm test
```

Playwright auto-starts the Vite dev server on `http://localhost:5173` (using the
root `dev` script). The tests exercise the registration form against a **real
backend**, so the Club API must be running on `http://localhost:8080` with the
`britsport` club seeded (adjust `CLUB_ID` in form.spec.ts if your seed differs. If you want to test the complete flow of the app with actual submitt. Add the last lines that have been commented out and change the email address of the test object.).

- `npm run test:ui` (from `tests/`) — open the interactive Playwright UI runner.
- `npm run test:report` (from `tests/`) — open the HTML report from the last run.

Playwright was selected because it lets you test the complete flow E2E in a simple way, and i am familliar with the setup of playwright. I preffer to use testId to find the elements but this demands more edits in the actual code. you can see different ways to identify and locate elements in the short testfile added here. 


## Generating API types

The TypeScript types for the API live in [src/api/schema.d.ts](src/api/schema.d.ts) and are generated from [openapi.yaml](openapi.yaml). Whenever the backend contract changes, refresh the spec and regenerate:

```bash
make api-types
# or
npm run api:types
```

## Tech Stack and reasoning

- **Language:** TypeScript 5.9 (strict mode). I wanted type safety end-to-end, with forms and input fileds it is always nice to have controll all the way. This is also a personal prefference as I think errors are easier localted and fixed with ts. 
- **UI library:** React 19. 
- **Build tool / dev server:** Vite 8 - simple setup for react and single page applications without to much "nois" in the setup. 
- **Styling:** Tailwind CSS v4 via the `@tailwindcss/vite` plugin. I kept the design system small with a handful of custom color tokens, so the look stays consistent without a lot of CSS files. 
- **UI primitives:** `radix-ui` for accessible building blocks (the toast notifications) and `@phosphor-icons/react` for icons — no need to hand-roll these. Since most components was simple and similar to many components i have created several times i chose to create the components from the ground with simple tailwindcss. I had som existing code for both toast(with the se of radix) and a simple wizard so I took a lot of inspiration from those. I could have chosen to use radix more but i did nor see the need in all the components (and i got a bit lost in going a bit basic for fun) in a bigger project it would be better to lean on component libraries, instead of "inventing the wheel" all over again. 
- **Typed API:** `openapi-typescript` generates the request/response types straight from the backend's OpenAPI spec. Generating types from the contract means the frontend and backend can't silently drift apart.
- **Linting:** ESLint 10 with `typescript-eslint`, plus the React Hooks and React Refresh plugins, to keep hook usage correct and the code consistent. Always nice to have when working in a team. 
- **Task runner:** A small Makefile wraps the npm scripts so the common commands are easy to remember.


- Docker was added last minute with help from claude code. I wanted to make it smooth and nice to run and spinn up propperly. 

## Future improvements

- Let the user choose a club in a more intuitive way. Creating a startpage with a simple select so people can sind their club and find the form without have to get the link sent to them personally. 
- Add tests for the wizard navigation and validation logic.
- Loading and error states while the form is being fetched.
- I would add Redux and use RTK queries in a biger app with more endpoints. In addition to it being smooth to implement it is better for caching and loading and making the app stable This makes it extreamly easy to genereate and controll the api connection with hooks. 
- For the general features. I would also like to add a direct edit link in the preview to go right back to the field you want to change.


## Disclaimer
Claude code helped me fix the last docker setup and was used to create a template with the techstack added and the structure for the Readme.md files. The reasoning is added by me.  

## Contact

Heidi Brække — heidibraekke@gmail.com
