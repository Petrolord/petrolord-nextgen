# What a target costs

Every degF of target arrival is more expensive than the one before it, and the wall that buys it gets cheaper per inch the further out it goes. The two curves bend the wrong way against each other.

{{panel:pd-line-explorer}}

## The price of the last few degrees

Derived inversions on the published fluid, 180.0 degF in against a 40.0 degF ambient at 120000.0 lb/hr and Cp 0.5 over 26400.0 ft on the 6.065 in bore. Moving the target from 160.00 degF to 140.00 degF moves the U needed from 0.220644616732 to 0.481611808482 Btu/(hr ft2 degF). Moving it from 60.00 degF to 45.00 degF moves it from 2.785291634878 to 4.769573431949, and the 41.00 degF target asks for 7.073253258346 at an implied ntu of 4.941642422609. The closer the target sits to ambient the steeper the wall gets, without limit.

## What a wall costs in foam

A derived sweep on the published pipe, the published films and the published foam conductivity, with only the foam outside diameter moved. The 8.625 in row is the published build and is marked. The last column is each row against the row above it.

| Foam outside diameter, in | Wall, in | U, Btu/(hr ft2 degF) | U ratio to the row above |
| --- | --- | --- | --- |
| 6.625 | 0.0000 | 105.9799311355 | n/a |
| 7.125 | 0.2500 | 4.6857421371 | 22.61753379 |
| 7.625 | 0.5000 | 2.4778766919 | 1.89103120 |
| 8.125 | 0.7500 | 1.7192055844 | 1.44129167 |
| 8.625 (published) | 1.0000 | 1.3348791131 | 1.28791107 |

The first quarter inch of wall divides U by more than twenty two. The fourth quarter inch divides it by 1.28791107. Further out the steps in this sweep stop being quarter inches: two more inches of wall, from 12.625 in to 16.625 in, is worth 1.42480183. The reason is in the logarithm: a layer resistance goes as ln(Do/Di), and ln(7.125 / 6.625) is 0.0727593543 while a quarter inch added at the outside, ln(16.625 / 16.125), is 0.0305367239.

## Or in a better material

Same pipe, same 2.0 in of wall, only the conductivity moved, as derived sweep points. Syntactic polypropylene foam at k 0.0900 gives U 1.3348791131 and aerogel blanket at k 0.0120 gives 0.1797250990. The layer resistances stand at exactly 7.50000000 to one, because a layer resistance is exactly inverse in k.

## The careful mistake

Expecting U to follow the material by the same factor. The two U values above stand at 7.42733831, not 7.50000000, because the films and the steel wall do not move when the insulation does. On a heavily insulated build the difference is small and on a thin one it is not, and the habit of quoting a U ratio as though it were a k ratio is what puts it wrong.

## Exercise

Price a 100.00 degF target and then a 60.00 degF target on the published fluid over 26400.0 ft and record both U values.

Then say which of foam thickness or foam material you would reach for first, and what the sweep says it buys.
