# SC5 Contract & Supplier Management: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies of the academy's first practice course.

## WHERE YOUR FACTS COME FROM

`PACK.md` in this directory, and nowhere else. Every rule, duty, figure and
definition a lesson states rests on a passage of the pack, and the lesson
records those passages in `TRACE.json`. The fetched texts under `sources/` are
there to check a passage; a figure found in a text that no passage carries is
not written (ask for the pack to be extended first).

Write a figure exactly as its passage prints it, with the passage's citation
in words ("the content Act, s.60", "the Procurement Act 2023, s.52(1)", "GovS
008, 5.4.5", "the World Bank Contract Management Practice guidance"). Never
write a passage id, the word "pack" or a pack section number in a lesson.

## WHAT A LESSON IS

`structure.py` is the authority on the 18 module keys, the 78 lesson keys,
the titles, the `est_minutes` and each lesson's topics. It self-checks and
reports zero problems. Do not add, rename or reorder a lesson: change
`structure.py`, re-run it, then `scaffold.py`.

Each lesson carries between its own minimum and 560 PROSE WORDS: 420 at 12
minutes, 460 at 13, 500 at 14. Prose words is what `lengths.py` counts: front
matter and markdown table rows are excluded, and headings are counted. Run
`python3 lengths.py --tier <tier>` on your own tier only.

Every stub `scaffold.py` wrote carries the lesson title as its H1 and nothing
else. Keep the H1 exactly (`scaffold.py --check` reports drift). Write an
opening paragraph under the H1, then short `##` sections, and end with
`## Exercise`.

## THE EXERCISE: WRITTEN SCENARIO WORK

A practice course has no calculator. Every `## Exercise` sets a short written
task on one of the synthetic Ekene contracts (EKC-01 to EKC-07, the pack's
section 4), names the contract and says it is synthetic, gives the facts the
learner needs (the scenario may add facts of its own, plainly marked as the
scenario's), and asks for something the learner writes: a note, a checklist,
a register line, a decision with its reason. Then a short `### A reading`
subsection gives the answer the sources support, citing them. An exercise
never asks the learner to recall a number, and never sends them to a
calculator, a panel, an engine, a Suite app or a capstone.

## QUOTING

A passage marked QUOTED may be quoted in quotation marks or a `> `
blockquote, word for word, with its citation. A passage marked BY CONCEPT is
explained in your own words, with its citation, and never quoted. Do not
paraphrase a licensed text closely: `gate_licensed_prose.py` finds any run of
eight of its words, with or without quotation marks.

## WHICH RULE APPLIES TO WHOM

Follow `BRIEF.md`: the content Act governs the Ekene contracts; the Public
Procurement Act 2007 binds federal procuring entities and is used as published
practice for an operator, said so; UK and World Bank texts are published
practice, named as such every time. Never tell a learner that a UK or World
Bank rule binds an Ekene contract.

## THE SEAMS

This course starts at award. Tender evaluation, the award decision, contract
cost under uncertainty and Nigerian content at the tender are "the procurement
course"; inventory "the materials course"; vessel fleets "the marine course";
joint operating agreements "the joint ventures course"; gas sales agreements
"the gas sales agreements course"; risk registers and management of change
"the risk, change and learning course"; audit "the compliance course". Name
each in one sentence where it touches this course, and do not re-teach it.

## THE TIER LINE

Every tier may use a lower tier's material. **No tier uses a higher tier's
question.** An Associate lesson does not segment suppliers, run a change
request through its assessment, or work a claim, a dispute or a termination;
a Professional lesson does not set a contract strategy, assess a claim, run a
dispute process, terminate or close out. A lower tier may say, in one
sentence, that a later tier takes a question up.

## SENTENCES THE PACK WILL LET YOU WRITE (a sample, with their sources)

1. **A contract manager runs the contract day to day and keeps its plan.**
   GovS 008, 4.6.6 (quoted).
2. **Every Ekene contract sits under the content Act.** The content Act, s.6:
   later contracts in the industry must conform to the Act (quoted).
3. **Nigerians get first consideration for training and employment.** The
   content Act, s.10(1)(b) and s.28(1) (quoted).
4. **An operator reports its Nigerian content every year.** The content Act,
   s.60: within sixty days of the beginning of each year (quoted).
5. **Contractors are bound by contract to report content information.** The
   content Act, s.65 (quoted).
6. **A contract over £5 million carries at least three KPIs under the UK
   Act.** The Procurement Act 2023, s.52(1) (quoted), as UK practice.
7. **A mobilisation fee is capped in Nigerian public contracts.** The Public
   Procurement Act 2007, s.35(1): not more than 15% (quoted), as a public
   entity's rule.
8. **Changes are justified and controlled with an audit trail.** GovS 008,
   5.4.5 (quoted and by concept).
9. **Termination is the last resort.** GovS 008, 5.4.7 (quoted); the World
   Bank guidance calls it the ultimate remedy (by concept).
10. **A mediation settlement is binding and enforceable.** The Arbitration
    and Mediation Act 2023, s.82(2) (quoted).

## HONESTY ABOUT THE SOURCES AND THE SCENARIOS

The Ekene contracts are synthetic, and every lesson that uses one says so.
Every text is named with its edition. A doubt the pack records (the garbled
retention period of the Public Procurement Act 2007 s.16(12), the Playbook's
two KPI counts, the World Bank's illustrative delay damages cap) is taught as
a doubt, with nothing invented to resolve it.

## THE VOCABULARY

Binding: the pack's section 3. No "AI".

## NO HISTORY

The course teaches none.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive, no "rather than", no
", never", no "instead of", no "and not", no "and never". Headings included.
A quotation keeps its source's words exactly.

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for repair history, a reading called the law, a licensed
text quoted, a computation claimed and an AI claim; `gate_licensed_prose.py`
for any run of eight words of a licensed text; `gate_source_trace.py` for the
trace (at least two passages a lesson, on its topics) and for passage ids in
learner text; `gate_quotes.py` if a quotation is added to the pack;
`lengths.py --tier <tier>` for the prose-word band; `scaffold.py --check` for
the H1s. Run the wave with `SC5_STAGE=lessons python3 run_gates.py --dry`
once your tier is written. Read the counts, as well as the exit code.
