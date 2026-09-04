# A stepped bar

A uniform bar's higher modes are odd multiples of its fundamental. A stepped bar's are not, and how far they miss is what a taper factor is measuring.

{{panel:pd-string-explorer}}

## The uniform case, exactly

The published uniform string returns modes of 40.721902461, 122.165707384 and 203.609512306 spm. The ratios against the fundamental are 3.000000000 and 5.000000000, the odd harmonics a fixed free bar is supposed to give, and the engine reports uniform true with a taper factor of 1.000000000 and an acoustic velocity of 16288.760984482 ft/s. Nothing is fitted here: one material and one area give a closed form, and the numerics land on it.

## The stepped case

The published taper returns 53.362124006, 143.726878480 and 244.330411470 spm, and the ratios are 2.693424993 and 4.578723505. They are not 3 and 5 and they are not going to be. The engine reports uniform false, unresolved false, a base note of 48.866038821915 spm and a taper factor of 1.092008382351.

The teaching well ODUMA-4, three sections of 1 in, 7/8 and 3/4, returns 59.134268422, 152.571313745 and 246.782140532 spm from a base note of 50.904388515803 spm and a taper factor of 1.161673288802. More steps, a larger factor.

## The taper factor is not a stiffness ratio

Walk the split of a 5000 ft two size string from all 3/4 to all 7/8 and the spring rate climbs steadily, 224.574787346 lb/in to 305.671238333 lb/in. The note does not.

| 7/8 at the top, ft | Fundamental, spm |
| --- | --- |
| 0 | 48.865672625 |
| 500 | 50.182293806 |
| 1000 | 51.468613341 |
| 1500 | 52.585606247 |
| 2000 | 53.361957790 |
| 2500 | 53.642386647 |
| 3000 | 53.362124006 |
| 3500 | 52.585920168 |
| 4000 | 51.469048138 |
| 4500 | 50.182824921 |
| 5000 | 48.866282953 |

The note rises, turns at 2500 ft of 7/8 with 53.642386647 spm, and comes back down to where it started while the string goes on getting heavier and stiffer the whole way. The two ends are uniform strings of the same length, which is why they nearly agree at 48.865672625 and 48.866282953 spm. The middle is where the step is, and the step is what raises the note.

A reader who expects the stiffest string to ring highest gets it wrong across the whole sweep. The published taper, at 267.091373300 lb/in, rings at 53.362124006 spm, below the softer 2500 ft split, and the stiffest string of all rings at 48.866282953 spm.

## The gap to the next mode

90.364754474 spm between the first and second modes on the published taper, and 93.437045323 spm on ODUMA-4. Both fundamentals sit far below any speed a unit runs at, and the second mode sits far above it.

## What a mode number is not

It is a property of a string in free vibration. It says where the string would ring, not what the plunger does, not what the polished rod carries, and not whether the design is any good.

## Exercise

Write the mode ratios for the published uniform string and for the published taper side by side, and say which of the two is the special case.

Then find the split with the highest note in the panel and say why it is not the stiffest string.
