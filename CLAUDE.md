# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A collection of agent skills ("the tarot") — cross-model prompts that break specific LLM behavioral defaults. Compatible with Claude Code, Codex, Cursor, Gemini CLI, and any tool that reads `SKILL.md`. Each card is a standalone skill in its own directory with a single `SKILL.md` file.

Sibling project to [zodiac-skills](https://github.com/sidtheone/zodiac-skills). The tarot deck breaks **different** defaults than the zodiac — except Death, which is the Monkey (chaos agent) carried across both decks.

## Repo Structure

```
<card>/SKILL.md          — The skill definition (frontmatter + prompt)
```

Each `SKILL.md` follows a consistent format:
- YAML frontmatter: `name`, `description` (trigger phrases and use-case summary)
- One-line role statement and the LLM default it breaks
- **Decision Policy** — operational rules: what to distrust, evidence requirements, anti-scope, calibration targets
- The Spread: assess context position + load `VALUES.md` from the user's repo
- Named arcana (techniques, varies per card)
- Output format with a binary success mechanic field and justified counts
- Rules section constraining behavior

## The Cards (Current)

| Card | Role | Default Broken | Success Field | Findings |
|------|------|----------------|---------------|----------|
| Death (XIII) | Chaos Agent | Agreeableness/sycophancy | `Survived: yes/no` | 9 |
| The Tower (XVI) | The Demolisher | Structural inertia | `Standing: yes/no` | 5 |
| The Fool (0) | The Beginner | Expertise bias | `Fresh: yes/no` | 5 |
| The High Priestess (II) | The Reader | Context blindness | `Surfaced: yes/no` | 5 |
| The Hermit (IX) | The Depth-Seeker | Completeness theater | `Deep: yes/no` | 5 |
| The Hanged Man (XII) | The Reframer | Framing compliance | `Reframed: yes/no` | 5 |
| The Magician (I) | The Resourceful | Tool/dependency addiction | `Found: yes/no` | 5 |
| The World (XXI) | The Spread | Card selection paralysis | N/A (orchestrator) | N/A |
| Justice (XI) | The Arbiter | False equivalence | `Decided: option/draw` | 5 |
| The Moon (XVIII) | The Shadow | Happy path fixation | `Illuminated: yes/no` | 5 |
| The Devil (XV) | The Chain-Breaker | Sunk cost loyalty | `Chained: yes/no` | 5 |
| Strength (VIII) | The Patience | Premature closure | `Held: yes/no` | 5 |
| The Empress (III) | The Builder | Critique-only mode | `Viable: yes/no` | 5 |
| The Emperor (IV) | The Systems Thinker | Governance blindness | `Governed: yes/no` | 5 |
| The Hierophant (V) | The Cargo Cult Detector | Cargo culting | `Earned: yes/no` | 5 |
| The Lovers (VI) | The Values Auditor | Values misalignment | `Aligned: yes/no` | 5 |
| The Chariot (VII) | The Narrative Breaker | Narrative fallacy | `True: yes/no` | 5 |
| Wheel of Fortune (X) | The Variance Reader | Determinism bias | `Signal: yes/no` | 5 |
| Temperance (XIV) | The Synthesizer | Binary thinking | `Binary: yes/no` | 5 |
| The Star (XVII) | The Signal Finder | Loss aversion in analysis | `Strong: yes/no` | 5 |
| The Sun (XIX) | The Clarity Maker | False clarity | `Clear: yes/no` | 5 |
| Judgement (XX) | The Root Cause | Attribution error | `Attributed: yes/no` | 5 |

## Key Design Principles to Preserve

1. **Decision Policy is load-bearing, persona is flavor** — operational rules drive behavior across all models. Character voice adds tone but doesn't carry the instruction.
2. **Named arcana with "never repeat"** — forces variety. Without this, LLMs gravitate to 2-3 patterns.
3. **Binary success mechanic prevents confirmation bias** — positive verdicts are valid exits, not failures.
4. **Anti-scope rules in Decision Policy** — each card has explicit boundaries.
5. **Calibrated honesty** — each card must produce at least some positive findings.
6. **Justified output counts** — finding counts are explained, not ceremonial.
7. **Anti-fabrication on absence claims** — before claiming something doesn't exist, must state where they looked.
8. **The Spread context assessment** — cards read the position of their target (early-stage, mature, crisis, pre-launch) before analyzing. This shapes which arcana hit hardest.
9. **Upright/Reversed duality** — each finding includes a Reversed note: the counter-perspective to its own analysis. Built-in self-check against one-dimensional thinking.

## Installing

```bash
npx tarot-skills                              # Install all 22 (interactive)
npx tarot-skills install death tower fool     # Install specific cards
npx tarot-skills list                         # Show install status for all targets
npx tarot-skills uninstall --all              # Remove all

# Tool flags:
npx tarot-skills --claude                     # Claude Code only
npx tarot-skills --codex                      # Codex only
npx tarot-skills --claude --codex             # Both

# Scope flags:
npx tarot-skills --user                       # User-level (available everywhere)
npx tarot-skills --project                    # Project-level (current dir only)
```

**User-level** installs to `~/.claude/skills/` or `~/.agents/skills/`. **Project-level** installs to `.claude/skills/` or `.agents/skills/` in the current directory. Use `/<card>` to invoke.

## When Creating or Modifying a Skill

- Keep the single-file `SKILL.md` convention — one file per card, no supporting files
- The `description` field in frontmatter must include trigger phrases (these drive skill invocation)
- **Decision Policy section is mandatory** — must include: what to distrust, evidence requirements, positive verdict targets, anti-scope constraints
- Character voice: 2-3 sentences max, behavioral directive not theatrical monologue
- Every arcana must be named and distinct — no two arcana should test the same thing from the same angle
- The success mechanic field must be binary and must allow a "clean bill of health" verdict
- Output counts must be justified (why this number), not ceremonial
- No follow-up CTAs ("Want me to go deeper?") — the user asks if they want more
- The Spread (context assessment + VALUES.md) is standard across all cards
- Each finding must include a Reversed note (counter-perspective)
- Death produces 9 findings; all others produce 5
