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

SECTION 15 prints the engine's note on the flow, verbatim: "Choked flow: the loss depends on the upstream pressure and not on what is downstream, so a trap blowing into a condensate header loses much the same steam as one blowing to atmosphere."

That sentence tells the reader which side of the trap the loss depends on. The upstream pressure, 9 bar a, is an input, and the note puts what is downstream outside the loss. The loss the table prints is set by the upstream pressure together with the orifice, the discharge coefficient, the steam density and the exponent, the five inputs that the SECTION 15 refusals name for the flow.

The note's last clause is the practical reading. A trap blowing into a condensate header and a trap blowing to atmosphere lose much the same steam. In practice, a trap blowing into a closed header shows no plume, and the note says the steam it loses is much the same as a trap that does.

## Inputs the engine will not assume

SECTION 15 prints the refusals for the flow's own inputs:

| the call | the engine says |
| --- | --- |
| discharge coefficient blank | REFUSED: A discharge coefficient in (0, 1] is required and is not defaulted: it depends on the orifice and on how the trap failed. |
| orifice blank | REFUSED: An orifice diameter, an upstream pressure and a steam density are required. |

The discharge coefficient, 0.72 at Isiokpo, is required because it depends on the orifice and on how the trap failed, and the engine does not know either. Lesson two reads the exponent's own refusal, and lesson three the boiler efficiency's.

## Exercise

Read the SECTION 15 row at an exponent of 1.135 and the engine's choked-flow note. Say which inputs the flow of 42.3520 kg an hour depends on, which side of the trap the note puts outside the loss, and what that means for a trap blowing into a condensate header.
