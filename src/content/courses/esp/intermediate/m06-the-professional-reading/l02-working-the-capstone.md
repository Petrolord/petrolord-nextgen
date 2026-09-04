# Working the capstone

The order of work, and the checks that catch the mistakes people make.

{{panel:pd-lift-explorer}}

## The method

A graded design problem runs on its own conditions. What carries across is the order: each step consumes the one before it, and nothing later repairs an error made earlier, because nothing later looks back.

**One. Sort the conditions into the chain.** Pressures and depths, then the PVT at intake conditions, then the separator, then the stage curve and the drive frequency. Sorting first is how you notice which rates are at the tank and which are at depth.

**Two. Build the intake pressure before anything else.** Flowing bottomhole pressure less the annulus gradient times the annulus column, where the column is the distance from the perforations to the pump and not to the surface.

**Three. Take the fluid the pump swallows, not the stream.** Rate and density through the pump once the separator has vented, then the design gradient from that density, then the specific gravity by dividing the gradient by 0.433.

**Four. Build the head from the two pressures, then decompose it.** Pressure difference over the gradient. Then the net lift from the pump depth and the fluid standing above the intake, the wellhead pressure over the same gradient, and the friction as what remains.

**Five. Size the stack and record both powers.** Head per stage at the duty rate and the drive frequency, divide, round up, then the head made, the shaft horsepower at the head required and the stack brake power at the head made.

## The checks

**The decomposition against the head from the pressures.** Three parts summed against one division: 0.000000000000 ft on both published designs.

**The friction identity.** Discharge pressure less the tubing column less the wellhead pressure, against the friction the breakdown reports: 184.6713 psi both ways on gassyOffshore, 22.1880 psi on highWaterCut.

**The two powers against the two heads.** The same ratio to the last bit: 1.000373590543 on gassyOffshore, 1.025676584275 on the short teaching stack.

**The margin against one stage.** It cannot reach a whole stage: 0.07170260 stages on gassyOffshore, 0.99257012 on QUA-IBOE-4.

**The gradient route.** Derive the specific gravity from the design gradient and the two conversions agree to 0.000000000000 ft. Take it from the density instead and they part by 3.832442 ft on gassyOffshore.

## The failures to expect

Using the whole stream density where the pumped mixture belongs, which on a design with a separator is 50.53658537 against 53.80104712 lbm/ft3. Using a tank rate where an in situ rate belongs, a factor of 1.11000000 on one published design and 1.02100000 on the other. Rounding the stage count to nearest. Reporting the head made where the head required was asked for, or the stack power where the shaft power was. Mixing 0.433 with 62.4 divided by 144 on one well.

And forgetting the drive frequency: a duty at 50 Hz maps back to a different rate on the 60 Hz curve, 4098.400000 bbl/d becoming 4918.080000 bbl/d, and the head per stage is read there.

## Exercise

Take either published design in the panel and work it in order: intake pressure, pumped fluid, gradient, head, three parts, stage count, both powers.

Write beside each number the choice that produced it, then say which of those choices would move the stage count most if you got it wrong.
