# gasvalue LESSON TASK. Read every line before you write a word.

You are writing lessons for **`gasvalue`, "Flare Gas to Value & LPG/CNG"**, the
first of the two Energy Transition courses in the NextGen academy module
`energy_transition` ("Energy Transition"), path_order 51. One sibling course is
written beside you: `carbon` (Carbon & Energy Efficiency, 52). Read "The seams"
before module one.

## The one sentence the course serves

**A flare is a measured gas before it is an emission or a product: its heating
value, its liquids and its carbon come from the analysis by the mole, the
flare's CO2 and methane follow the rule's two efficiencies, a route can yield no
more than the gas holds and is credited only for the share it recovers against a
declared counterfactual, and the LPG vessel, the vaporizer, the carousel, the
CNG bank and the cascade are each sized on the basis the engine states (a fill
limit's basis, the boiling point at pressure, the positions wholly working,
absolute pressure, real gas, equalisation).**

## The one rule everything else serves

**`/root/et-wip-gasvalue/digest.txt` IS YOUR ONLY SOURCE OF NUMBERS, BASIS
WORDS AND ENGINE SENTENCES.** Every figure, every basis the engine names and
every refusal you quote must appear in the digest exactly as it prints there.
You do not run the engine. You do not add, subtract, convert or round anything
yourself. If something you want is not in the digest, the lesson does not get
it, and you say so in your hand back so the digest can be extended rather than
the lesson invented.

**EVERY FIGURE IS INVENTED AND ILLUSTRATIVE.** The digest's preamble says so.
Egbema, Oguta, Kano and Ibafo are real places; the flow station, the plant, the
station and every figure attached to them are invented. Never present a figure
as a measured flare, a market price, a GWP a regulator set, or a code fill
limit.

`RECON.md` in this directory, the engine source comments and
`packages/engines/tools/validation/downstream/FINDINGS-gasvalue.md` are
PROVENANCE. Read them to understand the work. Do not take a figure or a sentence
from any of them.

## THE DEFECT THE LAST THREE WAVES SHIPPED: REASONING THE DIGEST NEVER PRINTS

The key-truth audits of the crude and supply waves replaced more than sixty bank
questions, and every one keyed on a LESSON sentence the digest does not print:
a rationale ("because the light molecules fit between the heavy ones"), a
consequence ("could clear a cargo that fails at the buyer's laboratory"), a
practice ("the shipping desk questions the freight"), a physical gloss ("the
curve only rises"). Each read as true, and none was checked by anything. **Do
not write them.** A lesson here may:

- quote a figure, a basis word or an engine sentence the digest prints;
- state what the engine does, in the words the digest uses to state it;
- point at a relationship the digest PRINTS as its own column or sentence ("net
  minus the gross flare", "left out minus given", "over the engine's",
  "storedKg minus deliveredKg minus leftInBanksKg");
- set a scene (who is flaring, who is buying the CNG) with no figure and no
  causal claim in it.

It may NOT explain WHY in words the digest does not use. When you want to say
why a rule exists, find the digest sentence that says it (the engine's notes and
refusals often do) and quote it. If there is none, do not write the reason; list
it in your hand back as a digest gap.

## History on this wave

The digest describes the engines as they are at f0aef14, after MD4-0 repaired
eighteen defects. It carries NO section about what an engine used to do. Teach
every repaired rule as how the engine works: the CO2 in the gas passes through;
the methane that escapes is the methane in the gas; a blank efficiency is
refused; only the recovered share of the flare is avoided; the breakeven is
closed form; a yield above what the gas holds is refused; a bank equalises and a
low bank still works; pressures are absolute; the fill limit states its basis;
the queue runs on the positions wholly working. Do not write "used to", "was
changed", "before the repair", "now correctly" or anything of that shape. Where
the digest prints the figure a shortcut would give beside the engine's (every
unburned carbon counted as methane, the heating value on mass, the fill limit
read on the other basis, the latent heat on volume, the gauge reading typed as
absolute), teach it as the shortcut the engine does not take, in the present
tense.

    node /root/dc-wavekit/digestprose.mjs /root/et-wip-gasvalue/digest.txt \
      --rules /root/et-wip-gasvalue --lessons <your content dir>

Run it over your lessons as well as the digest.

## Shape

- 6 modules a tier, 26 lessons a tier, 78 in the course. `structure.py` is the
  authority for every key, title, order, estimated minute and panel tag.
- **420 to 560 PROSE WORDS**, with the per-lesson minimum from `structure.py`'s
  `MIN_WORDS`: 420 for a twelve minute lesson, 470 for thirteen, 510 for
  fourteen. Front matter, table rows, headings and `{{panel:...}}` lines do not
  count.
- The lesson file is already there with its H1. Keep the H1 exactly; write
  below it.
- Panels are tagged where `structure.py` says and nowhere else, one
  `{{panel:<id>}}` line alone on its line.
- Every lesson ends with `## Exercise`, which asks the learner to read figures
  the digest carries and say what the relationship between them shows, using
  only relationships the digest prints.

## Rules that have cost this programme most

1. **A sentence may name a figure the digest prints. It may NOT characterise the
   relationship between two figures unless the digest prints that
   relationship.** No "about twice", no "most of", no "slightly higher", no "a
   fifth". Where the digest prints a difference or ratio column, quote it.
   Where it does not, quote both figures and stop.
2. **Precision is the digest's.** Tonnes of CO2, methane and CO2e a year and
   kilograms stored, delivered and left in a cascade print to three decimals;
   dollars of revenue, cost, margin, capital and cash flow to two; everything
   else computed to four. Quote a figure exactly as printed. Never round.
3. **A basis is the engine's word.** "absolute (bar(a))", "water_capacity_mass",
   "liquid_volume", "volume", "mass", "mole", "gas mass", "propane and heavier",
   "heating value". Quote them as printed.
4. **A refusal is quoted verbatim or described, never re-worded inside
   quotation marks.** The digest prints each after `REFUSED:`. Two engine
   sentences carry the contrastive shape the owner rule bans (the heating-value
   note in SECTION 8 and the vaporizer's floor note in SECTION 27); quote them
   only as the engine's words, in quotation marks, and never copy the shape into
   your own prose.
5. **Omitted and blank are different.** A value left out of the call keeps the
   engine's stated default; a box left blank is missing. The digest prints the
   omitted default for on-stream days (SECTION 13) and prints a blank refused or
   named missing for on-stream days, the gas gravity, shift hours and the lead
   time. Where the digest prints only one of the two, teach only that one.
6. **Held items are taught as limits, never as figures to compute with.**
   SECTIONS 14 and 35 state the four: the flare efficiencies have no default
   (H1), an unlit flare is not modelled (H2), code fill limits are not shipped
   (H3), GWP values and credit prices are case inputs (H4). Never tell the
   learner which efficiency tier, GWP edition or fill limit is right.
7. **Counts are not four-decimal figures.** fillsBeforeRecharge, queuePositions,
   minimumPositionsForThroughput and fleetRequired print as whole numbers.

## Owner copy rule, and it applies to headings

**No em dashes. No en dashes. No "X, not Y" contrastive anywhere a learner
reads**, including headings. Write "A is B." and then "B is not C." as two
sentences. "Rather than" and "instead of" pairs read as the same shape; avoid
them.

## Which digest section owns which module

| tier | module | digest sections |
|---|---|---|
| Associate | m01 What Is Being Flared | 1, 2, 3, 4 |
| Associate | m02 The Gas by the Mole | 5, 6 |
| Associate | m03 The Liquids in the Gas | 7, 8, 9 |
| Associate | m04 The Flare by the Rule | 10, 11 |
| Associate | m05 CO2e and Its Limits | 12, 13, 14 |
| Associate | m06 The Associate Reading | 15, read with 4 to 13 as one flare |
| Professional | m01 Four Routes and Their Envelopes | 16, 17 |
| Professional | m02 What the Gas Can Yield | 18 |
| Professional | m03 A Route's Year | 19, 20 |
| Professional | m04 The Counterfactual | 21 |
| Professional | m05 Credits and the Bid | 22, 23 |
| Professional | m06 The Professional Reading | 24, read with 16 to 23 as one parcel |
| Expert | m01 The LPG Blend and the Vessel | 25, 26 |
| Expert | m02 Vaporizer, Carousel and Float | 27, 28, 29 |
| Expert | m03 Gas in a Bank | 30 |
| Expert | m04 The Cascade | 31, 32, 33 |
| Expert | m05 The Customer's Switch | 34, 29 (the trailers) |
| Expert | m06 The Expert Reading | 35, 36, read with 25 to 34 |

The digest's own section headers carry the same map, generated from one table in
`gasvalue_dump.mjs` and checked against `structure.py`. A lesson does not reach
forward into a later tier's sections.

## The seams

- **`carbon` OWNS the inventory**: emission sources, GWP sets and their
  editions, computed against reportable, intensity and its boundary, the cost
  per tonne and the MAC curve, target verdicts, and energy efficiency. This
  course uses a methane GWP only as the case's stated input, and never says
  which edition a figure comes from or which is right. If a lesson wants to say
  that a flare is also an inventory line, say so in one sentence and send the
  learner to `carbon`.
- **Facilities (FC3) owns compressor thermodynamics.** Expert m04 l04 teaches
  cngCompression as a unit bridge: the throughput as standard volume, the
  pressures in psia, the stage count and pressures the Facilities engine
  returns. It does not teach head, efficiency or power, and grades none of it.
- **Economics owns NPV, IRR, Monte Carlo and decision trees.** routeEconomics
  and conversionEconomics hand a cash flow on and do not discount it (SECTIONS
  20 and 34 print the engines' own sentences). A simple payback and a breakeven
  credit price are this course's; a discounted anything is not.
- The loading-rack queue is the supply course's (`supply`); here the carousel
  and the forecourt call it, and the lessons say so in one sentence.

## LEAKAGE BAN

The capstone runs three records of its own, written in
`gasvalue_fields_capstone.mjs`, `fields.json` and `capstone.json`. Lesson
writers never read those files, never name those records, never guess a capstone
value, and never print a number that is not in the digest.

## Hand back

Per tier: the lessons written, the prose word count of each against its own
minimum, every figure you wanted and could not find in the digest, every
two-figure comparison you wrote and the digest line it points at, every "why"
you wanted to write and had no digest sentence for, and anything in the digest
you believe is wrong.
