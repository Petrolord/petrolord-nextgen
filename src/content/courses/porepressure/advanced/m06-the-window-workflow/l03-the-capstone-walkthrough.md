# The capstone walkthrough

The capstone converts the n 3 prognosis into drilling numbers, cross-checks with Bowers, and probes the calibration lever. Six fields; this lesson walks each: exact expected value, tolerance, route, and the slip that loses it.

## The six fields

Pore pressure as EMW at TD, expected 1179.1048116553065 kg/m3, tolerance 0.5. Fracture pressure as EMW at TD, 1903.9238599165737, tolerance 0.5. The window between them, 724.8190482612672, tolerance 0.5. Bowers loading velocity at 5 MPa, 1949.944709834568 m/s, tolerance 0.5. Bowers unloading stress at 3125.8 m/s, 10 MPa, tolerance 0.01. Pore pressure at TD with n 1.2, 43.901549937778526 MPa, tolerance 0.01.

## Field by field

The floor. One division: 47408579.625 over $9.80665 \times 4100 = 40207.265$. The slips: dividing by 4000 m of sediment alone, 1208.58, wrong by sixty tolerances; or a rig-floor datum imported from habit. Column and datum, then divide.

The ceiling. Same division on 76551571.17548856: 1903.92. The slip: converting the OVERBURDEN instead of the fracture pressure, 2266.33, a wall the well does not have; the mixture audit, two thirds overburden EMW plus one third floor, catches any such swap in one line.

The window. Subtract: 724.82. The slips are inherited, since the window is only as right as its walls; the free protections are the commutation check, converting the 29.14299155048856 MPa gap directly gives the same answer, and the K-algebra route, two thirds of overburden-minus-floor in EMW. Three routes, one number, pick any two.

The loading velocity. The five-step chain: to psi, 725.1886886510462; power 0.75, 139.74563970950388; times A plus mudline, 6397.4563970950385 ft/s; times 0.3048. The slips: skipping a unit edge, loud by orders of magnitude; or rounding the psi value before the power, quiet and usually survivable at this tolerance, but the habit that kills tighter fields.

The unloading stress. The inversion: to loading-equivalent 29.240177382128643 MPa, then over 50, cubed, times 50. The slips: stopping at the loading-equivalent, reporting 29.24, which is answering the wrong history; or applying U to the wrong layer, the bracket structure of the formula is the defence, unwind from the outside in.

The n 1.2 pore pressure. The Professional chain with a non-integer power: ratio 0.9580337483265022 to the 1.2 via logarithms, 0.9498542487938293, fraction times budget plus hydrostatic. The slips: linearising, 40 percent of the n 3 overpressure gives 43.808, outside tolerance by ten times; and the calculator-order slip on the fractional power. Logarithms, full precision, round last.

## The exam beneath the exam

What the six jointly certify: the conversion discipline, datum and column, twice; the window as an object with reconcilable routes; both Bowers curves, one forward, one backward; and the machinery re-run at a second calibration without the training wheels of an integer exponent. Two fields are exact by fixture construction, the 10 and, in spirit, the window trio's consistency; none requires new judgement, because the judgement was the tier's lessons, and the exam's arithmetic is deliberately the thin, checkable residue of it.

Time allocation for the sitting: the three conversions are two minutes; the Bowers pair, with care at the unit edges, ten; the n 1.2 chain, ten. The remaining time is for running each protection listed above, which is what distinguishes a submission from an attempt.

## Worked example

The full submission, six lines. Floor: $47408579.625 / 40207.265 = 1179.10$ kg/m3. Ceiling: $76551571.17548856 / 40207.265 = 1903.92$. Window: $1903.9238599165737 - 1179.1048116553065 = 724.82$. Loading: $(5000 + 10 \times (5 \times 10^6 / 6894.757293168361)^{0.75}) \times 0.3048 = 1949.94$ m/s. Unloading: written in stages as the module taught, since the one-line form invites bracket errors: loading-equivalent $(((3125.808993287662 / 0.3048 - 5000)/10)^{4/3}) \times 6894.757293168361 = 29.240177382128643$ MPa, then over 50, cubed, times 50: 10.00 MPa. Exponent: $41.408579625 + 49.714487325732826 \times (1 - 0.9580337483265022^{1.2}) = 43.9015$ MPa. Every line audited by a protection from this course.

## Exercise

Close the book and reconstruct the six values from structure: which are conversions, which are curve evaluations, which are chains, and which are exact by construction? Then check against the list.

Self check: conversions are the floor and ceiling, one division each; the window is a subtraction protected by three routes. Curve evaluations are the Bowers pair, one forward on loading, one backward through unloading, the second exact at 10 by fixture construction. The chain is the n 1.2 pore pressure, the only field where the Professional tier's five steps re-run in full. Knowing the kinds tells you where checking time goes: the chain gets the most, the conversions the least, and the Bowers pair gets its time at the unit edges, where all its risk lives.
