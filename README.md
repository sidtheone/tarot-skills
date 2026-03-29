# tarot-skills

> **https://github.com/sidtheone/tarot-skills**

The Major Arcana — 22 meta-thinking skills for LLMs. Cross-model prompts that break specific behavioral defaults. Compatible with Claude Code, Codex, Cursor, Gemini CLI, and any tool that reads `SKILL.md`.

Sibling project to [zodiac-skills](https://github.com/sidtheone/zodiac-skills). The tarot deck breaks **different** defaults than the zodiac — except Death, which is the Monkey (chaos agent) carried across both decks.

## Install

```bash
npx tarot-skills                              # Install all 22 (interactive)
npx tarot-skills install death tower fool     # Install specific cards
npx tarot-skills list                         # Show install status for all targets
npx tarot-skills uninstall --all              # Remove all
```

### Tool flags

```bash
npx tarot-skills --claude                     # Claude Code only
npx tarot-skills --codex                      # Codex only
npx tarot-skills --claude --codex             # Both
```

### Scope flags

```bash
npx tarot-skills --user                       # User-level (available everywhere)
npx tarot-skills --project                    # Project-level (current dir only)
```

**User-level** installs to `~/.claude/skills/` or `~/.agents/skills/`. **Project-level** installs to `.claude/skills/` or `.agents/skills/` in the current directory.

Use `/<card>` to invoke (e.g. `/death`, `/tower`, `/fool`).

## The 22 Cards

| # | Card | Slash Command | Role | Default Broken |
|---|------|---------------|------|----------------|
| 0 | The Fool | `/fool` | The Beginner | Expertise bias |
| I | The Magician | `/magician` | The Resourceful | Tool/dependency addiction |
| II | The High Priestess | `/high-priestess` | The Reader | Context blindness |
| III | The Empress | `/empress` | The Builder | Critique-only mode |
| IV | The Emperor | `/emperor` | The Systems Thinker | Governance blindness |
| V | The Hierophant | `/hierophant` | The Cargo Cult Detector | Cargo culting |
| VI | The Lovers | `/lovers` | The Values Auditor | Values misalignment |
| VII | The Chariot | `/chariot` | The Narrative Breaker | Narrative fallacy |
| VIII | Strength | `/strength` | The Patience | Premature closure |
| IX | The Hermit | `/hermit` | The Depth-Seeker | Completeness theater |
| X | Wheel of Fortune | `/wheel-of-fortune` | The Variance Reader | Determinism bias |
| XI | Justice | `/justice` | The Arbiter | False equivalence |
| XII | The Hanged Man | `/hanged-man` | The Reframer | Framing compliance |
| XIII | Death | `/death` | Chaos Agent | Agreeableness/sycophancy |
| XIV | Temperance | `/temperance` | The Synthesizer | Binary thinking |
| XV | The Devil | `/devil` | The Chain-Breaker | Sunk cost loyalty |
| XVI | The Tower | `/tower` | The Demolisher | Structural inertia |
| XVII | The Star | `/star` | The Signal Finder | Loss aversion in analysis |
| XVIII | The Moon | `/moon` | The Shadow | Happy path fixation |
| XIX | The Sun | `/sun` | The Clarity Maker | False clarity |
| XX | Judgement | `/judgement` | The Root Cause | Attribution error |
| XXI | The World | `/world` | The Spread | Card selection paralysis |

## What Each Card Does

- **The Fool** — sees what expertise makes invisible. Strips away accumulated knowledge to find what a newcomer would notice.
- **The Magician** — finds what's already there before reaching for something new. Solves with existing resources.
- **The High Priestess** — surfaces what's unsaid, implied, or between the lines. Reads the subtext.
- **The Empress** — generates options when everyone else only critiques. Builds alternatives.
- **The Emperor** — finds the process problem, not the people problem. Systems-level governance.
- **The Hierophant** — catches borrowed patterns that don't fit here. Detects cargo culting.
- **The Lovers** — finds gaps between stated and lived values. Audits alignment.
- **The Chariot** — catches stories forced onto disconnected events. Breaks false narratives.
- **Strength** — holds the question open when closure is premature. Resists the urge to decide too early.
- **The Hermit** — goes deep where others skim the surface. Rejects completeness theater.
- **Wheel of Fortune** — separates signal from luck. Identifies what's variance vs. what's real.
- **Justice** — makes the call when everyone else hedges. Decides between options.
- **The Hanged Man** — questions whether you're solving the right problem. Reframes the question.
- **Death** — pokes assumptions until something flinches. The chaos agent. Produces 9 findings (all others produce 5).
- **Temperance** — finds the third option in binary debates. Rejects false dichotomies.
- **The Devil** — reveals what you're chained to by sunk cost. Breaks attachment to past investment.
- **The Tower** — tears down flawed structures that nobody questions. Demolishes what shouldn't stand.
- **The Star** — finds what's genuinely working after destructive analysis. Recovers signal from wreckage.
- **The Moon** — walks the failure paths nobody tests. Illuminates the dark scenarios.
- **The Sun** — catches false confidence that papers over ambiguity. Demands real clarity.
- **Judgement** — catches when success or failure is attributed to the wrong thing. Finds root cause.
- **The World** — orchestrates 3-4 cards into a focused, cross-card reading. The spread selector.

## How It Works

Each card is a single `SKILL.md` file containing:

1. **YAML frontmatter** — `name`, `description` with trigger phrases
2. **One-line role statement** — what it does and which LLM default it breaks
3. **Decision Policy** — operational rules: what to distrust, evidence requirements, anti-scope, calibration targets
4. **The Spread** — context assessment (early-stage, mature, crisis, pre-launch) + `VALUES.md` integration
5. **Named arcana** — distinct analysis techniques, never repeated across invocations
6. **Output format** — binary success mechanic field + justified finding counts
7. **Rules** — behavioral constraints

### Key Design Principles

- **Decision Policy is load-bearing, persona is flavor** — operational rules drive behavior across all models
- **Named arcana with "never repeat"** — forces variety; without this, LLMs gravitate to 2-3 patterns
- **Binary success mechanic** — positive verdicts are valid exits, not failures
- **Anti-scope rules** — each card has explicit boundaries on what it won't touch
- **Calibrated honesty** — every card must produce at least some positive findings
- **Upright/Reversed duality** — each finding includes a counter-perspective to its own analysis
- **Anti-fabrication** — before claiming something doesn't exist, must state where it looked

## Repo Structure

```
<card>/SKILL.md          — The skill definition (one file per card)
bin/cli.js               — Install/uninstall CLI
package.json             — npm package config
```

## Examples

```bash
# Install just the analysis trio
npx tarot-skills install death moon tower

# Install everything for Claude Code at user level
npx tarot-skills --claude --user

# Check what's installed
npx tarot-skills list

# Remove everything
npx tarot-skills uninstall --all
```

Then invoke in your coding session:

```
/death          — chaos-test your assumptions
/tower          — tear down a flawed structure
/fool           — get a beginner's perspective
/world          — get a multi-card reading
```

## License

MIT
