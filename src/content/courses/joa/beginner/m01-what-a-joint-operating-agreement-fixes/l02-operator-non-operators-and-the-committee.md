# The operator, the non-operators and the committee

{{panel:joa-account-calculator}}

A joint venture has one operator and one or more non-operators. The operator runs the work day to day: it contracts, spends, keeps the joint account and asks the other parties for money. The non-operators advance their shares and check what the operator spent. Above both sits a committee of all the parties, which approves the work programme and the budgets. Different agreements give the committee different names; the Norwegian agreement calls it the management committee, and the Kenya model calls it the operating committee.

## The operator is also a party

The operator is one of the parties to the agreement. It holds a participating interest like everyone else and pays its own share of every cost. In the Ekene joint venture the operator is EKO, with a participating interest of 40.000000 percent. When the operator calls cash, it calls on itself as well: its own row appears in every cash call the account calculator prints.

## The operator asks for money in advance

The Kenya Model Production Sharing Contract (the 2015 model, Participation Agreement) describes the request plainly. The operator may:

> "request a non-operator to advance a share of the estimated expenditure for the following month, stipulating the due date of payment" (Kenya Model PSC 2015, Participation Agreement Art. 6.2)

The request rests on an estimate of next month's spending and carries a due date. The estimate will be wrong by some amount, so the agreement also needs a rule for correcting it later, the subject of the cash calls module.

## The committee sets the limits

The operator spends inside a work programme and budget the committee approved. The agreement then states how far the operator may go beyond them on its own authority. The Norwegian agreement allows a margin on a single line:

> "In carrying out an approved work program, however, the Operator may exceed a budget item or an AFE by up to 10%." (Norway JOA Art. 12.5)

A budget module later in this tier computes that margin and a second one on the budget as a whole. In the engine every such margin is a stated input: the 10% is the Norwegian text's figure, and the engine holds none of its own.

## The operator charges an overhead

Running a joint venture costs the operator money it cannot book line by line: head office staff, research, management. Agreements let the operator charge an overhead to the joint account on a stated scale over a stated base. The last module of this tier computes it.

## Roles in the engine

The engine stores no flag saying which party operates. It works from the parties, their participating interests and any carry, and splits each joint account amount among all of them. The contract makes EKO the operator, so in a cash call table EKO's row is the operator paying its own share.

## Exercise

Open the account calculator and choose the view "Cash calls". Run the Ekene 2027 cash calls as the box states them. Find the January 2027 rows in the per-party table and write down EKO's forecast share and call beside PA's and PB's. Then find NOC's row and note what it is called for. Keep your notes: the next lesson explains why one party is called for nothing.
