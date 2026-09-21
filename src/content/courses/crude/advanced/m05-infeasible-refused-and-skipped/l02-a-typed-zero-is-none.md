# A typed zero is none

The availability column is where costly typing mistakes are made, because three different entries look alike on a screen and mean three different things to the kernel. The engine's rule is short. A maximum left blank is no limit. A typed number is exactly that number, and a typed 0 is none.

## Three butane tanks

The digest solves the Apapa cargo three times, changing only Butane's maximum:

| butane maximum | status | butane volume bbl | total cost $ | binding |
| --- | --- | --- | --- | --- |
| 400 (as typed) | optimal | 400.0000 | 698701.5605 | Sulfur, RVP |
| 0 (tank empty) | optimal | 0.0000 | 710560.2149 | Sulfur |
| left blank (no limit) | optimal | 438.1863 | 698569.3341 | Sulfur, RVP |

Each row is a different problem with a different answer.

**400 as typed.** This is the Apapa recipe of module three. Butane sits at its 400 bbl bound, the total cost is 698701.5605 $, and Sulfur and RVP bind.

**0, the tank empty.** A typed 0 is an upper bound of zero, so Butane is out of the recipe entirely: 0.0000 bbl. The recipe is rebuilt from the other three components, the total cost is 710560.2149 $, and only Sulfur binds. RVP drops out of the binding list.

**Left blank.** A blank maximum is no limit at all. Butane is free to enter as far as the specifications allow, and the recipe takes 438.1863 bbl. The total cost is 698569.3341 $. Sulfur and RVP both bind, and with no tank limit to hold it, Butane is now stopped by the specifications alone.

## Why the rule is the rule

A blank and a zero must not be confused, in either direction.

If a blank were read as zero, every component whose availability nobody filled in would vanish from the recipe, and the optimizer would report a costlier cargo, or an infeasible one, for a reason nobody typed. If a typed zero were read as blank, a tank that is genuinely empty would be treated as bottomless, and the recipe would call for barrels that do not exist. Both mistakes produce a confident, optimal-looking answer. Neither would show as an error.

So the engine takes each entry literally. A number means that number. Zero is a number. Blank means the user did not state a limit, and the engine does not invent one.

## Reading the binding lists

The binding column is worth reading row by row. With 400 bbl typed, RVP binds and Butane is at its bound. With the tank empty, RVP does not bind: without Butane in the recipe, the RVP row has room. With no limit, RVP binds again, and it is now the RVP row itself that stops Butane. The same RVP limit is doing different work in each case, and the availability entry decides which.

This is the Associate tier's lesson on blanks carried into the optimizer. In the assay studio a blank sulfur is absent and never a zero, and the property is not blended. Here a blank maximum is absent and the limit is not applied. In both, a blank says nothing was stated, and the engine does not fill it.

{{panel:crude-recipe-explorer}}

In the panel, type 0, then clear the field, then type 400 in Butane's maximum, and read the recipe and the binding list after each.

## Exercise

Read the three butane rows: total cost 698701.5605 $ at 400 as typed, 710560.2149 $ at 0 and 698569.3341 $ left blank, with butane volumes 400.0000, 0.0000 and 438.1863 bbl. Say what the binding list in the tank-empty row shows about the RVP row, and say what the blank row's butane volume shows about what holds Butane back when no tank limit is typed.
