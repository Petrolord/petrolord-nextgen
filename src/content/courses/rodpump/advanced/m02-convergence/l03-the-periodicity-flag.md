# The periodicity flag

`notPeriodic` warns that the march never settled. It is not monotone in resolution, so a middling grid can raise it while a coarser and a finer one both converge.

{{panel:pd-balance-explorer}}

## What the flag says

The engine prints: The solution had not settled into a repeating cycle after 20 strokes. Its loads are indicative; raise the damping or check the inputs. `maxCycles` defaults to 20, and a run that raises the flag is a run that used all twenty.

At the shipped defaults ODUMA-4 settles in 4 cycles and raises nothing. The published taper settles in 3.

## The sequence that breaks the reading

Run ODUMA-4 at 11 spm with a damping ratio of 0.05 and walk the grid.

| Nodes | Cycles marched | converged | notPeriodic |
| --- | --- | --- | --- |
| 60 | 7 | true | false |
| 120 | 11 | true | false |
| 240 | 5 | true | false |
| 480 | 20 | false | true |
| 960 | 16 | true | false |
| 1920 | 20 | false | true |

Three coarse grids converge. A finer one does not. A finer one still does. The finest does not. On the same six grids at the shipped damping the flag is false at every row, so the flag is a property of the run and not of the well.

## What that costs the advice

The message asks the reader to raise the damping or check the inputs. Neither is the reason here: nothing about the well changed between 240 and 480 nodes. The one thing that did change is a parameter `runRodPumpDesign` does not expose, so a caller who sees this warning has nothing to turn. Through the design function at 11 spm and a damping ratio of 0.05 on the shipped grid, the warnings read `rodOverstressed` and no periodicity warning appears.

## The damping sweep says the same

Walk the damping ratio on ODUMA-4 at the shipped speed and the flag does not order itself either. At 0.0500 it fires, at 0.0600 it fires, at 0.0800 it does not, at 0.1000 it fires again, at 0.1200 it does not. The advice the message gives, raise the damping, is exactly what fails between 0.0800 and 0.1000.

## What it refuses

The flag refuses to distinguish a well that never repeats from a grid that landed badly. It states one thing: twenty cycles were marched and the tolerance of 0.0001 was not met. Treating it as a diagnosis of the design is the mistake, and treating its absence as proof of a settled answer is that mistake with the sign flipped.

## Exercise

Run ODUMA-4 at 11 spm and a damping ratio of 0.05 at 240, 480 and 960 nodes and record the flag at each.

Then say what a reader who saw only the 480 node run would have concluded, and what the other two rows do to that conclusion.
