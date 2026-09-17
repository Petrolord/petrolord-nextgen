import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Associate tier exam, 42 questions across the whole tier. Written from
# digest.txt Sections 1 to 11, which are the sections this tier owns. The exam
# reads ACROSS modules rather than re-asking any module bank: most items turn
# on WHICH number answers WHICH question, and on whether the engine worked a
# figure out or somebody copied it off a chart.

# --- which number answers which question -----------------------------------

q(2, "A sizing sheet carries 2.223779 in2 and 2.853000 in2 for one gas case. What are they?",
 "The area the case demands and the area of the orifice actually purchased.",
 ["The area at a typed Kb of 1.000000 and the area at a typed Kb of 0.720000.",
  "The area on the choked branch and the area on the subcritical branch.",
  "The area before the certified coefficient is applied and the area after it."],
 "The second figure is a rung of the published ladder, which is why it carries three decimals of its own. The pair divides to the margin of 1.282951 that the selection returns."),

q(0, "Which figure on that same gas case is the one a header modification could invalidate?",
 "None of them while the case is choked, because the required area does not move with the outlet pressure there.",
 ["The required area, because the outlet pressure enters the critical form through Kb and it is the header that sets that pressure.",
  "The margin, because a header modification moves the purchased area rather than the required one.",
  "The critical ratio, because it is worked out from the outlet pressure and the relieving pressure together."],
 "The critical ratio is a function of the isentropic exponent alone, and the purchased area is a rung of a published table. Once a case is subcritical the outlet pressure does become part of the sizing answer."),

q(3, "One case reports 1.839323 in2 and another 1.867758 in2 for the same liquid stream. What separates them?",
 "The viscosity, left out of the first call and stated at 85.000000 cp in the second.",
 ["The certified coefficient, stated at 0.975000 in the first call and 0.650000 in the second.",
  "The datum, with the first call working in absolute pressures and the second in gauge.",
  "The loop, with the first call stopped after one pass and the second run to convergence."],
 "The inviscid call returns a correction of 1.000000 with no Reynolds number and no passes at all. A single pass on the same stated viscosity gives 1.867601 in2, which is a third figure again."),

q(1, "A reader is shown 0.104258 and 0.551208 on one gas case. What are they, and what does the pair decide?",
 "The outlet pressure as a fraction of the relieving pressure and the critical pressure ratio, and their comparison decides the branch.",
 ["The critical pressure ratio and the outlet fraction, and their comparison decides whether the bellows warning fires.",
  "The outlet fraction and the measured edge at which a chart Kb is needed, and their comparison decides the branch.",
  "Two readings of the outlet fraction, one before the atmospheric constant is added and one after it."],
 "The measured edge at which the chart Kb warning fires is 0.300000, a separate figure again. The critical ratio comes from the isentropic exponent and the outlet fraction comes from two pressures."),

q(0, "Four figures on a steam case read 1928.700000, 1.021727, 0.949984 and 1.287000. Which one did nobody have to look up and nobody had to state?",
 "1.021727, the correction the engine worked out from the relieving pressure.",
 ["1928.700000, the relieving pressure the engine worked out from the stated set pressure.",
  "0.949984, the required area the engine worked out from the load and the pressure.",
  "1.287000, the orifice area the engine returned from its own exported table."],
 "The question is narrower than it looks. The relieving pressure and the required area are also computed, but the orifice area is a published table entry, and the one figure asked for here is the correction on that route."),

q(2, "A gas case comes back critical, at a required area of 2.223779 in2 and a margin of 1.282951. Which of those readings move if the caller types a different Kb?",
 "Both the required area and the margin, since Kb divides the area on the choked branch.",
 ["Neither of them, since the engine attaches a warning and leaves a typed Kb out of the answer.",
  "The required area alone, since a margin is fixed by the rung the selection landed on.",
  "The margin alone, since Kb enters after the area has been worked out and before the letter."],
 "At a Kb of 0.720000 the same case needs 3.088582 in2, which is a different rung and a different margin again. A typed Kb is dropped only on the branch that has no place for it."),

q(1, "Three margins on one train read 1.282951, 1.527500 and 1.354759. What do they tell a reader about the three cases?",
 "Almost nothing about the cases, since a margin records where a required area fell between two rungs of a published ladder.",
 ["That the second case was sized most conservatively of the three, since it carries the largest spare area over its own requirement.",
  "That the three cases were sized at different overpressure allowances, since a margin carries the allowance through.",
  "That the first case is closest to needing a larger valve, since a margin is a distance from the rung above."],
 "Two cases with identical engineering behind them can end up with very different margins. Nothing graded in this course is a margin or an orifice letter, for that reason."),

q(3, "Two selections come back at a margin of exactly 1.000000, one from a required area of 2.853000 in2 and one from 26.000000 in2. What do those two rows share?",
 "Each required area is exactly a listed orifice area, and the rule takes that orifice rather than the next one up.",
 ["Each required area sits a millionth of a square inch below a listed area on the ladder, which is what puts the margin at one.",
  "Each required area is the largest figure the rung above it can serve, so the margin comes out at one by arithmetic.",
  "Each was rounded to the three decimals the published table carries before the comparison was made."],
 "A margin of exactly 1.000000 is the same statement as landing on a rung, read a second way. Such a case has no spare area at all over its requirement, and there is a difference between a valve that just passes and a valve that passes."),

q(1, "One liquid reading is 0.984776 and another on the same stream is 0.984858. What separates them?",
 "The first is the correction the loop converged on and the second is what a single pass would have used.",
 ["The first is the correction at the stated viscosity and the second is the correction at the clamp itself.",
  "The first is the correction this engine returned and the second is the correction the validation oracle derived.",
  "The first is the correction on the converged area and the second the correction on the inviscid one."],
 "Each figure carries its own Reynolds number, 17546.394776 for the shortcut and 17412.317969 for the loop. The shortcut is what a hand calculation usually does, and the digest prints the ratio between the two areas they imply."),

q(0, "Which pair below is a computed figure standing beside the typed figure on the same route?",
 "KN 1.021727 beside KSH 1.000000.",
 ["Kv 0.984776 beside Kd 0.650000.",
  "The critical ratio 0.551208 beside Kc 1.000000.",
  "F2 0.875668 beside the outlet fraction 0.800000."],
 "A stated coefficient is a third kind of figure again, and an outlet fraction is an input rather than a factor of either kind. The pairing asked for here is the one the steam route carries."),

q(3, "The engine computes the exact circular segment and the terminal velocity balance, and types the API 526 table. What decides which treatment a quantity gets?",
 "Whether the package can state a closed form for it, since everything derivable is derived and everything published as a chart or a table arrives as an input.",
 ["Whether a published case reaches it, since anything a golden checks is computed and anything no golden reaches is typed.",
  "Whether it carries units, since a unit bearing quantity has to be computed for the unit packaging to be checked.",
  "Whether it changes between cases, since a figure that moves with the fluid is computed and a fixed one is typed."],
 "The distinction is about where a number comes from. A chart value is typed even though it very much depends on the service, and the leading constants are computed even though they are fixed."),

q(1, "Where does a figure that the module never exports come from in this course?",
 "From a call arranged so that its answer is that constant and nothing else, with the arrangement named beside the figure.",
 ["From the module source, read directly, since a constant in the source is the value in use by definition.",
  "From the published standard, since a leading constant is a property of the unit system rather than of an engine.",
  "From a fit to several returned answers, since one call can never isolate a constant hidden inside an equation."],
 "Reading the source and reading the behaviour are two different claims, and only the second one catches a name attached to a different number. Three separate arrangements agree on the atmospheric constant of 14.700000000000 psia."),

q(2, "The digest recovers only three of the four published Napier coefficients. Why?",
 "Because a ratio of two lines is unchanged when all four of its coefficients are scaled together.",
 ["Because the fourth is the threshold pressure, which is a published boundary rather than a coefficient.",
  "Because the fourth is only active above the exported crossing, where the published range has ended.",
  "Because the fourth cancels against the leading constant of 51.500000000000 in every arrangement."],
 "Three pressures above the threshold solve the ratio of two lines, and the published quartet is one scaling of the three figures that solve. A threshold is a separate object again, and it was bisected rather than solved for."),

# --- refusals, warnings and contracts ---------------------------------------

q(0, "Which of these makes the engine refuse rather than warn?",
 "A relieving pressure past the top of the published Napier range.",
 ["An outlet fraction above 0.300000 on the gas route.",
  "A viscosity correction below 0.500000000000 on the liquid route.",
  "A latent heat below 50.000000000000 on the fire route."],
 "The other three attach a notice to an answer the engine still returns, and only the steam route stops answering. A notice leaves a figure to act on and a refusal leaves none, so the two are read quite differently."),

q(3, "A typed Kb of 0.720000 is handed to a subcritical gas case. What happens?",
 "The area is what it would have been at a Kb of 1.000000, to twelve decimals, and the engine attaches a warning saying the typed figure was ignored.",
 ["The area grows in proportion, since Kb divides the area on both branches of this route.",
  "The call refuses, since a typed factor that the running branch has no place for is an input error.",
  "The area is unchanged and nothing is said, since a factor with no place in the running form is silently dropped."],
 "Both subcritical calls return 2.658695041098 in2. That is correct behaviour rather than a defect, because the standard uses F2 there, and the engine says so rather than leaving it to be discovered."),

q(1, "Three corrections in this tier read 0.551208, 0.984776 and 1.021727. Which of the three can come back above one?",
 "Only the steam correction, since the critical ratio is below one across the whole range the standard covers and the liquid one is held at one by its clamp.",
 ["Only the liquid correction, since the raw fit it comes from asymptotes above one at a high Reynolds number.",
  "The steam correction and the liquid one, since both are corrections rather than ratios of two pressures.",
  "None of the three, since a correction above one would let a valve pass more than its certified rate."],
 "The steam correction reaches 1.190866 at the top of its published range. The raw liquid fit does rise above one, which is exactly what the clamp is there to stop reaching an answer."),

q(0, "A liquid call comes back with an area and three further fields about its loop. What are they for?",
 "They say how many passes it took, whether it converged and what residual it stopped on, so an unfinished answer cannot be read as a finished one.",
 ["They say how many passes it took, how far the area moved on the last pass and what the error bar on the area is.",
  "They say how many passes it took, whether the correction was clamped and whether the case is inside the certified envelope.",
  "They say how many passes it took, whether the area is above the smallest listed orifice and which letter it selected."],
 "An iterative answer is right, wrong, or unfinished, and the third state is the one that ships by accident. The residual is a statement about the loop rather than an error bar on the valve."),

q(3, "Which figure below was found by walking the engine until its behaviour changed, rather than by arranging a call around it?",
 "The outlet fraction of 0.300000000000 above which the chart Kb warning fires.",
 ["The atmospheric constant of 14.700000000000 psia that every relieving pressure in the tier is built with.",
  "The liquid Reynolds constant of 2800.000000000000 that sits inside the Reynolds relation itself.",
  "The leading constant of 38.000000000000 in the liquid area equation."],
 "The other three are leading constants, recovered by arranging a call in which every other factor is one. An edge has no such arrangement, so it is bracketed and then narrowed until the behaviour turns over."),

q(1, "Which correction below makes a required area LARGER when it sits below one?",
 "All three of Kv on the liquid route, KN on the steam route and KSH on the steam route.",
 ["Only Kv on the liquid route, since the other two multiply the area instead.",
  "Only KN on the steam route, since it is the one correction that is allowed below one.",
  "Only KSH on the steam route, since a typed factor enters the equation the other way round."],
 "A correction below one divides into the area on each of those three routes. Kv is clamped so it never rises above one, KN sits below one between its threshold and its crossing, and a superheated KSH of 0.830000 takes an area from 0.949984 in2 to 1.144559 in2."),

q(0, "Between the Napier threshold and the exported crossing, a relief case gets a bigger valve because a pressure rose. Why does the engine say so rather than leave it to be found?",
 "Because a valve growing as a pressure rises is behaviour a user would otherwise read as a fault.",
 ["Because the correction in that interval is outside the range the published fit covers.",
  "Because the area in that interval is computed from the threshold rather than from the stated pressure.",
  "Because the two published boundaries are pinned as behaviour rather than derived."],
 "The engine notice states that the correction is below one across the interval, that the area is therefore larger, and that it steps at one boundary and returns through one at the other. The fit inside the interval is checked against the standard own SI statement."),

q(2, "The viscosity correction is clamped at one. What is that clamp protecting against?",
 "A correction for viscous drag adding capacity to a valve, which is what the raw fit does as it asymptotes to 1.006542523506.",
 ["A correction dividing by a number near zero, which is what the raw fit does at the low Reynolds end.",
  "A published case landing above the range the three coefficients were fitted in and going unnoticed.",
  "A Reynolds number computed from an area that the same correction is still moving between passes."],
 "The raw fit is exported so the asymptote stays inspectable, and the clamp is a stated convention of this engine rather than something derived. At the low Reynolds end the correction is small rather than large."),

q(0, "What is the whole meaning of choked, read off a required area column?",
 "The area is set by the upstream condition, so it is identical across every outlet fraction below the critical ratio.",
 ["The area is set by the outlet condition, so it moves smoothly with that pressure until the critical ratio is reached.",
  "The area is the largest figure the case can demand of a valve, so every subcritical answer on the sweep sits below it.",
  "The area is computed from a different leading constant, so the two branches cannot be compared."],
 "The subcritical areas sit ABOVE the choked one on this case, running from 2.224962 in2 upwards. The two forms do carry different leading constants, but that is not what the flatness says."),

q(1, "The crossing is probed at 0.551207 and 0.551209 rather than at 0.500000 and 0.600000. Why?",
 "So the two probes sit either side of the measured critical ratio and the size of the step is visible rather than asserted.",
 ["So the two probes sit inside the interval where the chart Kb warning is already firing on both rows.",
  "So the two probes avoid the outlet fractions the published gas cases already occupy.",
  "So the two probes land on the two areas the published set prints for the subcritical branch."],
 "Probes chosen a millionth either side make the branch change visible without a change of anything else. The published subcritical rows sit at quite different conditions again."),

q(2, "A gas case at an outlet fraction of 0.400000 carries a warning and its required area is 2.223779 in2, the same as at 0.100000. What is the warning about?",
 "The chart Kb a balanced bellows valve needs above a measured outlet fraction of 0.300000.",
 ["The branch being about to turn over, since 0.400000 is approaching the critical ratio.",
  "The typed Kb having been ignored, since the outlet fraction has passed the measured edge.",
  "The required area having stopped moving, which the engine flags as a possible input error."],
 "The area is flat across the whole choked range whether a warning fires or not, so the warning and the flatness are answers to different questions. The ignored Kb notice belongs to the subcritical branch."),

q(0, "One gas case is run at allowances of 10.000000 and 25.000000 percent, giving 2.223779 in2 and 1.964194 in2. What decides which of those answers is the right one?",
 "The contingency being sized for, since the allowance is part of choosing the case and the engine takes whatever percentage it is handed.",
 ["The branch, since a choked case is customarily allowed the larger of the two accumulations.",
  "The certified coefficient, since a valve certified at one allowance cannot be sized at another.",
  "The orifice ladder, since the allowance that lands furthest from a rung is the one to take."],
 "Those are two different questions with one answer each rather than two answers to one question. A fire case is customarily allowed more accumulation than a process case, and the engine takes the percentage without comment."),

q(0, "What is a published case a demonstration of?",
 "That this implementation and the published one agree at one set of inputs.",
 ["That the answer this implementation returns at that set of inputs is a correct one.",
  "That every behaviour on the route has been reached by at least one row.",
  "That the constants inside the equation have each been checked separately."],
 "It is a narrower claim than correctness and a more useful one. The interesting question about any published set is always which behaviours it leaves unvisited."),

q(1, "Which single published gas row can detect a coefficient that multiplies where it should divide?",
 "The one at a Kd of 0.900000, a Kb of 0.880000 and a Kc of 0.900000.",
 ["The one at the lowest relieving pressure, where a coefficient error is largest in proportion.",
  "The pair of subcritical rows, since only there do all three coefficients enter the same form.",
  "Any of the five, since a coefficient of 1.000000 still divides or multiplies an area that is not one."],
 "One divided by one and one multiplied by one are the same number, so a case at default coefficients cannot tell the two arrangements apart. Four of the five rows sit at the measured defaults."),

q(2, "Which published block puts a row where a fit term that is worth almost nothing elsewhere carries most of the sum?",
 "The liquid block, at a Reynolds number of 92.428866.",
 ["The steam block, at a relieving pressure of 1550.000000 psia.",
  "The gas block, at an outlet pressure of 400.000000 psia.",
  "The gas block, at coefficients away from the engine defaults."],
 "Without a case down there the steepest term of the viscosity fit would never be exercised by any published row. The steam row at 1550.000000 psia is valuable for a different reason, which is the interval where the correction is below one."),

q(2, "On an active steam row the published correction reads 0.998366 and the returned one 0.998342. What is that difference?",
 "One published fit evaluated twice, which is why the digest prints both columns side by side.",
 ["A tolerance that the validation suite allows itself on a fit it cannot derive independently.",
  "The step that the correction takes at its published threshold, caught between the two evaluations.",
  "The superheat factor on that row, which the published answer applies and the re-run of it does not."],
 "A tolerance is a property of a check rather than of two numbers, and the superheat factor on that row is 1.000000 on both sides. The row sits inside the interval where the correction is below one."),

q(0, "A published set is described as agreeing with the engine to better than two parts in a thousand. Where does that figure come from?",
 "A relative difference column the digest computes between the published answer and the re-run answer.",
 ["A tolerance the validation suite declares before any case is run against it.",
  "The precision the digest prints each quantity at, which sets the smallest difference visible.",
  "The residual the loop stopped on, which bounds how far the re-run answer can be from the published one."],
 "It is one of the very few two figure relationships in this course that a lesson may quote, because the digest works it out rather than a reader forming it. A residual belongs to an iteration and is a statement about the loop."),

# --- units, pressures and the traps -----------------------------------------

q(1, "A gauge pressure is fed to the gas route where an absolute one was wanted. What does the engine do?",
 "It returns a perfectly finite area that is wrong by whatever the conversion was.",
 ["It refuses, because every pressure argument is validated against its declared range.",
  "It converts the figure, because the route knows which datum its own argument carries.",
  "It returns an area with a warning, because the outlet fraction lands outside its usual band."],
 "No guard anywhere in the module catches a unit. The error is about one atmosphere, which is small enough to read as a rounding difference and large enough to matter."),

q(2, "Which of the three sizing routes in this tier never needs the atmospheric constant?",
 "The liquid route, which works on a difference of two gauge pressures.",
 ["The steam route, which works from a stated relieving pressure directly.",
  "The gas route, which works on an outlet fraction rather than on a pressure.",
  "None of them, since every relieving pressure in the tier is built with it."],
 "A difference of two gauge pressures is the same difference in absolute, so the datum never enters. The steam route needs its relieving pressure in psia, and the gas route needs both of its pressures absolute before a fraction can be formed."),

q(3, "A reading is reported to four decimals where the engine returned 2.223779 in2. What is wrong with that?",
 "It is quoted at a precision this course does not declare for an area, which is six decimals.",
 ["It is quoted at a precision this course reserves for a measured constant, which is twelve decimals.",
  "It is quoted at the precision of a flow, which is correct only for a load in lb/hr or gpm.",
  "Nothing, since a required area is compared against a published table carrying three decimals."],
 "Areas, pressures, dimensionless ratios and the gas coefficient print to six decimals, flows and duties to four, and measured constants to twelve. Rounding a reading shorter than the declared precision turns a correct answer into a wrong one."),

q(0, "Which set of units does this tier speak?",
 "Gas and steam loads in lb/hr, liquid loads in gpm, pressures in psia except where a row says psig, temperatures in degR and areas in in2.",
 ["Gas and steam loads in lb/hr, liquid loads in gpm, pressures in psig throughout, temperatures in degF and areas in in2.",
  "Gas and steam loads in lb/hr, liquid loads in acfs, pressures in psia except where a row says psig, temperatures in degR and areas in ft2.",
  "All three loads in lb/hr, pressures in psia except where a row says psig, temperatures in degR and areas in in2."],
 "The gauge cases are the liquid route and every stated set pressure. A degF temperature fed where degR is wanted produces a finite and badly wrong area, and no guard catches it."),

# --- the thesis and the shape of the tier -----------------------------------

q(1, "State the thesis this whole course rests on.",
 "Every number the engine returns is the size that one chosen case demands, and the engine never chooses the case.",
 ["Every number the engine returns has been checked against a published case, so the sizing it produces can be trusted.",
  "Every number the engine returns is either computed or typed, so a reader can always say which.",
  "Every number the engine returns is exact for the inputs given, so the answers cannot disagree."],
 "Hand it a load and it will tell you what area passes that load, and it will never tell you that the load was the wrong one. The computed against typed reading is the skill this tier builds on top of that thesis."),

q(2, "Which route computes the load it sizes for, and which tier takes it apart?",
 "The fire case, at the Professional tier.",
 ["The gas and vapour route, at the Professional tier.",
  "The blowdown march, at the Expert tier.",
  "The liquid route, at the Associate tier."],
 "It computes the load from a geometry, a drainage answer and an environment factor that the caller states. The blowdown march empties a vessel rather than sizing a valve for a load."),

q(1, "What is the one shape every column of the three stream summary shares?",
 "A stated load and conditions, a relieving pressure, one computed factor, one typed factor, a stated coefficient, an area, a letter and a margin.",
 ["A stated load and conditions, a relieving pressure, two computed factors, a stated coefficient, an area and a letter.",
  "A stated load and conditions, a relieving pressure, one computed factor, one typed factor, an area, a letter and a governing case.",
  "A stated load, a set pressure, an outlet pressure, a branch, one computed factor, an area and a letter."],
 "Nothing in the tier ranks one of the three against another, because they protect three different pieces of equipment. Choosing between scenarios happens within one protected item."),

q(3, "A candidate reports a branch as 0.551208 rather than as a word. What has gone wrong?",
 "A branch is a regime the engine reports, and 0.551208 is the critical ratio that decides it.",
 ["Nothing, since the critical ratio and the branch are two renderings of one answer.",
  "A branch is reported as an outlet fraction, so the figure should have been 0.104258.",
  "A branch is reported as a factor, so the figure quoted should have been the F2 that the case returned."],
 "Report the branch as a word and the correction as the figure returned. Where a reading is a ratio, say what it is a ratio of, because this module carries several and they are not interchangeable."),

q(1, "Seven exports in this module return a bare number. How does one of them refuse?",
 "By returning NaN, since a bare number has no room for an `error` string beside it.",
 ["By returning zero, which a caller is expected to test for before using the figure.",
  "By returning null, which is the same absence that an inviscid Reynolds field carries.",
  "By throwing, which is why a caller has to wrap those seven in a guard of their own."],
 "The twelve object routes are the ones that can carry an `error` string. Nothing in this module throws, and the null is what an inviscid liquid call returns in place of a Reynolds number."),

q(0, "Which subject does this course hand back to another course by name?",
 "The flare setback and its allowable radiant intensities, which belong to the separation course.",
 ["The knockout drum length, which belongs to the gas processing course.",
  "The viscosity correction on a liquid valve, which belongs to the line sizing course.",
  "The critical pressure ratio on a gas valve, which belongs to the gas lift course."],
 "Gas lift owns critical flow through an injection port, which is the same nozzle relation solved for a throughput rather than for an area. The drum length is sized in this engine at the Professional tier."),

q(3, "A learner asks which of two relief cases on a train is the governing one. What does this tier answer?",
 "Nothing, because choosing between scenarios happens within one protected item and this engine never chooses a case.",
 ["The one with the larger required area, since the governing case on any train is the one that demands the most valve.",
  "The one with the larger relief load, once both loads are converted into the same unit.",
  "The one whose margin is smallest, since that case is the closest to needing a larger orifice."],
 "Two cases on different equipment cannot be ranked at all, and the loads are not even in the same units. A larger required area within one protected item is a different question from a comparison across a train."),

q(2, "Of everything this tier teaches, what would a reader have to go and read a standard to check?",
 "Kb, Kw, KSH and the fourteen published orifice areas.",
 ["Kb, Kw, KSH and the three coefficients of the viscosity fit.",
  "The two Napier boundaries, the coefficient C and the fourteen published orifice areas.",
  "Kd, Kc, the critical pressure ratio and the fourteen published orifice areas."],
 "Those four are the typed set: three chart or table factors and one published table of areas. The viscosity fit is held for literature as well, but nothing in the tier types it as an input, and the coefficient C and the critical ratio are closed forms."),

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/beginner/fc5b_exam.json', label='fc5b_exam', expect_n=42)
finish()
