#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

const TOOLS = {
  claude: {
    label: "Claude Code",
    userDir: path.join(os.homedir(), ".claude", "skills"),
    projectDir: path.join(process.cwd(), ".claude", "skills"),
  },
  codex: {
    label: "Codex",
    userDir: path.join(os.homedir(), ".agents", "skills"),
    projectDir: path.join(process.cwd(), ".agents", "skills"),
  },
};

const CARDS = [
  "death",
  "tower",
  "fool",
  "high-priestess",
  "hermit",
  "hanged-man",
  "magician",
  "world",
  "justice",
  "moon",
  "devil",
  "strength",
  "empress",
  "emperor",
  "hierophant",
  "lovers",
  "chariot",
  "wheel-of-fortune",
  "temperance",
  "star",
  "sun",
  "judgement",
];

const DESCRIPTIONS = {
  death: "Chaos Agent — pokes assumptions until something flinches",
  tower: "The Demolisher — tears down flawed structures that nobody questions",
  fool: "The Beginner — sees what expertise makes invisible",
  "high-priestess": "The Reader — surfaces what's unsaid, implied, or between the lines",
  hermit: "The Depth-Seeker — goes deep where others skim the surface",
  "hanged-man": "The Reframer — questions whether you're solving the right problem",
  magician: "The Resourceful — finds what's already there before reaching for something new",
  world: "The Spread — orchestrates 3-4 cards into a focused, cross-card reading",
  justice: "The Arbiter — makes the call when everyone else hedges",
  moon: "The Shadow — walks the failure paths nobody tests",
  devil: "The Chain-Breaker — reveals what you're chained to by sunk cost",
  strength: "The Patience — holds the question open when closure is premature",
  empress: "The Builder — generates options when everyone else only critiques",
  emperor: "The Systems Thinker — finds the process problem, not the people problem",
  hierophant: "The Cargo Cult Detector — catches borrowed patterns that don't fit here",
  lovers: "The Values Auditor — finds gaps between stated and lived values",
  chariot: "The Narrative Breaker — catches stories forced onto disconnected events",
  "wheel-of-fortune": "The Variance Reader — separates signal from luck",
  temperance: "The Synthesizer — finds the third option in binary debates",
  star: "The Signal Finder — finds what's genuinely working after destructive analysis",
  sun: "The Clarity Maker — catches false confidence that papers over ambiguity",
  judgement: "The Root Cause — catches when success or failure is attributed to the wrong thing",
};

function getPackageRoot() {
  return path.resolve(__dirname, "..");
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function install(cards, skillsDir) {
  fs.mkdirSync(skillsDir, { recursive: true });
  const root = getPackageRoot();
  let installed = 0;

  for (const card of cards) {
    const src = path.join(root, card);
    const skillFile = path.join(src, "SKILL.md");

    if (!fs.existsSync(skillFile)) {
      console.error(`  skip: ${card} (no SKILL.md found)`);
      continue;
    }

    const dest = path.join(skillsDir, card);
    copyDir(src, dest);
    console.log(`  installed: ${card} → ${dest}`);
    installed++;
  }

  return installed;
}

function uninstall(cards, skillsDir) {
  let removed = 0;

  for (const card of cards) {
    const dest = path.join(skillsDir, card);
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true });
      console.log(`  removed: ${card}`);
      removed++;
    } else {
      console.log(`  skip: ${card} (not installed)`);
    }
  }

  return removed;
}

function list(skillsDir, label) {
  const installed = new Set();
  if (fs.existsSync(skillsDir)) {
    for (const d of fs.readdirSync(skillsDir)) {
      if (fs.existsSync(path.join(skillsDir, d, "SKILL.md"))) {
        installed.add(d);
      }
    }
  }

  console.log(`\n  Tarot Skills (${label})\n`);
  for (const card of CARDS) {
    const status = installed.has(card) ? "●" : "○";
    console.log(`  ${status} ${card.padEnd(18)} ${DESCRIPTIONS[card]}`);
  }
  console.log(
    `\n  ${installed.size} of ${CARDS.length} installed → ${skillsDir}\n`
  );
}

function resolveCards(args, defaultAll = false) {
  if (args.includes("--all") || args.includes("all")) {
    return CARDS;
  }
  const cards = args.filter(
    (a) => !a.startsWith("-") && CARDS.includes(a)
  );
  if (cards.length === 0) {
    if (defaultAll) return CARDS;
    console.error(
      `  error: specify card names or --all\n  cards: ${CARDS.join(", ")}`
    );
    process.exit(1);
  }
  return cards;
}

const FLAG_ARGS = ["--claude", "--codex", "--project", "--user"];

function resolveToolsFromArgs(args) {
  const tools = [];
  if (args.includes("--claude")) tools.push("claude");
  if (args.includes("--codex")) tools.push("codex");
  return tools;
}

function resolveScopeFromArgs(args) {
  if (args.includes("--project")) return "project";
  if (args.includes("--user")) return "user";
  return null;
}

function filterArgs(args) {
  return args.filter((a) => !FLAG_ARGS.includes(a) && a !== "--both");
}

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function askTool() {
  console.log(`
  Which tool?

    1) Claude Code
    2) Codex
    3) Both
`);
  const answer = await prompt("  Choose [1/2/3] (default: 1): ");
  switch (answer) {
    case "2":
      return ["codex"];
    case "3":
      return ["claude", "codex"];
    default:
      return ["claude"];
  }
}

async function askScope(toolLabel) {
  const cwd = process.cwd();
  console.log(`
  Where should ${toolLabel} skills be installed?

    1) Project   (${cwd} only)
    2) User      (available everywhere)
`);
  const answer = await prompt("  Choose [1/2] (default: 1): ");
  return answer === "2" ? "user" : "project";
}

function getSkillsDir(toolKey, scope) {
  const tool = TOOLS[toolKey];
  return scope === "project" ? tool.projectDir : tool.userDir;
}

function dirLabel(skillsDir) {
  const home = os.homedir();
  if (skillsDir.startsWith(home)) {
    return "~" + skillsDir.slice(home.length);
  }
  return skillsDir;
}

function usage() {
  console.log(`
  tarot-skills — 22 Major Arcana skills for Claude Code & Codex

  Usage:
    npx tarot-skills                       Install all 22 (interactive)
    npx tarot-skills install <card...>     Install specific cards
    npx tarot-skills uninstall <card...>   Remove specific cards
    npx tarot-skills uninstall --all       Remove all
    npx tarot-skills list                  Show all cards and install status

  Tool flags (skip tool prompt):
    --claude                                Claude Code
    --codex                                 Codex
    (use both flags for both)

  Scope flags (skip scope prompt):
    --user                                  Install to home dir (available everywhere)
    --project                               Install to current project only

  Cards:
    ${CARDS.join(", ")}

  Examples:
    npx tarot-skills
    npx tarot-skills --claude --project
    npx tarot-skills --codex --user
    npx tarot-skills install --claude --codex death tower fool
    npx tarot-skills list
`);
}

async function main() {
  const [, , command, ...args] = process.argv;

  switch (command) {
    case "help":
    case "--help":
    case "-h":
      usage();
      break;

    case "install": {
      const filtered = filterArgs(args);
      const cards = resolveCards(filtered, true);
      let tools = resolveToolsFromArgs(args);
      if (tools.length === 0) tools = await askTool();
      let scope = resolveScopeFromArgs(args);

      for (const key of tools) {
        const t = TOOLS[key];
        const s = scope || (await askScope(t.label));
        const skillsDir = getSkillsDir(key, s);
        console.log(
          `\n  Installing ${cards.length} tarot skill(s) to ${t.label} (${s})...\n`
        );
        const count = install(cards, skillsDir);
        console.log(
          `\n  Done. ${count} skill(s) installed to ${dirLabel(skillsDir)}\n  Use /<card> to invoke.\n`
        );
      }
      break;
    }

    case "uninstall":
    case "remove": {
      const filtered = filterArgs(args);
      const cards = resolveCards(filtered);
      let tools = resolveToolsFromArgs(args);
      if (tools.length === 0) tools = Object.keys(TOOLS);

      for (const key of tools) {
        const t = TOOLS[key];
        for (const scope of ["user", "project"]) {
          const skillsDir = getSkillsDir(key, scope);
          if (fs.existsSync(skillsDir)) {
            console.log(
              `\n  Removing from ${t.label} ${scope} (${dirLabel(skillsDir)})...\n`
            );
            const count = uninstall(cards, skillsDir);
            console.log(`\n  ${count} skill(s) removed.\n`);
          }
        }
      }
      break;
    }

    case "list":
    case "ls": {
      for (const key of Object.keys(TOOLS)) {
        const t = TOOLS[key];
        for (const scope of ["user", "project"]) {
          const skillsDir = getSkillsDir(key, scope);
          if (fs.existsSync(skillsDir)) {
            list(skillsDir, `${t.label} — ${scope}`);
          }
        }
      }
      break;
    }

    default: {
      let tools = resolveToolsFromArgs(command ? [command, ...args] : args);
      if (tools.length === 0) tools = await askTool();
      let scope = resolveScopeFromArgs(command ? [command, ...args] : args);

      for (const key of tools) {
        const t = TOOLS[key];
        const s = scope || (await askScope(t.label));
        const skillsDir = getSkillsDir(key, s);
        console.log(
          `\n  Installing all 22 tarot skills to ${t.label} (${s})...\n`
        );
        const count = install(CARDS, skillsDir);
        console.log(
          `\n  Done. ${count} skill(s) installed to ${dirLabel(skillsDir)}\n  Use /<card> to invoke.\n`
        );
      }
      break;
    }
  }
}

main();
