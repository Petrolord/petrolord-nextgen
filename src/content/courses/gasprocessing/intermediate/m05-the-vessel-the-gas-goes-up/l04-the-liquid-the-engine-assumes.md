# The liquid the engine assumes

Souders-Brown compares a liquid against a gas, so the sizing needs a liquid density. In this module that density is an input, and which liquid it describes is a decision the caller makes.

## The default and the alternatives

The liquid the gas rises against defaults to the module's one glycol density of 69.568831 lb per ft3. A sweetening column passes its own instead, and the module builds one from each amine's solution gravity:

| liquid | density, lb/ft3 |
| --- | --- |
| glycol, the default | 69.568831 |
| MEA solution | 63.011408 |
| DEA solution | 63.635283 |
| MDEA solution | 64.883034 |

{{panel:fc-absorber-explorer}}

## Why the difference matters

A glycol density and an amine solution density are different numbers, and a column sized against the wrong one is confidently the wrong width. Confidently is the important word. Nothing in the answer looks unusual, the arithmetic is correct throughout, and the result is a plausible diameter for a vessel that was measured against a fluid it will never contain.

The published cases carry the comparison so it does not have to be reasoned about. On the same duty the two liquids give 3.828818705 ft against glycol and 3.900134220 ft against MDEA solution, a factor of 1.018625984.

## Read the third published case

The contactor golden has a case that is an amine column sized against an amine solution, and its liquid density is 64.883034 lb per ft3, built from the solution gravity the amine table already carried. That case exists because the amine route through this vessel needs its own check, and a golden made entirely of glycol columns would pass whatever the amine route did.

That is a general point about published cases. A case only checks the path it walks. A suite that is green on every case it has may still be silent about a branch nobody wrote a case for, and the count of passing cases says nothing at all about which branches are covered. Reading a golden for what it omits is a slower and more useful exercise than reading it for what it agrees on.

## What to carry away

Three things travel out of this module. The density is an input, so read which one an answer used. The amine densities come from the property table's solution gravity, which is the same table the circulation chain reads, so one declared number lands in two different answers. And the default is glycol, which means a sweetening caller who says nothing gets a glycol column.

The liquid density is an input on the page beside the rest of them, so none of this has to be inferred. It has to be looked at.

## Exercise

Record the default liquid density and the three amine solution densities. Then record the two diameters on the same duty against glycol and against MDEA solution and the factor between them, and say where the amine densities in that table come from.
