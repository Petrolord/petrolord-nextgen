import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Expert m05, Infeasible, Refused and Skipped. Digest section 25.

q(2, "The Apapa pool is asked for the 10 ppm gasoline template and the engine returns the status infeasible. What recipe comes back with it?",
 "None; the whole answer is the verdict and its message.",
 ["The closest recipe it could find, with the limits it breaks marked so the planner can see them.",
  "The 50 ppm recipe, returned unchanged as a fallback cargo for the same 8000 bbl batch.",
  "A recipe with the sulfur maximum relaxed back to 50."],
 "The engine returns the status infeasible and \"REFUSED: No recipe from these components can meet every specification. Relax a limit, or bring in a component that can.\" Moving the sulfur maximum back to 50 alone still reads infeasible.")

q(0, "Each limit of the 10 ppm template is moved back to its 50 ppm value in turn, the rest kept at 10 ppm. What does the table show?",
 "All four rows stay infeasible: no single limit moved back rescues the pool.",
 ["Moving the RON minimum back to 91 rescues the pool on its own.",
  "Moving the sulfur maximum back to 50 makes the pool optimal.",
  "Moving the RVP maximum back to 9 rescues it, since RVP binds at the Apapa optimum."],
 "The RON, MON, sulfur and RVP rows each still read infeasible. No single limit moved back rescues the pool.")

q(3, "On the 50 ppm template, one limit at a time is tightened to its 10 ppm value. Which single tightenings still leave the Apapa pool a recipe?",
 "The MON minimum of 85 and the RVP maximum of 8.5.",
 ["The RON minimum of 95 and the sulfur maximum of 10, because neither of those two rows binds at the 50 ppm optimum today.",
  "None of the four: each single tightening reads infeasible.",
  "All four: each single tightening still returns optimal."],
 "Tightened one at a time, the RON minimum and the sulfur maximum are each infeasible, and MON and RVP return optimal.")

q(1, "The Apapa pool is posed with a RON minimum of 99. What does the engine return?",
 "The status infeasible, with the message that no recipe from these components can meet every specification.",
 ["An optimal recipe with RON at 94.5010, since RON gives away 3.5010 at the Apapa optimum.",
  "An optimal recipe with the RON specification listed as skipped, with its reason.",
  "The refusal for a missing cost, since no component's cost can buy a RON of 99."],
 "A RON minimum of 99 sits in the digest's infeasible table beside the 10 ppm template, with the same message. An infeasible blend is a real answer: the specifications cannot be met by the components available.")

q(2, "Butane's maximum is typed as 0 because the tank is empty. What does the engine return?",
 "Optimal, with Butane at 0.0000 bbl, a cost of 710560.2149 $, and Sulfur alone binding.",
 ["Optimal with Butane at 438.1863 bbl, since a zero maximum is read as no limit and the specifications decide.",
  "A refusal, because a maximum of zero leaves the component with no room and must be removed from the pool by hand.",
  "The Apapa recipe unchanged, Butane at 400.0000 bbl and 698701.5605 $."],
 "A typed 0 is none. The recipe comes back with Butane at 0.0000 bbl, and the binding list is Sulfur alone.")

q(3, "Butane's maximum is left blank, and the recipe takes 438.1863 bbl of it at 698569.3341 $. How has the engine read the blank?",
 "As no limit: a maximum left blank sets no bound on Butane's volume.",
 ["As the 400 bbl tank, the default the engine keeps for a blank field.",
  "As a maximum of 0, the reading the engine gives a typed zero.",
  "As a default cap the engine sets on any component left blank."],
 "A maximum left blank is no limit. The engine returns optimal with Butane at 438.1863 bbl and binding Sulfur, RVP; a typed 0 is none, and gives Butane at 0.0000 bbl.")

q(0, "optimiseBlend is called with no components at all. What does it return?",
 "REFUSED: No components to blend.",
 ["The status infeasible, with no recipe.",
  "Optimal, with an empty recipe.",
  "The kernel throws on a malformed row."],
 "The refusals table prints the request with no components beside \"REFUSED: No components to blend.\"")

q(2, "The Apapa pool is solved with Isomerate's cost field empty. What comes back from the optimizer?",
 "REFUSED: No cost for Isomerate. A least-cost recipe needs a price on every component; remove the component or give it one.",
 ["An optimal recipe with Isomerate at a cost of zero, taking as much as the specifications and its tank allow, because a blank cost is read as a free component and the least-cost recipe leans on it as far as the rows let it go.",
  "An optimal recipe with Isomerate left out entirely, since a component without a cost is dropped from the pool silently and the other three components are blended to the same 8000 bbl target instead.",
  "An infeasible status, since phase one cannot build an objective row for a component whose cost is missing, and so the pool is reported as unable to meet every specification at the 8000 bbl batch."],
 "A blank cost is refused. The cost column is the objective, and a least-cost recipe needs a price on every component.")

q(1, "A blank maximum is solved and a blank cost is refused. What makes the two blanks different?",
 "A blank maximum is no limit; a least-cost recipe needs a price on each component.",
 ["A blank maximum is read as zero, while a blank cost is read as a free component.",
  "The kernel checks costs itself and throws, while the optimizer checks maximums.",
  "A maximum can never be typed, so every maximum is blank and the engine sets it."],
 "A maximum left blank is no limit: Butane left blank solves at 438.1863 bbl. A blank cost is refused, with Isomerate named.")

q(3, "A target volume of 0 returns \"REFUSED: The target volume must be greater than zero.\" Which reading of that answer holds?",
 "It is one of the inputs optimiseBlend refuses, each in its own words.",
 ["It is the optimizer's word for unbounded, used when the batch row has no upper limit.",
  "It is an optimal empty recipe, since a batch of zero costs nothing to blend.",
  "It is the kernel throwing on a malformed row with the wrong coefficient count."],
 "It sits among what optimiseBlend refuses, each in its own words. The infeasible pools also print a REFUSED message, and they carry the status infeasible beside it.")

q(0, "Isomerate carries no sulfur figure. The engine returns optimal at 695245.0644 $ with Sulfur skipped. What does that total cost?",
 "A recipe meeting every specification except the skipped sulfur row.",
 ["The Apapa cargo on the full 50 ppm template, since the missing figure is read as zero sulfur on Isomerate and the rest is unchanged.",
  "The full Apapa cargo on the 50 ppm template.",
  "Sulfur's price of relief, read over the batch."],
 "The reason reads \"Not every component carries this property, so the specification was not applied.\" The Apapa cargo with sulfur applied costs 698701.5605 $.")

q(1, "FCC gasoline has no SG and no API, yet every component still carries a sulfur figure. Why is the Sulfur specification skipped?",
 "Sulfur blends on mass, and a mass row needs every density.",
 ["FCC gasoline's sulfur of 110 ppm is above the limit, and a component above the limit cannot be carried in a sulfur row at all.",
  "The engine skips any specification that would bind at the optimum when a component's data is incomplete in any column.",
  "Without an SG the engine cannot form the batch row, so every specification on that component is skipped with it."],
 "On the mass basis w_i is SG x sulfur and d_i is SG. The engine says so: \"This property blends on mass and not every component has a density (sg or API), so the specification was not applied.\"")

q(3, "With Sulfur skipped because Isomerate carries no sulfur figure, what does the recipe report as achieved for Sulfur, and for Density?",
 "Sulfur is not formed and returns no value; Density, which blends on volume, is applied at 0.7536 kg/l.",
 ["Sulfur at 0.0000 ppm, the missing figure read as none, and Density at 0.7536 kg/l.",
  "Sulfur at 50.0000 and Density at 0.7547, as in the full Apapa recipe.",
  "Neither is reported, since a skipped row blanks every achieved value."],
 "The skipped specification is not formed: the engine returns no value. Density blends on volume, is applied, and achieves 0.7536 kg/l on that recipe.")

q(2, "Reformate is typed with a minimum of 3000 and a maximum of 2000. The kernel alone would call such a problem infeasible. What does the optimizer return?",
 "REFUSED: Reformate has a minimum above its maximum.",
 ["The status infeasible from phase one, with the specifications listed so the planner can hunt for the conflicting pair.",
  "A recipe with Reformate at 2000 bbl, its maximum.",
  "A recipe with Reformate at 3000 bbl, its minimum."],
 "optimiseBlend refuses the crossed bounds and names the component. The kernel alone returns infeasible for a lower bound of 5 above an upper bound of 3.")

q(1, "Isomerate is given a floor of 1200 bbl. The recipe takes 1200.0000 bbl at 698909.5490 $, Butane falls to 339.9340 bbl, and sulfur relief is 537.5403 $ per ppm. Why does that relief differ from the 551.8026 at the Apapa optimum?",
 "The floor forces a different recipe, with Butane inside its availability.",
 ["The floor adds its own cost to every row, and the relief price subtracts it once per barrel of the floor.",
  "Sulfur no longer binds once Isomerate is forced in, so its row is priced at the floor instead of the limit.",
  "Butane rises to its availability of 400, which lowers the sulfur price."],
 "A minimum forces barrels into the recipe. At that optimum butane is 339.9340 bbl against its availability of 400: inside its availability. Sulfur and RVP still bind.")

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/advanced/cra_m05.json', label='cra_m05', expect_n=15)
finish()
