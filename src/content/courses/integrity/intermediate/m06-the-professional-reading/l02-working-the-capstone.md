# Working the capstone

A different well, under conditions this tier has not run. The method is the whole of what transfers.

{{panel:wi-annulus-explorer}}

## Five steps, in this order

**One. List every element that bounds the annulus.** Not the ones you think are weak. Every one. The string outside it, the string inside it, the hanger, the wellhead, the shoe formation at the bottom of the string it sits in. An element you leave off the list cannot govern, and the row you never wrote is the one failure mode this method has.

**Two. Get each element's TRUE VERTICAL depth from the survey.** Never its measured depth. Head is a vertical column, and on the published well the element at 2400 m measured sits at 2048.29303343 m vertical. Using the measured figure would have charged head over several hundred metres of hole that contribute none. Take the vertical depth from the survey for every element, one at a time.

**Three. Apply the role factor, not the raw rating.** Look up what the element is doing, not what it is: 0.5 for an outer casing in burst, 0.8 for an inner casing in burst, 0.75 for an inner tubing in collapse, 1 for a shoe or a bare rating. The engine will refuse a role it does not recognise rather than guess a factor, and it will refuse a factor that is zero or below, or greater than one.

**Four. Subtract the head net of the far side.** The annulus density minus the far side density, times 9.80665, times that element's vertical depth. Each element has its own far side, and two rows in the same table can legitimately carry different backup densities.

**Five. Take the minimum.** Over the rows, not down the list to the first plausible one.

## Two checks before you submit

**The governing value must be the smallest row, and it must not be assumed to be the first.** Compare it against every row you wrote. If the row you expected to govern is not the smallest, that is the module 3 inversion doing its work, and the table is right and you were wrong.

**A row that comes back negative means the clamp fired.** The reported value will be zero and the flag will be up. That answer is a finding, not a pressure. Report it as the well being unable to hold what is already in it, and name the element and its raw allowable.

## Exercise

Build the element list on paper before you touch the panel, and write the vertical depth beside each entry.

Enter the rows, then rank them smallest to largest and say by how much the governing one wins.

Then change one far side density and confirm that only its own row moves.
