# What it refuses

Most of these limits are honest declarations in the engine's own header. Three are behaviours that look like answers and are not.

## The column is static

There is no friction in it, no velocity and no injection gas rate in the annulus at all, so the casing pressure it computes is the shut-in gas column and not a flowing one. Two designs running 500.0 Mscf/d and 250.0 Mscf/d down the same annulus get the same column, because the rate never enters it.

## Two of the three lines are inputs

The unloading and transfer lines are straight lines on constant gradients, and the engine does not pretend otherwise. It declares them: 0.45 and 0.1 psi/ft on `westTexasOil`, 0.5 and 0.12 on `deepHighPressure`, 0.42 and 0.08 on `constantPressurePPO`, 0.46 and 0.09 on `midDecrementKnifeEdge`. A real unloading column is neither straight nor constant.

## No inflow, no outflow

It does not solve the well's inflow and it does not solve multiphase outflow. The flowing production traverse that locates the deepest injection point is passed in as a depth and pressure table, so the caller supplies it from a validated nodal model rather than the module inventing a gradient.

## Continuous lift only

Intermittent lift is not modelled anywhere in the module. Every valve setting, every spacing decision and every warning it emits assumes a well lifting on a continuous point of injection, so a string sized here and then run on a cycle is being run outside the thing that designed it.

## Upper bounds, not predictions

Throughput is Thornhill and Craver, an orifice equation, which does not know that a real valve throttles on its stem before it is fully open. `westTexasOil` valve 1 is credited with 1359.548505991 Mscf/d against a 500.0 Mscf/d target. That is a ceiling. The nitrogen dome uses Dranchuk and Abou-Kassem with nitrogen criticals, an extrapolation off the natural gas basis it was fitted to, defensible in a window the header pins at Tpr 2.3 to 3.1 and Ppr 1 to 5.

## Three that look like answers

| Behaviour | What it reports | What is true |
| --- | --- | --- |
| Target-depth mandrel | No spacing warning | 131.375432376 ft against a stated 250.0 ft minimum |
| PPO closing test | Clears by 379.101060 to 724.986977 psi | The tubing side rule misses by 31.822047 to 52.249541 psi |
| Deepest injection point | Residual 4.67696e-3 psi | True residual 1.58211e-1 psi, 33.83 times larger |

## The mistake

Reading a quiet run as a clean one. `westTexasOil` raises three warnings and every one of them is about multipointing. The 131.375432376 ft violation of its own declared minimum raises nothing, because the branch that pulls the last mandrel to target depth returns before the spacing test runs. The absence of a warning is evidence about the code path, not about the design.

## Exercise

For the target-depth mandrel, the PPO closing test and the deepest injection point, write down the number the engine reports and the number that governs.

Then say which of the three would be hardest to catch by reading the output alone, and why.
