# Licences out of order

A tracker that simply counts ticks would report a project with one licence the same way, whichever licence it holds. modularRefinery's tracker reads the order as well. It names the next stage by sequence, and it flags a stage ticked out of order.

{{panel:refinery-screen-explorer}}

## What the tracker returns

For each set of completed stages, the tracker returns a complete count, the next stage and an out of order flag:

| completed ids | complete count | next stage | out of order |
| --- | --- | --- | --- |
| (none) | 0 | Licence to Establish | false |
| lte | 1 | Licence to Construct | false |
| ltc | 1 | Licence to Establish | true |
| lte, ltc | 2 | Licence to Operate | false |
| lte, ltc, lto | 3 | null | false |

## Reading the rows

With nothing complete, the next stage is Licence to Establish. With lte complete, it is Licence to Construct. With lte and ltc, it is Licence to Operate. With all three, the next stage is null: there is nothing left to name, and the tracker says so with no stage at all.

The third row is the one this lesson is about. A project that has ticked ltc, the Licence to Construct, without lte, the Licence to Establish, has a complete count of 1, the same count as the project that ticked lte alone. The count cannot tell them apart. The other two columns can. The next stage reads Licence to Establish, because the first stage in sequence is still open. And out of order reads true.

## Why the next stage is the first open one

In every row the tracker prints, the next stage is the first stage in sequence that is not complete. That is the right rule for a sequence with prerequisites. A project that holds a construction licence without an establishment licence has not finished establishing, whatever else it holds, and the tracker sends it back to the stage that is missing.

## What out of order means in practice

On a real project an out of order tick usually means one of three things. The data entry is wrong, and someone ticked the wrong box. The first stage was granted and never recorded, so the tracker has a gap the paperwork does not. Or the project really does hold a later permission without an earlier one, which is a matter for the regulator and the project's lawyers, and not something the screen can resolve.

In all three cases the flag does its job. It stops a count of 1 being read as progress when the order says the project has a gap.

## The count alone misleads

A status report that says one licence complete is ambiguous. With the next stage and the flag beside it, it is not: one licence, next Licence to Construct, in order; or one licence, next Licence to Establish, out of order. Those are two very different projects.

## The mistake

Reporting the complete count without the next stage and the out of order flag. The count is the one column of the three that cannot see order.

## Exercise

Read the rows for lte alone and for ltc alone. Quote the complete count, the next stage and the out of order flag for each. Say which column is identical across the two rows, which two differ, and what the differences tell you about each project.
