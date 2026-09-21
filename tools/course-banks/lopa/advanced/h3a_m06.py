import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H3 lopa, Expert tier, module 06 "Judgement, End to End".
# Digest sections drawn on: 31 (budgets, stretched intervals, the redesign
# signals and the verification note) and 26 (the states the longest interval
# search returns, read here as something a note has to record).

q(3,
 "A function must achieve 0.007407407407. Its transmitters take 0.000369505528 and its logic solver 0.000136440000, both on a one year test. What is left for the valves?",
 "0.006901461880",
 ["0.007407407407, because the requirement applies to each subsystem in its own right",
  "0.001792971954, which is what the whole function achieves on a one year test",
  "0.000369505528, which is only the transmitters' share of the sum on a one year test"],
 "A function is a series sum, so the requirement is a budget and the remainder after the two parts is 0.006901461880. The requirement applies to the sum and never to each part alone. 0.001792971954 is the achieved figure of the whole function on a one year test, and 0.000369505528 is the transmitters' share alone, which is one of the two figures the remainder is found by taking away."),

q(1,
 "That remainder of 0.006901461880 is handed to the longest interval search as the valve target. What comes back?",
 "35393.040486 hours, which is 4.040301 years, with the state FOUND.",
 ["35393.040486 hours, which is 4.040301 years, with the state CAPPED_AT_LIFETIME, because the search has run out at the end of the equipment life and reports the cap.",
  "46473.426980 hours, which is 5.305186 years, with the state FOUND.",
  "No interval and the state UNACHIEVABLE, because the remainder is smaller than the requirement."],
 "The engine returns 35393.040486 hours, 4.040301 years, with the state FOUND. 46473.426980 hours belongs to the same valves against a target of 0.01, which is a looser figure than the remainder. A remainder smaller than the whole requirement is what a budget always produces and says nothing about achievability, and nothing here is capped."),

q(0,
 "Why does the state FOUND matter as much as the interval itself when a budget is turned into a schedule?",
 "It says a crossing exists, so the budget is reachable by scheduling alone and no new hardware is needed to meet the requirement on those valves.",
 ["It says the search converged, which every successful search reports.",
  "It says the interval is inside the equipment lifetime and can be scheduled.",
  "It says the target was reached exactly, which the interval column also shows."],
 "FOUND means the PFDavg rises to meet the target at a finite interval, so scheduling alone closes the budget. A state that only reported convergence would be worth nothing, since the engine returns a state on every call. Being inside the lifetime is what CAPPED_AT_LIFETIME reports on, and every FOUND row reaches its target exactly, which is a property of the search and gives no separate reason to record the state."),

q(2,
 "The teaching function is re-verified with every proof test interval stretched to 3.5 years. What does it achieve, and what is the verdict?",
 "0.008382016506, which is still SIL 2 and misses the requirement of 0.007407407407.",
 ["0.006819960176, which is still SIL 2 and meets the requirement, since the band has not moved at all between the two stretches and the function is therefore unaffected.",
  "0.010066196546, which has dropped to SIL 1 and misses the requirement of 0.007407407407.",
  "0.008382016506, which has dropped to SIL 1 and misses the requirement."],
 "At 3.5 years the function achieves 0.008382016506, which is above the required 0.007407407407, so it misses while it is still SIL 2. 0.006819960176 is the three year row and it meets. 0.010066196546 is the four year row. The drop to SIL 1 happens only at four years, which is the point of the row."),

q(3,
 "The same function is stretched to four years. What is its achieved risk reduction factor and its band there?",
 "99.342388, in the SIL 1 band",
 ["119.303034 and SIL 2, which is what the function reports at a stretch of 3.5 years",
  "146.628422 and SIL 2, which is what the function reports at a stretch of three years",
  "246.170895 and SIL 2, which is what the function reports at a stretch of two years"],
 "At four years the function achieves 0.010066196546, a risk reduction factor of 99.342388, and SIL 1. 119.303034, 146.628422 and 246.170895 belong to the 3.5 year, three year and two year rows, all of which are still SIL 2."),

q(3,
 "At a stretch of three years, what does the teaching function report?",
 "146.628422, and it still meets the requirement",
 ["119.303034, and it no longer meets the requirement at that stretch",
  "99.342388, and it no longer meets the requirement at that stretch",
  "246.170895, and it still meets the requirement at that stretch"],
 "Three years is the last stretch that still meets the tolerable frequency, with a PFDavg of 0.006819960176 and a risk reduction factor of 146.628422. The figures 119.303034 and 99.342388 go with the stretches of 3.5 and four years, where the function misses, and 246.170895 goes with two years."),

q(1,
 "Read the band column of that stretch table alone. What would a reader miss?",
 "That the function stopped meeting its requirement between three years and 3.5 years, while four successive rows all read SIL 2.",
 ["That the function stopped meeting its requirement between 3.5 years and four years, which is where the band column changes and where the verdict column changes with it.",
  "Nothing, because the band and the verdict change on the same row of the table.",
  "That the achieved risk reduction factor falls faster than the interval grows."],
 "The verdict turns false at 3.5 years while the band is still SIL 2, and the band falls to SIL 1 only at four years, so the two columns change on different rows. A SIL band is a decade wide and the required PFDavg is one number inside it, so a SIL that holds is no evidence that the requirement holds."),

q(0,
 "Which three signals say that more of the same hardware will not close the gap?",
 "A required risk reduction factor beyond SIL 3, a target below a coverage floor, and a common cause term that dominates every architecture on offer.",
 ["A warning on the interval, a refusal on a field, and a band that has dropped.",
  "A long proof test interval, a high MTTR, and a low proof test coverage.",
  "A required PFDavg inside the band, an achieved figure above it, and a missed target."],
 "Those three are the standing redesign signals, and the engine reports each as a state, a floor or a dominant term. A warning and a refusal are about a call and an input. A long interval, a high restoration time and a low coverage are inputs that can often be changed. A miss on its own is the ordinary case that scheduling or a better subsystem usually answers."),

q(2,
 "On a redesign signal, what does the engine supply and what does it leave to the analyst?",
 "It reports the state, the floor or the dominant term, and the decision to redesign is the analyst's.",
 ["It reports the state and also recommends the redesign, weighing the cost of new hardware against the cost of tightening the tolerable frequency on the row it was given.",
  "It reports nothing until the analyst asks for a redesign check, which is a separate call.",
  "It reports the state and refuses any further call on that subsystem until an input changes."],
 "The engine reports each signal as a state, a floor or a dominant term, and the decision is the analyst's. It does not weigh the cost of a redesign against a tighter tolerable frequency and has no opinion on whether a layer outside the instrumented system is available. There is no redesign call and no lock on further calls."),

q(0,
 "Which set of items belongs in a verification note written to this course's standard?",
 "The scenario and its tolerable frequency, the required PFDavg as well as the band, every subsystem with its inputs and the source of each rate, the summed figure and its risk reduction factor, each interval with its state, any warning returned, and what the engine did not check.",
 ["The achieved band, the verdict, and the date of the calculation.",
  "The achieved PFDavg and the required PFDavg, with nothing else needed.",
  "The inputs and the outputs of every engine call made, in the order they were made."],
 "The digest lists the shape of the note item by item, and every one of them is there so a reader who disagrees can recompute the answer. A band and a verdict cannot be audited, a pair of figures leaves out the rates and the states, and a log of calls in order records the work without making the verification argument."),

q(1,
 "Why does the note carry the required PFDavg as well as the band it falls in?",
 "The band is a decade wide and the required figure is one number inside it, so writing only the bands would leave out the comparison that settles the verdict.",
 ["The band is used for the verdict and the required figure for the interval search, so the note needs one of them for each of the two decisions that have to be recorded in it.",
  "The band is what the engine returns and the required figure is what the analyst assumes, so both have to be recorded to keep the two apart.",
  "The two are always the same band, so recording both is a check on the arithmetic."],
 "A band covers a decade of PFDavg and the required figure is one number inside it, so a function whose band matches the required band can still miss. The verdict comes from comparing the two figures, the engine returns the required figure as well as the band, and the two bands matching is exactly the trap this tier exists to prevent."),

q(2,
 "Why does a reported proof test interval carry its state?",
 "FOUND, UNACHIEVABLE, INTERVAL_INDEPENDENT and CAPPED_AT_LIFETIME are very different findings arriving in the same field, and only the state tells them apart.",
 ["The state records how long the bisection took to converge, which a reviewer needs in order to judge how much numerical confidence to place in the interval that was reported.",
  "The state records which architecture the subsystem used, which the interval alone does not reveal.",
  "The state records whether the interval was rounded to hours or to years."],
 "An interval with no state beside it is ambiguous: a crossing, a target the design cannot reach, an answer the interval never entered, and a bound set by the lifetime all look alike as a number. The state carries none of the convergence history, the architecture or the rounding, all of which are recorded elsewhere in the note."),

q(1,
 "The note has a heading for what the engine did not check. What belongs under it?",
 "The architectural constraint, the demand mode assumed low, and the fact that every failure rate is an input somebody has to justify.",
 ["The subsystems that were not on the critical path of the function, and any interval that a planner has not yet agreed to with the maintenance team on the plant.",
  "The golden cases that did not reproduce and the rows the oracle disagreed with.",
  "Any figure the engine returned with a warning attached to it."],
 "The limits the engine states are the architectural constraint, the high demand mode and the absence of failure rate data, together with the judgement of independence. A warning belongs under the caveats heading, since a warned figure IS a figure the engine checked. Every golden case reproduces, and the subsystems are all in the sum."),

q(2,
 "Across the whole stretch from one year to four years, what happens to the achieved risk reduction factor of the teaching function?",
 "It falls from 557.733208 to 99.342388.",
 ["It falls from 557.733208 to 119.303034, which is the lowest value the stretch table reaches before the function leaves the band it started in.",
  "It falls from 246.170895 to 99.342388, since the one year row is the reference and the two year row is where the stretch is first recorded.",
  "It rises from 99.342388 to 557.733208."],
 "The one year row reads 557.733208 and the four year row 99.342388. 119.303034 is the 3.5 year row and 246.170895 the two year row, so neither is an end of the stretch. The risk reduction factor is one over PFDavg, so it falls as the interval grows."),

q(0,
 "What exactly was stretched in the table that carries those five rows?",
 "Every proof test interval in the function at once, which is what a deferred turnaround does to a plant and is a harsher change than moving one subsystem alone.",
 ["The valve interval alone, with the other two subsystems held at one year.",
  "The lifetime of every subsystem, with the proof test intervals held at one year.",
  "The interval of whichever subsystem carried the largest share of the sum."],
 "The digest states that the function is re-verified with every proof test interval stretched together. Holding two subsystems still, moving a lifetime or moving only the largest share would each be a different and narrower question, with a different answer, which is why the note records which question was asked."),

emit(Q, '/root/hse-wip-lopa/banks/h3a_m06.json', expect_n=15)
finish()
