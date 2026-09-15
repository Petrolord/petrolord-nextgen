# Sizing is not flashing

Two questions get asked about a separator and only one of them is answered here. How big must the drum be is sizing. What comes out of it at this pressure and temperature is a flash calculation, and it lives in engines/fluid/separator.js.

{{panel:fc-separator-explorer}}

## The question this engine answers

Given a stream at conditions, a mist extractor and a retention time, this engine returns dimensions. On ABANA-1 the gas needs an area of 3.308855 ft2, which is a diameter of 2.052551 ft. At that diameter the liquid stands 10.605223 ft deep and the vessel is 16.605223 ft tall once the 6.000000 ft allowance above the liquid is added.

Every one of those is a length or an area. None of them is a composition, a temperature, a recovery or a rate leaving the vessel.

## The question it does not answer

A flash calculation splits a feed into a vapour and one or more liquids at a stated pressure and temperature, and it needs an equation of state and a component list to do it. This engine holds neither. It takes the gas rate and the liquid rates as given, reads them at conditions, and sizes a drum around them.

So a train of three separators at falling pressures is three sizing problems here, and the stream feeding the second one has to come from somewhere else. Type the flash result in and this engine will size the vessel. Ask it what the flash result is and it has no answer to give.

## The same stream, two vessels

ABANA-1 and ABANA-2 run on one stream, which is why they share Ppr 0.922896, Tpr 1.488478, z 0.908065 and a gas density of 2.239712 lb/ft3. Only the rate differs: 18.000000 MMscfd on the test separator against 110.000000 MMscfd on the production separator, which is 4.825708 ft3/s against 29.490437 ft3/s at conditions.

| stream | gas MMscfd | actual gas ft3/s |
| --- | --- | --- |
| ABANA-1 | 18.000000 | 4.825708 |
| ABANA-2 | 110.000000 | 29.490437 |

One set of gas properties, two sizing problems, because sizing is about how much of the stream arrives per second and the properties are about what the stream is.

## The boundary in practice

A process engineer hands over a heat and material balance. The rates and the compositions on it came from a flash. Everything downstream of that handover, the areas, the diameters, the heights and the lengths, is sizing. Keeping the two apart matters because they fail differently: a sizing error gives a drum that is the wrong size for a correct stream, and a flash error gives a correctly sized drum around a stream that was never going to be there.

## The mistake

Expecting the sizing result to change when a downstream pressure changes. It will change, through the conditions, because the gas density and the actual rate move. What it will not do is tell you how much liquid the drop in pressure released, and that is the number the next stage needs.

## Exercise

State the three figures this engine returns for ABANA-1 and say what each one measures. Then explain why ABANA-1 and ABANA-2 share a gas density of 2.239712 lb/ft3 while arriving at 4.825708 and 29.490437 ft3/s, and name the calculation that would have to produce the ABANA-2 rates in the first place.
