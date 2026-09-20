# The auditable flag

{{panel:lp-worksheet}}

The second half of the credit rule is the auditable flag. The engine's rule reads, verbatim: "an IPL is credited once, and only when flagged independent === true and not flagged auditable === false". Independence has to be asserted as true. Auditability is different: it only has to be not denied. A layer with no auditable flag is credited, and a layer flagged false is set aside.

## The layer this removes from ORONI

| IPL | IPL PFD, stated | independent, stated | auditable, stated |
| --- | --- | --- | --- |
| operator round on a procedure never audited | 0.1 | true | false |

This entry is flagged independent. It is a separate action by a separate person on a separate instrument, and on independence alone it would be credited. The engine sets it aside with the reason "flagged not auditable". A protective layer nobody audits is a layer nobody knows is still being performed, and an IPL PFD of 0.1 is a claim about how often it works that no record supports.

## The two flags are read differently on purpose

Independence is a positive claim that has to be made. Auditability is a claim the analyst can withdraw. The engine treats a missing auditable flag as no objection, so the default path credits a layer whose audit status was simply never discussed. That asymmetry is a choice, and naming it is part of using the engine honestly: the flag only removes credit when somebody has actively recorded that the layer is not auditable.

The alternative would have been to require auditability to be asserted true, the way independence is, which would refuse credit to every layer on a worksheet where the column was left blank. The engine does not take that route.

## These rules are specification

This is the honest position and the course states it plainly. The engine's own validation record says no independent route validates the credit rules. Its shared negative control removed the auditable exclusion from both the engine and the oracle and the suite stayed green, which means no test in the suite could tell the two behaviours apart. The rules are the engine's contract, pinned by behaviour tests, and the judgement of whether a layer really is independent and auditable stays with the analyst.

So the flag is a bookkeeping device for a decision made by people. What the engine guarantees is that the decision is recorded, applied consistently to every row, and visible in the output, where the uncredited layer appears with its reason attached.

## Exercise

The operator round carries an IPL PFD of 0.1 and is set aside as not auditable, leaving ORONI with a credited product of 0.001000000000. Work out the credited product and the mitigated frequency the row would report if that round were audited and the flag removed, starting from the unmitigated 0.013500000000 per year. Then write one sentence on what an audit record would have to show before you would make that change.
