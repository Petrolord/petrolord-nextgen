# A failed trap is choked flow

Isiokpo's second record is its steam system. This lesson reads one failed steam trap through steamTrapLoss, one of the energyEfficiency functions SECTION 1 lists, and the flow model the engine states for it.

{{panel:carbon-efficiency-explorer}}

## The trap

SECTION 15 prints one trap failed open. Every figure is invented for this course, and the fuel emission factor is SYNTHETIC:

| input | value |
| --- | --- |
| orifice | 4 mm |
| upstream pressure | 9 bar a |
| discharge coefficient | 0.72 |
| steam density | 4.65 kg/m3 |
| isentropic exponent | 1.135 (dry saturated steam) |
| hours in service a year | 8400 |
| steam price | 22 USD a tonne |
| steam energy content | 2650 MJ a tonne |
| boiler efficiency | 0.83 |
| fuel emission factor | 56.1 kg CO2e per GJ (SYNTHETIC) |

The first five inputs decide the flow. The rest turn the flow into a year, into money, into fuel and into carbon.

In practice, a steam trap is a valve that lets condensate out of a steam line and holds the steam in, and a trap that fails open passes live steam through its orifice.

## The loss

SECTION 15 prints the trap's loss at its stated exponent:

| isentropic exponent | kg an hour | tonnes a year | annual cost USD | annual fuel GJ | annual tCO2e |
| --- | --- | --- | --- | --- | --- |
| 1.135 | 42.3520 | 355.757 | 7826.65 | 1135.851 | 63.721 |

The trap passes 42.3520 kg of steam an hour. For the 8400 hours in service the engine reports 355.757 tonnes a year, and at the invented 22 USD a tonne an annual cost of 7826.65 USD. The last two columns are the fuel a boiler burns to raise that steam and the carbon from that fuel: 1135.851 GJ and 63.721 tCO2e a year. Lesson three reads them.

Each column carries its own unit. The flow is kilograms an hour and prints to four decimals; the year's steam is tonnes and prints to three; the money is US dollars to two.

## The flow model

SECTION 15 prints the engine's note on the flow, verbatim: "Choked flow: the pressure ratio 0.1126 is at or below the critical 0.5774, so the loss depends on the upstream pressure alone."

With no downstream pressure given, the trap is taken to vent to atmosphere, ATMOSPHERE_BAR_A, 1.01325 bar a. SECTION 15 states the test: the flow is choked while the downstream pressure over the upstream is at or below the critical ratio (2/(k+1))^(k/(k-1)). At 0.1126 against 0.5774 the Isiokpo trap is choked, and the loss the table prints is set by the upstream pressure, 9 bar a, together with the orifice, the discharge coefficient, the steam density and the exponent.

## A downstream pressure

SECTION 15 then gives the same trap a downstream pressure:

| downstream bar a | pressure ratio | critical ratio at 1.135 | choked | kg an hour | tonnes a year |
| --- | --- | --- | --- | --- | --- |
| left out (1.01325) | 0.112583 | 0.577430 | true | 42.3520 | 355.757 |
| 3 | 0.333333 | 0.577430 | true | 42.3520 | 355.757 |
| 5 | 0.555556 | 0.577430 | true | 42.3520 | 355.757 |
| 6 | 0.666667 | 0.577430 | false | 41.4785 | 348.419 |
| 7 | 0.777778 | 0.577430 | false | 37.5765 | 315.643 |
| 8 | 0.888889 | 0.577430 | false | 29.0510 | 244.029 |

The digest reads the table in one sentence: "At or below the critical ratio the loss does not move with the downstream pressure; above it the downstream pressure lowers the loss." At 3 and 5 bar a the trap is choked and loses the same 42.3520 kg an hour as the trap venting to atmosphere. At 6, 7 and 8 bar a choked is false and the loss is 41.4785, 37.5765 and 29.0510 kg an hour. In practice, a trap blowing into a closed condensate header shows no plume, and the header's pressure is what the table says to read.

## Inputs the engine will not assume

SECTION 15 prints the refusals for the flow's own inputs:

| the call | the engine says |
| --- | --- |
| discharge coefficient blank | REFUSED: A discharge coefficient in (0, 1] is required and is not defaulted: it depends on the orifice and on how the trap failed. |
| orifice blank | REFUSED: An orifice diameter, an upstream pressure and a steam density are required. |

The discharge coefficient, 0.72 at Isiokpo, is required because it depends on the orifice and on how the trap failed, and the engine does not know either. Lesson two reads the exponent's own refusal, and lesson three the boiler efficiency's.

## Exercise

Read the SECTION 15 downstream table and the engine's choked-flow note. Say which rows are choked, what the kg an hour column does across those rows, and what it does in the rows where choked is false. Then say what that means for a trap at a downstream pressure of 5 bar a and of 8 bar a.
