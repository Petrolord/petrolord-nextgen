import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Associate m05, fitting the parameters.
# Sources: the course digest's fitting section (the basis, the grid and its tie
# rule, the compass search, the EKENE-P1 table of the three fits, the stop rule,
# holding the fit, atBounds, the flat SSE surface of holt-linear-exact), the
# stated defaults, the warnings paragraph and the convention table's reason for
# the fit. Every figure is printed there.

q(1, "A caller supplies phi for the damped method and supplies nothing for alpha or beta. How are the three parameters treated?",
 "It holds phi fixed, lists it in `fixed`, and fits alpha and beta.",
 ["All three are fitted, the given phi serving only as the search's start.",
  "The call is refused, since the damped method fits all three or none of them.",
  "alpha and beta held at 0.5 and 0.2."],
 "A parameter given is held fixed and a parameter left out is fitted, so a caller can give some and leave others; the result lists the given ones in `fixed`. On EKENE-P1, phi 0.5 given fits alpha and beta around it. No start is taken from a given value, nothing is refused, and 0.5 and 0.2 are values a lesson chose to give, never a default."),

q(3, "What does the fit minimise when a parameter is left free?",
 "The SSE of the scored one-step errors.",
 ["The error of the step 12 forecast measured against the last month's rate.",
  "The number of fitted parameters that end on a bound and appear in `atBounds`.",
  "A sum of absolute one-step errors, so that large misses count no more than small ones."],
 "The basis states the target: \"free parameters minimise the one-step SSE over the scored errors\". The h-step forecasts play no part in the fit, `atBounds` is a report the fit makes afterwards, and squaring makes large errors count much more than small ones."),

q(0, "How many coarse grid points does the fit score for holt, both parameters free?",
 "121, eleven alpha values by eleven beta values.",
 ["11, since beta is searched only once alpha has been fixed by the grid.",
  "605, the full grid of alpha, beta and the five values of phi together.",
  "38, the same number of SSE evaluations the ses fit takes on EKENE-P1."],
 "alpha and beta each run 0 to 1 by 0.1, eleven values, and holt scores every pair: 121 points. The grid of 605 adds the five phi values and is the damped method's. 11 points is simple smoothing's grid, and 38 is the total of the ses fit's grid and compass search on EKENE-P1."),

q(2, "Two coarse grid points score the same SSE. Which one does the fit keep?",
 "The earlier one, in the order alpha outermost, then beta, then phi.",
 ["The later one, which replaces the best on any SSE that is equal or lower.",
  "The one lying nearer the centre of the box, where alpha and beta are 0.5.",
  "Both, with the search starting from their average."],
 "The basis says \"ties keep the earlier point\", and the grid is scored alpha outermost, then beta, then phi, so the loop order is part of the rule. A later point replaces the best only when its SSE is lower by the stated relative margin. No point is preferred for its place in the box, and the search starts from one point."),

q(1, "When does a later grid point replace the best one found so far?",
 "When its SSE is below the best's SSE x (1 - 1.00e-12).",
 ["Any equal or lower SSE replaces it.",
  "Only if its SSE is lower by at least 0.05 of the best's value, a margin the grid states.",
  "If its SSE is lower and its alpha higher."],
 "The tie rule is relative: a later point replaces the best only when its SSE is below best x (1 - 1.00e-12), the stated `GRID_TIE_REL`, so an equal SSE keeps the earlier point. 0.05 is the compass search's first step, a fraction of each range, and alpha plays no part in the rule."),

q(3, "What does the compass search do after a whole sweep that improves nothing, while its step is still above 2^-30 of the range?",
 "Halves its step and sweeps again.",
 ["Stops at once, since no trial in that sweep lowered the SSE at all.",
  "Doubles its step, so that it can climb out of a small local dip.",
  "Goes back to the grid and restarts from the second best grid point."],
 "The search tries the step added and taken away on each free parameter in turn, moves to the best trial that lowers the SSE, and halves the step after a sweep that improves nothing. It stops only when a sweep at a step of at most 2^-30 of the range improves nothing, so a step still above that is halved. It never doubles its step or returns to the grid."),

q(0, "How large is the compass search's first step?",
 "0.05 of each parameter's range, half the grid spacing.",
 ["0.1, the grid spacing.",
  "2^-30 of the range, the finest step, widened as the search proceeds.",
  "0.8, the lowest fitted phi."],
 "The first step is 0.05 of each parameter's range, the stated `PS_STEP`, half the grid's spacing of 0.1, so the search begins by looking between grid points. 2^-30 of the range is where the step ends, and the step only ever halves. 0.8 is the lower bound of a fitted phi."),

q(2, "Fitting ses on EKENE-P1, the grid starts at alpha 1 and the search makes 0 moves in 38 SSE evaluations. Why no moves?",
 "Alpha 1 is on the edge of the box, and a lower alpha raises the SSE.",
 ["A round grid value of alpha, such as 1, makes the engine skip the search.",
  "The SSE surface is flat there, so every alpha scores 49562.030000 alike.",
  "The compass search runs only for holt and damped."],
 "From alpha 1 the search tries a higher alpha, which the box does not allow, and a lower one, which raises the SSE, so no trial improves: it halves its step until it stops. Of the 38 evaluations, 11 are the grid and the rest are the search's trials, so the search did run. 49562.030000 is the SSE at alpha 1 alone; lower alphas score more."),

q(1, "Why is the final SSE of a fit never above the grid SSE?",
 "The search moves only to a trial that lowers the SSE.",
 ["A rescoring of the grid keeps the lower SSE.",
  "Its search works on a finer grid that contains every coarse grid point.",
  "The final SSE is rounded down to 0.1."],
 "The compass search moves to the best trial only when that trial lowers the SSE, so it only ever moves downhill from the grid's best point: the final SSE is at most the grid SSE on every method. No rescoring, finer grid or rounding takes place."),

q(0, "What does `atBounds` list in a fit record?",
 "Every fitted parameter that ended exactly on an edge of its box.",
 ["Every parameter the caller gave, which the engine holds fixed through the fit.",
  "Every parameter lying within 0.05 of an edge, the first compass step.",
  "Each grid choice the search left unmoved."],
 "`atBounds` lists every fitted parameter that ended exactly on a bound: alpha and beta at 0 or 1, phi at 0.8 or 0.98. Given parameters are listed in `fixed` and never in `atBounds`. The list asks for exactly the bound, and whether the search moved a parameter is a separate record."),

q(3, "Holt is fitted on the exact line 10, 12, 14, 16, 18, 20, 22, 24, where every alpha and beta give SSE 0. What does the fit return?",
 "alpha 0 and beta 0, the grid's first point, after 0 moves: the parameters are not identified.",
 ["A refusal naming `y`, because an SSE that is already 0 leaves nothing to minimise.",
  "alpha 1 and beta 1, both on their upper bounds, as a naive trend would take them.",
  "alpha 0.5 and beta 0.5, the centre of the box, which the fit picks to break the tie."],
 "Golden `holt-linear-exact` scores SSE 0 at every point, so the grid tie keeps its first point, alpha 0 and beta 0, and the search makes 0 moves. Any pair would fit as well: the parameters are not identified. The forecasts 26.000000, 28.000000, 30.000000 continue the line. The engine refuses nothing here and breaks ties by order, never by position."),

q(2, "When does the compass search stop with `converged` true?",
 "When a sweep at a step of at most 2^-30 of each range improves nothing.",
 ["When the SSE falls below 1.00e-12, the stated relative tie band of the grid.",
  "As soon as 200000 SSE evaluations have been spent on the one fit.",
  "After exactly 26 halvings, whatever size the step has reached."],
 "The stop rule is on the step: when a sweep at a step of at most 2^-30 of each range improves nothing, the search stops with `converged` true and `finalStep` records the fraction. 1.00e-12 is the grid's tie band. Reaching 200000 evaluations first stops the search with `converged` false. The fits on EKENE-P1 each made 26 halvings because that is how many take 0.05 below 2^-30."),

q(1, "What happens if a search reaches 200000 SSE evaluations before its step rule is met?",
 "It stops with `converged` false and a warning, and still returns its parameters.",
 ["The call is refused by naming the parameter the search was working on.",
  "It restarts from the grid with a finer step and carries on searching.",
  "It returns no forecast at all, only the grid's best point and its SSE."],
 "`PS_MAX_EVALS` is 200000; a fit that reaches it first stops with `converged` false and `warnings`, and the parameters and forecasts still come back. A warning is attached to a result, so there is no refusal and no restart. No fit in this course reaches that cap."),

q(0, "Every parameter of a holt fit is given. What does the fit record hold?",
 "`optimiser` is null, and the basis reads \"all parameters given: no estimation\".",
 ["An `optimiser` record of 0 moves, beside the basis \"all parameters given: no estimation\".",
  "The grid's 121 SSE values, kept for comparison with the given pair.",
  "`converged` false, since no search ran to meet the stop rule."],
 "With nothing left to fit, no search runs, the optimiser record is null and the basis reads \"all parameters given: no estimation\". There is no optimiser record of moves to read and no `converged`, true or false, and no grid is scored."),

q(3, "Why does the engine fit by a grid and a compass search?",
 "It is deterministic: the same series gives the same parameters on any machine.",
 ["Maximum likelihood with a gradient optimiser is what it runs, as other tools do.",
  "Only this search finds the least SSE anywhere in the box, which no other method can.",
  "Random starts are drawn, and averaging many fits steadies the parameters."],
 "The course states the choice: least one-step SSE, a grid then a compass search in a stated box, chosen because it is deterministic, the same series giving the same parameters. Maximum likelihood with a gradient optimiser is the common alternative. `converged` true is a statement about the search, never a promise of the least SSE anywhere in the box, and the search uses no random start."),

emit(Q, '/root/dai-wip-forecastml/banks/d4b_m05.json', expect_n=15)
finish()
