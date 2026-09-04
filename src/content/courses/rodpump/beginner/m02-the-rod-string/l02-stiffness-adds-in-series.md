# Stiffness adds in series

One over the spring rate is a sum of length over area times modulus, taken section by section, so it is the compliances that add and never the spring rates.

{{panel:pd-string-explorer}}

## The arithmetic on the published taper

The 7/8 section, 3000 ft of it, has a compliance of 1.962893216e-3 in/lb, which on its own would be a spring rate of 509.452063888 lb/in. The 3/4 section, 2000 ft, has a compliance of 1.781143844e-3 in/lb, a spring rate of 561.436968366 lb/in on its own.

Add the compliances and the total is 3.744037060e-3 in/lb, so the string spring rate is 267.091373300 lb/in. That is what the engine does, and the oracle returns the same figure with a difference of 0.000e+0 lb/in, because a compliance sum has only one answer.

## The mistake, priced

Add the spring rates instead and the answer is 1070.889032254 lb/in, which is 4.009448 times the true string rate. A string that stiff barely stretches, so the static stretch computed from it is far too small and the plunger stroke that follows is far too long.

One line catches it every time. A series string is always softer than its softest section. The softest section here is 509.452063888 lb/in standing alone, and the whole string comes out at 267.091373300 lb/in, well under it. Any answer larger than the smallest section rate is arithmetic, not steel.

## Compliance is not shared out by length

The 7/8 section is 3000 ft of the 5000 and carries 52.427184 percent of the compliance; the 3/4 section is 2000 ft and carries 47.572816 percent. The three way taper of the teaching well ODUMA-4 makes it plainer: 1500 ft of 1 in rods, 1600 ft of 7/8 and 1700 ft of 3/4, with compliance shares of 22.685963, 31.606022 and 45.708015 percent. The lengths are nearly equal and the shares are not, because compliance per foot goes as one over the area, and the areas are 0.785398163, 0.601320469 and 0.441786467 in2.

The section that stretches most is the smallest one, wherever it sits.

## What the spring rate is for

Static stretch is the fluid load times the elastic constant. On the published taper a fluid load of 5000 lb gives 18.720185 in.

## What it refuses to tell you

Whether the sections are in a sensible order. Reverse the published taper, 3/4 above 7/8 over the same 5000 ft, and the answer is ok true with a `taperStepsUp` warning and a spring rate of 251.236634246 lb/in. The compliance sum is indifferent to order; the string is not.

## Exercise

Take the two published sections and compute the string spring rate both ways, by adding compliances and by adding spring rates, and write the ratio between the two results.

Then say which of the three ODUMA-4 sections you would enlarge first to stiffen the string, and give the compliance share that decides it.
