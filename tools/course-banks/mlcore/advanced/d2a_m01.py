import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D2 Expert m01, Conditioning and the NIST reference problems.
# Figures from digest sections 17 (condition numbers, the exact copy, why
# 1.00e+8, the Longley bracket), 18 (the NIST table, LRE, Filip), 3 (the ols
# refusals) and 24 (the condition boundary). Q7 was checked against the vendored
# engine: maxCondition equal to the printed Longley figure is refused, because
# the full number carries digits past the sixth decimal; the key claims only
# that the print cannot decide it.

q(2, "The engine returns two condition numbers with every least squares fit. Which one decides whether it refuses the design?",
 "`scaledConditionNumber`, measured after every column of the design is scaled to unit length",
 ["`conditionNumber`, the raw 2-norm figure of the design as given, because it carries the column of ones",
  "Either of the two, so a design is refused as soon as one or the other passes 1.00e+8",
  "The raw figure after each feature is centred on its training mean, which the engine does before measuring"],
 "The refusal reads the scaled number alone, and the basis says so: \"2-norm condition number of the design with unit-length columns; refused above maxCondition 100000000\". The raw number mixes units and is printed so a reader can see how much of the apparent trouble is units. The engine does not centre the features: centring is arithmetic the course did outside the fit, and it moved the attribute design from 7608.495043 to 8.661304.")

q(0, "On the training rows of the teaching split, adding the depth to the three logs moves the raw condition number from 5595.200723 to 751074.623153 and the scaled one from 193.359232 to 225.474144. How does the course read that change?",
 "As a units story: the depth column is large, and it comes nowhere near being a copy of the logs",
 ["As a collinearity story, because the raw number grew far more than the scaled number did when the depth joined",
  "As a near refusal, because the raw figure is what maxCondition is compared with and it rose most",
  "As evidence that depth carries no sonic signal, since its scaled number moved less than the logs' own"],
 "A large raw number beside a modest scaled one is a units story; a large scaled number is a collinearity story, and only that one is acted on. The depth in thousands of feet beside a density in g/cm3 inflates the raw figure whatever the data, and the scaled figure barely moved. maxCondition is compared with the scaled number, 225.474144 here, far below 1.00e+8. A condition number says nothing about signal: the training R-squared rose from 0.683457 to 0.698882.")

q(3, "The logs and the four well-level attributes read a scaled condition number of 7608.495043 on the training rows. Every feature is then centred on its training mean. What changes?",
 "The scaled number falls to 8.661304 while the training R-squared stays at 0.861914",
 ["The scaled number falls to 8.661304 and the training R-squared falls with it, as the attribute signal sat in the offsets from zero",
  "The raw number falls to 1251.765912 while the scaled number holds at 7608.495043, since scaling had already removed the units",
  "Neither number moves, as the engine centres every feature itself"],
 "Centring brings the raw number to 1251.765912 and the scaled number to 8.661304, and it leaves the fit unchanged: the R-squared of the training fit moves by 0. Centring changes where the columns sit relative to the intercept, and the fitted plane stays where it was. Unit-length scaling removes units and leaves near-collinearity with the column of ones in place, which is why the scaled number was large before centring.")

q(1, "Over the training rows easting has a mean of 414.173333 km and a population SD of 0.772284 km. Why does that make the attribute design close to collinear?",
 "Beside an intercept, a column far from zero that varies little is nearly a multiple of the column of ones",
 ["Its unit is the kilometre while the logs carry their own units, and the scaled number keeps that mismatch",
  "Easting names the well, and any feature that names a well raises the scaled condition number by itself",
  "Its population SD is below 1 km, so unit-length scaling divides the column by a small number and inflates it"],
 "Scaling each column to unit length removes the units, so what the scaled number measures is how close one column comes to a combination of the others. Easting at 414.173333 km with an SD of 0.772284 km is almost a constant, and a constant is a multiple of the column of ones; northing behaves the same way. Naming a well is the leakage finding, a different property. Unit-length scaling divides each column by its own length, which for easting is large.")

q(2, "A fifth column exactly twice NPHI is added to the three logs. How did the course read its scaled condition number, 6.22e+16, as a returned field?",
 "It raised maxCondition to 1.00e+300, so the call was fitted and the field came back",
 ["It read the figure printed inside the refusal at the default, which is the field a lesson reasons with",
  "It centred NPHI and its copy first, which let the fit through at the default limit of 1.00e+8",
  "It fitted ridge at lambda 0 on the same columns, since ridge returns the number that ols refuses on"],
 "A refusal returns `error` and `field` and no numeric field, so the course raised the limit to 1.00e+300 to have the number returned. The message's figure, 62175765717049960, is part of a sentence for a person and is quoted only as the engine's words. An exact copy stays an exact copy after centring. Ridge at lambda 0 refuses the same design in the same words, since the refusal rule belongs to both.")

q(0, "Why does the default refusal limit sit at 1.00e+8?",
 "At kappa = 1.00e+8, kappa^2 x machine epsilon is 2.220446, so the worst-case error bound reaches the coefficient itself",
 ["It is the largest scaled condition number among the NIST problems the engine fits, rounded up to a power of ten as an empirical ceiling",
  "Above it the smallest coefficient LRE of any fit falls below 7.66, the float-design limit that Filip reaches",
  "Every scaled condition number above it belongs to an exact copy of a column, as the twice-NPHI design shows"],
 "A least squares solution can lose up to about kappa^2 x machine epsilon of relative accuracy in the worst case. With epsilon 2.220446049250313e-16, kappa = 1.00e+8 gives 2.220446: an error bound as large as the coefficient, so no digit of some coefficient can be guaranteed. The limit is a stated worst-case bound. Filip's 5.21e+9 is above it without any exact copy, and the NIST problems fitted at the default read at most 43275.043587.")

q(3, "A reader passes maxCondition 43275.043587, the figure the course prints for Longley's scaled condition number, expecting a fit exactly at the limit. What can the printed figure tell them?",
 "Nothing decisive: the print is a rounding to six decimals, and the rule compares the full number with the limit",
 ["A fit, because a value exactly at the limit is fitted and this is Longley's value exactly",
  "That the call is fitted once the engine rounds its own number to six decimals before comparing",
  "A warning beside the fit, which is what the engine returns for a design sitting exactly at its limit instead of a refusal"],
 "A value exactly at the limit is fitted, and that is true of the full number. 43275.043587 is six decimals of a number with more digits, which can lie on either side of it; printed alike is not equal. The pair of calls that pins the rule is 43000, refused, and 44000, fitted. Least squares carries no warning: the engine declined the fit-and-warn alternative, so a design is fitted or refused.")

q(1, "At the default limit the engine refuses Filip, the degree ten polynomial of 82 rows and 11 coefficients. What does the refusal say about the design?",
 "Its scaled condition number, 5.21e+9 in quotable form, is above 1.00e+8, so some coefficients could carry no reliable digits",
 ["Its 82 rows are too few for 11 coefficients, so the residual degrees of freedom fall below the stated minimum",
  "Its certified values were computed in multiple precision, which a float64 least squares fit cannot compare with",
  "It holds an exact copy of a column, the same finding the twice-NPHI design gave at 6.22e+16"],
 "The message is the ill-conditioning refusal: the scaled condition number, printed in full as 5206821213.915052, is above maxCondition 100000000. kappa^2 x epsilon is then 6.02e+3, far above 1. Filip has 82 rows for 11 coefficients, well clear of the rule that needs more rows than coefficients. Its columns are powers of one variable: nearly collinear, with no column an exact copy of another.")

q(0, "Raised knowingly to maxCondition 1.00e+10, Filip is fitted with a smallest coefficient LRE of 7.66 against a float-design limit of 7.66. What does the course conclude?",
 "The missing digits are an input limit, and the two figures are claimed to agree only at the two decimals printed",
 ["The engine's LRE equals the float-design limit exactly, so the fit loses no digit the data offered",
  "The engine lost Filip's digits to its own arithmetic, since every other problem reached at least 13",
  "Filip's R-squared, at 10.37, shows the coefficients are good to ten digits once the limit is raised"],
 "The float-design limit is how many certified digits the float64 inputs allow: the exact solution of the design as rounded to float64. No method reaches the certified values from float64 data to more digits than that, so Filip's shortfall belongs to the input. The two figures print alike, and printed alike is not equal. The R-squared LRE of 10.37 is a different figure from the worst coefficient's 7.66: quote the LRE of the figure you use.")

q(2, "What does an LRE of 14 say about an engine coefficient compared with its certified value?",
 "The first fourteen significant digits agree: minus log10 of the relative error is 14",
 ["The engine's figure differs from the certified one by 14 units in the last printed decimal place",
  "Fourteen of the problem's coefficients agree with their certified values to the full float precision",
  "The two agree to fourteen decimal places after the point, whatever the size of the coefficient"],
 "LRE = -log10(|estimate - certified| / |certified|), a count of agreeing significant digits built from the relative error, so it does not depend on the coefficient's size or on decimal places. The course quotes the smallest LRE over a problem's coefficients, the worst one. When the two are identical in float the relative error is zero, and the LRE is capped at 16.")

q(3, "Wampler5 reads a smallest coefficient LRE of 16.00 and an R-squared LRE of 13.73. What does the pair teach?",
 "A coefficient's digits and R-squared's digits are different figures, so quote the LRE of the figure you use",
 ["The cap of 16 shows the engine's R-squared is wrong in its fourteenth digit on Wampler5, where the certified value has more digits",
  "Wampler5 is the worst of the NIST problems, as its R-squared carries the fewest digits in the whole table",
  "Once every coefficient reaches the cap, the R-squared LRE is copied down from the smallest of them"],
 "The coefficient LRE and the R-squared LRE of one problem need not be alike: Wampler5 matches every certified coefficient at the cap, and its R-squared reaches 13.73. Filip shows the other order, 7.66 on a coefficient and 10.37 on R-squared. Filip's 10.37 is the fewest R-squared digits in the table.")

q(1, "Norris reads a smallest coefficient LRE of 14.06 against a float-design limit of 14.07. How does the course read that row?",
 "The two print differently, and the engine's figure is the lower of the two",
 ["The engine exceeds the float-design limit, a sign that the certified value itself carries a rounding",
  "They are equal, as every NIST problem but Filip meets its limit to the precision shown",
  "It is a defect in the engine's arithmetic, since Norris is a straight line with a scaled number of 2.800505"],
 "14.06 is below 14.07, so the engine's worst coefficient sits just under the ceiling the float64 inputs set. Pontius prints 13.51 against 13.51 and Wampler2 13.20 against 13.2: those print alike, which claims agreement at the precision shown and nothing finer. Norris prints differently, so no equality is claimed there. A shortfall of that size beside the ceiling marks no arithmetic defect.")

q(0, "Leaving Filip aside, which NIST problem has the smallest coefficient LRE in the course's table, and what does it read?",
 "Wampler2, at 13.20, which is why the course says every problem but Filip agrees to at least 13 digits",
 ["Pontius, at 13.51, as the only problem below fourteen digits apart from Filip",
  "Longley, at 14.62, the hardest design of the set by its scaled condition number of 43275.043587",
  "NoInt2, at 15.34, because a fit with no intercept loses the most digits"],
 "Read the column: Norris 14.06, Pontius 13.51, NoInt1 14.72, NoInt2 15.34, Longley 14.62, Wampler1 16.00, Wampler2 13.20, Wampler3 to Wampler5 16.00. The smallest is Wampler2's 13.20, below Pontius's 13.51. Longley has the largest scaled condition number of the problems fitted at the default while its LRE is 14.62, and NoInt2 reads 15.34, above every problem except the four Wamplers at the cap.")

q(3, "A column of zeros, CALI, is passed to `ols` among the features. What does the engine return?",
 "A refusal naming `X.CALI`, in its own words: X.CALI is zero in every row, so its coefficient is not identifiable",
 ["The ill-conditioning refusal, with a scaled condition number printed in full above the default maxCondition of 1.00e+8",
  "A fit with the CALI coefficient set to 0, since a zero column contributes nothing to the prediction on any row of the table",
  "A refusal naming `y`, because a column with zero variance leaves R-squared undefined"],
 "The engine names the column and its reason: a coefficient on a column of zeros could take any value without changing a single fitted value. The engine sets no coefficient to 0 on its own. The zero variance refusal named `y` is about a target that never varies, a different call.")

q(2, "Which statement about the refusal limit is true of the engine as the course states it?",
 "It belongs to both `ols` and `ridge`, and a scaled condition number exactly at maxCondition is fitted",
 ["It belongs to `ols` alone, since ridge's penalty always makes the design well enough conditioned to fit",
  "It refuses at the limit and above, so a scaled number equal to maxCondition is refused",
  "It can be switched off by passing maxCondition 0, which the engine reads as no limit at all"],
 "The boundary table lists `ols`, `ridge` with the rule \"refuse the scaled condition number above maxCondition\" and the boundary \"exactly at the limit is fitted\". A limit below one is refused by name: maxCondition must be a finite number, 1 or more. Raising the limit is how a fit is let through knowingly, as Filip was at 1.00e+10.")

emit(Q, '/root/dai-wip-mlcore/banks/d2a_m01.json', expect_n=15)
finish()
