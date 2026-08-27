# What the warnings mean

Run the Ekene tank in the panel and the engine returns five warnings. They are all the same warning about five different rows, they look alarming, and the answer they are attached to is correct to fourteen significant figures. Learners meet them and either ignore every warning the engine ever emits or distrust a result that deserves trust. Neither is a good habit, so here is what the engine is actually telling you.

Start with the distinction that organises all of it.

**A warning is about this run. The validation tier is about the method.** Two claims from two different parts of the engine, answering two different questions. The warnings ask whether anything about the data you handed over deserves comment. The tier asks whether the piece of physics you invoked has been tested against a published worked example. A run can carry five warnings and a benchmark tier at once, and Ekene does.

## The five warnings, read

Here is the first one, verbatim:

> PVT lab table is not sorted ascending: row 1 pressure 3200 psia is not greater than row 0 pressure 3400 psia.

The other four say the same thing about rows 2 through 5. The Ekene laboratory table is listed in descending pressure, 3400, 3200, 2900, 2600, 2300 and 2000 psia, the way a lab report prints it, and the engine's structural check on lab tables walks the rows expecting each pressure to exceed the one before it. Five adjacent pairs, five complaints.

Now, why does the engine care about the order of a table it is only going to interpolate in? Because the interpolation routine takes the first row's pressure as the bottom of the table's range and the last row's pressure as the top. On a descending table that reads as a range from 3400 up to 2000, which no pressure can be inside. Every lookup fails the range test and returns nothing.

So the table is not merely untidy. On this fixture it is inert. Lesson 2 showed the consequence: with the per-row values removed, the run with the table in the file and the run with the table deleted return 13296089.9738372 stb, identical in every digit, because both ran on correlations.

On Ekene as committed, none of that matters. The per-row values sit at level one of the precedence chain, the engine never reaches the table, and the warnings describe a part of the file that was never consulted. Sort the table into ascending order and rerun with the per-row values still in place: the answer is unchanged at 12139208.1074968 stb and the warning count drops to zero.

That is the whole shape of it. The warnings were true, specific, and about something that did not affect this answer. They were also the only notice you were ever going to get that a laboratory table in the file was unusable.

## The rest of the warning vocabulary

Five more things the engine will tell you about a run, worth recognising when you meet them.

**A drive index sum away from 1.** If the indices at the final timestep miss 1.00 by more than 0.05 the engine says so and calls it a possible material balance solution issue. Strip Ekene's per-row fluid properties and this fires, reporting a sum of 0.388, because the placeholder branch from lesson 3 drives the oil expansion negative.

**A low fit statistic.** Below 0.95 the engine notes that the data may have scatter or the drive mechanism may be wrong.

**A lab table too short to interpolate.** One row cannot bracket anything, and the engine says it will fall through to correlations.

**Correlation and viscosity range warnings.** Lesson 1. Your conditions are outside what the correlation's author sampled, and the engine asks you to read the result as an extrapolation.

**A declared source that is not there.** If the case declares its PVT source as a lab table but the file contains neither a table of at least two pressure points nor per-row columns, the engine says so and names the three ways to fix it rather than falling back silently.

## Two behaviours that are not warnings at all

**Missing or backwards dates throw.** The routine that extracts the time steps raises a named error naming the offending timestep, and the run produces nothing. Set Ekene's fourth date to 2020-03-01 and ask for a Fetkovich aquifer and you get exactly that: a message that the date is not after the previous timestep's, and that dates must be strictly increasing. Make the same edit and ask for a pot aquifer and the run completes normally, because the pot aquifer is time independent and never asks for a time step. Only the time marching models do.

**The validation tier does not react to your run.** Force a pot aquifer onto Ekene, which has no aquifer, and the engine reports an oil in place of -516449.043355256 stb, a physically impossible number. The tier still reads benchmark verified, and no new warning appears. The tier is a statement about whether the oil and pot aquifer path has been checked against a published example. It is not a statement about whether your case should have used that path. Nothing in the output will tell you that except the negative sign, the drive mechanism reading strong water drive on a tank you know is closed, and your own judgment.

There is one more divergence to know about and not to chase here. The engine forms every drive index over gross withdrawal $F$, while the reference string it prints for the combination drive benchmark names the book's convention, net withdrawal $F - W_p B_w$. On any oil case with produced water the two disagree, the reported indices do not sum to 1, and the closure warning above can fire for a bookkeeping reason rather than a physical one. The Associate tier taught the net convention, which is the one that closes. The Expert tier works the whole thing out.

## Worked example: triaging a warning list

You are handed a result with three warnings: two sort complaints about a lab table, and a drive index sum of 0.94.

Take the sum first, because it is about the answer. Check whether water was produced, since that is the convention trap above, and check the aquifer model before you touch the data.

The sort complaints second. Ask whether the lab table was reachable at all. If the run also carries per-row fluid properties, the table was never read and the complaint is cosmetic. If it does not, the table was inert and the run is on correlations, which changes what you can claim about the result even though no number in it is wrong.

The tier last, and only to quote it, never as evidence that the case was set up correctly.

## Exercise

Take the provenance table you built in lesson 1 and add a fourth column headed "what the engine would say". For each property, write the warning you would expect if that property's source were unavailable or malformed.

Then write two sentences for a reserves memo about the Ekene run as committed, which reports five sort warnings, a benchmark tier and an oil in place of 12139208.1074968 stb. They have to be honest about the warnings and clear that the answer does not rest on the thing they describe. Show them to someone who has not taken this course and ask whether they came away reassured or worried. If they came away worried, rewrite.
