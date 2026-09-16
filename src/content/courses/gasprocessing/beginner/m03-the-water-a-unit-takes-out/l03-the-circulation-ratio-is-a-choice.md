# The circulation ratio is a choice

The gallons of glycol circulated per pound of water removed is a design choice, and this engine will not make it for you. It is the one number that decides both how much glycol moves and how much heat each gallon of it needs.

{{panel:fc-water-explorer}}

## The choice, moved across its range

OBIAFU at 62.000000 MMscfd, a spec of 7.000000 lb per MMscf, and everything else held:

| gal per lb | circulation, gpm | Btu per gal | sensible, Btu/gal | overhead, Btu/gal | reboiler, MMBtu/hr | warning |
| --- | --- | --- | --- | --- | --- | --- |
| 1.500000 | 2.999920 | 2302.8317 | 1386.1650 | 916.6667 | 0.414499 | yes |
| 2.000000 | 3.999894 | 2073.6650 | 1386.1650 | 687.5000 | 0.497666 | no |
| 2.500000 | 4.999867 | 1936.1650 | 1386.1650 | 550.0000 | 0.580834 | no |
| 3.000000 | 5.999841 | 1844.4983 | 1386.1650 | 458.3333 | 0.664002 | no |
| 3.200000 | 6.399830 | 1815.8525 | 1386.1650 | 429.6875 | 0.697269 | no |
| 4.000000 | 7.999788 | 1729.9150 | 1386.1650 | 343.7500 | 0.830337 | no |
| 5.000000 | 9.999734 | 1661.1650 | 1386.1650 | 275.0000 | 0.996673 | no |
| 6.000000 | 11.999681 | 1615.3317 | 1386.1650 | 229.1667 | 1.163008 | yes |

## Three things move, and they do not move together

Raise the ratio and more gallons circulate, so the gpm column rises. More gallons means more total sensible heat, because every gallon has to be carried from the absorber up to the still temperature whether it is carrying much water or little. So the MMBtu an hour column rises too.

But each of those gallons carries less water, so each one needs less heat to boil its water back out. The overhead column falls, and with it the Btu a gallon. That is the whole of it: the Btu a gallon falls while the MMBtu an hour rises, and the sensible per gallon sits unmoved at 1386.1650 the length of the table because the temperature rise per gallon never changed.

## What the ratio is actually saying

A ratio of 3.200000 gal per lb says that every pound of water taken out of the gas is carried away by that many gallons of glycol. Turn it round and it says how much water each gallon has to pick up on its way down the contactor. A high ratio is a lightly loaded gallon and a low ratio is a heavily loaded one, and the whole of the behaviour in the table above follows from that single reading.

It is worth forming the turned round version deliberately, because the engine does. The water a gallon picks up is what the still boils back out, and the overhead heat term is built on it.

## Why this is the hardest number on the sheet

Every other figure in a dehydration answer has somewhere to come from. The content came from the conditions, the load from the contract and the rate from the reservoir. The circulation ratio came from a person.

It is also the number that most often gets inherited. A ratio that worked on a different gas at a different spec turns up on a new data sheet because it was on the last one. The engine reports what it costs and declines to have an opinion on what it should be, which is the honest position for a module with no dew point chart in it.

## The band, and what lies outside

The table flags two rows. At 1.500000 and at 6.000000 gal per lb the engine attaches a warning that the ratio sits outside the customary band of 2.000000 to 5.000000 gal per lb. It still answers. A customary range is a statement about what other people build, and a later lesson reads both of its edges.

## Exercise

Record the gpm, the Btu a gallon and the MMBtu an hour at 2.000000, 3.200000 and 5.000000 gal per lb. Then state which two of those three columns move in the same direction as the ratio, which one moves against it, and why the sensible Btu a gallon never moves at all.
