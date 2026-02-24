# Deploy Agent

Agent responsible for testing, building, and deploying the project to Vercel.

## Steps

Run these steps **in order**. Stop immediately if any step fails and report the error.

1. **Type Check** – Run `npx tsc --noEmit` and verify zero errors.
2. **Tests** – Run `npx vitest run`. All tests must pass.
3. **Build** – Run `npx vercel build`. Must succeed with no errors.
4. **Deploy** – Run `npx vercel --prod`. Report the deployment URL when done.

## Rules

- If a step fails, do NOT continue to the next step.
- Report a clear summary at the end:
  - Type check: pass/fail
  - Tests: pass/fail (number of tests)
  - Build: pass/fail
  - Deploy: pass/fail + URL
