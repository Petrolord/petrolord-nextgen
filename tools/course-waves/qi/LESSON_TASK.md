# QI Quantitative Interpretation: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the lesson
bodies. You write ONE TIER's lessons, in the NextGen worktree
`/root/wt-qi-nextgen`, under `src/content/courses/qi/<tier>/`.

## FIRST, ALWAYS

Commit what is already on disk before you start, and commit after every
module, staging by explicit path only (`git add src/content/courses/qi/<tier>/...`;
never `git add -A`, never `git add .`), with a conventional message and the
Co-Authored-By line from your instructions. Other agents share this worktree
and its git index: commit with an explicit pathspec
(`git commit -m ... -- src/content/courses/qi/<tier>`) so you never sweep in
another agent's staged files. Push after each commit. Never switch branches.

## WHERE YOUR NUMBERS COME FROM

`/root/qi-wip-qi/digest.txt`, and nowhere else. Quote a figure at the
precision the digest prints it (six decimals for every measured quantity,
whole numbers for counts and stated inputs as stated). Never round a digest
figure in prose unless the rounding is itself printed; if you want a short
form, say "about" and quote the printed figure in the same lesson's table.
Never compute a figure the digest does not print (no ratios, differences or
percentages of your own): if a comparison is not printed, describe its
direction in words.

## WHAT A LESSON IS

`/root/qi-wip-qi/structure.py` is the authority on the module keys, lesson
keys, titles, `est_minutes` and panel tags. Do not add, rename or reorder a
lesson.

Each lesson carries between its own minimum and 560 PROSE WORDS: 420 at 12
minutes, 460 at 13, 500 at 14. Prose words is what `lengths.py` counts: front
matter, markdown table rows, `{{panel` and `{{video` lines are excluded, and
headings are counted. Run `python3 /root/qi-wip-qi/lengths.py --tier <tier>`.

Every stub carries the lesson title as its H1, one `{{panel:...}}` line and,
on eighteen lessons, one `{{video:...}}` line. Keep all of them exactly
(`python3 /root/qi-wip-qi/scaffold.py --check` reports drift). Shape: an
opening paragraph under the H1, then short `##` sections, a small table with
numbers first, and a closing `## Exercise` that asks the learner to DO
something in the tier's panel (name the view, the source and the controls to
set) with the Ekene pack or their own case, and never to recall a number.
Place the `{{panel:...}}` line just above `## Exercise`; place the
`{{video:...}}` line after the opening paragraph.

## THE HOUSE VOICE

Dense, numbers first, no sentence that tells the reader what they are about to
read. Explain what each number means for the two questions. Every claim about
the engines, the data or a method must rest on a digest line; an "in
practice" remark is allowed only where the digest itself makes it.

## AN APP COURSE

Associate m01 l05 says it once in plain words: the practicals run in the
course's own explorer panels, which call the same engines the lessons quote,
and a Suite user will find the same steps in QI Studio and Rock Physics
Studio. Never make the Suite a requirement. Every required input has a visible
control in the panel; a lesson that asks a learner to change an input names
the control.

## THE TIER LINE

Every tier's lessons may use a lower tier's material. **No tier's lessons may
use a higher tier's material or graded question.** An Associate lesson does
not tie a well, build an angle gather or invert; a Professional lesson does not
invert. A lesson may say that a later tier takes a question up, in one
sentence.

## QUOTING A RESULT: THE FIELD, NEVER THE MESSAGE

A lesson quotes a NUMERIC FIELD at the digest's precision. An engine message
may appear only verbatim, in a `> ` blockquote or between double quotation
marks, exactly as the digest prints it, and never as the source of a figure
the lesson then reasons with.

## THE CAPSTONE BRIEF LESSON

m06 l04 of your tier describes what the capstone asks, in words: the case is a
held-out synthetic case supplied as a case file, pasted into the tier's panel;
it names the six figures in words, as digest section 21 (Associate) or the
tier's capstone section does, and tells the learner to state every choice the
case states. It quotes no case figure, no case name and no Ekene figure as a
target.

## THE VOCABULARY

Binding, digest section 60 once it exists; until then: "AI" is acoustic
impedance; "net sand" is Vsh at or below the stated cut-off; "the wet trend"
is the fluid line fitted to the brine-substituted interfaces; "distance" is
the signed perpendicular distance from a stated line, negative on the
hydrocarbon side; "the -6 dB band" is read off the mean spectrum of stated
traces with a stated taper.

## NO HISTORY

The course teaches none. A sentence that begins "the engine used to" or "QI
Studio used to" is a defect.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive, no "rather than", no
", never", no "instead of", no "and not", no "and never". Headings included.
British English (colour, metres when quoting the kit, behaviour). Depth in
feet. Never cite a digest section number in learner-visible text and never
write "the digest": say "the course".

## WHAT GATES YOUR WORK

Run, on YOUR TIER only, and read the counts as well as the exit code:

    python3 /root/qi-wip-qi/lengths.py --tier <tier>
    python3 /root/qi-wip-qi/gate_copy_rule.py
    python3 /root/qi-wip-qi/gate_vocabulary.py
    node /root/qi-wip-qi/numsweep_qi.mjs
    python3 /root/dc-wavekit/litsweep.py /root/qi-wip-qi --lessons /root/wt-qi-nextgen/src/content/courses/qi --lessons-only
    node /root/dc-wavekit/leakage.mjs /root/qi-wip-qi --tier <tier>
    node /root/qi-wip-qi/gate_capstone_leak.mjs --no-banks
    python3 /root/qi-wip-qi/scaffold.py --check

If a gate is missing or broken, say so in your hand-back; never edit a gate,
the digest, structure.py or another tier's files. If the digest lacks a figure
a lesson needs, write the lesson without it and list the gap in your
hand-back.

## WHEN YOU ARE DONE

Hand back: the commit shas, each gate's summary line, the word count range of
your 26 lessons, and every digest gap or digest claim you found doubtful
(section and line).
