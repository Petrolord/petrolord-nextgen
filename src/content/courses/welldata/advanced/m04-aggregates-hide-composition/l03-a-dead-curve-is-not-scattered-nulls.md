# A dead curve is not scattered nulls

The 272 contains two findings, not one. They arrive as the same kind of number, they are added together by the same arithmetic, and they are about different things. Separating them is the point of this module and the reason this tier sits at the top of the ladder.

## The two components again

NPHI has 201 nulls of 201, so it holds no finite samples at all. GR has 71 nulls of 201, so it holds real gamma ray readings in GAPI with flagged gaps among them.

Both rows were produced by counting cells that hold -9999. That is the only thing they have in common.

## What an entirely absent curve is a statement about

A curve with no finite samples was arguably never delivered. The header declares the mnemonic, the data section carries a full column for it, and the column contains no measurement anywhere. What arrived is the shape of a curve with nothing inside it.

That points at the acquisition or at the assembly of the file. A tool that was not in the string, a channel that failed before the run began, a composite built from runs that none of them logged. Whatever the cause, what you must establish is whether this well has neutron data at all, because it is not in this file.

Notice what you cannot do with it. There is no interval to work around and no statistics to compute over a reduced sample. You cannot average it, plot it, or use it in any calculation that expects a neutron curve, and no amount of care with the file changes that. The question is not what to do with the curve. The question is whether the curve exists somewhere.

The one thing that is dangerous is the mnemonic itself. Downstream software often decides what it can compute by checking which curve names are present, and a name is present here. A human scanning a registry sees the curve listed against the well and plans on that basis. That is why the deadness has to be made visible at import time rather than discovered halfway through an interpretation.

## What scattered nulls in a working curve are a statement about

71 nulls of 201 in GR is a different report entirely. The tool ran, the curve recorded, most of the column carries measurements, and at some depths there is no reading.

That is a data quality matter inside a usable curve. It has an interval structure: the flagged samples sit somewhere specific in the column, and where they sit tells you what happened. Flags at the top are usually a tool coming on depth. Flags in the middle are often bad hole, a washout, or an interval the vendor could not stand behind. Flags at a boundary are frequently a splice.

And GR remains usable. Statistics computed over its finite samples are legitimate, the curve can be plotted with gaps, and an interpretation over the intervals where it has data is sound as long as everyone knows where those intervals are. The response is to characterise the gaps and carry the caveat, rather than to go looking for a curve that is not there.

So the two findings differ in what they are about, in what you can still do, and in who you go and speak to. They are not two sizes of the same problem.

## The two graded fields overlap

Now the point the truth of this campaign forces on you. The dead curve count of 1 and the null count of 272 are not independent readings. The dead curve is 201 of that 272.

Read those fields as a reporting form and they look like two separate findings about the delivery: one dead curve was detected, and this file carries 272 flagged nulls. Read them against the file and it is one absence counted twice, once as a curve and once as 201 cells, plus 71 cells of something else.

Two consequences follow, and both of them bite in practice.

The first is that you cannot add these fields into a severity score. Anything that treats a dead curve and a null total as separate contributions is counting the same 201 cells twice, and the file's apparent badness inflates for no reason at all.

The second is that the fields move together. Resolve the dead curve and the null total falls from 272 to 71 at the same moment, without anybody touching a single flagged GR sample. A pair of numbers where fixing one changes the other is a pair that must be reported together with the relationship stated, because a reader who assumes independence will draw a conclusion the data does not support.

## Worked example

Write the finding two ways and compare them.

The version that hides the structure: nullheavy_20.las has 272 flagged nulls and one dead curve. Both halves are true and graded correct, and a reader takes away two problems of unstated size.

The version that carries it: nullheavy_20.las has 272 flagged nulls across its 4 value curves of 201 samples each, of which 201 are NPHI in V/V, a curve with no finite samples at all and the campaign's one dead curve, and 71 are gaps in GR in GAPI, which is otherwise a working curve. RHOB in G/C3 and DT in US/M have 0 nulls of 201 each.

The second version is longer by two clauses and it answers every question the first version raises. It names the absent curve, it separates the absence from the gaps, it shows that the dead curve is part of the 272 rather than an additional problem, and it says that half the file is complete.

## Exercise

For each of the two components of the 272, write one sentence stating what the finding is about, and one sentence stating what you can still do with that curve. Then explain in two sentences why the campaign's dead curve field and its null total field cannot be treated as independent findings, and what happens to each of them if the neutron curve arrives populated.

Self-check: NPHI with 201 nulls of 201 is a statement about whether the curve was delivered at all, since it has no finite samples, and nothing can be computed from it, so the action is to establish whether neutron data for this well exists anywhere. GR with 71 nulls of 201 is a statement about data quality inside a curve that works, since most of its samples are real readings in GAPI, so it can be used with its gaps characterised and the caveat carried. The two fields are not independent because the dead curve accounts for 201 of the 272, so treating them as separate findings counts the same absence twice and would inflate any severity measure built by adding them. If the neutron curve arrived populated, the dead curve count would fall to 0 for this file and the null total would fall from 272 to 71 in the same step, which is the clearest demonstration that the two numbers were reading the same thing.
