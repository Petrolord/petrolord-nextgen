import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H5 qra, Expert tier, module 05 "What the Engine Does Not Know".
# Digest sections drawn on: 32 (what the engine does not know, exposure caps,
# the rounded published example), and the shared sections 1 (what it declines
# to compute), 4 (the consequence seam), 9 (what the ignition table rests on),
# 11 (Appendix 6.B), 19 (no published F-N example), 22 (the R2P2 point),
# 24 (what the Fd fractions rest on), and section 34.

q(2,
 "A reviewer asks for an aversion weighted risk integral beside the F-N curve. What does the engine offer, and what does the analyst do instead?",
 "No aversion weighted integral, since no source it read defines one; the analyst reports the expected value sum of f times N and the F-N curve, and argues aversion in words.",
 ["An aversion weighted integral with an exponent of 2, the risk averse value the Dutch line carries, applied to every scenario of the curve in turn.",
  "An aversion weighted integral with an exponent the caller states, since the engine takes every such weighting as an input like any other.",
  "No integral of any kind, the expected value sum of f times N included, because no published worked F-N example was available to test one."],
 "The digest says the engine has no aversion weighted risk integral because no source it read defines one, and it implements the expected value sum of f times N instead. The alpha of 2 is the slope of a criterion line, which is no weighting of the curve, and the engine takes no weighting input at all. The expected value sum is computed and reported with the curve."),

q(0,
 "An analyst wants the single R2P2 societal point extended into a line so the whole F-N curve can be compared with it. What does the engine provide?",
 "The point alone, N = 50 at 0.000200000000 per year with no slope, because R2P2 defers extrapolation to a reference the engine did not read; a line is the analyst's own.",
 ["A line of slope minus one through the point, as the preset `r2p2-para-136`, because that is the common practice R2P2 prints beside its point and every analyst is expected to apply to the whole curve.",
  "A line of slope minus two through the point, borrowed from the Dutch line, because the engine carries one risk averse slope for every criterion.",
  "The point extended flat to every N of 50 or more, since R2P2 asks for 50 or more deaths and a flat line captures exactly that reading."],
 "The preset `r2p2-para-136` is one point, N = 50 at 0.000200000000 per year, and the engine gives it no slope because R2P2 defers extrapolation. A slope of minus one is common practice, but R2P2 does not print it and no preset carries it: an analyst supplies it as their own criterion, C = 0.01 and alpha = 1. The Dutch slope is another criterion's, and no flat extension exists."),

q(3,
 "An analyst supplies the slope minus one line through the R2P2 point as their own criterion. What does the engine's basis then say about its source?",
 "\"criterion as given\", and the JISIKE off-site curve against it is BELOW, worst ratio 0.014910 at N = 3.000000.",
 ["\"UK HSE R2P2 (2001) para 136\", and the JISIKE curve against it EXCEEDS, worst ratio 18.000000 at N = 300.000000.",
  "\"TNO Purple Book CPR 18E (1999) Figure 6.8\", and the JISIKE curve against it is BELOW, worst ratio 0.001000 at N = 50.000000.",
  "\"criterion as given\", and the JISIKE curve TOUCHES it, the corner at N = 10 sitting on the line within the snap of 1e-9."],
 "A line the analyst supplies carries the source \"criterion as given\", and the JISIKE off-site curve against C = 0.01, alpha = 1 is BELOW with a worst ratio of 0.014910 at N = 3.000000. 18.000000 at N = 300 is the worst ratio against the Dutch line, 0.001000 at N = 50 is the ratio to the R2P2 point itself, and the JISIKE curve has no corner at N = 10."),

q(1,
 "The Dutch line `vrom-establishments` cites Bevi. What does the engine not know about it, and how should an analyst treat the line?",
 "Bevi was repealed on 1 January 2024 and its successor was not read, so the analyst treats the line as a historical published comparison.",
 ["Bevi's successor keeps the same three points, so the analyst treats the line as the current Dutch legal limit for establishments across the Netherlands.",
  "Bevi's successor moved the line to a slope of minus one, so the analyst should switch to a caller line with C = 0.01 at once for every establishment.",
  "Bevi exists only as an unpublished draft, so the analyst treats the three points as the engine's own estimate of the Dutch values."],
 "The digest says Bevi was repealed on 1 January 2024 and the engine did not read its successor, so the analyst treats the Dutch line as a historical published comparison. Nothing is known about the successor's points or slope, so neither claim about it can be made. The three Bevi points are published and lie on the Purple Book line."),

q(2,
 "Which of these is a published, reproduced check on the societal side of the engine, where the F-N curve itself has no published worked example?",
 "The criterion side: the three Bevi points lie on the Purple Book line, and the R2P2 point is printed in its source.",
 ["The F-N curve of the JISIKE off-site scenarios, reproduced from a CCPS worked example that prints the same five scenarios.",
  "The area identity, 0.000336000000 per year, which reproduces a worked societal calculation printed in the Purple Book.",
  "The Fd fractions indoors and outdoors, reproduced against the numeric example that the Purple Book prints beside Table 5.3."],
 "The digest says what IS published and reproduced is the criterion side: the Bevi points on the line and the printed R2P2 point. The CCPS and HSE worked examples were not available. The area identity is a self-consistency check with no published source behind it, and the Purple Book prints no numeric example for the Fd fractions."),

q(0,
 "No published worked F-N example was available to the engine. How is its F-N curve checked, and what may an ALARP note therefore claim?",
 "By self-consistency only, a brute force count at every corner, a second route on a grid of N and the area identity, so the note never cites an F-N figure as published-verified.",
 ["By comparison with the Purple Book's own worked societal risk figure, so the note may cite each corner of the curve as published-verified in the societal section of the ALARP note.",
  "By comparison with the Dutch line, since a curve that lies on the Bevi points is by that fact reproduced against a published source.",
  "It is not checked at all, so the note must leave the societal picture out and report the individual risk of the most exposed person only."],
 "The digest lists the three self-consistency checks and says the course never presents an F-N figure as a published reproduction. The Purple Book prints no worked F-N curve. A criterion line is a comparison, which verifies nothing about the curve's own arithmetic. The curve is checked, so the societal picture belongs in the note, with its checks stated."),

q(3,
 "What does the area identity check on the JISIKE off-site curve, and what does it return?",
 "That F at each corner times the width of its step sums to the expected fatalities per year: 0.000336000000 on both sides.",
 ["That F at each corner times its own N of deaths sums to the PLL of the JISIKE crew: 0.002420000000 on both sides of the identity.",
  "That the frequency of scenarios with no deaths equals the area under the curve: 0.000050000000 on both sides of it.",
  "That the curve's highest corner equals the sum of every scenario frequency in the set: 0.000049700000 on both sides of the identity."],
 "The area under the step curve, F at each corner times the width of its step, is 0.000336000000 per year, equal to the expected fatalities per year, which is the off-site PLL. 0.002420000000 is the crew PLL, a different set of scenarios. The no-death frequency is kept out of the curve, and 0.000049700000 is F(3), which leaves out the scenario that reaches no one."),

q(1,
 "Purple Book Table 4.5 cells, the 0.6 and 0.4 vapour cloud split and the Fd factors are all in the engine. What does the engine not know about them?",
 "A check against a second reading: each is one transcription with no published example to test it, so the analyst states the values used and their source.",
 ["Their units: each is exported without one, so the analyst converts them to per year before a lookup is quoted in an ALARP note beside the stated frequencies of the tree.",
  "Their price year: each was set in 1999 and must be uprated by the benefit growth rate before it is used in a gross disproportion test of any measure the analyst weighs.",
  "Their owner: each belongs to the facilities courses, so the analyst must fetch the values from there and never state them."],
 "The digest says each is a single transcription with no published example to test it, and the analyst states the values used and their source; a capstone states every ignition probability and the split for the same reason. They are probabilities and fractions, which carry no per year unit and no price year. They are part of this engine, stated by the analyst, and no other course supplies them."),

q(2,
 "The engine's own validation planted a wrong clothing factor in both the engine and its oracle, and the suite stayed green. What does the course conclude about the Fd fractions?",
 "That it teaches the rules and never grades a number that passes through them, because a check shared by engine and oracle cannot catch a shared transcription.",
 ["That the clothing factor is wrong today, so every Fd figure the engine returns must be corrected by hand before it enters an ALARP note as the input for a population cell.",
  "That the fractions should be applied to individual risk as a vulnerability factor, where a wrong value matters less than in societal risk.",
  "That the suite is broken, so the analyst runs the oracle alone and quotes its fractions in place of the engine's figures."],
 "The digest records the planted factor as the reason the course never grades a number that passes through the Fd rules: a wrong value shared by the engine and its oracle agrees with itself. It says nothing is wrong with today's factor. The fractions are for societal risk and are not a vulnerability factor, and the oracle shares the same transcription, so it is no escape."),

q(0,
 "Where does every probability of death this engine uses come from, and what does the engine do about it?",
 "From consequence modelling in the consequence course; the engine takes Pd as a stated input and the analyst records where it came from.",
 ["From the Purple Book Table 5.3 fractions, which the engine converts to a probability of death at every place on the plot plan that the analyst is given.",
  "From the event tree, whose leaf probabilities are each a probability of death once the tree has been multiplied through from its root to the leaf.",
  "From the risk matrix, which this course never scores, but whose category the engine converts to a probability of death."],
 "The digest says a probability of death is the output of consequence modelling in the consequence course, and this course takes it as a stated input and records its source. Table 5.3 gives fractions of a population indoors. A leaf probability is the probability of a path, never of death. The risk matrix belongs to the risk and change course, and no matrix category becomes a Pd here."),

q(3,
 "A full assessment needs a grid of points, a wind rose and a population map. What does the engine do with them?",
 "Nothing: the caller supplies each scenario frequency and Pd, so the analyst does that bookkeeping and records it.",
 ["It builds the grid from the plot plan and reads the wind rose from a stated weather file, returning an LSIR at every grid point.",
  "It spreads each scenario's frequency across twelve wind sectors, the Appendix 6.B default, before it sums the LSIR at a place.",
  "It takes the population map as an input and returns the Fd fractions per cell as a vulnerability factor for individual risk."],
 "The digest says the engine does no grid or wind rose bookkeeping; the caller supplies each scenario frequency and probability of death. The 12 wind sectors of Appendix 6.B are that worked example's stated inputs, which are no engine default. The Fd fractions are for societal risk, never a vulnerability factor for individual risk."),

q(1,
 "The Purple Book limits exposure to a fire to 20 s and to a toxic cloud to 30 minutes. What does the engine do when an exposure runs longer?",
 "It applies the cap without refusing and states the time it used, so a toxic exposure of 60 minutes is computed at 30, which is consequence modelling on the other side of the seam.",
 ["It refuses the call, naming the exposure field, because an exposure beyond the Purple Book's limit is outside the range the engine accepts.",
  "It computes at the full exposure and adds a warning, leaving the analyst to decide whether the Purple Book cap should be applied by hand.",
  "It scales the probability of death down in proportion, so a toxic exposure of 60 minutes counts at half its stated probability of death."],
 "The digest says the engine applies the cap without refusing and states the time used: a toxic exposure of 60 minutes is computed at 30, and the toxic case belongs to the consequence side of the seam. No refusal is raised, the cap is applied by the engine itself, and nothing rescales a stated probability of death."),

q(2,
 "Purple Book Appendix 6.B prints Pd = 0.381, where the engine's whole chain gives 0.380294556093. What explains the gap, and what should a reproduction do?",
 "The source is internally rounded, since 0.381 follows only from its rounded ECW of 86.2 m; a reproduction that needs a rounded intermediate says which one.",
 ["The engine's chain is wrong in its third decimal, so a reproduction quotes the printed 0.381 and discards the engine's figure for the step and every later step built on it.",
  "The source used R = 360.555 m where the engine uses 361 m, so a reproduction replaces the engine's distance with the printed one.",
  "The gap comes from the probit, a stated input that belongs to the consequence course, so the gap is left unexplained in the note."],
 "The digest says the whole chain gives 0.380294556093, which rounds to 0.380, and the printed 0.381 follows only from the rounded ECW of 86.2; both routes reproduce the printed contribution of 7e-9 to two significant figures. The gap describes the SOURCE. It is the source that uses R = 361 m for a point at 360.555 m, and the gap is fully explained."),

q(3,
 "Which of these does the engine refuse to do, by its own design?",
 "Re-grade anything the consequence course or the facilities courses own: it exports none of their functions, and the jest suite asserts so.",
 ["Return an LSIR for a place whose probability of death is zero for some scenario, which it refuses as an incomplete input set of scenarios at that place.",
  "Compare an F-N curve with the single R2P2 point, since a point without a slope cannot be compared with a step curve at any corner of it.",
  "Accept a VPF above the 2003 checklist figure, since any value higher than 1336800 lies outside the HSE illustrative range."],
 "The digest lists re-grading nothing the consequence or facilities courses own among what the engine does not do: it exports none of their functions. A zero Pd simply contributes zero, the curve is compared with the R2P2 point at N = 50, and a VPF is refused only when it is missing or not above 0."),

q(0,
 "An analyst wants to apply the Purple Book indoor fractions as a vulnerability factor on the EREMOR operator's individual risk. What does the engine's position say?",
 "No source the engine read gives a vulnerability factor for individual risk; the indoor fractions are for societal risk, so the default is 1 and the basis says what was supplied.",
 ["The indoor fractions are the Purple Book's vulnerability factor, day 0.93 and night 0.99, and the engine applies them by default to every place.",
  "The engine refuses any vulnerability factor below 1, since only the Purple Book fractions may lower an individual risk and they are not allowed here.",
  "The engine computes a vulnerability factor from the operator's hours, so the analyst supplies no factor and the fractions are never used."],
 "The digest says no source the engine read gives a vulnerability factor for individual risk, the Purple Book indoor and outdoor fractions are for societal risk, the default is 1, and the basis records what was supplied. The fractions are no default factor. A factor from 0 to 1 is accepted when the analyst supplies one, and the engine derives nothing from hours beyond the occupancy."),

emit(Q, '/root/hse-wip-qra/banks/h5a_m05.json', expect_n=15)
finish()
