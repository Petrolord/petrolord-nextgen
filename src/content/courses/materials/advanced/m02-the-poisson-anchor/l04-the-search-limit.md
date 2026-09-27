# The search limit

{{panel:materials-spares-calculator}}

The engine finds the cheapest number of spares by pricing every whole number from 0 to a stated limit and taking the lowest total. The limit is a stated input, maxSpares, with no default. This lesson reads what happens at the edge of that search.

## An exhaustive search, with a flag

Every number from 0 to the limit is priced, so the search misses nothing inside its range. What it cannot see is a cheaper stock above the limit. When the cheapest total it finds sits on the limit itself, the engine says so in its reason and sets the "Stopped at the search limit" tile to true. On the ESP motor with a limit of 1, verbatim:

> 1 spare: holding 37000 a year against expected downtime 1718091.85, total 1755091.85, the lowest for 0 to 1; the search stopped at maxSpares 1, so a larger stock may cost less

The flag is the cue to search again with a larger limit. It is a result with a reason, and it is no refusal.

## What "may" means

The words "may cost less" are exact. With 4 failures a year the ESP motor's mean doubles, and a search to 6 stops on its limit with the flag raised. Search again to 10 and the cheapest is still 6, now inside the range and unflagged. The flag says the answer is unproven, and a wider search settles it.

## Free holding again

With a holding rate of 0 every spare is free to keep, so the largest number searched always wins and the flag is always raised. On the ESP motor to a limit of 3, verbatim:

> 3 spares: holding 0 a year against expected downtime 77347.41, total 77347.41, the lowest for 0 to 3; the search stopped at maxSpares 3, so a larger stock may cost less

## What the limit accepts

The limit is a whole number from 0 to 1000; the cap is the engine's stated MAX_SPARES. A fraction is refused, and so is a limit above the cap, each in the engine's own words:

> maxSpares must be a whole number from 0 to 1000; got 1.5

> maxSpares must be a whole number from 0 to 1000; got 1001

A limit of exactly 1000 is accepted, and the engine prices every row. A limit of 0 is accepted too, and prices the empty shelf alone.

## Choosing a limit

A sensible limit sits well above the mean orders outstanding, so the cheapest stock falls inside the range. The engine does not choose it: the planner states it, and the flag reports when the choice was too small.

## Exercise

Open the spares calculator on the view "Insurance spares" and start from "The ESP motor on the Ekene register". Set "Search limit, the most spares (stated)" to 1 and compare the reason with the first quotation above. Set it to 1.5, then to 1001, and read both refusals. Set it to 1000 and check that the cheapest stock is 4 with the flag false. Restore 6, set "Failures a year (stated)" to 4, and read the flag. Raise the limit to 10 and record whether the cheapest stock moved.
