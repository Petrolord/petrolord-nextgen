# A blank cost is named

A netback with no freight is a real question. The engine answers it, and says that it did.

{{panel:crude-valuation-explorer}}

## Blank is a choice the engine has to make

Every cost field can be left empty. An engine could refuse such a call, or it could take the empty field as zero and say so.

For costs, it takes the second. The engine gives the reason: a blank cost is taken as zero, because a netback with no freight is a legitimate question. The blank cost is named in the result, and complete stays true.

## Taken as zero, and NAMED

What makes that safe is the second half of the rule. The blank cost is NAMED. The engine returns a list, assumedZero, of every term it took as zero because it was blank. A figure computed on an assumption carries the assumption with it.

The digest prints the Kwale case with two fields left blank:

| asked | netback $/bbl | assumedZero (named by the engine) |
| --- | --- | --- |
| Kwale, freight and losses left blank | 67.4412 | freight, losses |

Complete: true. A blank cost is named and does not make the valuation incomplete. A missing price or a missing yield does, and the next lesson reads one.

The netback here is 67.4412 $/bbl. The complete Kwale valuation, with every field filled, is 64.9473 $/bbl. Two figures for the same blend, and the only thing that tells a reader which one they are looking at is the list beside it. With assumedZero reading "freight, losses", nobody can mistake the first for a full netback.

## Losses count as a cost here

Notice that losses appear in the list. A blank loss percent is treated the same way as a blank freight: taken as zero, and named. That is consistent with lesson 2. Losses left out is one of the wrong readings that lesson printed; here it becomes a deliberate question, and the engine marks it as one.

## Where the line is

This rule is for costs only. It does not permit filling other blanks with zero. The Associate tier taught the opposite for properties: a blank sulfur is absent. It is not read as a zero, and the property comes back as not blended with the crude named.

So two kinds of blank get two answers. A blank property is absent, it is not blended, and the crude without it is named. A blank netback cost is taken as zero and named, and the valuation stays complete. In both, the blank is named in the result.

## Reading the complete case again

The complete Kwale valuation printed "Costs taken as zero because they were blank: nothing." That line is assumedZero reporting an empty list. It is the confirmation that 64.9473 carries no assumed zero.

## Exercise

Read the two Kwale netbacks, 64.9473 and 67.4412 $/bbl, and the assumedZero list beside each. Say which is the full valuation and how a reader who saw only one of them would know. Then say why the engine takes a blank cost as zero when it treats a blank sulfur as not blended.
