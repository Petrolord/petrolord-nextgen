# The published domain

Bowers published in 1995 with velocity in feet per second and effective stress in psi, and the fitted constants of every basin calibration since live in those units. The engine keeps the parameters in their published domain and converts at the edges: SI in, SI out, imperial inside. This lesson makes that arrangement precise, because unit discipline is where second methods quietly die.

## The two constants

$$1\ \mathrm{ft} = 0.3048\ \mathrm{m} \qquad 1\ \mathrm{psi} = 6894.757293168361\ \mathrm{Pa}$$

Both exact by definition in the engine, matching the oracle to the last digit. The mudline velocity default, 5000 ft/s, converts to exactly $5000 \times 0.3048 = 1524$ m/s, a number this course has already used as the inversion's hard floor.

## Why not convert the constants once?

The tempting shortcut: convert $A$ and $B$ into SI once and forget the imperial units forever. It fails for a structural reason worth understanding, not just obeying. $B$ is a pure exponent and survives any unit change; but $A$ multiplies $\sigma^B$, so its units are ft/s per psi-to-the-0.75, and converting it requires folding in $PA\_PER\_PSI^{0.75}$: the conversion factor depends on $B$. Every calibration with a different $B$ needs a different $A$ conversion. Publish a table of SI-converted $A$ values and the first person to pair an $A$ with a neighbouring row's $B$ produces garbage with no units to warn them.

Keeping parameters in the domain they were fitted in, with explicit conversion at the edges, is therefore not conservatism, it is error-proofing: the design the engine uses, and worth copying into any spreadsheet you ever build around published constants of any kind.

## The numerical anatomy of A = 10

What kind of number is $A = 10$? At 5 MPa: $725.1886886510462$ psi raised to 0.75 is $139.74563970950388$, times 10 is 1397 ft/s of velocity above mudline. So $A = 10$ means each psi-to-the-0.75 unit buys 10 ft/s. In SI terms there is no clean sentence, which is rather the point: the constant is only legible in its own domain.

The graded value assembles as: 5000 plus 1397.4563970950388 equals 6397.4563970950385 ft/s, times 0.3048 equals 1949.944709834568 m/s. Notice the check the units offer: had the psi conversion been skipped, 5 million raised to 0.75 would put the stress term near a hundred thousand, an absurd million-plus ft/s after scaling; had the ft/s to m/s conversion been skipped, the answer would land near 6397, four times the observed velocities in the well. Both failure modes are loud IF you know the scale the answer should have, roughly 1500 to 4500 m/s for sedimentary rock, and unit errors of this kind are precisely why an interpreter carries those scale expectations.

## PA_PER_PSI to fifteen digits

The engine holds 6894.757293168361, not 6894.76 or 6895. Does it matter? Run the sensitivity: the psi value scales linearly with the constant, then through the 0.75 power, so a relative error $\delta$ in the conversion becomes about $0.75\,\delta$ in the stress term. Using 6895 instead, a relative error of $3.5 \times 10^{-5}$, shifts the 5 MPa loading velocity by roughly $1397 \times 0.75 \times 3.5 \times 10^{-5} = 0.037$ ft/s, about 0.011 m/s: inside the 0.5 tolerance forty times over. So a rounded conversion passes THIS capstone. The engine still carries all digits because goldens are compared at fourteen decimals, and a fixture that is sloppy about constants cannot certify anything else. Know both facts: the tolerance you are graded to, and the precision the reference implementation holds itself to.

## Where the domains meet in the capstone

Both graded Bowers fields cross the boundary twice. The loading field: 5 MPa in SI, converted in, curve evaluated in the published domain, velocity converted out to 1949.944709834568 m/s. The unloading field, module 5's: 3125.808993287662 m/s converted IN to ft/s, inverted in the published domain, stress converted OUT to 10 MPa. In and out through the same two constants each time; the arithmetic between conversions never sees SI.

## Worked example

The full unit ledger for the graded loading point, every quantity tagged. $\sigma' = 5\,\mathrm{MPa} = 5 \times 10^6\,\mathrm{Pa}$. Convert: $5 \times 10^6 / 6894.757293168361 = 725.1886886510462$ psi. Power: $725.1886886510462^{0.75} = 139.74563970950388$ (psi$^{0.75}$). Scale: $\times\,10 = 1397.4563970950388$ ft/s. Offset: $+\,5000 = 6397.4563970950385$ ft/s. Convert: $\times\,0.3048 = 1949.944709834568$ m/s. Six lines, two crossings, one graded field, tolerance 0.5 m/s cleared with fifteen digits to spare.

## Exercise

A spreadsheet reproduces the loading curve but returns 1949.9 m/s only when its user enters stress in units of 10 kPa. Diagnose what its author did, and say whether the sheet is safe to keep.

Self check: entering 5 MPa as 500 units and getting the right answer means the sheet expects psi-scaled input near 725 for this stress, and 500 versus 725 does not match; work it instead from the arithmetic: to land on 139.746 from the power step, the sheet's input times its internal conversion raised to 0.75 must equal 725.188 psi to the 0.75. If 500 units produce that, its internal factor is $725.189/500 = 1.4504$, which is the psi-per-10kPa conversion, $10000/6894.757 = 1.4504$. So the author hard-wired a 10 kPa input unit, probably by converting the constant halfway. The sheet computes correctly for whoever remembers its private unit, which is to say it is a trap, and the fix is the engine's design: SI at the edges, published domain inside, conversions explicit and labelled.
