# Reference conditions and mixed units

{{panel:gsa-quantity-calculator}}

A standard cubic foot and a standard cubic metre are volumes of gas at stated reference conditions of temperature and pressure. The same gas occupies more space when it is warmer and less when it is compressed, so a volume means nothing until the conditions are named. A contract states them, and the engine requires a statement for every conversion.

## The engine requires a statement

The input `referenceConditions` is a string, and it must say something:

> referenceConditions must be a non-empty string; got "  "

The engine does not interpret the words. It echoes them back on the result, so the conditions travel with the figure. The Ekene power plant states "60 F and 14.696 psia (synthetic statement)"; the golden metric cases state "15 C and 101.325 kPa". A reader of any result can see which conditions it rests on.

## Mixed pairs

Sometimes the volume and the heating value come from different unit families: a meter reading in standard cubic metres with a heating value quoted in Btu per standard cubic foot, or the reverse. The engine converts the volume by the exact geometric factor, a cubic foot being 0.028316846592 cubic metres, and then follows the route of the heating value.

| case | volume | heating value | MMBtu (engine) | GJ (engine) |
| --- | --- | --- | --- | --- |
| Sm3 with Btu/scf | 1 MMSm3 | 1050 Btu/scf gross | 37080.400058 | 39121.893098 |
| scf with MJ/Sm3 | 1000 scf | 39 MJ/Sm3 gross | 1.046728 | 1.104357 |

The engine's rule for the first pair, verbatim:

> MMBtu = (volume in Sm3 / 0.028316846592 ft3 per Sm3) x heating value in Btu/scf / 1,000,000

## The assumption in a mixed pair

A mixed pair assumes one set of reference conditions for both numbers. The engine applies only the geometric factor between the cubic foot and the cubic metre; it makes no correction for temperature or pressure. The power plant states 60 F and the golden metric cases state 15 C, and those are two different sets of conditions. A contract that states its volume at one set of conditions and its heating value at another needs a conversion the engine does not make. The caller states the conditions, the engine echoes them, and the responsibility for making them consistent stays with the caller.

## Zero and negative quantities

A volume of zero is a result: zero MMBtu and zero GJ, with the rule printed as usual. A negative volume cannot be metered, and the engine refuses it:

> quantity must be a finite number at or above 0; got -1

## Why this lesson matters for the rest of the tier

Every quantity in the contract rests on one conversion. If the reference conditions are wrong, the DCQ is wrong, and so is every day's take and every deficiency built on it. Reading the conditions is the first check on any contract you model.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "Volume to energy". Enter one MMSm3 with a heating value of 1050 Btu/scf gross and reference conditions "15 C and 101.325 kPa", run it, and read the tiles and the rule line. Then enter 1000 scf at 39 MJ/Sm3 gross and run it. Next, blank the reference conditions to two spaces and read the refusal. Finally set `quantity` to -1 and read that refusal too.
