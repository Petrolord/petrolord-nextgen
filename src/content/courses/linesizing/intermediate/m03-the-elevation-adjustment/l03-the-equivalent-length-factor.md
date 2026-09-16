# The equivalent length factor

The hill does something else as well, and it is not the multiplier on the outlet. It changes the length the friction acts over. On the SOKU trunk 1500.000000 ft of rise gives an equivalent length factor of 1.0408761444.

{{panel:fc-gasline-explorer}}

## The second column of the elevation group

| elevation change ft | e to the s | equivalent length factor |
| --- | --- | --- |
| 0.000000 | 1.0000000000 | 1.0000000000 |
| 1500.000000 | 1.0828513009 | 1.0408761444 |
| -1500.000000 | 0.9234878318 | 0.9612364537 |
| -3000.000000 | 0.8528297754 | 0.9244633111 |

Two columns, two jobs. The first scales a pressure inside the group. The second scales a length outside it.

## Why a hill changes a length

The friction a gas spends depends on how much gas is in the pipe and how fast it is moving, and the hill has already changed the pressure distribution along the line through the static column. A climbing line holds its pressure differently from a flat one of the same physical length, and the published forms account for that by replacing the real length with an effective one. A factor of 1.0408761444 says the friction behaves as though the climb were over four percent more pipe than was laid.

Descending, the factor falls below one and the line behaves as though it were shorter. At 3000.000000 ft of fall it is 0.9244633111.

## Both terms, and both collapse together

At an elevation change of 0.000000 ft the multiplier is exactly 1.0000000000 and the factor is exactly 1.0000000000. The two parts of the adjustment vanish at the same moment and the flat form returns exactly. That joint collapse is the cleanest check there is on an elevation implementation, because a term that is nearly one on a flat line is a term that is wrong everywhere.

## Reading the two columns together

The two do not move by the same amount. At a rise of 1500.000000 ft the multiplier is 1.0828513009 while the factor is 1.0408761444, and at a fall of 1500.000000 ft they are 0.9234878318 and 0.9612364537. They are separate consequences of the same s, and a rate is the result of both acting at once, which is why the rate change on a hill cannot be predicted from either column alone.

## Both columns come from one input

The two numbers on a row are consequences of the same s. There are not two elevation inputs and there is no way to have one without the other. That matters when a result is being reproduced by hand, because taking the multiplier from the engine and the length factor from a textbook mixes two sources for one physical quantity, and they will not correspond unless every input behind s matches.

## The mistake

The mistake is applying the factor to the physical length and then also entering the hill somewhere else, which counts the same slope twice. The engine returns both parts of one adjustment and they are meant to be used together, once.

The second mistake is reading the factor as a correction for a longer route over a hill. It is not about the survey. A line that climbs is longer on the ground as well, and that extra distance is already in the length the caller supplies.

## Exercise

Give the equivalent length factor at rises and falls of 1500.000000 ft and at a fall of 3000.000000 ft. Say what each of the two columns of the elevation group acts on. Then explain what happens to both at an elevation change of zero and why that is worth testing.
