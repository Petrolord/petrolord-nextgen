# Two findings two responses

Separating the 272 into 201 and 71 is only worth doing if the two halves lead somewhere different. They do. This lesson is about what you actually do next, which is a short list of practical steps in each case, and about the order you do them in.

## The absent curve

NPHI has 201 nulls of 201 and no finite samples, so the first move is outward. This is a delivery question and you cannot answer it from the file.

Go back to whoever supplied the data. That is the vendor or the archive if the file came from outside, and it is the person who requested and received the delivery if it came from inside. Address the query to a person rather than to an inbox, because you are asking them to go and look at something.

Ask three things, in this order. Was a neutron tool run in this well at all. If it was, which run or which file carries the curve, since it is not in this one. If it was not, say so in writing, so the absence becomes a recorded fact about the well rather than an open question that somebody re-opens in six months.

Ask for one of two outcomes. Either a corrected file that carries the curve, or an explicit statement that no neutron data exists for this well. Both close the item. An unanswered query does not, and an unanswered query about a curve that a downstream tool believes exists is the exact situation this whole campaign is designed to prevent.

In the meantime, make the deadness visible where people and software will meet it. The decision you were taught at the Associate tier still applies: flag the column as dead so the delivery record shows what the supplier sent, or drop it so nothing downstream can mistake the mnemonic for data. Either is defensible, and leaving the column in place unmarked is not, because the mnemonic alone is enough to make a porosity workflow enable a path it cannot complete. Whichever you choose, write down which file, which curve, which choice and why.

And use the rest of the file. Two of its four curves have 0 nulls of 201, so RHOB in G/C3 and DT in US/M are complete and there is no reason to hold them back. A dead curve is not a reason to quarantine a well. It is a reason to be precise about which part of the well you have.

## The gapped curve

GR has 71 nulls of 201 and most of its column carries real readings in GAPI. The first move here is inward, because you can learn a great deal without asking anyone.

Find out where the gaps are. Flagged samples at the top of the column usually mean the tool was coming on depth. A block in the middle usually means bad hole or an interval the vendor would not stand behind. Flags at a boundary often mean a splice between runs. The pattern is visible in the file and it tells you most of what you need.

Then decide whether the location of the gaps matters for what this well is for. Gaps above the zone of interest are a footnote. Gaps through the zone are a real limitation and the interpreter needs to know before they start rather than after.

If the pattern is unexplained, or if it sits over the interval that matters, then you do go back, and the question is narrower than the one about the neutron curve. Ask what happened over those depths, ask whether the remarks in the original log header say anything, and ask whether a later run covers the same interval.

And in the meantime the curve is usable. Statistics over its finite samples are legitimate as long as they are computed over the finite samples only, the curve plots with its gaps shown as gaps rather than interpolated across, and any interpretation records which intervals had data. The caveat travels with the curve, and the curve keeps working.

## What the two responses have in common

Both end in a written record, in the same place, in the same form: file, curve, finding, decision, date, and who was asked. The record is what stops the same question being asked again by the next person, and it is what lets you tell a supplier's third delivery from their first.

Both also treat the file as usable until proven otherwise. Neither finding is a reason to reject nullheavy_20. One curve is absent, one is gapped, two are complete, and a well that carries three working curves is a well you can do something with.

## The order they go in

Prioritise by turnaround rather than by the size of the number.

The neutron query goes out first, even though the interpretation work may not need that curve for weeks. It is the item with the longest turnaround, because somebody has to go and look for another file, or find a run ticket, or confirm that a tool was never in the string. Started today it may close this month. Started next month it may not close at all, because the people who remember the job will have moved on.

The gap question can wait, because you can answer most of it yourself and the curve is usable while you do. It is a smaller number and a smaller problem, and it stays smaller.

Note that this ordering is the reverse of what a null total alone would suggest. Sorted by the number, the file just looks bad. Sorted by what each finding needs, one item is urgent because of who has to act on it and one is not, and no aggregate could have told you that.

## Exercise

Write the two messages you would send about nullheavy_20.las, each in three or four sentences: one to the data supplier about the neutron curve, and one to the interpreter who is going to work this well. Then say which of the two you would send first and why, without referring to the size of either number.

Self-check: the supplier message should state that NPHI arrives with 201 nulls of 201 and no finite samples, ask whether a neutron tool was run in this well, ask which file carries the curve if it was, and ask for a written confirmation if it was not, so that either a corrected file or a recorded absence closes the item. The interpreter message should say that NPHI is unusable and has been flagged or dropped with the choice recorded, that GR has 71 nulls of 201 and remains usable with its gaps characterised and its statistics taken over the finite samples, and that RHOB in G/C3 and DT in US/M have 0 nulls of 201 and are complete. The supplier message goes first because it has the longest turnaround and depends on someone else going to look for something, while the gap question is largely answerable from the file you already hold.
