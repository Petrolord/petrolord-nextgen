# When they disagree

The Ekene fixture agrees to fifteen digits because it was built to. Your field will not. A volumetric booking and a material balance answer that differ by 10 to 20 percent is the ordinary state of the world, and an engineer who treats that gap as a failure will waste weeks trying to make it vanish instead of explaining it.

This lesson gives you three tools: how to state a gap so nobody misreads it, how to decide which route is more likely wrong, and what the direction of the gap is telling you.

## State the gap without hiding the denominator

A percentage is meaningless until you say what it is a percentage of. Suppose a field's volumetric booking is 14000000 stb and its material balance slope comes back at 12139208.1074968 stb. The absolute gap is 1860791.89250316 stb, and there are three defensible ways to quote it:

$$\frac{1860791.89250316}{14000000} = 13.2913706607369 \text{ percent of the volumetric figure}$$

$$\frac{1860791.89250316}{12139208.1074968} = 15.3287749581786 \text{ percent of the material balance figure}$$

$$\frac{1860791.89250316}{13069604.0537484} = 14.2375536768421 \text{ percent of the mean of the two}$$

Same gap, three numbers, two percentage points of spread. Nobody is lying in any of the three, but a report saying "the methods agree within 13 percent" and a second report on the same field saying "the methods disagree by 15 percent" will start an argument that has nothing to do with the reservoir.

Quote the absolute gap in barrels first, then the percentage with its base named. On the Ekene fixture that reads: absolute gap 7.45058059692383e-8 stb, relative gap 6.13761666407432e-15 of the volumetric booking.

## Which route is more likely wrong

Neither is automatically the truth. Each is fragile in a specific way, and knowing the failure modes tells you where to look first.

**Volumetrics is only as good as the map and the contact.** Its chain is a product of five or six factors, and an error anywhere in it passes straight through to the answer, undamped. Watch how little it takes on Ekene. Move the net to gross cutoff from 0.8 to 0.7 and the booking falls from 12139208.1074968 stb to 10621807.0940597 stb, a change of 12.5 percent, from one petrophysical judgment. Move the initial water saturation from 0.35 to 0.30 and it rises to 13072993.3465350 stb, a change of 7.69230769230769 percent. Neither revision requires new data.

And the largest factor of all carries no error bar at all. The gross rock volume depends on the depth-converted surface and on where the fluid contact is picked, and a contact moved by a few metres in a low relief structure can move the volume by more than every petrophysical parameter combined.

**Material balance needs good pressure data and enough depletion.** Its fragility is different. The slope is $F/E_t$, and $E_t$ is a small number: at Ekene's last survey the total expansion is 0.0261900809071921 rb/stb, which is 2.18250674226601 percent of the initial oil formation volume factor. You are dividing by a small quantity, so any error in that small quantity is magnified in the answer.

Two conditions make $E_t$ trustworthy. The pressures must be real static reservoir pressures, correctly datum-corrected, not flowing pressures and not one well's gauge assumed to speak for the whole tank. And the field must have depleted enough for the expansion terms to be large compared with their own uncertainty. Ekene qualifies: pressure has fallen 1103.99173733300 psi from 3200 psia, which is 34.4997417916564 percent of initial pressure. A field that has produced for six months and dropped 40 psi does not. Its answer will swing with every new survey, and the honest response is that the method is not ready yet.

A rough rule: early in field life, trust volumetrics and treat the material balance answer as provisional. Late in field life, after real depletion, material balance becomes the stronger number, because it has been measuring the reservoir's actual response for years while the map has not been re-shot.

## The direction of the gap is diagnostic

This is the part that turns a discrepancy into information. Recall from lesson 1 that the two routes see different populations of barrels: volumetrics counts everything inside the mapped closure, and material balance counts only the volume in pressure communication with your wells.

So when material balance comes back **lower** than volumetrics, the leading explanation is not an arithmetic mistake. It is that part of the mapped volume is not connected: a sealing fault, a permeability barrier, a compartment nobody has drilled. That is an actionable finding. It says there may be an infill target, and that your depletion plan is draining a smaller tank than the map suggests.

When material balance comes back **higher** than volumetrics, something is adding energy or volume the closed-tank model has not been told about. The mapped closure may be too small, the contact may be deeper than picked, or the tank may be receiving support from outside itself. That last possibility is the whole subject of the Professional tier, and for now it is enough to know that a material balance answer which keeps growing as more surveys arrive is a signal, not a nuisance.

Either way, the honest report says which direction the gap runs and offers a mechanism. "Material balance is 18 percent below volumetrics, consistent with an unconnected northern compartment" is engineering. "The methods disagree by 18 percent" is a shrug.

## Worked example: a field that does not close

A colleague brings you this. Volumetric booking 14000000 stb from a map remapped last year. Material balance slope 12139208.1074968 stb from six good pressure surveys with 1100 psi of depletion. R-squared of the straight line is high and the points show no curvature.

Work through it before reading on. State the gap properly: 1860791.89250316 stb, which is 13.2913706607369 percent of the volumetric figure. Note the direction, which is that material balance is the lower number. Check whether material balance is entitled to an opinion, and it is, because a thousand psi of depletion across six surveys is plenty of signal and the line is straight. Then ask what the straight line rules out. A tank receiving outside support does not usually give a clean line through the origin, so the leading candidate on the low side is a connectivity story rather than a data story.

The recommendation writes itself. Book against the material balance figure for depletion planning, because that is the volume your wells can reach, keep the volumetric figure on the page as the mapped total, name the difference as possible unconnected volume, and say what would test it: a well in the suspected compartment, or a survey in a well shut in long enough to speak.

## Exercise

Take a second field. Volumetric booking 10500000 stb, material balance slope 12139208.1074968 stb, three pressure surveys, total depletion 120 psi.

Compute the gap and confirm you get -1639208.10749684 stb, which is -15.6115057856842 percent of the volumetric figure and -13.5034187813660 percent of the material balance figure. Then answer two questions in writing. Which route would you challenge first here, and why does that differ from the worked example even though the gap is a similar size? And what single additional measurement would do most to settle it?
