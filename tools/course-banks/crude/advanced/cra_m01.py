import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Expert m01, What a Linear Programme Is. Digest section 19.

q(2, "Two rows, x + y <= 2 and x + y >= 3, sit under the objective minimise x + y. Which answer comes back from solveLP?",
 "infeasible, since no point meets both rows",
 ["optimal, objective 3.0000, where x + y >= 3 holds",
  "unbounded, since x + y has no floor",
  "it throws, as the rows contradict each other"],
 "Infeasible and unbounded are answers, and the course prints this problem's status as infeasible. The kernel throws only on a malformed problem.")

q(0, "In the kernel's own terms, what is the 400 bbl of Butane the Apapa terminal holds?",
 "A bound on one variable, the upper limit on Butane's volume.",
 ["A row, because it limits how the volumes of the four components behave jointly.",
  "A coefficient of the objective, since the tank volume enters the cost of the recipe.",
  "The batch row's right-hand side, the barrels to deliver."],
 "The bounds are passed apart from the rows: the kernel shifts every lower bound to the origin, and it gives a bound no shadow price. A tank limit belongs to one component, so it is a bound on that one variable, and a component held by it reports as a component at its availability.")

q(3, "A planner asks why the Sulfur maximum cannot be entered as a bound on the kernel. What is the reason?",
 "A specification constrains a mixture of volumes, and a bound belongs to one volume alone.",
 ["A bound can only hold a whole number, and the sulfur limit is carried as a ratio of two sums over the components.",
  "The kernel accepts bounds of zero only, so every tank limit and specification has to be written as a row.",
  "Bounds are minimised with the objective, so a sulfur bound would be driven to zero."],
 "A bound belongs to one variable. A specification limits a blended property of all the volumes together, so it is a row, and the bounds stay with each component's floor and availability.")

q(1, "The four corners of the textbook region print objectives 0.0000, 20.0000, 12.0000 and 21.0000. Where does the course say the optimum of a linear programme is found?",
 "At a vertex of the feasible region, here x 3.0000, y 1.5000.",
 ["Inside the region, where no constraint holds and the kernel can move freely.",
  "Midway along the edge joining the corners at 20.0000 and 21.0000.",
  "At the origin, where both bounds hold exactly."],
 "The optimum of a linear programme, when there is one, is found at a vertex of the feasible region. The kernel's optimum for the textbook case is x 3.0000, y 1.5000, objective 21.0000, one of the four corners.")

q(0, "What does solveLP promise its caller about the status of every problem it is posed?",
 "A status of optimal, infeasible or unbounded, and the caller is told which.",
 ["A recipe, with an infeasible problem answered by the nearest point that fits.",
  "An optimum, or an error thrown whenever the rows cannot all be met.",
  "A status of optimal or failed, with the reason left to the caller."],
 "Its status is always one of optimal, infeasible or unbounded, and the caller is told which. Infeasible and unbounded are answers. A malformed problem is not an answer, and there the kernel throws.")

q(3, "The Apapa pool blends four components. By the course's definition of a vertex, how many constraints and bounds must hold exactly at its optimum?",
 "At least four, with the batch row counted among them.",
 ["Exactly two, one for each binding specification the recipe presses against.",
  "At least five, one for each specification in the 50 ppm gasoline template.",
  "At least eight, a lower and an upper bound for each of the four components."],
 "A vertex is a point where at least as many constraints and bounds hold exactly as there are variables. The Apapa pool blends four components, so four volumes, and the batch row sum(v_i) = target is an equation met by every recipe.")

q(1, "The kernel is asked to minimise x with a lower bound of 5 above an upper bound of 3. What does it return?",
 "The status infeasible, because no value of x fits both of its bounds.",
 ["The status optimal, with x placed on its upper bound of 3.",
  "The status unbounded, since nothing limits how small x may go.",
  "It throws, as for a row with the wrong number of coefficients."],
 "No row is needed for this verdict. A single variable whose lower bound sits above its upper bound has no value that fits, so the problem has no feasible point, and infeasible is the answer.")

q(2, "Maximise 3x + 2y with x + y <= 2 and y >= 2. Both rows press on y. What does the kernel return?",
 "optimal, objective 4.0000",
 ["infeasible, because y >= 2 uses the whole allowance of the first row",
  "unbounded, because the second row sets no upper limit on y",
  "optimal, objective 21.0000, the textbook case's value"],
 "A region that is very small is still a region. The kernel finds a feasible point and a best objective on it, 4.0000.")

q(3, "A row is written with 1 coefficient on a problem with two variables, and the kernel stops with \"Row 0 has 1 coefficients, expected 2\". How is that result to be read?",
 "As a fault in the question, with no status attached to it at all.",
 ["As infeasible, since the short row contradicts the rest.",
  "As unbounded, since one variable is free of that row.",
  "As optimal on the one variable the short row names."],
 "A problem that is written wrongly is neither optimal, infeasible nor unbounded. The kernel throws, which is a fault in the question, and it refuses to answer it with a status.")

q(0, "In two-phase simplex, which phase finds that the rows contradict, and so returns infeasible?",
 "Phase one, when it cannot drive every artificial variable to zero.",
 ["Phase two, when no neighbouring vertex improves the objective any further.",
  "Phase two, when the pivot count passes a limit and stops.",
  "Neither: the kernel compares each row with the bounds first."],
 "Driving the artificial variables to zero is how phase one finds a point meeting every row. When that fails, the rows contradict, and infeasible is the verdict.")

q(2, "The textbook result prints iterations 2. What does that count?",
 "The pivots of phase one and phase two together.",
 ["The rows that hold exactly at the optimum, which in the textbook case number two.",
  "The phases the method ran, one to find a point and one to reach the optimum.",
  "The corners the kernel visited on its way, the origin and then the optimum."],
 "iterations counts the pivots the kernel made, phase one and phase two together, and the textbook case took 2.")

q(1, "Why does the kernel choose its entering variable by Bland's rule on blending problems in particular?",
 "Blends are degenerate constantly, and Bland's rule cannot cycle.",
 ["Blends have more variables than rows, and Bland's rule adds the missing rows.",
  "Bland's rule finds a start that a batch equation cannot give.",
  "Blending costs are positive, and Bland's rule needs them to be."],
 "Specifications bind exactly at the optimum, so blending problems are degenerate constantly. Bland's rule picks the entering variable, and it cannot cycle.")

q(3, "Maximise x with x - y <= 1, y unbounded above. What status does the kernel return?",
 "unbounded, since x can grow with y and the objective has no ceiling",
 ["infeasible, since a variable with no upper bound has no vertex",
  "optimal where x - y reaches 1 and the row holds exactly",
  "none: it throws on a variable with no upper bound"],
 "The region is not empty and x can grow with y without end, so the objective has no ceiling. Unbounded is an answer the kernel reports as plainly as optimal and infeasible.")

q(0, "The LP kernel uses absolute tolerances on its pivots and on phase one. What does the course state about where those tolerances are shown to hold?",
 "Right at the barrel scale of the two apps' cargoes; nothing in the course shows them on a problem scaled in millions.",
 ["They are relative to each row's largest coefficient, so every scale is handled alike.",
  "They are tuned for very large problems, and an 8000 bbl cargo falls below their resolution.",
  "They are shown to hold in phase two alone, where the pivots move toward the optimum."],
 "L4 is held and taught as a limit. The course shows the tolerances working at barrel scale and makes no claim for coefficients in the millions.")

q(2, "A blend minimises cost, and the textbook case maximises earnings. What does that difference change about the method?",
 "The same kernel does both: it minimises, or maximises when asked.",
 ["A maximisation is refused, since solveLP only minimises its objective.",
  "A minimisation needs its costs written as rows first.",
  "A maximisation has no shadow prices to report."],
 "solveLP minimises c'x subject to its rows and bounds, or maximises when asked. The textbook case is a maximisation and still carries shadow prices, 0.7500 and 0.5000.")

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/advanced/cra_m01.json', label='cra_m01', expect_n=15)
finish()
