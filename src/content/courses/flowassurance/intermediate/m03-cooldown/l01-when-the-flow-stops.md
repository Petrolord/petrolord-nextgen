# When the flow stops

Distance leaves the equation and time takes its place. The same wall, the same ambient, and a completely different question: how long before the fluid in the pipe is somewhere it should not be.

{{panel:pd-line-explorer}}

## One equation swapped for another

Flowing, the balance is m Cp dT/dx against the wall loss per foot. Shut in, it is (M Cp) dT/dt = -U A (T - Ta), lumped capacitance: one temperature for the whole content of the pipe, falling towards ambient on an exponential in time. The mass rate is gone. What replaces it is the heat capacity of everything that has to be cooled.

## The one published case

150.0 degF start, 40.0 degF ambient, 70.0 degF target, through the published insulated U on the 6.065 in bore, with the contents at 55.0 lbm/ft3 and Cp 0.5 and the steel shell at 490 lbm/ft3 and Cp 0.11.

| Quantity | Golden | Engine |
| --- | --- | --- |
| No-touch time, hr | 4.662725032604 | 4.662724855250 |
| Time constant, hr | 3.588690908413 | 3.588690771912 |

The two agree to a relative difference of 3.803658e-8 on both, which is the oracle converting out of SI seconds at the boundary.

## The U it uses came off a flowing line

The U in that case is 1.334879072040 Btu/(hr ft2 degF), the published insulated build, and that build carries an inside film of 250, a flowing bore. A shut-in line has a stagnant bore. Read the 250 carefully: it is not one of the four values the film catalog offers, which are 300.0000, 200.0000, 25.0000 and 5.0000 Btu/(hr ft2 degF). The published case cannot be rebuilt from a catalog id, and the substitution a shutdown calls for is from that 250 to the stagnant 5.0000.

Rebuild the same stack with the stagnant film and U falls to 1.0580538200 Btu/(hr ft2 degF). The same cooldown through it takes 5.8826629631 hr with a time constant of 4.5276225695 hr, which is 1.26163631 times the flowing-U answer.

## Which way that error runs

`cooldownTime` takes whichever U it is handed and nothing in it asks where that U came from. The flowing U gives the shorter no-touch time, 4.662724855250 hr against 5.8826629631 hr, so here the mistake errs towards leaving the line early. That is a comfortable direction, it is still the whole difference between the two answers, and the same substitution used to judge an arrival is not comfortable at all.

## The careful mistake

Carrying a design U straight from the steady state work into the cooldown call because both are properties of the same pipe. They are not the same U. The wall did not change, the bore-side boundary layer did. On the published insulated build the inside film is 0.53395165 percent of the resistance stack, and on the same build with a stagnant bore it is 21.16107640 percent of it.

## Exercise

Run the published cooldown at the insulated U of 1.334879072040 and record the no-touch time.

Then run it at 1.0580538200 and say which of the two you would put in a shutdown procedure, and what you would write next to it.
