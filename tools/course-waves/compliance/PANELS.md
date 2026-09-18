# compliance PANELS TASK. Three explorer panels over one teaching lab.

Read LESSON_TASK.md first. The digest is the only teaching truth, and a panel is
a lesson a learner can move.

## Shape

One lab, `src/components/course/panels/compliance/complianceLab.js`, the ONLY
file that imports the vendored `packages/engines/engines/assurance/*` modules.
Every value it exports is pinned by vitest in `complianceLab.test.js` against the
figures the digest prints, so a panel and a lesson can never disagree. The lab
reads the teaching cases from `compliance_fields.mjs` as mirrored under
`tools/course-waves/compliance/`, through `waveInputs.mjs`, never from `/root`.

Register the three ids in `src/content/courses/panelRegistry.js`:
`compliance-register-explorer`, `compliance-plan-explorer`,
`compliance-readiness-explorer`. The manifests already carry them, so
`src/lib/courseContent.test.js` fails "every panel referenced by a manifest is
registered" until they are registered. That red is expected at the foundation
and is this phase's to clear.

## THE CLOCK RULE, AND IT IS THE PANEL RULE THAT MATTERS MOST HERE

**Every engine call the lab makes passes an explicit as-of date.** The engine's
default is the machine clock, and a panel that forgets the argument shows a
different register tomorrow. The lab exports the wave's as-of date and a setter
the learner moves; it NEVER calls `new Date()` with no argument, and the lab test
proves it by building the whole snapshot under two faked system dates and under
`TZ=America/Los_Angeles` and demanding the same bytes. Build a date the way
`compliance_fields.mjs` builds `AS_OF`, at local midnight from three numbers.
A date string handed to the engine as today throws a TypeError: the lab passes a
Date or nothing reaches the engine.

## THE THREE

**`compliance-register-explorer`** (Associate throughout)

- the IKORO obligation register with a slider for the as-of date, so the learner
  watches Due soon become Overdue and an expiry overtake a due date (SECTIONS 3
  and 7). At the digest's own as-of date every row must match SECTION 3;
- the lead time as a control on the flare return, with the edge drawn at the day
  the status changes (SECTION 4);
- the current period drawn as a band ending at the next due date, with the last
  filing marked inside or outside it (SECTION 5);
- recording a filing: the next due date rolled from the date that was due, with
  the date rolling from the filing would give drawn beside it and labelled as the
  one the app does not use (SECTION 6);
- the document library's review states, and the review date earned at issue with
  the correction date marked (SECTIONS 8 and 9).

Do not render explainStatus's reason for a filed One-off as a reading (R4). Show
the status; if the reason is shown at all, show it with the frame the digest
prints.

**`compliance-plan-explorer`** (Professional throughout)

- the ABAM inspection and test plan, each point as a card with its type, status
  and whether it stops work, and the progress percent counted live from the
  cards (SECTIONS 10 to 12);
- requests as actions: decide, waive, set aside, remove. **Every action goes
  through the engine's gate first and a refused action changes nothing**, with
  the engine's reason shown. That is the mechanism of this tier;
- the closure walk for the plan and for a Major NCR, one requirement at a time,
  the refusal naming what is still missing (SECTIONS 11 and 13);
- NCR ageing by band and severity at the chosen as-of date (SECTION 14);
- the ABAM checklist with its answers, the unanswered items named and the
  critical items without a finding named (SECTION 15), and the programme's
  delivered percent against its outstanding audits (SECTION 17).

**`compliance-readiness-explorer`** (Expert throughout)

- the ORASHI clause register with each clause's last counting examination,
  covered, stale or never, and the certification cycle as a control (SECTION
  20). Toggling an audit's type or status must move coverage exactly as the
  engine does: a certification body's audit, an audit in progress and a
  cancelled audit never count;
- the lead auditor picker over a scope, the owned clauses named when the engine
  refuses (SECTION 19);
- a finding's closure walk and its age stopping at its closed date (SECTION 21);
- **readiness as a list, never as a percentage or a gauge** (SECTION 22). The
  certificate expiry as a control, showing the serious item, the watch item and
  nothing, at the edges the digest prints. Do not render `certificateExpiring` as
  "inside the lead window" on its own (R3).

## THE CAPSTONE GUARD

Write `panelCapstoneGuard.test.js` on FC6's pattern: every graded value in
`fields.json`, rendered as the bare integer and signed, must appear in no panel,
lab or page source, with a permanent plant proving the detector fires. Every
graded value here is an integer, so the guard must match whole tokens rather than
substrings, and it must also refuse the five engine-derived answer dates that
`gate_promptleak.py` lists.

## Copy

No em dashes, no en dashes, no "X, not Y" contrastive in any label, tooltip or
caption. Status words are the engine's, with their capitals.
