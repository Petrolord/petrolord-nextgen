# When the normal does not fit

{{panel:materials-stock-calculator}}

The normal curve serves an item used steadily, many units a period. A slow mover is different. The pressure safety valve repair kit PSV-KIT on the Ekene register is used a kit at a time, about six times a year, so demand over its lead time is a small whole number. A normal curve fitted to that puts probability on fractions of a kit and on demand below zero.

## Poisson demand

For such an item the engine reads demand over the protection period as Poisson: independent single-unit demands arriving at a steady average rate. One figure describes the whole distribution, the mean demand over the protection period, which is the stated demand rate a period times the lead time plus the review period. The engine's rule begins, verbatim:

    X ~ Poisson(demandRate x (leadTime + reviewPeriod))

The answer is a whole number of units, the level, and the engine chooses the smallest level that meets the stated target.

## The PSV kits

The stated case, from the Ekene register (synthetic): 0.5 kits a month, a lead time of 4 months, continuous review, a cycle service level of 0.95. The Poisson mean over the lead time is 2.000000 kits, and the engine returns a level of 5. The safety stock is the level less the mean, 3.000000 kits, and the achieved cycle service at that level is 0.983436.

PSV-KIT is class V by the safety override at Associate and class C by annual usage value: cheap, slow and critical.

## A cap on the mean

The engine accepts a Poisson mean of at most 500 and refuses above it, naming the largest lead time the stated demand rate allows and pointing to the normal safety stock. On a demand rate of 5 a period, verbatim:

> leadTime must be at most 100 so that the mean demand demandRate x leadTime is at most 500; above that the normal safetyStock serves; got 100.5

Past six decimals the ceiling is printed rounded toward the accepted side, so it is accepted when typed back:

> leadTime must be at most 166.666666 (rounded down at the sixth decimal so that it is accepted) so that the mean demand demandRate x leadTime is at most 500; above that the normal safetyStock serves; got 170

A stated review period counts toward the mean and lowers the ceiling:

> leadTime must be at most 229.5 so that the mean demand demandRate x (leadTime + reviewPeriod) is at most 500; above that the normal safetyStock serves; got 240

The Poisson view refuses a demand rate of zero, and a protection period of zero, by name, as the normal view does.

## Exercise

Open the stock calculator, choose the view "Stock for Poisson demand" and start from "The PSV kits on the Ekene register". Read the Poisson mean, 2.000000, the level 5 and the safety stock 3.000000, and read the table of levels below the tiles.

Set the control "Demand rate a period (stated)" to 0 and read the refusal. Restore 0.5, then set the control "Lead time, periods (stated)" to 1001 and read the refusal: note the largest lead time the engine names, and check it against the cap of 500 on the mean.
