# FC4 KEY TRUTH TASK. The capstones and their answer files.

## THE THREE PLACES REPAIR HISTORY LEAKS FROM. Read this before anything else.

The engine this course teaches has just been through a 49-finding repair.
That means three files near you are FULL of sentences describing what it used
to do, and **none of them is teaching truth**:

1. **`RECON.md` and `FINDINGS.md`.** Both open with a banner saying they are
   provenance. Do not take a number or a behaviour from either.
2. **THE ENGINE SOURCE COMMENTS.** `engines/facilities/gasProcessing.js` is
   dense with them: "The 379.49 this file used to quote", "It used to carry
   two", "This function divided by one until FC4-0", "the march used to
   evaluate mu at each interval MIDPOINT PRESSURE but at the temperature it
   started with". **NOTHING GATES A WRITER READING ENGINE COMMENTS.** A
   sibling wave shipped three repair-history sentences into committed lesson
   text and the worst of the three came from an engine source comment.
   **Engine source comments are provenance, not teaching truth.**
3. **Anything you remember from a briefing.** Including this one.

**`digest.txt` is the only teaching truth.** It is swept by
`digest_prose.mjs` for exactly this, so a forbidden sentence in the digest is
worse than the same sentence in a provenance file: two of the three sibling
leaks were not the writers' fault at all, because the writers took what the
digest said.

**AND IT IS NOT ONLY WHOLE SENTENCES.** One sibling leak was a lesson H2
HEADING, "One sentence used to answer several questions". Sweep your
headings, not only your prose. A keyword sweep will not catch the worst of
it either: the worst sibling instance was plain past tense with no trigger
word at all. Read your own past-tense sentences against what the engine does
TODAY.

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
