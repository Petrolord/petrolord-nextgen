# The prognosis panel map

Every module from here on hands you the same instrument, so this lesson is a guided tour of it. The panel runs the full Eaton prognosis over the golden well, all 401 samples, every time you change a control.

{{panel:pp-eaton-explorer}}

## The three controls

The panel exposes exactly the three decisions an interpreter makes when running this method on any well, and nothing else.

The exponent $n$ can be set to 1, 2, 3, 4 or 5, with 3 marked as the capstone value. This is the amplifier from the last lesson.

The compaction trend can be the well's own header trend, 656 us/m and 0.6 per km, or the trend fitted to the twelve picks, 650 us/m and 0.7 per km. The capstone uses the well's own; module 4 is about what happens on the other setting.

The onset threshold can be 0.01, 0.05 or 0.2 MPa. The capstone's detection rule uses 0.05 MPa: the reported onset is the first sample whose pore pressure sits more than that above hydrostatic. Module 3 shows why this humble control moves a graded number.

Everything else about the well is fixed, because it is data: the log, the density column, the water depth, gravity. The panel will not let you adjust reality, only interpretation.

## The plot

The plot is pressure against depth, depth increasing downward as always. Four curves.

The dashed blue hydrostatic and dashed grey overburden are the Associate tier's frame, unchanged. They bound everything: no curve the method can produce leaves that envelope.

The red curve is the pore pressure prognosis. On the capstone settings it hugs the hydrostatic to the amber line at 2500 m, then peels away and runs increasingly to the right of it. The red dot marks the reported onset.

The green curve is the fracture pressure, computed from the prognosis with the coefficient form. It appears now, runs through every experiment you do, and gets its own module 5. Notice from the start where it lives: above the red curve, below the grey one, always.

## The tiles

The tiles report the six graded quantities, plus three diagnostic ones.

Onset, NCT at TD, pore pressure at 3000 m, pore pressure at TD, overpressure at TD, and fracture pressure at TD are the capstone's six. On the capstone settings they read 2520 m, 259.5530 us/m, 33.308 MPa, 47.409 MPa, 6.000 MPa and 76.552 MPa.

The ratio at TD tile shows the raw evidence at total depth, 0.9580 on the header trend. The budget tile shows $S - P_h$ there, 49.714 MPa. Their combination through the exponent gives the overpressure tile, and it is worth checking that once by hand while the panel is in front of you.

The last tile is the quality control and it deserves a paragraph of its own.

## The loop tile

This well encodes its own answer: 4 kPa of overpressure per metre below 2500 m. The final tile reports the worst disagreement, over all 401 samples, between the overpressure the prognosis recovered and the overpressure the well encodes.

On the capstone settings that number is floating-point residue: a few times $10^{-8}$ Pa. The prognosis does not approximately recover the ramp; it recovers it exactly. This is the closed loop the Associate tier promised, and module 3 examines it properly.

Move either the exponent or the trend off the capstone settings and the tile changes units from pascals to megapascals, because the disagreement is no longer residue, it is error. This one tile is the difference between a method demonstrated and a method merely run: on a synthetic well the loop can be closed, so anything that opens it is your choice of settings, quantified.

## How to use the panel while you read

Each lesson that embeds the panel names the setting it wants you on. The habit to build now: before touching a control, predict the direction of every tile you understand so far, then look. The panel recomputes honestly from the engine, so a surprise is always information, and usually it is the lesson.

## Worked example

Set the panel to the capstone settings, $n = 3$, the well's own trend, threshold 0.05 MPa. Verify the overpressure tile from the two diagnostic tiles: budget 49.714 MPa, ratio 0.9580 at TD, so the grains keep $0.9580^3 = 0.8793$ of the budget and the fluid takes $49.714 \times (1 - 0.8793) = 6.000$ MPa. The tile agrees.

## Exercise

Still on the capstone settings, read the pore pressure at TD and the fracture pressure at TD from the tiles, and state where each sits relative to the frame curves. Then predict: if the exponent were raised to 5, which direction does each of those two tiles move?

Self check: pore pressure at TD is 47.409 MPa, 6 MPa right of the hydrostatic and far left of the overburden; fracture pressure is 76.552 MPa, between the pore pressure and the overburden. Raising $n$ to 5 amplifies the same ratio harder, so pore pressure rises, to 51.001 MPa. Fracture pressure rises too, to 77.749 MPa, because the coefficient form passes a share of any pore pressure increase through to the fracture pressure. Checking the two moves against each other, the fracture pressure rose 1.197 MPa for a 3.592 MPa rise in pore pressure, exactly one third; where that fraction comes from is module 5's business.
