# The capstone worked

The reading worked through, with every constant named at the step that uses it. Work it on paper first, because the value here is in the order rather than in the answers.

{{panel:fc-water-explorer}}

## Step one, the conditions become a content

At 104.000000 degF the vapour pressure of water is 1.069612 psia. Over a total pressure of 950.000000 psia that is a mole fraction of 0.001125908. Through the standard cubic feet a pound mole of 379.483571856287 and the molecular weight of water of 18.015280, the content is 53.450380 lb per MMscf.

Constants used here: the Magnus coefficients of 0.610940, 17.625000 and 243.040000, the standard base of 14.696000 psia and 519.670000 degR, and the molecular weight of water.

## Step two, the spec becomes a load

The contract allows 7.000000 lb per MMscf out, so the load is 46.450380 lb per MMscf. No constant was needed and no rate has been mentioned.

## Step three, the rate makes it extensive

At 62.000000 MMscfd the removal is 2879.9235 lb a day. One multiplication, and the answer has stopped being a property of the gas.

## Step four, the choice makes it gallons

A circulation ratio of 3.200000 gal per lb gives 9215.7553 gallons a day, and over the 1440.000000000 minutes in a day that is 6.399830 gpm. The ratio is the one figure here that came from a person.

## Step five, the heat terms

A gallon weighs 9.300000 lb at a specific heat of 0.550000 Btu per lb per degF, carried from 104.000000 degF to a still at 375.000000 degF. That is 1386.1650 Btu a gallon of sensible heat.

Each gallon carries 0.312500000 lb of water, which is one over the ratio. At 1100.000000 Btu a lb that is 343.7500 Btu, and a reflux ratio of 0.250000 adds its fraction again to give 429.6875 Btu a gallon.

The two sum to 1815.8525 Btu a gallon, of which 0.763369 is sensible.

## Step six, the duty

At 9215.7553 gallons a day and 1815.8525 Btu a gallon, over the group factor of 24000000, the reboiler is 0.697269 MMBtu an hour.

## What each constant was doing there

Some constants above are derived, computed from something else the module exports, so there is nothing separate to check. Some are measured back out of the engine, so the name and the number in use can be shown to agree. The rest are declared, meaning customary, with no publication here to check them against.

Which group a constant sits in tells you what an error in it would look like. A derived one is wrong only if its parent is wrong. A measured one shows up as a ratio away from 1.000000000000. A declared one shows up nowhere, which is why it is worth knowing they are there.

## The two figures from outside the dehydration chain

The contactor is 3.192661 ft across and the still overhead carries 74.065024 short tons of aromatics a year. Neither came through any step above. The first belongs to a vessel calculation and the second to a mole balance, and both are taught in later tiers.

## Exercise

Work the six steps in order without looking at the figures, then check each against the list above. For every step, name the constant it consumed and say whether its result is intensive or extensive.
