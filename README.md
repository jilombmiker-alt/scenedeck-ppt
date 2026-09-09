# SceneDeck PPT Skill

**Version 1.0.0**

SceneDeck PPT turns an idea, notes, or source documents into an audience-specific task brief, evidence-aware slide plan, and verified editable PowerPoint deck.

It is designed for product proposals, business reviews, sales proposals, fundraising decks, teaching presentations, and general professional reports.

## Install

Clone this repository into the Codex skills directory:

```bash
git clone https://github.com/jilombmiker-alt/scenedeck-ppt.git ~/.codex/skills/scenedeck-ppt
```

Restart Codex, then invoke it with:

```text
$scenedeck-ppt 把这份材料做成一份面向业务负责人的 10 页立项汇报。
```

## What it enforces

- Build the audience and decision brief before slide production.
- Separate provided facts, reasoned judgments, and missing evidence.
- Use scenario-specific narrative structures.
- Validate the slide plan before authoring.
- Create an editable PPTX and render every slide before delivery.
- Never invent data, quotes, sources, people, or outcomes.

## Validate the repository

```bash
npm test
```

The validator and tests have no third-party dependencies.
