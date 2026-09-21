# Fuel and carbon need a boiler

The Isiokpo trap's loss is steam. The last two columns of its row are fuel and carbon, and neither comes out of the trap. They come out of the boiler that raised the steam. This lesson reads what the engine needs before it will report them, and what it reports when it does not have it.

{{panel:carbon-efficiency-explorer}}

## The row with everything given

The lab prints the invented Isiokpo trap at its stated exponent of 1.135, with steam at 2650 MJ a tonne, a boiler efficiency of 0.83 and a fuel emission factor of 56.1 kg CO2e per GJ. All three are invented for this course, and the emission factor is SYNTHETIC: it is no published factor for any fuel.

| isentropic exponent | kg an hour | tonnes a year | annual cost USD | annual fuel GJ | annual tCO2e |
| --- | --- | --- | --- | --- | --- |
| 1.135 | 42.3520 | 355.757 | 7826.65 | 1135.851 | 63.721 |

The steam lost is 355.757 tonnes a year. The fuel the boiler burns to raise it is 1135.851 GJ a year. The carbon from that fuel is 63.721 tCO2e a year, on the synthetic factor of 56.1 kg CO2e per GJ.

The course prints the chain as relations, computed here from the engine's figures:

| figure | relation |
| --- | --- |
| tonnes a year | kg an hour x hours / 1000 = 42.3520 x 8400 / 1000 = 355.757 |
| annual fuel GJ | tonnes a year x MJ a tonne / 1000 / boiler efficiency = 355.757 x 2650 / 1000 / 0.83 = 1135.851 |
| annual tCO2e | GJ x kg per GJ / 1000 = 63.721 |

The boiler efficiency enters at the fuel step, and the carbon is built on the fuel.

## The row with the boiler efficiency blank

The engine reports the same trap with the boiler efficiency left blank. The trap still loses 355.757 tonnes a year. The fuel and the carbon are none. The engine explains each, verbatim.

fuelNote: "Fuel needs a boiler efficiency in (0, 1]. It is not assumed to be 1."

carbonNote: "Carbon needs the steam energy content, the boiler efficiency and an emission factor. Without them the carbon figure is left blank."

The fuel note names the value the engine refuses to assume: a blank is not read as a boiler efficiency of 1. The carbon note lists everything the carbon figure depends on and says what happens when any is missing: the figure is left blank. Left blank is the engine's phrase. A blank carbon figure is not a zero tonne figure. It is a figure nobody can compute from what was typed.

The steam loss is unaffected, at the same 355.757 tonnes a year. The engine reports the part it can compute and names the parts it cannot.

## Hours: blank and left out are different calls

The hours in service get the same care. The lab prints the refusal for a blank:

REFUSED: Hours in service a year are required, between 0 and 8784. A blank is not read as a full year.

The same words answer a call with 9000 hours. But an argument left out of the call entirely takes a stated default: the engine reports that hours left out take the stated default of 8760, giving 371.004 tonnes a year against the 355.757 at the typed 8400.

The Associate tier met the same distinction on the flare, in its refusals: a blank destruction efficiency refused, the same argument left out taking its stated default. A blank box is a box somebody left empty, and the engine refuses it. A left-out argument is a call that never named the input, and the engine applies the default it states.

## Exercise

Read the lab's trap row at 1.135, the result with the boiler efficiency blank and the two notes, and the two hours cases. Say which figures survive a blank boiler efficiency and which become absent, what the fuel note says the engine will not assume, and what distinguishes the call that gives 371.004 tonnes a year from the call that is refused.
