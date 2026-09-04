# A string is not a valve

Nothing in a valve sheet can be checked without the string it came from, because every number in it was produced by a depth that the valve above it chose.

{{panel:pd-valve-explorer}}

## The chain of dependence

The decrement fixes the stage pressures. The stage pressures and the transfer differential fix the depths. The depths fix the temperatures and the pressures on both sides of each port. Those fix the domes, and the domes fix the rack settings. Change the decrement from 25.00 to 20.00 psi per valve and valve 6 moves 162.471207387 ft deeper. Every setting below valve 1 in the sheet is then wrong, and none of them look wrong.

## What the sheet looks like down the string

On westTexasOil the rack openings fall 956.727988968, 944.791780671, 929.734277193, 912.433488084, 893.468891559, 873.239491858 and 852.029990859 psia. The spreads fall with them, 47.285654927, 38.072257328, 30.389147439, 24.002651349, 18.710371399, 14.338457993 and 10.738466038 psi.

Both trends are consequences of position, not of hardware. All seven valves carry the same 0.25 in port in the same 0.77 in2 bellows at the same R of 0.063749851. The deep valve is not a smaller valve. It is the same valve set for a lower stage pressure at a hotter depth where the casing and the tubing have closed on each other.

## The mistake

Substituting one valve. A bigger port to gain throughput changes R, which changes the dome the balance demands, which changes the rack opening and the interval the valve stays open across, which changes whether it is still open when the point of injection has moved below it. Moving one mandrel to miss a coupling does the same thing through a different door, and both changes look local on a sheet that lists valves in rows.

Re-run the string. A design that has had a single valve edited in place is not a design that was ever computed.

## What it refuses

The module will not tell you a sheet is stale. It reports a stop reason, a warning list and a per valve table, and every one of those describes the run it just did. It also refuses the two questions a reviewer most wants answered: whether the well flows at these depths, since there is no IPR in it, and what the real flowing traverse is, since that is passed in from outside rather than invented here.

## Exercise

Record the rack opening and the spread for all seven charged valves of westTexasOil, then re run the design at 20.00 psi per valve.

Then say how many rows of the original sheet survive unchanged, and name the one that does.
