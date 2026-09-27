# Revisions, transfers and divestments

{{panel:prms-aggregation-calculator}}

Every movement other than production is stated with a low, a best and a high. What differs is the sign: some movements go either way, some only add, one only subtracts. The headings and signs are the engine's stated convention.

## The signs

- Revisions are signed. A revision of previous estimates can raise one category and lower another.
- Transfers are signed: into the class positive, out of it negative.
- Improved recovery, extensions and discoveries, and acquisitions are entered positive and added.
- Divestments are entered positive and subtracted.

On the Ekene field Reserves, the engine prints each with its sign convention in the heading, verbatim:

> revisions of previous estimates (signed): 1P 0.3, 2P -0.2, 3P -0.6

> transfers between classes (signed; in positive, out negative): 1P 3.4, 2P 5.1, 3P 6.9

> improved recovery (additions): 1P 0.5, 2P 0.8, 3P 1.2

## Reading the Ekene movements

The revision raises the 1P by 0.300000 and lowers the 2P by 0.200000 and the 3P by 0.600000: a waterflood performance review narrowed the range. The transfer brings the Ekene infill wells into Reserves from Contingent Resources at their investment decision, adding 3.400000, 5.100000 and 6.900000. The improved recovery comes from a water injection pattern change. Each note is synthetic.

A transfer is two-sided. The quantities that enter the Reserves reconciliation leave the Contingent Resources of the same project, and a Contingent reconciliation for the same period would carry them as a negative transfer. PRMS 2.2.2.6, which the engine cites, makes a related point in its own terms: moving a quantity between classes with no new information leaves the distribution of the estimate unchanged.

## Entered positive

An addition or a divestment stated negative is refused, verbatim:

> movements[0].low must be a finite number at or above 0; got -1

The sign of a divestment lives in its type. On the golden case "rec-divest-acquire", divestments larger than the additions leave a computed closing of 7.000000, 11.500000 and 16.000000, and a replacement ratio of -0.750000.

## One shape per type

A revision is stated as low, best and high. A single quantity on a revision is refused, verbatim:

> movements[0].quantity must be left out for revisions (state low, best and high); got 1

A type outside the seven is refused and the message lists them, verbatim:

> movements[0].type must be one of "revisions", "improved-recovery", "extensions-and-discoveries", "acquisitions", "divestments", "transfers", "production"; got "discoveries"

An unknown key on a movement is refused too, with the accepted keys: type, low, best, high, quantity and note.

## Contingent Resources

A Contingent reconciliation takes the same headings except production. The golden case "rec-contingent" closes at 7.600000, 12.400000 and 21.100000. Revisions, transfers and the rest behave as they do in Reserves.

## Exercise

Open the aggregation calculator on the view "Reconciliation" and start from "The Ekene field Reserves, one year". Read each movement's type control and its three figures, and write down which are signed. Set the transfer's 2P figure to 0 and read the computed closing and the Closes tile; restore it. Then switch to "Divestments and acquisitions", read the movements and the replacement ratio tile, and change the divestment's low control to -1 and read the refusal.
