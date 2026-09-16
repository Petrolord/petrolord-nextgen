# FC4 KEY TRUTH TASK. The capstones and their answer files.

## REPAIR HISTORY: FRAMED IS CURRICULUM, UNFRAMED IS A DEFECT.

**You may teach what this engine used to do. You must say that is what you
are doing.** An academy-wide sweep settled this: six live Economics courses
teach repair history deliberately, one of them in a module directory named
for it and a lesson titled "What was repaired and what was not", with 29
graded items on the subject. FC1's own sweep found 27 history-shaped
sentences and every one was framed and none was a defect. **Every real defect
this class has produced was UNFRAMED.**

So the rule is not "no history". The rule is:

- **A sentence about former behaviour that reads as current behaviour is a
  defect.** That is the whole of it.
- **Framing comes from the HEADING above a passage, or the line immediately
  before it.** An inline "HISTORY." prefix inside a sentence is not framing,
  and the gate does not read it as framing either. Put it in the heading, the
  way `Expert m05 l01` does.
- **Never repeat history you did not know was history.** That is what the
  three sources below are about.

## THE THREE PLACES HISTORY REACHES YOU, AND ONLY ONE IS FRAMED FOR YOU

The engine this course teaches has just been through a 49-finding repair.
That means three files near you are FULL of sentences describing what it used
to do, and **none of them is teaching truth**:

1. **`digest.txt` SECTION 20, which IS framed for you.** It is the one
   section of the digest whose subject is what this engine used to do, it
   says so in its title and its first line, and it is the only place you
   should be drawing history from. Four items, each a general lesson that
   happens to have an example here.
2. **`RECON.md` and `FINDINGS.md`.** Both open with a banner saying they are
   provenance. They describe the engine AS FOUND, in far more detail than
   Section 20, and **their numbers are stale**: fourteen of the eighteen
   graded capstone fields moved when the repair was vendored. Read them to
   understand the work. Do not take a figure from either.
3. **THE ENGINE SOURCE COMMENTS.** `engines/facilities/gasProcessing.js` is
   dense with them: "The 379.49 this file used to quote", "It used to carry
   two", "This function divided by one until FC4-0", "the march used to
   evaluate mu at each interval MIDPOINT PRESSURE but at the temperature it
   started with". **NOTHING GATES A WRITER READING ENGINE COMMENTS.** A
   sibling wave shipped three repair-history sentences into committed lesson
   text and the worst of the three came from an engine source comment.
   **Engine source comments are provenance.** Digest Section 20 counts them
   for you, by reading the source, and there are dozens across the vendored
   engines. A sibling course carries 12 history instances in its lesson text,
   5 of them H2 headings, traced to a changelog block in one engine file. The danger is
   not that the subject is forbidden. It is that **a sentence lifted out of a
   comment arrives with no frame around it**, and you cannot frame something
   you did not know was history. Before using any sentence you found in the
   source, establish whether it describes what the engine does now.
4. **Anything you remember from a briefing.** Including this one.

**`digest.txt` is the only teaching truth**, and Section 20 is the only part
of it that is history. It is swept by the kit's `digestprose.mjs` with this
wave's own claims, cleared phrases and 33 engine pins:

    node /root/dc-wavekit/digestprose.mjs \
      /root/fc-wip-gasprocessing/digest.txt \
      --rules /root/fc-wip-gasprocessing --lessons <your content dir>

**RUN IT OVER YOUR LESSONS, not only over the digest.** It sweeps lesson
headings as well as lesson prose, because one sibling leak was a lesson H2:
"One sentence used to answer several questions".

**Expect to TRIAGE rather than to get a clean binary.** The gate carries two
families. High-confidence keywords FAIL when unframed. Plain past-tense
narration WARNS, because no word list catches the worst instance this
programme has seen, which was "the object looked healthy, the coefficient was
right" with no trigger word in it. Read every warning against what the engine
does today, and either frame it or rewrite it.

This wave's own digest raises three warnings and all three are inside Section
20. They are re-read by hand on every rebuild rather than cleared, because
clearing them would make the one place carrying history the one place nobody
checks.

## What a capstone is here

Three capstones, one a tier, **six engine-derived graded fields each**,
eighteen in the wave. A graded field is a RETURN VALUE OF THE ENGINE. It is
never arithmetic performed in the generator, never a figure typed by hand,
and never a value that reads a held-for-literature item.

The generator is `fc4_capstone.mjs`. It is already written and it runs. It
imports `fc4_fields_capstone.mjs` and nothing else from this wave, and
**nothing in the digest generator imports either of them**, which is what
keeps the two roads apart.

## The streams

| tier | stream | what it is |
|---|---|---|
| Associate | IKOT ABASI | a TEG dehydration train making pipeline spec |
| Professional | OTUMARA | a sour gas train, read as a staged device and as a mole balance |
| Expert | ESCRAVOS | a dew point skid letting down into a low temperature separator |

## Every held item is neutralised by CONSTRUCTION

Do not change any of this without re-checking the whole list, because each
one is load bearing:

- **The McKetta real-gas correction is held.** IKOT ABASI and BOTH ESCRAVOS
  water reads sit below the pressure at which the engine warns. Verified by
  asserting the `warning` field is null on all three calls. Re-run that check
  after any change to a pressure or a temperature.
- **The 1100 Btu per lb water overhead is held.** NO Associate graded field
  reads a reboiler duty. The duty is taught in the lessons; the SENSIBLE
  half, built entirely from stated inputs, is what is graded.
- **The contactor's liquid density is held and is the wrong fluid for an
  amine.** NO Professional graded field reads a contactor diameter.
- **The amine duty per gallon is a customary value.** OTUMARA states its own.
- **The BTEX absorbed fraction and molecular weight are operating values.**
  Both are stated on the one capstone that grades a BTEX figure.

## ALL THREE ANSWER FILES ARE CUT. `fields.json` IS REGENERATED.

FC4-0 is merged and vendored. `make_fields.mjs` regenerates `fields.json`
from the generator, eighteen fields with a declared tolerance each, and it
refuses if any field has no tolerance declared for it.

## A STABILITY CLAIM IS MEASURED HERE, NEVER REASONED ABOUT

An earlier ordering of the Expert capstone led with the compressibility
derivative AND the inlet water content, on the reasoning that neither touched
the Joule-Thomson chain. **The derivative holds. The inlet water content
moves**, by 1.0000169391883849, because it is a MOLAR quantity and the
module's standard base was one of the repairs. Eleven Associate and
Professional fields moved for the same reason.

`gate_movement.mjs` now re-measures every one of the eighteen against the
pre-vendoring engine and fails if the `STABLE` list in the generator is not
exactly what held. **Four of the eighteen hold**: the sensible heat per
gallon, the Kremser fraction, the stage count, and the derivative. Nothing
else does.

It also requires a NAMED cause for every field that moved, checks that every
field attributed to the standard base moved by exactly the measured base
factor, and reports an unexplained movement rather than passing it. The six
causes are in the gate. Run it after any change to a capstone condition.

## Write the go-live assertions from the engine's OUTPUT

Not from the intuition the prompt was written with. A previous wave's first
clean go-live run refused because the assertion encoded an expectation the
course itself disproved. Run the generator, read the number, assert the
number.

## The leak gate

`gate_capstone_leak.py` checks both directions: every condition in
`fc4_fields_capstone.mjs` must be absent from `digest.txt` and from
`fc4_dump.mjs`, and every graded value must be absent from `digest.txt` at
three renderings. It refuses to report success unless it swept at least ten
conditions and exactly eighteen graded values, and it fails on a dead row in
its own shared-values ledger.

**It has already caught one real leak**: an earlier IKOT ABASI absorber and
still temperature pair produced exactly the same sensible heat per gallon as
a row of the digest's own reboiler-temperature table. Run it after every
change to a condition.

## Hand back

The eighteen fields with their values and units, the held-item check re-run
and its three null warnings, the leak gate output with its counts, and a
statement of which four Expert fields are still waiting on FC4-0.
