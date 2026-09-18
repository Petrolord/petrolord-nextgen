# FC9 Corrosion & Integrity: the key-truth writer's task

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course; `RECON.md`, `FINDINGS.md`, the engine's source
comments and the vendored repair record are PROVENANCE.

## WHAT A KEY TRUTH IS

One sentence a learner should be able to say afterwards, with the number that
makes it checkable. Not a summary of a lesson: **a claim with evidence.**

## THE KEY TRUTHS THIS COURSE OWES ITS LEARNERS

### Associate

1. A corrosion rate here is one mechanism's uniform rate, and the engine says in
   its own list that it is not a pitting rate, a weld rate or a top-of-line rate.
2. An invented curve wearing a standard's name was WITHDRAWN rather than retuned,
   and the engine now returns `regionProvided` false and
   `materialGuidanceProvided` false so the absence is a field.
3. A partial pressure is the total pressure times a mole fraction; a fugacity is
   that times a coefficient below one at high pressure; and it is the FUGACITY
   that drives the rate while the H2S threshold and the film ratio use PARTIAL
   PRESSURES.
4. The rate is two resistances in series, so it is always below both terms and
   sits close to the smaller one.
5. The protective film's onset is COMPUTED and it MOVES: across the swept
   fugacities it moves by 96.443771 degrees Celsius, and at the shipped fugacity
   of 1.344240 bar it is 80.984504 C.
6. Below its reference pH the engine REFUSES rather than returning a factor of
   one, because a more acid water is not a less corrosive one.

### Professional

7. The oil-wet regime sets the water wetting factor to zero, so the rate is zero
   by assumption rather than by calculation, and the category, the life and the
   inhibition figure are all withheld.
8. A 95 percent corrosion inhibitor at 80 percent availability delivers 76.000000
   percent effective protection, 19.000000 percentage points short of the
   datasheet figure, and 4.800000 times the metal loss. **Availability is what
   limits it.**
9. This module computes its own friction factor and its own Reynolds number, and
   the line sizing course computes different ones for the same pipe.
10. The friction branch switch is a genuine discontinuity: the wall shear jumps by
    a factor of 2.189815 across two ten-thousandths of the Reynolds number, and it
    is reported rather than smoothed.
11. The wall shear verdict now acts on the rate. At 60 ft/s the shear is 362.474888
    Pa against a measured 100.000000 Pa threshold, the credit is removed, and the
    rate is 13.080024 mm/yr against a credited 1.896603 mm/yr, a ratio of
    6.896552, with the life falling from 4.207953 yr to 0.242737 yr.
12. The H2S to CO2 ratio is PRESSURE FREE, which is what catches a partial
    pressure built from the total pressure or from a fugacity.

### Expert

13. Eleven numbers in this module have no source in the repository and one claim
    was withdrawn. Every one of the eleven is pinned by MEASURING it out of the
    engine and comparing it against a literal in a third file, because a constant
    that lives in two files cannot be validated by comparing those two files.
14. This module has no inspection interval, no minimum thickness, no retirement
    thickness, no fitness-for-service method, no erosional velocity, no pitting
    criterion and no cracking criterion, and it says so in a returned list.
15. The rate category is a LABEL and the bands are held: the shipped default reads
    high at 0.754524 mm/yr and a tighter band set would call the same number
    something worse.
16. The binding constraint names which of the module's own limits governs the
    answer, in descending order of what would change first. It is not a
    recommendation.
17. The interesting questions are inversions: what rate can I tolerate, what
    availability do I need, what allowance reinstates the design life. All three
    are answered by bisecting a verdict the engine returns.
18. A fit that is wrong in a number is a tolerance problem. A fit that is invented
    and then labelled with somebody else's authority is not, because the number
    was never the claim.

## THE RULES

Digest section 22's three vocabulary collisions are binding: always "corrosion
inhibitor", always "mechanical erosion" or "erosional wall loss", always "this
module's friction factor". No em dashes, no en dashes, no "X, not Y" contrastive.
No key truth may state a held number as a validated one, and no key truth may
carry a graded capstone answer at any precision.
