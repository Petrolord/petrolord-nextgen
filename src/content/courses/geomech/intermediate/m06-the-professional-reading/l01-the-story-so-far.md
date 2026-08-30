# The story so far

Five modules, one hole, and two bounds on one number.

## The claim

Drilling a hole concentrates the stress the removed rock was carrying onto the rock around it, and the mud weight is the only lever on what happens next.

## What each module established

**Module 1.** Removing rock does not remove the load. For a circular hole the far-field difference is amplified by four at the wall: at 2500 m a 3906250 Pa horizontal stress difference becomes a 15625000 Pa spread in effective hoop stress. Three wall stresses, hoop, axial and radial, plus a shear term that is zero for a vertical hole and non-zero the instant it deviates. The mud IS the radial stress, and it lowers the hoop stress and raises the radial one at the same time, which closes the Mohr-Coulomb gap at one plus q per unit of pressure.

**Module 2.** Two criteria. Collapse is a shear failure at the hoop stress peak, evaluated by Mohr-Coulomb over a one degree theta sweep, at ZERO breakout width, which is conservative by a large and stated margin. Fracture initiation is a tension failure at the hoop stress dip, and it is a wellbore-wall question rather than a leak-off, a propagation or a lost-circulation question. The lower bound is the LARGER of the collapse pressure and the pore pressure, and which of the two wins changes with depth: at 1000 m collapse binds at 1374.158459503409 kg/m3 against a pore pressure of 1030, and at 2500 m the pore pressure binds by a wide margin.

**Module 3.** A vertical hole has no azimuth, and the engine proves it by giving identical windows at three azimuths while rotating the breakout angle to compensate. Deviating usually costs window: at 2500 m along SHmax it falls from 2021.2813784141406 to 1470.958940756114 kg/m3 from vertical to horizontal. Along Shmin it does the opposite over half the range, peaking at 2240.374586622351 at 30 degrees. Horizontal along Shmin beats horizontal along SHmax by 35 percent, almost all of it at the fracture end.

**Module 4.** Verified twice: against an independent numpy implementation on both wells and the whole profile, and against closed forms on a vertical fixture that the engine reproduces exactly rather than nearly. Neither is validation, and the course says so.

**Module 5.** The pressures come from bisections rather than formulas. The collapse criterion is NOT monotone in the well pressure, because at high pressure the radial stress becomes the largest wall stress, so the engine scans before it bisects. Three ways a boundary is returned instead of a solution, and five cheap checks to run before using a number.

## The two formulas to carry

    collapse Pw  = Pp + (3 x SH_eff - Sh_eff - UCS) / (1 + q)
    fracture Pw  = Pp + (3 x Sh_eff - SH_eff) + T0

Exact for a vertical hole, close for a near-vertical one, and the sanity check on everything else.

## The one sentence

The mud weight is bounded below by shear failure or by the pore pressure, whichever is larger, and above by tension at the wall, and every one of those three depends on where the hole is pointing.
