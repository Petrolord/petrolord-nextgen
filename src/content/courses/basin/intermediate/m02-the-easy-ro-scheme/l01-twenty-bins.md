# Twenty bins

Easy%Ro describes vitrinite maturation as twenty parallel first-order reactions. This lesson lays out the twenty bins in full, because the capstone and the exam both assume you know what the scheme actually contains rather than what a summary of it says.

## The energy grid

The activation energies run from 34 to 72 kcal/mol in steps of 2:

34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72.

The previous module showed what this grid buys: at any one temperature the rates across it span twenty-two orders of magnitude, so there is always a boundary somewhere on the ladder between bins that react geologically fast and bins that are effectively inert. Maturation is that boundary sweeping upward as the rock heats.

## The weights

Each bin carries a stoichiometric weight, the share of the total reactable vitrinite assigned to it:

0.03, 0.03, 0.04, 0.04, 0.05, 0.05, 0.06, 0.04, 0.04, 0.07, 0.06, 0.06, 0.06, 0.05, 0.05, 0.04, 0.03, 0.02, 0.02, 0.01.

Two properties of this list matter. The weights hump gently in the middle, peaking at 0.07 on the 52 kcal bin, so the middle of the ladder carries the most reactable mass, which is why reflectance keeps rising steadily through the oil window rather than exhausting itself early. And the weights sum to 0.85, not to 1.

That 0.85 is not sloppiness. The scheme's read-out, F, is the total weight reacted, and it is deliberately not normalised. F runs from 0, nothing reacted, to 0.85, everything reacted, and the reflectance formula in the next lesson is calibrated against F on exactly that scale. If you normalise F to 1 because it looks tidier, every reflectance you compute afterwards will be wrong. The published weights ARE the model.

## The fixed parameters

The frequency factor is $10^{13}$ per second, one value for all twenty bins. The scheme is Sweeney and Burnham's 1990 publication, and its numbers are pinned in the engine's kinetics library as constants, cross-checked against an independent implementation. Nothing here is per-basin, per-rock or per-user. The vitrinite scheme is the same on every continent, which is precisely what makes a measured Ro comparable between basins and usable as a calibration standard.

Keep the contrast with module 4 in view: the kerogen potentials, which share this same energy grid, are per-type library data and legitimately editable. Same grid, same integrator, opposite editing policy, for the reason lesson 2 of module 1 gave.

## The state

At any moment, the vitrinite state of a layer is twenty numbers: the unreacted fraction remaining in each bin, initialised to the weights above. Heating drains the bins, low energies first. F at any moment is the initial weight minus what remains, summed over the ladder:

$$F = \sum_i \left( w_i - x_i \right)$$

with $w_i$ the published weight and $x_i$ the current unreacted fraction of bin $i$.

## Worked example

A rock's history has fully drained the four lowest bins, 34 through 40 kcal, and not touched anything above. What is F?

The drained weights are 0.03 + 0.03 + 0.04 + 0.04 = 0.14, so F = 0.14. Notice what you did not need to know: the temperature history that did the draining. F is a state, and every history that fully drains those four bins and no more produces the same F. Different histories generally drain the ladder to different depths and drain the boundary bins partially, which is why F in practice is a fine-grained record, but the principle stands: the state, not the path, sets the reflectance.

## Exercise

Answer each in a sentence. Which bin carries the most weight, and what does that placement do to the shape of the maturation curve? Why is F's maximum 0.85 rather than 1, and what goes wrong if you normalise it? Why must the vitrinite weights not be editable while the kerogen potentials may be?

As a self check: the 52 kcal bin carries 0.07, the most, so the ladder's middle holds the most reactable mass and reflectance keeps climbing steadily through mid-maturity instead of saturating early. F tops out at 0.85 because the published weights sum to 0.85 and the reflectance formula is calibrated on that unnormalised scale, so normalising rescales F and corrupts every Ro. The vitrinite scheme is the calibration standard, so it stays fixed; kerogen chemistry genuinely varies by source rock, so its spectrum is data, not constants.
