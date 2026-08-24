# Picking shale points

The equation from the last lesson has parameters, and in a real well nobody hands them to you. You get them by fitting the trend to points taken off the log. Which points you take is the decision that determines everything downstream, and it is a geological decision rather than a numerical one.

## Why not fit the whole log

The obvious move is to run a least squares fit through every sonic sample in the well and let the volume of data average out the noise. It fails, for a reason that has nothing to do with statistics.

A sonic log through a clastic section is a mixture of rock types. Sands, silts, shales, thin carbonate stringers and coal all pass under the tool, and each has its own transit time at the same effective stress. The compaction relation you are fitting applies to one of those rock types, shale, because shale is the one whose porosity tracks effective stress in a repeatable way. Fitting a shale relation to a mixed lithology log fits a relation to a rock that does not exist.

Worse, the mixture is not evenly distributed with depth. A sand rich interval at one depth and a shale rich interval at another do not cancel. They tilt the fitted curve, and a tilt in the fitted curve is a systematic pressure error rather than random scatter.

The same argument rules out the intervals where the tool is not reading rock at all. Washouts give long transit times because the tool is looking at mud. Cycle skips give sudden spikes. Casing shoes, bit changes and log splices leave steps. None of these are compaction, and a fit does not know that.

## What makes a good pick

A usable shale pick satisfies all of the following.

It is shale, on independent evidence. The gamma ray log is the usual arbiter, with a cutoff chosen for the well rather than borrowed. Resistivity and neutron density character back it up.

It is in the middle of a thick, clean shale bed, away from bed boundaries where the sonic tool is averaging across a contact and reading neither rock.

The hole is in gauge there. Check the caliper before you check the sonic.

It is in the normally pressured section, or at least in a section you are willing to argue is normally pressured. This is the subtle criterion and the one that produces most bad trends, because a pick taken in an overpressured shale sits above the true normal trend and pulls the fit toward itself.

The picks as a set span the depth range. An exponential is defined by a starting value and a decay rate, so picks clustered over a few hundred metres constrain neither. You want them spread from as shallow as the log allows down to the deepest normally compacted shale you trust.

## The twelve picks this capstone uses

The capstone fits its trend to twelve picks, with the matrix transit time fixed at 220 us/m.

| z (m) | dt (us/m) |
|---|---|
|  200 | 593.8240412214866 |
|  500 | 523.0158785790468 |
|  800 | 465.6198974549904 |
| 1100 | 419.0956193738281 |
| 1400 | 381.3837725061018 |
| 1700 | 350.8151435486827 |
| 2000 | 326.0366944948908 |
| 2300 | 305.9516740523121 |
| 2600 | 289.6710729015687 |
| 2900 | 276.47427409385205 |
| 3200 | 265.7771568830787 |
| 3500 | 257.1062421947293 |

Look at the depths first. Twelve picks at an even 300 m spacing from 200 m to 3500 m below the mudline. That covers most of the logged interval and constrains the exponential at both the shallow end, where the curve is steep, and the deep end, where it is nearly flat.

Then look at the values. They fall monotonically and the steps between them shrink with depth, which is the exponential shape from the last lesson. Nothing in this set looks like a sand, a washout or a spike. It is a clean pick set, and the next lesson shows how clean.

## What a bad pick does

Take one pick out of a sand. Sands at depth are often faster than shales, so the pick sits below where a shale pick would sit. A single low pick deep in the set steepens the fitted curve, which lowers the trend everywhere below it, which shrinks the apparent departure of the log from the trend, which under predicts pore pressure. Under predicting pore pressure is the error that gets wells into trouble.

Now take one pick from a washed out interval, where the transit time is long. That pulls the fit the other way, flattening the curve and inflating the apparent departure, and the prognosis comes back with pressure the well does not have.

Neither of these announces itself. The fit returns numbers either way, to as many decimal places as you ask for. The defence is to look at the picks on the log before you fit, and to look at the fitted curve on the log after you fit.

## Exercise

Describe the depth coverage of the twelve picks above, and state which of the criteria in this lesson you cannot verify from the table alone.

Self check: there are twelve picks at a regular 300 m spacing, from 200 m to 3500 m below the mudline, so they span most of the well and constrain both the shallow steep part of the exponential and the deep flat part. From the table alone you can verify only the depth coverage and the monotonic fall of the transit times. You cannot verify that any pick is in shale, that the hole was in gauge, that each pick sits in the middle of a thick bed, or that the picks are all in the normally pressured section. Those four checks need the gamma ray, the caliper and the pressure picture, which is why picking is done on the log display rather than in a table.
