# The vertical assumption

Until someone builds a trajectory, every workflow that touches well depths is silently assuming holes are plumb lines. This module measures what that assumption costs on the golden model, and the honest answer is: on three wells, nothing at all, and on the fourth, everything up to and including the SIGN of a residual.

{{panel:em-tie-explorer}}

## The experiment

The panel's trajectory control runs it. "Assume a straight vertical hole" rebuilds the selected well as if its survey read zero inclination everywhere: TVDSS becomes MD minus KB, and every pick lands at the wellhead. For W1, W3 and W4 the switch changes nothing, since their holes are genuinely vertical; the residual tiles do not move. The assumption is FREE exactly where it is TRUE, which is why it survives in so many quick-look workflows.

Select W2 and switch. The tie rows become:

| Pick | True residual | Vertical-assumption residual |
| --- | --- | --- |
| TopA | -35.75883821136131 | +26 |
| TopB | +8.318351595797822 | +112.00000000000023 |
| BaseB | +45.02816332199586 | +157.00000000000023 |

## Read the damage carefully

TopB and BaseB inflate by roughly 104 and 112 m: bad, but at least bad in a way that announces itself. Residuals of 112 and 157 m on a model whose total relief is a few tens of metres are absurd on sight; any reviewer would catch them.

TopA is the dangerous row. The vertical assumption gives PLUS 26, a plausible-looking number on this model, smaller than three other entries in the true table. Nothing about plus 26 advertises that it is wrong, let alone that the true value is MINUS 35.76. The assumption did not inflate this residual; it REVERSED it. A modeller acting on plus 26 would pull the TopA surface DOWN at W2, when the well actually found TopA 35.76 m SHALLOWER than the surface: the correction would be applied in the wrong direction, on top of a wrong magnitude.

That is the module's core warning. The cost of a false assumption is not always a big number you will notice. Sometimes it is a small number with the wrong sign, and those are the expensive ones, because they carry no alarm.

## Why the numbers land where they do

The vertical-assumption TVDSS at the three picks is 1550, 1670, 1730: too deep by 53.34, 88.48 and 106.06 m, since the real hole spent length going east. And the surface is read at the wellhead, (1400, 2200), instead of up to 296 m east: the clamped surfaces at the wellhead read 1524, 1558 and 1573. Both halves of the residual moved. Next lesson dissects the two error channels separately; here, note only that the integer-looking 26, 112 and 157 arise because the wellhead samples are integers and MD minus KB is an integer, so the float dust in 112.00000000000023 is nothing but the wellhead BaseB sample's own representation.

## Worked example

Derive the vertical-assumption TopA row by hand. TVDSS: 1580 minus 30 equals 1550. Surface at the wellhead: clamped TopA at (1400, 2200) is 1524. Residual: 1550 minus 1524 equals plus 26. Now place beside it the true row from module four: landed TVDSS 1496.6634373420557, surface at the landing 1532.422275553417, residual minus 35.75883821136131. Between the two rows, TVDSS moved 53.34 m shallower and the sampled surface moved 8.42 m deeper; the residual swung by 61.76 m and crossed zero on the way.

## Exercise

Using the numbers above, compute the swing (vertical-assumption residual minus true residual) for all three of W2's picks, and check each equals the TVDSS error at that pick plus the surface-sampling difference. Then state which of the two contributions grows with depth along the hold and why.
