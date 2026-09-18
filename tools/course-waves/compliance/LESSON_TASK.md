# compliance LESSON TASK. Read every line before you write a word.

You are writing lessons for **`compliance`, "Compliance, Audit & Quality"**, the
second course in the NextGen `assurance` module, path_order 60. The sibling
course `riskchange` ("Risk, Change & Learning", path_order 59) is being written
beside you. Read "The seam with riskchange" before module one.

## The one sentence the course serves

**Nothing in these five apps is typed as a status: every status, count, age and
verdict is derived from a dated record read against one stated as-of date, and
every gate refuses until the evidence, the date and the named person it asks for
are on the record.**

## The one rule everything else serves

**`/root/as-wip-compliance/digest.txt` IS YOUR ONLY SOURCE OF NUMBERS, DATES,
STATUS WORDS AND ENGINE SENTENCES.** Every figure, every date, every status and
every refusal you quote must appear in the digest exactly as it prints there. You
do not run the engine. You do not count days yourself. If something you want is
not in the digest, the lesson does not get it, and you say so in your hand back so
the digest can be extended rather than the lesson invented.

**THE AS-OF DATE IS PART OF EVERY FIGURE.** The digest is built at one as-of date,
stated in its third line. Every "days until", every status, every age and every
"overdue" in it is true AT THAT DATE and at no other. Name the as-of date in any
lesson that quotes a day count or a status, and never write "today" as if it
meant the reader's today.

`RECON.md` in this directory, the engine source comments and the FINDINGS files in
`packages/engines/tools/validation/assurance/` are PROVENANCE. Read them to
understand the work. Do not take a figure or a sentence from any of them.

## History on this wave

This digest describes the engine as it is at 6b00f43. It carries NO section about
what the engine used to do. It names owner decisions by the wave that took them
(AS13-0, AS15) in SECTION 23, and each of those lines states CURRENT behaviour. A
sentence about former behaviour that reads as current behaviour is a defect; do
not write "used to", "was changed", "before the repair" or anything of that shape.
If you want to say why a rule exists, say what the rule prevents, in the present
tense. Engine source comments are dense with history ("it used to FAIL OPEN", "the
old app showed 73%"); nothing gates a writer reading them, so do not lift a
sentence out of one.

    node /root/dc-wavekit/digestprose.mjs /root/as-wip-compliance/digest.txt \
      --rules /root/as-wip-compliance --lessons <your content dir>

Run it over your lessons as well as the digest.

## Shape

- 6 modules a tier, 26 lessons a tier, 78 in the course. `structure.py` is the
  authority for every key, title, order, estimated minute and panel tag.
- **420 to 560 PROSE WORDS**, with the per-lesson minimum from `structure.py`'s
  `MIN_WORDS`: 420 for a twelve minute lesson, 470 for thirteen, 510 for
  fourteen. Front matter, table rows, headings and `{{panel:...}}` lines do not
  count.
- The lesson file is already there with its H1. Keep the H1 exactly; write below it.
- Panels are tagged where `structure.py` says and nowhere else, one
  `{{panel:<id>}}` line alone on its line.
- Every lesson ends with `## Exercise`, which asks the learner to read figures the
  digest carries and say what the relationship between them shows.

## Rules that have cost this programme most

1. **A sentence may name a figure the digest prints. It may NOT characterise the
   relationship between two figures unless the digest prints that
   relationship.** No "about twice", no "most of", no "nearly all". Where the
   digest prints two counts, quote both.
2. **A status is the engine's word, with its capital letter.** "Due soon", "On
   track", "Compliant", "Review overdue", "Not in force". Never paraphrase one
   into a synonym: "On track" and "Compliant" are two different statuses and the
   difference is a lesson in this course.
3. **A refusal is quoted verbatim or described, never re-worded inside quotation
   marks.** The digest prints each one after `REFUSED:`. The oracles check the
   verdict and never the wording, so the words are the engine's own and nothing
   else vouches for them.
4. **ONE ENGINE SENTENCE IS A RECORDED DEFECT (R4).** The reason the engine gives
   for a filed One-off obligation prints "next due in" followed by a negative
   number. The digest prints it in SECTION 3 with a frame on the line after it,
   and again in SECTION 23 as R4. Teach the STATUS of that obligation; do not
   teach its reason as a reading, and if you quote it, quote the frame with it.
5. **ONE ENGINE STRING BREAKS THE COPY RULE AND IS QUOTED ANYWAY.** "A finding
   that stopped work is a nonconformity, not an observation." is a verbatim
   engine refusal (digest SECTION 15). You may quote it inside quotation marks as
   the engine's words. You may not write that shape yourself.
6. **Held items are taught as limits, never as figures to compute with.** SECTION
   23 lists them. R1 (two outstanding counts that disagree) and R3 (the expiring
   flag on a lapsed certificate) are named there as limits: say the counts
   disagree, do not teach either count as the right one.

## Owner copy rule, and it applies to headings

**No em dashes. No en dashes. No "X, not Y" contrastive anywhere a learner
reads**, including headings. Write "A is B." and then "B is not C." as two
sentences.

## Which digest section owns which module

| tier | module | digest sections |
|---|---|---|
| Associate | m01 | 1, 2 |
| Associate | m02 | 3, 7 |
| Associate | m03 | 4, 5 |
| Associate | m04 | 6 (and the One-off rows of 3) |
| Associate | m05 | 8, 9 |
| Associate | m06 | 3 to 9, read as one register and one library |
| Professional | m01 | 10, 11 |
| Professional | m02 | 11, 12 |
| Professional | m03 | 13, 14 |
| Professional | m04 | 15 |
| Professional | m05 | 16, 17 |
| Professional | m06 | 10 to 17, read as one plan and one programme |
| Expert | m01 | 18 |
| Expert | m02 | 19 |
| Expert | m03 | 20 |
| Expert | m04 | 21, and the root cause lists of 1 |
| Expert | m05 | 22 |
| Expert | m06 | 22, 23, 24 |

The digest's own section headers carry the same map, generated from one table in
`compliance_dump.mjs` and checked against `structure.py`. A lesson does not reach
forward into a later tier's sections.

## The seam with riskchange

- THIS course owns audit independence (the Audit & Findings Manager's lead
  auditor against the auditee; ISO 19011 for every examiner), the audit and
  finding lifecycles, and the root cause categories.
- Document Control's reviewer rule (the author never reviews a revision) is
  documentControl code and is taught here, Associate m05 l04, as AS15 D1. Do not
  go on to teach the MOC approval gates or the peer review rules: they belong to
  riskchange.
- Risk scores, bands, appetite and heat maps belong to riskchange. If a lesson
  needs to mention that a finding can feed a risk register or a lesson learned,
  say so in one sentence and send the learner to riskchange.

## LEAKAGE BAN

The capstone runs three records of its own, written in
`compliance_fields_capstone.mjs`, `fields.json` and `capstone.json`. Lesson
writers never read those files, never name those records, never guess a capstone
value, and never print a number that is not in the digest.

## Hand back

Per tier: the lessons written, the prose word count of each against its own
minimum, every figure you wanted and could not find in the digest, every
two-figure comparison you wrote and the digest line it points at, and anything in
the digest you believe is wrong.
