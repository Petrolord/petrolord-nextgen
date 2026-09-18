# FC8 `metering`: Metering, Control Valves & Storage

The wave brief. Read this once before you write anything, then work from
`digest.txt`.

## VERIFY THIS BRIEF YOURSELF RATHER THAN TRUSTING IT

Briefs in this programme have repeatedly carried wrong numbers. One sibling
brief quoted sixteen figures the digest could not vouch for and every one of
them was wrong; the lesson writer caught them by checking against the digest,
which is the only reason they never shipped. So: **every figure you write comes
out of `digest.txt`, at the precision the digest prints it, and nowhere else.**
If this brief and the digest disagree, the digest is right and this brief is a
defect you should report.

This brief is deliberately written with almost no figures in it for exactly that
reason. `gate_claims.mjs` checks every number in every brief in this wave
against the digest, and `briefcheck.py` from the shared kit does it again.

## WHAT IS PROVENANCE AND MAY NEVER BE QUOTED

Four files in and around this wave are **PROVENANCE**. They record what the
repair found and what was done about it. They are a claim about work, not a
statement about what the engines now do, and no figure in any of them may reach
a lesson, a panel or a bank question:

* `RECON.md` in this wave directory
* `FINDINGS.md` in this wave directory
* `tools/validation/facilities/FINDINGS-metering.md`, vendored beside the oracle
* the comment blocks in the engine sources themselves

The engine source comments are on that list on purpose. They are the most
tempting thing in the repository to quote, because they are well written and
they are right next to the code. They are still provenance: several of them
describe what the engine USED TO do.

## THE ONE SOURCE OF TRUTH

`digest.txt` in this directory. Thirty two sections. Every figure in it was
produced by calling the vendored engine while the file was built, and the file
rebuilds byte for byte from `build_digest.sh`.

Each section header names the module that owns it, in the form
`(owned by Associate m01)`. Find your module, read your sections, and read the
sections either side of them so you know what the tier before you established.

## THE TWO RULES THAT WILL COST YOU A REWRITE IF YOU MISS THEM

**One. A number is quoted at the precision the digest prints it.** The digest's
header says which class prints to how many decimals. Every graded tolerance in
this course is at least half a unit in the last place of its own class, so a
reader who quotes as printed is inside the tolerance. A reader who rounds
further is not.

**Two. You may not characterise a relationship between two figures unless the
digest computed and printed it.** You may not write that one term is "about a
tenth" of another, or "three times" another, or "far larger than" another, on
your own arithmetic. The digest carries lines beginning `RELATION`, and each one
gives you the two values, their difference and their ratio. Quote one of those,
or say nothing about the relationship. This rule has cost this programme more
than any other.

## THE COURSE

Three engines, one argument. A meter run, a control valve and a tank are the
three places on a facility where a number that looks like a measurement is
really a design judgement with a standard behind it, and where the behaviour
that matters lives at a boundary the ordinary equation walks straight past.

* The orifice equation is simple. Its **uncertainty** is the subject.
* The valve equation is simple. Its **choking boundary** is the subject.
* The tank shell equation is simple. **Venting** is what actually destroys
  tanks.

No engine imports another, so nothing a learner knows about one carries over to
the next by construction. The tiers follow the three engines.

* **Associate** is the meter run: what it measures and how well.
* **Professional** is the valve: the boundary, and what sits either side of it.
* **Expert** is the tank: the inversions, and what is refused.

Six modules a tier, twenty six lessons a tier, seventy eight lessons in the
wave. `structure.py` is the only place that shape is stated and the manifests
are built from it.

## WHAT IS REFUSED IS CURRICULUM

Two answers in these engines are **WITHHELD BY NAME**, and teaching them as
limits is one of the reasons this course exists.

**The emergency fire vent.** The tank engine computes the fire heat input and
then refuses to turn it into a required vent capacity, because the relation that
does that is not in the package and the two plausible forms of it differ by a
factor of about twenty four. An emergency vent sized twenty four times too small
is how a tank is destroyed. Digest SECTION 28 shows the duty being returned and
the vent being refused, and quotes the refusal in the engine's own words. Expert
module 4 is built on it. **It is graded nowhere in this course.**

**The straight run for two elbows in different planes.** The metering engine
refuses that column by name, because the figures that used to be there fell as
beta rose and then rose again, and a published requirement rises with beta.
Digest SECTION 16 shows the refusal. Associate module 4 teaches it. **It is
graded nowhere either.**

Digest SECTION 31 is the whole register: fifteen items these three engines do
not carry or do not cite, two of them outright refusals. Read it before you
write a word, because it is the list of things you must not let a lesson imply
the engine knows.

## HOW TO QUOTE A REFUSAL

Quote the engine's own message, inside backticks, as the engine's own words. Do
not paraphrase it. A digest that paraphrased an error message would teach a
sentence the learner will never see on the screen, and the same is true of a
lesson. The digest prints every one of these messages verbatim on lines
beginning `>`.

Some of those messages breach the owner copy rule, because they carry an
"X, not Y" contrastive. Quote them anyway, exactly, and **never write a
contrastive of your own**. `gate_copy_rule.py` exempts those exact engine
strings by name and fails everything else.

## THE CAPSTONES, AND WHAT YOU MUST NEVER WRITE

There are three capstones, one a tier, six graded fields each. Their plants,
their conditions and their answers live in `fc8_capstone.mjs` and in
`fields.json`, and **nothing in those two files may appear in a lesson, a panel
or a bank question**. Nothing in the digest comes from them either: the digest
and the capstones run different facilities at different conditions on purpose,
and `gate_capstone_leak.py` proves it in both directions.

You will not need them. Everything a lesson needs is in the digest.

## THE COPY RULE

No em dashes. No en dashes. No "X, not Y" contrastive constructions in anything
a learner reads, including headings and manifest titles. Write "rather than"
instead. The only exemption is a verbatim engine string, which is exempted by
exact text.

## WHAT THE FOUNDATION HAS AND HAS NOT DONE

Done: the engines are vendored sha-identical with engines main and the closure
was walked rather than listed; the digest is built and reproduces byte for byte
under five timezones and four locales; the eighteen graded fields are chosen,
their tolerances are derived in one place, and the discriminate sweep shows no
weak route; the course tree is scaffolded with manifests and placeholder bodies;
the wave inputs are committed into the repository so the course gates can run on
a runner that has never heard of this directory.

Not done, and not yours unless you are told otherwise: no lesson body, no bank,
no panel, no lab, no migration. Nothing has been applied to any database.
