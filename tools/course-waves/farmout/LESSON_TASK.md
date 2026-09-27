# EC10 Farm-ins, Farm-outs & Asset Valuation: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task
file is quoted from it. The engine's FINDINGS record, the oracle and its
golden, the fixture README and the engine's source comments are PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares it: every amount of money, value, EMV, payment, cost, carry, fee,
price, percentage, share, interest, promote, ratio, probability and chance to
SIX decimals; years, day counts, event counts, draws, seeds and whole inputs as
whole numbers; an engine message, reason and basis verbatim. A rule figure of a
text (the seven per cent of reg. 19(2), the 90 days of reg. 19(7), the 50
percent of PIA s.95(14)) is written as the text states it and cited to its
regulation or section, as the digest's provisions section does. A Penn State
figure is cited as a figure and never with the page's words.

## WHAT A LESSON IS

`structure.py` is the authority on the 18 module keys, the 78 lesson keys, the
titles, the `est_minutes` and the panel tags. It self-checks and reports zero
problems. Do not add, rename or reorder a lesson: change `structure.py` and
re-run it, then `scaffold.py`.

Each lesson carries between its own minimum and 560 PROSE WORDS: 420 at 12
minutes, 460 at 13, 500 at 14. Prose words is what `lengths.py` counts: front
matter, markdown table rows and `{{panel` lines are excluded, and headings are
counted. Run `python3 lengths.py --tier <tier>` on your own tier only.

Every stub `scaffold.py` wrote carries the lesson title as its H1 and one
`{{panel:...}}` line per panel tag. Keep both exactly (`scaffold.py --check`
reports any drift). An opening paragraph under the H1, then short `##`
sections ending in `## Exercise`. A small table, numbers first, and an
`## Exercise` that asks the learner to DO something in the course's calculator
panel, with the Ekene Deep prospect or their own terms, and never to recall a
number.

## AN ENGINE COURSE

Every `## Exercise` sends the learner to the calculator panel the lesson tags
(the earning calculator, the deal calculator or the valuation calculator) and
names the view to open. There is no Suite app for this course; do not send a
learner to one. Associate m01 l05 says it once in plain words: the practicals
run in the course's own calculator panels, which call the same engine the
lessons quote. Every required deal term has a visible control in the panel
that writes it into the box; a lesson that asks a learner to change a term
names the control.

## THE SEAMS

This course teaches farm-ins, farm-outs and valuing an interest. Carries,
back-ins and the joint operating agreement are "the joint ventures course";
decision trees, EMV and the value of information as methods are "the decision
analysis course"; portfolio choice and its risk measures are "the portfolio
course"; the cash flow ledger, discounting and NPV are "the cash flow course";
the Nigerian fiscal system is "the Petroleum Industry Act course". Name each in
one sentence where it touches this course and do not re-derive it.

## THE TIER LINE

Every tier's lessons may use a lower tier's material. **No tier's lessons may
use a higher tier's graded question.** An Associate lesson works one event's
split, its promote and its consideration; it does not work a cap, a
drill-to-earn event, an EMV, a break-even or a fee figure. A Professional
lesson does not work the value of information, a price per percent, a
development carry or a back-in. An Associate or Professional lesson may say
that a later tier takes a question up, in one sentence. The consent process at
Associate is in words; the fee is computed at Professional.

## THE READINGS AND THE STATED INPUTS

Taught as the engine's stated choices, verbatim, beside the text each reads
(`BRIEF.md`), and never keyed as the law. The value of the transaction, every
cap and overrun rule, the vesting rule, the uplift and its day basis, the
chance, the costs and the success-case value are stated inputs; a lesson says
which text prints a figure (the 2024 Regulations, the Act) and that the engine
holds none of the deal terms.

## QUOTING A RESULT: THE FIELD, NEVER THE MESSAGE

A lesson quotes a NUMERIC FIELD at the digest's precision, as the digest prints
it. An engine message, reason or basis may appear only verbatim, in double
quotation marks, a `> ` blockquote, a backtick span or a four-space indented
block, exactly as the digest prints it, and not as the source of a figure the
lesson then reasons with. `numsweep_farmout.mjs` exempts a quoted span only
when its text is EXACTLY a string the digest prints. A reason rounds money to
the cent and a computed percentage to six decimals: the 2033 uplift of the
Ekene development carry reads 9629358.08 in its reason; the lesson reasons
with the field, 9629358.080000.

## THE REFUSALS, BY NAME

Digest section 5 tables 61 refusals. **Quote the engine's message in a
blockquote.** The ones each tier must teach:

* Associate m01 l05 to m06: interests that do not sum to 100, an unknown key,
  a negative promote, a share paid above the farmor's interest, no cap, no cash
  bonus, no past costs, a farminee that is already a party.
* Professional m01 to m06: a cap on "none" with an amount, a gross-cost cap
  with no overrun rule, an overrun rule under a carry-amount cap, a vesting
  rule the engine does not accept, no assignor fees, a chance above 100, a
  success value with both an NPV and cash flows, a PEL under the gazetted fee,
  stated rates under the gazetted fee, a payment before its notification.
* Expert m01 to m06: one signal, likelihoods that do not sum to 100, no seed,
  a draw count above the work cap, a value basis the engine does not accept, a
  development carry that earns the farmor's whole interest, no uplift, a
  back-in target at or below the current interest, and the caps.

## SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **The other parties pay their own shares.** On the Ekene well FIN pays
   18200000.000000, EKO 14000000.000000 and PA 13800000.000000.
2. **A promote is measured against the interest held after the event.** The
   appraisal well's promote is 10.000000 points and its ratio 1.285714.
3. **A heads-up deal carries no promote.** 30.000000 for 30.000000: a promote
   of 0.000000 points and a ratio of 1.000000.
4. **The consideration is carry, bonus and reimbursement.** 10000000.000000 to
   EKO; FIN's equivalent working interest is 51.739130 percent.
5. **The overrun rule moves money between the two sides only.** FIN pays
   18400000.000000 under one rule and 16000000.000000 under the other; PA pays
   14400000.000000 under both.
6. **A deal moves value between the sides.** EKO's EMV rises from
   18418808.982316 to 19833033.704181, and FIN's is -1806224.721864.
7. **A break-even is of a named term.** FIN breaks even paying 35.594574
   percent, and at a chance of 27.281304 percent.
8. **The fee is seven per cent of a stated value.** 392000.000000 on
   5600000.000000; one surcharge day costs 39.200000.
9. **Information is worth more to one side than the other.** 6745331.458602 to
   FIN and 6892331.458602 to EKO.
10. **A price per percent is a stated figure over a computed one.** The stated
    price is 2.026914 times the risked value per percent.
11. **Simple and compound uplifts at the same rate differ.** 44438966.681600
    and 46353141.996585 over the life of the Ekene carry, both recovered in
    2036.

## HONESTY ABOUT THE SYNTHETIC DATA AND THE SOURCES

The Ekene Deep prospect is synthetic, and the digest says so. Every text is
named with its edition and the date it was read. No licensed text is quoted,
and the Penn State page is cited for its numbers only. A text's quirk (the
table with two numbers, the regulations numbered twice, the value of the
transaction defined twice) is shown as the digest shows it.

## THE VOCABULARY

Binding. Digest section 28. No "AI".

## NO HISTORY

The course teaches none. A sentence that begins "the engine used to" is a
defect anywhere in these 78 lessons.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive, no "rather than", no
", never", no "instead of". Headings included. Never cite a digest section
number in learner-visible text: say "the course".

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for the legislated words, repair-history framing, a
reading stated as the law, a hidden default, a quoted licensed text and a
quoted Penn State sentence; the kit's `leakage.mjs` for graded answers;
`numsweep_farmout.mjs` (the kit's `numsweep.mjs` against `truth-farmout.json`,
the harvest of the digest, with the quoting rule above) and the kit's
`litsweep.py` for literals that resolve against nothing; `lengths.py --tier
<tier>` for the prose-word band; `gate_capstone_leak.mjs` for any capstone
name, term, series or value; and `gate_claims.mjs` for every number in every
brief. Read the counts, as well as the exit code.
