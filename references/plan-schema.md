# Slide plan schema

The validator accepts a JSON object with this shape:

```json
{
  "title": "Deck title",
  "mode": "professional",
  "scenario": "product",
  "brief": {
    "speaker": "Product manager",
    "audience": "Business owner and delivery team",
    "job": "Obtain approval for a controlled MVP test",
    "expectedAction": "Approve scope, owner, and two-week test budget",
    "durationMinutes": 12
  },
  "slides": [
    {
      "id": "s01",
      "layout": "cover",
      "title": "This opportunity is ready for a controlled test",
      "claim": "The user problem is material enough to validate now",
      "bullets": ["One short support point"],
      "evidenceStatus": "judgment",
      "speakerNote": "Explain the timing and the decision needed.",
      "sources": []
    }
  ]
}
```

## Required top-level fields

- `title`: non-empty string.
- `mode`: `quick`, `professional`, or `creative`.
- `scenario`: `product`, `review`, `sales`, `fundraising`, `teaching`, or `general`.
- `brief`: object containing `speaker`, `audience`, `job`, `expectedAction`, and positive `durationMinutes`.
- `slides`: 3–20 slide objects. Normal delivery decks should usually stay within 5–15.

## Slide fields

- `id`: unique non-empty string.
- `layout`: `cover`, `statement`, `split`, `metrics`, `timeline`, `visual`, or `closing`.
- `title`: audience-facing takeaway, not an internal instruction.
- `claim`: one primary claim.
- `bullets`: 0–5 concise support points.
- `evidenceStatus`: `provided`, `judgment`, or `needed`.
- `speakerNote`: presenter guidance; production scaffolding belongs here.
- `sources`: array of source objects. Each source has `label` and `url`; `accessed` is optional.

## Evidence rules

- A slide marked `needed` must contain at least one `[待补充：...]` marker in its title, claim, bullets, or speaker note.
- A `provided` slide that includes a non-trivial public claim should list a source.
- A number is not automatically a fact. If its source and definition are unknown, mark it `needed`.
- Do not use URLs that were not actually consulted.
