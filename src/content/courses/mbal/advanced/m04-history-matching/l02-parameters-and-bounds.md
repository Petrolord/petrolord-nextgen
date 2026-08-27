# Parameters and bounds

A match is defined by three choices, and only the first of them is usually made consciously. Which parameters you free. What starting values you give them. What box you allow them to move in. Every one of those is a statement about the reservoir, and every one of them changes the answer.

## What can be freed

The engine's parameter set is a closed list of seven keys, and it is short for a reason. These are the quantities the tank model is genuinely parameterised by.

| key | what it is | unit | applies to |
|---|---|---|---|
| `stoiip_stb` | oil in place $N$ | stb | any oil case |
| `ogip_scf` | gas in place $G$ | scf | gas cases |
| `gas_cap_m` | gas cap ratio $m$ | fraction | oil cases with a gas cap |
| `aquifer_w_rb` | aquifer water in place $W$ | res bbl | pot and Fetkovich aquifers |
| `aquifer_j_rb_d_psi` | aquifer productivity index $J$ | rb/d/psi | Fetkovich only |
| `aquifer_radius_ft` | reservoir radius at the contact $r_R$ | ft | Carter-Tracy only |
| `aquifer_permeability_md` | aquifer permeability | md | Carter-Tracy only |

Asking for a key that does not apply to your case is an error, not a silent no-op. Ask for a Fetkovich productivity index on a Carter-Tracy case and the run stops and tells you which parameters that aquifer is actually shaped by. That is the right behaviour: a parameter you thought you were fitting and were not is worse than a run that refuses.

If you do not choose, `defaultHistoryMatchParameters` chooses for you, and its choice is the in place scale plus whatever shape parameters the configured aquifer has:

| aquifer model | default fit set |
|---|---|
| none | oil or gas in place only |
| pot | in place, aquifer water in place |
| Fetkovich | in place, aquifer water in place, productivity index |
| Carter-Tracy | in place, reservoir radius at the contact |

Two things follow from that table. The default is never one parameter unless there is no aquifer, and the default for Fetkovich is three. If you accept the default on a Fetkovich case you have freed three parameters without deciding to, and the next lesson is about what that costs.

## Starting values

The initial guess for the in place scale is the preliminary regression's own answer. The engine runs the forward material balance first, takes the oil or gas in place it produces, and starts the search there. Aquifer parameters start from whatever is configured on the case, falling back to the regressed aquifer volume where the regression produced one. The Carter-Tracy radius has its own fallback chain: the configured radius, else a wedge radius derived from the reservoir area and the encroachment angle, else a legacy default of 2980 ft.

That last fallback deserves a moment. If your case carries neither a radius nor an area, the search starts from a number that has nothing to do with your field, and since the default bounds are multiples of the starting value, the box you search in is built from that number too. A silently defaulted start contaminates the bounds as well.

If the preliminary regression fails or returns a value that is not positive, the run stops and asks you for a starting value rather than inventing one.

## Bounds

The search runs on the natural logarithms of the parameters, and the bounds are a box in that log space. Where you do not supply bounds, the defaults are wide multiples of the starting value:

| parameter | default box | span |
|---|---|---|
| in place scale $N$ or $G$ | start divided by 100 to start times 100 | 4 orders of magnitude |
| aquifer water in place $W$ | start divided by 1000 to start times 1000 | 6 orders of magnitude |
| productivity index $J$ | start divided by 1000 to start times 1000 | 6 orders of magnitude |
| Carter-Tracy radius $r_R$ | start divided by 30 to start times 30 | 2.95424250943932 orders |
| aquifer permeability | start divided by 100 to start times 100 | 4 orders of magnitude |
| gas cap ratio $m$ | 0.001 to 10, absolute | 4 orders of magnitude |

Look at what those defaults mean on the Dake tank. The reservoir radius at the oil water contact is 9200 ft, mapped, from a real outline. The default box runs from 306.666666666667 ft to 276000.000000000 ft. The upper end is a reservoir 52 miles across. The lower end is a reservoir you could walk around in a minute. The oil in place, starting from the regression's 307221409.553720 stb, is allowed anywhere from 3072214.09553720 stb to 30722140955.3720 stb.

These are not physical statements. They are numerical guard rails, wide enough that they will not accidentally constrain a search that is behaving. That is the correct default for a library and the wrong default for your case.

**A bound is a physical statement, and it should read like one.** You know things the optimiser does not. You know the mapped outline, so you know the radius to within the uncertainty of a contact pick and a loop tie, which is tens of percent and not three orders of magnitude. You know the aquifer cannot be smaller than the water it has already delivered. You know the gas cap ratio cannot make the gas column taller than the structure. Each of those is a bound with a source, and a bound with a source is evidence in your match. A bound of "the default was wide enough" is not.

Write bounds you would defend out loud. If you would not say "this radius cannot be below 7000 ft because the contact pick would have to be wrong by 400 ft to allow it", do not enter 7000.

## Worked example: a bound that binds

Match the Dake tank on the oil in place alone, as in lesson 1, but with the box set to 400000000 to 900000000 stb, a range chosen to sit entirely above the honest answer.

The search stops after 1 iteration at

$$N = 399999999.999999 \ \text{stb}$$

parked exactly on the lower bound, with a root mean square pressure error of 122.907344457332 psi against the 4.31298999061806 psi the free search achieved. The result flags that parameter `at_bound`, and the run returns two warnings: that the parameter finished at its search bound and the bound is constraining the fit, and that match quality is poor because the root mean square error exceeds two percent of the initial pressure.

Read what happened. The optimiser did not fail. It did the best it could inside the box it was given, and the best it could do was to press against the wall. A parameter sitting on its bound is not an estimate at all. It is a statement that the data wanted to go somewhere you did not allow, and the value you are reading is the position of your own constraint, not a property of the reservoir.

The reported uncertainty on that parked value is 9.63953303585523 percent, with an interval of 333982971.259059 to 479066341.007826 stb. That interval is arithmetic from the curvature at a point on a wall. It does not mean the oil in place is probably in that range, and quoting it would be worse than quoting nothing.

So the rule is unconditional. **Check `at_bound` on every parameter of every match before you look at any other number in the result.** If anything is at a bound, either the bound was wrong and you should widen it and rerun, or the bound was right and the model cannot fit the data inside the physics you are willing to allow, which is a far more interesting finding than a fitted number.

## Exercise

You are matching a field whose oil water contact has been mapped from three wells and a reasonable seismic pick. The reservoir radius at the contact comes out at 9200 ft, and your interpreter tells you the contact depth is good to about 30 ft on a structure whose flanks would move the outline by roughly 8 percent per 30 ft.

Write down the bounds you would set on the reservoir radius, and the sentence you would put in the match report justifying them. Then compute the dimensionless radius each of your two bounds implies, given an aquifer outer radius of 46000 ft, and say whether either implied value would push the aquifer into a regime the finite solution of module 1 handles differently.

Finally, one judgment call to write down and keep. Your bounds are tighter than the engine's defaults by a large factor. Name the circumstance in which that tightness would cause you to report a wrong answer with confidence, and say what in the result object would warn you it had happened.
