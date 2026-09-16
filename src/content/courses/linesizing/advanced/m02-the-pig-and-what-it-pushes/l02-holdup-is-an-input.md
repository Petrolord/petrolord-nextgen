# Holdup is an input

The swept volume is the line volume times a holdup, and the holdup is a number somebody else produced. The engine says so in its own header, which is the most important sentence in the pigging chain.

{{panel:fc-wall-pig-explorer}}

## The seam, stated plainly

The multiphase half is not in this engine. There is no flow regime, no slip, no holdup correlation and no slug model anywhere in it. Two-phase pressure drop, flow regime and holdup are the Suite's Beggs and Brill correlation, which is app code, and wherever this engine needs a holdup it takes one as an input.

That is honest and it is also a seam a reader has to see rather than infer. Everything downstream of the holdup inherits its uncertainty, and nothing downstream records where it came from.

## A straight multiplication

| holdup | swept bbl | as a fraction of the line volume |
| --- | --- | --- |
| 0.000000 | 0.0000 | 0.000000 |
| 0.020000 | 32.6707 | 0.020000 |
| 0.040000 | 65.3414 | 0.040000 |
| 0.060000 | 98.0121 | 0.060000 |
| 0.100000 | 163.3535 | 0.100000 |
| 0.200000 | 326.7070 | 0.200000 |
| 0.500000 | 816.7674 | 0.500000 |
| 1.000000 | 1633.5349 | 1.000000 |

The third column reproduces the first on every row of the table. That is the whole relation: swept volume is the line volume scaled by the holdup, with nothing else in it.

At a holdup of zero the sweep is 0.0000 bbl, a dry line with nothing to push. At a holdup of one it is 1633.5349 bbl, the entire line running liquid full.

## The guard, and the legal limit

A holdup above one is refused: "holdup must be between 0 and 1". A line cannot hold more liquid than it has room for.

The boundary is where the teaching is. A holdup of exactly 1.000000 is accepted, because a line running full is a real condition. It is 1.000001 that is refused. A guard that rejected its own limit would be as wrong as one that accepted nonsense.

## The precision trap

The engine prints 98.0121 bbl to four decimals whatever the holdup was. Those decimals are real arithmetic performed on an assumption, so they describe the multiplication rather than the line. A holdup of 0.060000 that was an engineering guess produces a four-decimal swept volume that looks measured.

The table shows what the engine will not do as well. It never questions the holdup it was handed. A holdup of 0.500000 is an extraordinary condition for most lines, and the engine returns 816.7674 bbl for it without comment, because the value is inside the legal range and there is no model of the flow in here that could disagree with it.

## The mistake

The mistake is letting the printed precision travel. A catcher specified from 98.0121 bbl has been specified from somebody's holdup estimate, and the estimate deserves to be stated beside the answer every time the answer is quoted.

The second mistake is borrowing a holdup from a different condition. Holdup moves with rate, with gas fraction and with inclination, so the figure from a line running at design rate is not the figure for the same line at turndown, and this engine cannot tell that it was handed the wrong one.

## Exercise

State where holdup comes from and name what this engine does not contain. Then give the swept volume at holdups of 0.000000, 0.060000 and 1.000000, say what the fraction column shows, and give the refusal for a holdup above one with the value on each side of the guard.
