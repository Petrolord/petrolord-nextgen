# The isentropic exponent

One input of the Isiokpo trap describes the steam itself: the isentropic exponent. The engine asks for it and states the two values it expects. This lesson reads what the exponent does to the loss and why a blank is refused.

{{panel:carbon-efficiency-explorer}}

## Two exponents, one trap

SECTION 15 prints the invented Isiokpo trap at two exponents, with every other input the same: a 4 mm orifice, 9 bar a upstream, a discharge coefficient of 0.72, a steam density of 4.65 kg/m3 and 8400 hours in service a year.

| isentropic exponent | kg an hour | tonnes a year | annual cost USD | annual fuel GJ | annual tCO2e |
| --- | --- | --- | --- | --- | --- |
| 1.135 | 42.3520 | 355.757 | 7826.65 | 1135.851 | 63.721 |
| 1.3 | 44.4620 | 373.481 | 8216.58 | 1192.439 | 66.896 |

The Isiokpo trap's stated exponent is 1.135, for dry saturated steam. The second row is the same trap at 1.3.

The digest states the difference between the two rows from the engine's figures: at the superheated exponent the same trap loses 17.724 tonnes a year more, a ratio of 1.049821 to the saturated figure. Both figures are marked computed here. They are the digest's arithmetic on two engine answers, quoted as the digest prints them.

Read across, every column of the 1.3 row differs from the 1.135 row: the flow in kilograms an hour, the tonnes a year, the money, the fuel and the carbon. A change in the exponent alone reaches every column the trap reports.

## Which exponent belongs to which steam

SECTION 15 names both values in one place, the engine's refusal for a missing exponent:

REFUSED: An isentropic exponent above 1 is required: about 1.3 for superheated steam and about 1.135 for dry saturated steam.

The refusal does three jobs. It says the exponent is required. It says the exponent must be above 1. And it tells the caller which value goes with which steam: about 1.3 for superheated steam and about 1.135 for dry saturated steam. The choice is the caller's, made from the state of the steam in the line.

In practice, the state of the steam is read from the line the trap sits on, and a trap on a superheated line and a trap on a saturated line are given different exponents.

## Blank and 1 get the same answer

SECTION 15 prints the refusal twice, once for a blank exponent and once for an exponent of 1. Both get the words above. A blank is not read as any exponent, and 1 is not above 1. The engine prints no loss for either.

SECTION 25 lists the rule among those in force: a trap needs a boiler efficiency for fuel and carbon, an isentropic exponent, and hours a year. Its MD45-1 table adds that a trap is choked only at or below the critical pressure ratio, and that ratio moves with the exponent: the choked-flow note prints the critical 0.5774 at 1.135 and 0.5457 at 1.3.

## The choice changes the answer

The two rows make one point. The exponent is a property of the steam the caller has to state, and stating it wrongly changes the loss. The digest's 17.724 tonnes a year between the rows is the figure that shows it for this trap. For a reader, the practical rule is simple: an exponent quoted with the loss, and the steam state quoted with the exponent.

## Exercise

Read the two rows of SECTION 15 and the digest's computed difference of 17.724 tonnes a year and ratio of 1.049821. Say which exponent belongs to which steam according to the engine's refusal, which row is the Isiokpo trap as stated, and what the two computed figures show about what the choice of exponent does to the loss.
