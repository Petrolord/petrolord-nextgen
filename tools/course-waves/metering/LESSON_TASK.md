# FC8 `metering`: the lesson writer's task

You are writing one tier: twenty six lessons across six modules. Read `BRIEF.md`
first. This file is the mechanics.

## VERIFY THIS FILE YOURSELF RATHER THAN TRUSTING IT

Everything below about how words are counted was read off the code in
`lengths.py` in this directory, not off another wave's task file. Read it
yourself. If this file and the code disagree, the code is right and this file is
a defect worth reporting, because that is exactly the failure this section
exists because of.

## HOW LONG A LESSON IS, AND WHAT A WORD IS

Every lesson body must land between its own floor and the band ceiling. The
floor rises with the lesson's `est_minutes` and both numbers are written into
the manifest entry for each lesson as `min_prose_words` and `max_prose_words`.
`structure.py` is where they come from and `lengths.py` is what measures them.

**WHAT IS EXCLUDED FROM THE COUNT**, read off `prose_words()` in `lengths.py`:

* the front matter, meaning everything between the leading triple dashes;
* markdown **table rows**, meaning any line whose first non-space character is a
  pipe;
* **panel markers**, meaning any line whose first non-space characters are
  `{{panel`.

**EVERYTHING ELSE IS COUNTED. THAT INCLUDES EVERY HEADING**, including the H1
that is the lesson title, and including the `#` characters, because the count is
a whitespace split over the surviving lines. A file that is one seven word H1
plus two body words counts as ten words: the `#` is a token, the seven title
words are tokens, and the two body words are tokens.

**THIS IS THE OPPOSITE OF WHAT EVERY EARLIER WAVE'S TASK FILE SAID.** Their
docstrings and their task files told the writer that headings were excluded, and
the code has never excluded them. A writer who trusted the task file wrote every
lesson 20 to 40 words light against the band. The code is the authority here,
because every already written wave was measured by it.

`lengths.py` in this wave is **scoped to one tier**. Run
`python3 lengths.py --tier <your tier>` and read only your own numbers. It also
reports, per tier, whether the mean word count rises with `est_minutes`, and a
tier where it does not is out of rank even if every lesson is in band.

At the foundation stage `lengths.py` exits 2 and says so, because every lesson
is still a scaffold placeholder and a gate that measured nothing must never
report success.

## THE FILES YOU EDIT AND THE FILES YOU DO NOT

Your lessons are at
`src/content/courses/metering/<tier>/<module>/<lesson>.md` in the NextGen
repository. Each one already exists as a stub.

* **Replace the placeholder body.** The placeholder marks itself with an HTML
  comment saying so, and `scaffold.py` will never overwrite a file whose marker
  has gone.
* **Leave the H1 alone.** It is the lesson title exactly as the manifest carries
  it.
* **Leave the `{{panel:...}}` line alone**, where there is one. Panels are not
  built yet and the id is registered in the manifest.
* **Do not edit `manifest.json`.** It is generated from `structure.py`.

## WHERE YOUR NUMBERS COME FROM

`digest.txt`, at the precision the digest prints. Nothing else. `RECON.md`,
`FINDINGS.md`, the vendored `FINDINGS-metering.md` and the engine source
comments are provenance and are not teaching truth.

Find your module's sections by searching the digest for
`owned by <Associate|Professional|Expert> m0<n>`. Read the sections either side
of yours too.

## THE RELATIONSHIP RULE

You may not write that one figure is larger, smaller, a fraction or a multiple
of another unless the digest printed that comparison. Lines beginning `RELATION`
carry the two values, their difference and their ratio. Quote one, or write
nothing about the relationship. Your own arithmetic over two digest figures is
not allowed, however obviously true it looks.

## QUOTING THE ENGINE

Refusals, warnings and notes are quoted **verbatim, inside backticks**, because
the learner will see those exact words on the screen. The digest prints them on
lines beginning `>`, wrapped for width; rejoin the wrapped lines into one
sentence when you quote. Do not paraphrase them and do not improve them.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastives, anywhere a learner
reads, headings included. Write "rather than". The only exemption is a verbatim
engine string.

## WHAT YOU MAY NEVER TOUCH

`fc8_capstone.mjs`, `fields.json` and anything derived from them. No capstone
plant name, no capstone condition and no graded answer may appear in a lesson.
`gate_capstone_leak.py` sweeps for all three at four renderings each, including
full float precision.

Nothing in this course grades the required emergency fire vent capacity or the
straight-run requirement for two elbows in different planes. Both are refused by
the engine by name and both are taught as limits. Do not let a lesson imply
either one is recoverable from what the package carries.

## EXERCISES

Every lesson carries an `## Exercise` section. An exercise asks the learner to
read a specific row of the digest and say what it means, or to predict which
side of a boundary a stated case falls on. An exercise must never ask for a
number that is one of the eighteen graded capstone answers.

## BEFORE YOU HAND BACK

* `python3 lengths.py --tier <your tier>` clean.
* `python3 gate_copy_rule.py` clean.
* Every figure you wrote traced back to a digest line by you, by eye, once.
