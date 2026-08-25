# Between the graded depths

The capstone grades values at 3000 m and total depth, but a prognosis is used at every depth: casing seats, formation tops and kick calculations do not wait at round numbers. This lesson fills in the interval, partly to give you the full table, and partly because the in-between behaviour is where several exam-grade misconceptions live.

## The table

Engine values at five depths spanning the ramp, all on capstone settings:

At 2600 m: log 313.01471963830767 us/m, trend 311.6193270435334, ratio 0.9955420863389854, budget 30.04308796385235 MPa, overpressure 0.4 MPa.

At 3000 m: log 297.76677602422825, trend 292.07031526461174, ratio 0.9808693876607879, budget 35.523412418439044, overpressure 2.0.

At 3500 m: log 282.5387777324301, trend 273.3910027183001, ratio 0.9676229398047687, budget 42.544004457243325, overpressure 4.0.

At 4000 m: log 270.92263512383806, trend 259.5530276341839, ratio 0.9580337483265022, budget 49.714487325732826, overpressure 6.0.

## Three readings of the table

First, both the log and the trend DECREASE with depth, everywhere. The rock keeps getting faster even while it becomes more overpressured. This surprises people reliably, so take it apart: compaction continues below the onset, just at a deficit. The overpressured shale at 4000 m has compacted less than a normal shale at 4000 m would have, but more than the shale at 3000 m has. Overpressure shows as a widening gap between two falling curves, not as a log that turns around and climbs. A sonic that actually reverses with depth is a much bigger anomaly than this well ever produces.

Second, the ratio deteriorates smoothly, 0.9955 to 0.9580. There is no dramatic moment anywhere in the sonic. If you plotted only the transit-time logs at field scale, the ramp would be nearly invisible to the eye; 11 us/m of departure at TD against a 271 us/m log is four percent. The prognosis makes the invisible legible, which is its whole value, and also its whole danger, since it amplifies error with the same gain as signal.

Third, the overpressure is exactly linear, but no other column is. Ratio, budget and their product's factors all bend; only the assembled overpressure runs straight at 4 kPa per metre, because that is what was encoded. The lesson generalises: the SHAPE of an overpressure profile is the fingerprint of its mechanism. A ramp that steepens with depth suggests ongoing generation; one that flattens suggests drainage into a connected sand; a step suggests a seal. This well's dead-straight ramp is the signature of a constant-rate imposed mechanism, the kind only a synthetic well has, and reading profile shapes is a skill the Expert tier assumes.

## Interpolating honestly

Need the pore pressure at 3250 m? Two honest options. Run the chain at 3250 m, which the engine does; the answer sits at hydrostatic plus 3 MPa exactly. Or interpolate the overpressure linearly between the bracketing values, 2 MPa at 3000 and 4 at 3500, giving 3 at 3250, and add the hydrostatic at 3250 computed properly.

The dishonest option is interpolating the pore pressure itself between 33.307730125 and 40.358154875 without recomputing the hydrostatic. On this well it happens to work, because both hydrostatic and overpressure are linear in depth. The moment either curve bends, on any well with varying fluid density or a nonlinear ramp, pressure interpolation drifts while overpressure interpolation usually survives, since overpressure is the smaller, smoother residual. Interpolate residuals, not totals: it is the same principle as flattening on a datum in correlation work.

## Worked example

Compute the pore pressure at 2600 m from the table. Hydrostatic: $9.80665 \times (1025 \times 100 + 1030 \times 2600)$ Pa $= 27.267390325$ MPa. Overpressure from the chain: budget 30.04308796385235 times the fraction $1 - 0.9955420863389854^3 = 0.0133142105925088$, giving 0.400000 MPa. Pore pressure $27.267390325 + 0.4 = 27.667390325$ MPa.

The check the ramp provides: 2600 m is 100 m below the ramp top, and 100 times 4 kPa is 0.4 MPa. Passed.

## Exercise

Without the engine: state the overpressure and pore pressure at 3750 m, and say which parts of your answer used the encoding and which used the frame.

Self check: 3750 m is 1250 m below the ramp top, so overpressure is $1250 \times 4$ kPa $= 5$ MPa; that used the encoding. Hydrostatic is $9.80665 \times (1025 \times 100 + 1030 \times 3750)$ Pa $= 38.88336725$ MPa exactly; that used the frame. Pore pressure is their sum, 43.88336725 MPa. On a real well the first step does not exist; there is only the chain, which is why the chain, not the ramp, is what the capstone examines.
