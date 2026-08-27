# The three solvers

The engine's input type carries a field called `solver_method`, whose permitted values are the union

```
havlena_odeh | p_over_z | p_over_z_modified | pot_aquifer_plot
```

The first is the oil-side straight line. The other three are ways of reading the same gas tank, and they exist because a $p/z$ plot that is not straight can be un-bent in more than one way, depending on what is bending it.

One thing to know before you use the field. In the engine source, `solver_method` is declared on the inputs and never branched on: the gas path chooses its regression from `aquifer_model`. The field records the method you intend, but the thing that selects the arithmetic is the aquifer model. Do not assume that changing the label changes the answer.

## p_over_z: the volumetric reading

This is lesson 2. The tank is closed and the engine configuration is `fluid_system: 'gas'` with `aquifer_model: 'none'`.

Run the Pletcher case that way and the engine returns a gas in place of $104.110270168826$ Bcf, which against the true 100.8 Bcf is $3.28399818335935$ percent high. Its $R^2$ is $0.999929244287833$, its water drive index at year ten is $-0.000560706213911048$, and its drive indices sum to $0.996948447216229$. The engine tags the run `published_method`: the formulation is standard and documented, but this configuration is not sitting on a published benchmark.

Two of those numbers are the diagnostic. A slightly negative water drive index is not physical, and a drive index sum of 0.997 rather than 1.000 says the terms do not quite account for the withdrawal. Neither is dramatic. Both are the model quietly reporting that something has been left out.

## pot_aquifer_plot: Pletcher Equation 13

If the bend is water, model the water. This plot rearranges the gas balance so that both unknowns, the gas in place and the aquifer size, fall out of one straight line:

$$\frac{F}{E_g} = G + \frac{p_i - p}{E_g} \left[ G B_{gi} \frac{S_{wi} c_w + c_f}{1 - S_{wi}} + \left( c_w + c_f \right) W \right]$$

Plot $F/E_g$ against $(p_i - p)/E_g$. The intercept is $G$ directly, in scf, and the slope contains the aquifer water in place $W$, which the engine extracts by subtracting the known expansion term and dividing by $c_w + c_f$.

Run the case with `aquifer_model: 'pot'`, excluding year 1 as Pletcher does because it is an early-time outlier, and the engine returns

| quantity | engine | truth | error |
|---|---|---|---|
| gas in place | 100.994684584637 Bcf | 100.8 Bcf | +0.193139468886000 % |
| aquifer water in place | 69.0397563415655 MM res bbl | 74.5 MM res bbl | -7.32918611870406 % |
| cumulative influx at year 10 | 2344383.00609054 res bbl | 2494000 res bbl | -5.99907754248041 % |

with $R^2$ $0.999703243147068$ over nine points, drive indices summing to $1.00047449754455$, a drive mechanism of `gas_expansion_drive`, an aquifer strength of `weak`, and a validation tier of `benchmark_verified`.

The four gates this case is held to: gas in place within 2 percent of 100.8 Bcf, aquifer water within 10 percent of 74.5 MM res bbl, cumulative influx within 10 percent of 2494000 res bbl, drive index sum within 0.05 of unity. All four pass, the first with an order of magnitude to spare.

## The comparison that matters

Put the runs side by side.

| | aquifer_model 'none' | aquifer_model 'pot' |
|---|---|---|
| gas in place error | +3.28399818335935 % | +0.193139468886000 % |
| $R^2$ | 0.999929244287833 | 0.999703243147068 |

The wrong model has the better $R^2$. It fits its own data more tightly than the right model does, and it is $17.0032474579172$ times further from the truth.

That is the single most important sentence in this module. Goodness of fit is a statement about consistency between a model and the data you fed it, not about whether the model is the right one, and a wrong model with a free parameter can fit better precisely because it is free to absorb a real effect into that parameter.

Choose your solver from the physics and from the module 1 diagnostics: is there a water leg, is the water cut rising, is the fitted $p/z$ intercept above the measured $p_i/z_i$, does the $F/E_t$ ratio drift. Then check that the answer is physical. Do not choose by $R^2$.

## p_over_z_modified: when the bend is rock, not water

The third method exists for a different cause of the same symptom. In an overpressured gas reservoir the initial pressure sits well above the normal hydrostatic gradient and the rock is held apart by that pressure. As the reservoir depletes the rock compacts, the pore volume shrinks, and that supports the pressure exactly the way water influx does. The plot bends upward again and the naive extrapolation overstates the gas again, with rock compaction masquerading as extra gas.

The Ramagost and Farshad correction takes the compaction out of the plotted variable rather than adding a term to the balance:

$$\left( \frac{p}{z} \right) \left( 1 - \frac{c_f \Delta p}{1 - S_{wi}} \right) \ \text{against} \ G_p$$

An overpressured volumetric tank straightens out and its intercept is the gas in place again.

See what happens when the right correction meets the wrong problem. Apply the transform to the Pletcher data, whose bend is water and not compaction, and fit the corrected column: the $x$ intercept is $104.984995886491$ Bcf, $4.15178163342327$ percent high, with an $R^2$ of $0.999764886431655$.

Better than the naive $107.924344535358$ Bcf, and still wrong by more than twenty times the pot aquifer answer's error. The correction pulled the line the right way because compaction and influx bend it the same way, but it could only remove as much as $c_f$ could explain, and $c_f$ was not what was doing it. A correction that improves your answer is not thereby the correct correction.

## Choosing

The decision is about mechanism. Is the initial pressure above the normal hydrostatic gradient for the depth, with an elevated $c_f$? Suspect compaction and reach for the modified plot. Is there a mapped water leg, a rising water cut, or a fitted intercept above the measured anchor? Suspect water and reach for an aquifer model. Neither, and the plot runs straight through its own initial point? The volumetric reading is the honest one, and adding an aquifer term the data does not need will cost you, exactly as module 2 showed on the oil side.

## Exercise

Apply the Ramagost and Farshad factor $\left(1 - c_f \Delta p / (1 - S_{wi})\right)$ to the year ten measured $p/z$ of $2803.69858645977$ psia, with $c_f$ 0.000006 per psi, $\Delta p$ 3773 psi and $S_{wi}$ 0.15. Report the corrected value and how many psia the correction moved the point.

Then answer two questions. First, the correction moves a late point further than an early one. Explain why from the form of the factor, and say what that does to the slope of the fitted line. Second, you are handed a gas field whose $p/z$ plot bends upward, which is normally pressured for its depth, and whose wells produce no water at all after eight years. Which method do you run first, and what would you go and look for before trusting any of them?
