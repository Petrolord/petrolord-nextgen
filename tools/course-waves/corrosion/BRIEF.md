# FC9 Corrosion & Integrity: the wave brief

**Read this before anything else, and read `digest.txt` beside it.**

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Four
other files in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `RECON.md` in this directory | PROVENANCE. The pre-repair audit. Its numbers are stale wherever the repair moved behaviour, which is most places. |
| `FINDINGS.md` in this directory | PROVENANCE. The same, at more length. |
| the engine's own source comments | PROVENANCE. The module carries past-tense comment lines about what it used to do. A sentence lifted out of one arrives with no frame around it. |
| `FINDINGS-corrosion.md` and `RECON-corrosion.md`, vendored beside the oracle | PROVENANCE. The repair's own record. |

A sibling course's Expert brief carried two figures that came from its recon
report. Both were wrong. The writer refused to invent them, which is the only
reason it was caught. `gate_claims.mjs` now checks every number in every brief
against the digest and says so when a figure is in the recon report instead.

## THE COURSE STATEMENT, IN ONE SENTENCE

A corrosion rate is a claim about a mechanism, and this engine's claim rests on
numbers that are not sourced anywhere in the repository, so the course teaches
the rate as a screening argument to be read and argued with, and grades only what
the engine can stand behind: what is in the stream, how fast it moves, what the
corrosion inhibitor programme actually delivers, and what the allowance actually
buys.

## THE HEADLINE LESSON: A WITHDRAWAL

An earlier version of this engine computed a sour-service severity region from an
expression of its own invention, labelled it with the names of two standards, and
served three named material recommendations off it: what steel to buy, when to
control hardness, when to qualify weldments. **The repair did not retune the
expression. It withdrew the claim.**

Digest section 2 is the whole of it, and section 2 is **not** repair history. Its
own second line says so. The absence is current, permanent and declared: the
engine returns `regionProvided` false and `materialGuidanceProvided` false today
and will keep doing so, so a caller cannot read the gap as an unset property.

**The general lesson, and it is the largest one in this course.** A fit that is
wrong by a factor of two in a number is a tolerance problem and you fix it by
measuring. A fit that is invented and then labelled with somebody else's
authority is a different kind of thing: the number was never the claim. The claim
was "this is what the standard says", and no amount of retuning makes that true.

**The threshold value stayed where it was.** Changing a live number without a
source would have repeated the same mistake with the sign flipped. The engine
keeps its threshold, declares it held, and prints it in both units.

## WHAT THIS COURSE NEVER GRADES, AND IT IS MOST OF THE ENGINE

Digest section 21 is the authority and digest section 3 pins every held constant.
Eleven items are HELD and one is WITHDRAWN:

1. every de Waard-Milliams constant, and therefore **every corrosion rate the
   correlation produced**. This course grades no correlation rate at all.
2. whether the protective scale factor multiplies the reaction term or the
   combined rate, and anything downstream of that factor.
3. the scale constants and the **published** film onset temperature.
4. the pH slope, the reference pH, and what the correlation does below it.
5. the fugacity pressure cap and anything above it.
6. the H2S screening threshold's VALUE.
7. the two H2S to CO2 transition ratios.
8. the two wall shear film thresholds.
9. the Blasius constants and the friction branch switch.
10. the rate category bands, and therefore the category WORD.
11. an inspection interval, a minimum thickness, a retirement thickness, a
    fitness-for-service assessment, an erosional velocity, a pitting criterion
    and a cracking criterion. All of these are NOT PROVIDED, which is a stronger
    statement than held.
12. WITHDRAWN: the severity region and the material guidance.

Every published **validity band** of every correlation is held too. Only four
range guards are enforced and may be taught as enforced: nought to one on every
fraction, nought to fourteen on pH, a temperature above absolute zero, and the
partial-pressure sum against the total.

## THE FIGURES A LEARNER WILL MEET, ALL QUOTED FROM THE DIGEST

**The shipped studio case**, digest section 19. Nothing typed:

| what the screen shows | value, from the digest |
| --- | --- |
| the rate | 0.754524 mm/yr, which is 29.705656 mpy |
| effective corrosion inhibition | 85.500000 percent |
| wall shear | 14.408065 Pa |
| category | high, and the engine declares the band held |
| remaining life | 4.207953 yr |
| the computed film onset | 80.984504 C, at a fugacity of 1.344240 bar |

**Five changes to that one case**, digest section 19:

* at 60 ft/s the wall shear is 362.474888 Pa against a measured stripping
  threshold of 100.000000 Pa, the corrosion inhibitor credit is removed, and the
  rate is 13.080024 mm/yr against a credited 1.896603 mm/yr. The ratio between
  those two is 6.896552 and the remaining life falls from 4.207953 yr to
  0.242737 yr.
* at 1 mol percent H2S the ratio is 0.333333333333, the regime is sulphide, and
  the rate is **unchanged** at 0.754524 mm/yr. The category and the life are
  WITHHELD and the rate is kept as a stated upper bound.
* at pH 4.0, the reference and the boundary, the rate is 1.341754 mm/yr against
  0.754524 mm/yr at the shipped 4.5. Below 4.0 the engine refuses.
* oil wet loses its category, its life and its inhibition figure, which becomes
  null rather than zero.
* a blank temperature, CO2, velocity, line diameter, density, viscosity or pH box
  is a refusal that names the box.

**The lesson the module exists to teach**, digest section 9. A 95 percent
corrosion inhibitor at 80 percent availability delivers 76.000000 percent
effective protection, 19.000000 percentage points short of the datasheet figure,
and the metal loss is 4.800000 times what the datasheet number would give.

**The onset is not a fixed temperature.** Across the fugacities the digest sweeps
it moves by 96.443771 degrees Celsius.

**The rate is now strictly monotonic in pH** above the reference: from 4.724817
mm/yr at pH 4.000000 to 0.014941 mm/yr at pH 9.000000, a factor of 316.227766.

**The friction branch switch is a genuine discontinuity.** At the measured switch
the wall shear jumps by a factor of 2.189815 across two ten-thousandths of the
Reynolds number.

**The stripping velocity is a number.** For the digest's Tunu stream it is
8.126015 m/s and the shear there is 100.000000 Pa.

**The sour threshold is not 0.05 psia.** Measured out of the engine it is
0.050763208303 psia, and a threshold of exactly 0.05 psia would be
0.003447378640 bar. The digest computes TWO relationships for that pair and
they have different bases, so quote whichever section you are teaching from
and never weld one's figure to the other's wording. Section 3: the gap
between the two, as a fraction of THE SMALLER, is 1.526417 percent. Section
24: 0.003447378640 bar is 1.503467 percent BELOW THE THRESHOLD THE ENGINE
ACTUALLY USES. An earlier draft of this brief paired 1.526417 with Section
24's wording, which is false, and all three lesson writers caught it.

**And one Suite conversion factor is truncated.** The studio divides a psig
pressure by 14.5038; the engine exports 14.503773800722, exact by definition. The
shipped default rate through the studio's divisor is 0.754523654262 mm/yr and
through the engine's exact factor is 0.754524736514 mm/yr, a fractional
difference the digest prints. **This is why all three capstones state their
conditions in the engine's units.**

## THE THREE VOCABULARY COLLISIONS, LEGISLATED AND BINDING

Digest section 22 carries the rule for each. A lesson, bank question, key truth
or panel string that breaks one is a defect and the copy gate catches it.

1. **"inhibitor"** already means a HYDRATE inhibitor across the Flow Assurance
   course: methanol or monoethylene glycol, dosed in mass fraction of the water
   phase. Here it is a CORROSION inhibitor: a filming amine with an efficiency
   and an availability. **Always write "corrosion inhibitor" on first use in every
   lesson and every bank question, and never bare "inhibitor" in a prompt, an
   option or a heading.**
2. **"erosion"** already means a GEOLOGICAL process in the Basin Modelling
   course. Here it would mean mechanical wall loss from solids or impingement,
   which this module does not model at all. **Always write "mechanical erosion" or
   "erosional wall loss", and every use must carry the statement that the engine
   has no erosional-velocity criterion.**
3. **"friction factor" and "Reynolds number"** belong to the Pipeline & Line
   Sizing course, which computes both with a different correlation and a
   different transition. The two will not agree on the same pipe and the engine
   says so in its own docstring. **Always write "this module's friction factor" or
   "this module's Reynolds number", and always state that the line sizing course
   computes its own.**

And two misreadings on the same footing: **"integrity"** here means one
arithmetic, an allowance divided by a rate; and the single **"rate"** is a general
uniform rate and never a prediction for a weld, a bend, a top-of-line film or a
pit.

## THE SCOPE SEAMS: CITE, DO NOT TEACH

Digest section 23 is the authority. The erosional velocity criterion, wall loss
taken to a derated burst pressure, the Barlow relation with a design factor, and
fugacity and partial pressure are all owned by live courses. Name the owner, say
what this module does differently, and stop. **One course points at this one:** the
Well Integrity and P&A course explicitly refuses corrosion, wall loss and
remaining life in its own scope statement. FC9 fills that refusal. A barrier
envelope is not a corrosion allowance.

## THE COPY RULE

No em dashes, no en dashes, and no "X, not Y" contrastive anywhere a learner
reads, headings and titles included. **Five verbatim engine strings breach it**
and the digest quotes all five, because a digest that paraphrases an error message
teaches a message the learner will never see. When you quote one, put it in a
blockquote as the engine's own words. **Never write a contrastive of your own.**

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words, with the minimum derived from
`est_minutes` by `structure.py`: 420 at 12 minutes, 460 at 13, 500 at 14.
`structure.py` is the authority on the module and lesson keys and it self-checks.

Three capstones, 6 graded fields each, 18 in all. `fields.json` is the answer key
and the tolerance of every field is made in exactly one place,
`gradedTolerance.js` in the NextGen repository. **Never type a tolerance.**
