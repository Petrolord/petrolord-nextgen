# Sensible heat, absorber to still

The reboiler duty does not arrive as one number. It is assembled from named parts, and the parts answer different questions. The first part is the plainest one in the whole course: heating the glycol itself from where the gas left it to where the still needs it.

{{panel:fc-water-explorer}}

## Mass, specific heat, temperature rise

A gallon of glycol leaves the bottom of the contactor at the gas temperature and has to reach the reboiler temperature. On OBIAFU the gas is at 104.000000 degF and the still runs at 375.000000 degF, so the rise is the difference between those two.

That gallon weighs 9.300000 lb, and its specific heat is 0.550000 Btu per lb per degF. Mass times specific heat times rise gives 1386.1650 Btu a gallon, and the engine returns exactly that figure under its own name.

Nothing about water has entered yet. This term would be the same if the glycol picked up no water at all, because it is the cost of moving the solvent round the loop rather than the cost of doing anything to it.

## The still temperature moves it and nothing else

| reboiler degF | sensible, Btu/gal | overhead, Btu/gal | total, Btu/gal |
| --- | --- | --- | --- |
| 340.000000 | 1207.1400 | 429.6875 | 1636.8275 |
| 360.000000 | 1309.4400 | 429.6875 | 1739.1275 |
| 375.000000 | 1386.1650 | 429.6875 | 1815.8525 |
| 390.000000 | 1462.8900 | 429.6875 | 1892.5775 |
| 400.000000 | 1514.0400 | 429.6875 | 1943.7275 |

Read the middle column against the third. The sensible term rises with the still temperature the whole way down the table. The overhead term sits at 429.6875 at every one of the five temperatures, because boiling a pound of water out costs what it costs regardless of how hot the vessel is.

So the still temperature has exactly one place to act in this balance, and the total moves only because the sensible half moved.

## Why the still runs where it does

A glycol regenerator temperature is a compromise that this module does not resolve. Hotter means a stronger lean glycol coming back, which is the whole point of regenerating. Hotter also means more sensible heat every gallon, as the table shows, and above a certain temperature the glycol itself starts to degrade.

The engine will not pick the temperature for you. It takes the number you type and reports what the sensible half costs at it, which is the same doctrine the circulation ratio was under. A design choice is an input with its consequence printed beside it.

## Why the parts are named

The alternative to a split duty is a single Btu a gallon figure, and a single figure cannot be argued with. Split into a sensible half and an overhead half, the same answer tells you where to push. A duty dominated by the sensible term is a circulation problem or a still temperature problem. A duty dominated by the overhead is a water problem. The two have different remedies and a combined number hides which one you have.

## Exercise

Build the sensible term for OBIAFU from the absorber temperature, the still temperature, the glycol density per gallon and the specific heat, and check it against 1386.1650 Btu a gallon. Then record the sensible and the overhead at 340.000000 and at 400.000000 degF, and say which of the two the still temperature reaches.
