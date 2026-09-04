# Onward

The stage says what one impeller makes on the fluid it was drawn for. The Professional tier asks what the pump actually sees, and the answer is not the fluid on the curve.

## What the pump sees at its intake

Free gas is the first thing. Gas volume fraction through the pump is graded against two published limits, a standard maximum of 0.10 and a handler maximum of 0.25, and the verdict between them buys a different pump rather than a different stage count. The fluid in the pump then has its own density and its own gradient, and the package carries two conversions for that one gradient: the rounded field form of 0.433000 psi/ft per SG and the exact 62.4 over 144, which is 0.433333333333. They differ by 0.076982 percent, worth 3.832442 ft of head on the gassyOffshore design.

## Where a head requirement comes from

Total dynamic head is built from three parts and then divided by the head per stage. Because stages are integers and the count rounds up, the stack always makes more head than it was asked for. The gassyOffshore golden design needs 191.92829740 stages and gets 192, making 4980.20162863 ft against a requirement of 4978.341767 ft: a margin of 1.85986141 ft, or 0.07170260 of one stage. The margin is bounded by a stage and never by a percentage.

## Then the motor and the cable

Brake power per stage times the count becomes a shaft horsepower, and that becomes amps at a nameplate, a voltage drop down a cable and a set of surface numbers. The Expert tier owns the seams in that chain, including a cable table that carries copper resistance at 77 degF and no ampacity column, so the ampacity check passes by construction.

## What you take with you

The stage reading, and the habit of asking where it came from. The published cubic reaches zero head at 4806.6229 bbl/d, 1306.6229 bbl/d past the last point anyone measured, and answers at every rate in between without changing its tone. Nothing ahead makes that better. A stage count divides by the head per stage, a motor is sized from the power that follows and a cable from the current after that, so a reading taken outside the data arrives at the surface as an amperage.

## Exercise

Write the head per stage at 2500 bbl/d and 60 Hz, and beside it three things you would still need before it could size anything.

Then say which of the three is an input and which is a decision.
