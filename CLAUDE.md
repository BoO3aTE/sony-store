# Sony Store — Claude Code Guide

## Project

RTL Arabic Sony PlayStation gaming e-commerce store. Built with Next.js 16, React 19, Tailwind CSS 4, Turbopack, and Vercel Analytics + Speed Insights. Deployed via Vercel (auto-deploys on push to main).

Stack: Next.js 16 · React 19 · TypeScript · Tailwind 4 · Supabase · Vercel

## Context Management

**This project has a history of sessions hitting the context ceiling.** A past overflow caused a GitHub device auth code to expire (5h45m of wasted auth window).

- Run `/compact` deliberately when the context bar reaches ~60%
- After completing any major unit of work (new component, new page, deployment) — check the context bar and compact if past halfway
- Do not wait until the ceiling is close; compact early and often

## GitHub Auth

If Claude Code prompts for GitHub device authentication:

1. Open the auth URL immediately — do not defer it
2. Complete the device flow in the browser before returning to any coding task
3. GitHub device codes expire in ~15 minutes; context-heavy sessions will burn through that window fast

## Development Notes

- Source files live in `src/`
- `_old/` contains archived HTML/CSS versions — do not touch unless asked
- `.claude/settings.local.json` is local-only and should not be committed
