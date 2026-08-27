# Intervals on real data

Ekene is noise free. That was a teaching decision, and lesson 1 showed what it costs: the interval block collapses to the last bits of double precision and has nothing to say. Real intervals need real scatter, and the armed literature fixtures carry some. Not measurement noise, in most cases, but something more interesting for an evaluator: scatter that the author of the document created by rounding numbers before printing them.

This lesson fits three published tables with the engine and reads the intervals that come back.

## Worked example: the Weaver harmonic table

Pages 21 and 22 of Weaver P03-004 print a harmonic example built from $q_i = 120$ bbl/d and an effective annual decline of 0.35, which the document converts to a nominal $-\ln(1 - 0.35) = 0.430782916092454$ per year, or 0.00118022716737659 per day. The rate column is rounded to whole barrels per day: 99 where the curve gives 98.73, and so on for eleven rows at half-year spacing.

Feed those eleven printed rates to `fitArpsModel` as harmonic and the engine returns

- $q_i = 119.962186015231$ bbl/d, half-width 1.19418713671404, which is 0.995469636208883 percent
- $D_i = 0.00117967451797403$ per day, half-width 0.0000209633059995933, which is 1.77704152121516 percent
- $R^2 = 0.999919333353602$, RMSE 0.224237940662093

Two things to notice. First, the fitted parameters are close to the document's inputs but not equal to them, because the fit sees rounded rates rather than the curve. Second, and this is the point of the module, the document's own $q_i$ of 120 and its $D_i$ of 0.00118022716737659 both sit **inside** the reported intervals. Here the interval behaved as advertised, because the only thing separating the data from the model was random-looking round-off, which is precisely the error structure the formula assumes.

Now refit the same eleven times with unrounded rates from the same curve. The parameters snap back to $q_i = 120.000000000000$ and $D_i = 0.00118022716737659$, and the half-widths collapse to 5.36790353525214e-14 and 9.42256562313961e-19. The interval did not measure the reservoir. It measured how many digits Weaver chose to print.

## A second case: Ahmed's monthly gas forecast

Example 16-2 in Ahmed's *Reservoir Engineering Handbook* prints a twelve-row monthly forecast for a gas well, with the model rates rounded to whole MMscf per month: 1193, 1149, 1105 and so on down to 783. The book's least-squares decline is 0.0383 per month.

Fitting the twelve printed integers as an exponential on a 30-day month grid returns $q_i = 1193.73866764865$ and a nominal decline of 0.00127588809168947 per day, which is 0.0382766427506840 per month against the book's 0.0383. The half-widths are 0.841291847000170 on $q_i$, which is 0.0704753787239961 percent, and 0.00000361769148991190 per day on $D_i$, which is 0.283543009255736 percent and works out at 0.000108530744697357 per month.

Compare the two cases. Weaver rounds to three significant figures at the start and two by the end of his table, and gets a $D_i$ interval of 1.78 percent. Ahmed rounds to four significant figures throughout, and gets 0.28 percent. Same physics, same estimator, one order of magnitude between the intervals, entirely because of a formatting decision made before either curve reached you. When you inherit a table rather than a database, the interval you compute from it is partly a property of the spreadsheet you were handed.

## A third case, where the interval misses

Example 16-3 in the same book works Ikoku's 1984 gas-well data. Its twenty-five-row table is printed to six decimals, so round-off is negligible. The book solves for the decline exponent by Newton iteration and converges to $b = 0.5195$, with $D_i = 0.3668$ per year, which is 0.00100493150684932 per day.

The engine scans $b$ in steps of 0.05, so it cannot land on 0.5195. It picks $b = 0.500000000000000$ and, having done so, must bend the other two parameters to compensate. It returns $q_i = 9.71490740363775$ MMscf/d with half-width 0.103117346566342, and $D_i = 0.000954733671926069$ per day with half-width 0.0000126354377798578, at $R^2 = 0.999273936010773$.

The fitted $D_i$ is 0.348477790253015 per year. The book's 0.3668 per year is far outside a band whose half-width is 1.32345157098809 percent of the fitted value. Nothing is noisy, nothing is rounded, and the interval still fails to bracket the published answer, because the displacement was caused by a decision the residuals cannot see: a grid resolution of 0.05 on $b$. The engine reports a $b$ half-width of 0.0500000000000000 for this fit, which is exactly ten percent of 0.5, which is the placeholder from lesson 2 and not a measurement of anything.

## The misconception to retire: real data means the interval is trustworthy

The tempting summary of this lesson is "Ekene's intervals are meaningless because it is synthetic, and literature intervals are meaningful because the data are real". Half of that is right. The Weaver case worked because the error structure matched the assumption. The Ikoku case failed on data that is at least as real, because the dominant error was a modelling choice rather than scatter. What separates a useful interval from a decorative one is not the provenance of the numbers. It is whether the thing that will actually make you wrong shows up as vertical residuals.

## Exercise

Take the Weaver harmonic fit above and push it through to a booking. Using $q_i = 119.962186015231$ bbl/d and $D_i = 0.00117967451797403$ per day with the harmonic EUR relation $(q_i/D_i)\ln(q_i/q_{\text{lim}})$ at an economic limit of 20 bbl/d, the base EUR is 182173.617757658 bbl.

Now build the optimistic corner by adding the $q_i$ half-width and subtracting the $D_i$ half-width, and the pessimistic corner the other way round. Compute both EURs and express each as a percentage of the base. Then answer in one sentence: parameter intervals under two percent each produced an EUR range of what width, and would you be comfortable calling that range a P10 to P90 spread? Lesson 4 gives you the vocabulary for why the honest answer is no.
