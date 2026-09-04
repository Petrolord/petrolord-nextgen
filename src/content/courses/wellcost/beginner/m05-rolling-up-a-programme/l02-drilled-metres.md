# Drilled metres

The second currency of the rollup counts only new hole, and three of the four activity kinds contribute nothing to it.

{{panel:wc-time-explorer}}

## What the counter counts

The engine carries a running depth and a running total of drilled metres. Only a drill activity moves either one. When it runs, the drilled total gains the interval from its start depth to its end depth, and the hole depth advances to the new bottom.

Trips, casing runs and flat activities leave both untouched. They record a start depth equal to their end depth, and the drilled total passes straight through them.

That is worth stating plainly, because two of those kinds are quoted in metres. The golden programme has round trips at 2,000 m and 3,000 m, and casing run to 500 m, 2,000 m and 3,000 m. Those metres are travelled, not drilled.

On the golden case the drilled total is 3,000 m, which is the sum of the three hole sections: 500 m of 26 inch, 1,500 m of 17.5 inch and 1,000 m of 12.25 inch.

## Drilled metres and total depth

The engine also reports total depth, and on this programme it is 3,000 m as well. The two agree, and in this engine they always will.

The reason is a refusal. A drill activity must begin exactly where the hole currently is, and the engine rejects one that does not, naming the depth you asked for and the depth the hole is at. A redrilled or sidetracked interval cannot be entered, so drilled metres can never exceed total depth here.

Deepen the well and the two move together. Adding 200 m, 500 m, 1,000 m and 1,500 m to the deepest section gives totals of 3,200, 3,500, 4,000 and 4,500 m in both columns.

Do not read that agreement as a general truth about wells. It is a property of what this model refuses to represent, and on a real well with a sidetrack the two numbers part company.

## Why it is a currency at all

Drilled metres exists as a total for the same reason days does. Some things are bought by the metre, and they need a quantity to multiply.

The two currencies are independent. The allowance sweep in the previous module moved the days from 16 to 24 and left drilled metres at 3,000 every time.

## Exercise

Read `drilledM` and `tdMdM` from the panel and confirm both are 3,000.

Change the allowance and confirm the drilled total does not move. Then change an ROP and confirm the same thing.

Try a drill activity that starts 100 m above the current hole depth. Record the message you get and say why the refusal is correct.
