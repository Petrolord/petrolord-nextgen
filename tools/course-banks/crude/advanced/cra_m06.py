import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Expert m06, The Expert Reading. Digest sections 26 and 27, read with 21 to 25.

# target rank 1
q(3, "In the optimizer's default pool, what is relief worth on its two binding specifications?",
 "Sulfur 55.0114 $ per ppm and RVP 578.9052 $ per psi.",
 ["Sulfur 551.8026 $ per ppm and RVP 4448.9659 $ per psi.",
  "Sulfur 55.0114 $ per ppm and RVP 4448.9659 $ per psi.",
  "Sulfur -0.0720 $ per ppm and RVP -0.2674 $ per psi."],
 "The default pool's price table prints 55.0114 $ per ppm on the Sulfur maximum and 578.9052 $ per psi on the RVP maximum, with the rowPrices -0.0720 and -0.2674 beside them. 551.8026 and 4448.9659 are the Apapa cargo's figures.")
q(0, "When the productBlending oracle checks a recipe, where do the achieved properties it compares come from?",
 "From physical inventories, with its rows from physical mass balances.",
 ["From propertyOfBlend, called on the engine's own recipe.",
  "From the engine's LP rows, read back at the optimum.",
  "From the Refutas index inverted by bisection, for all of them."],
 "The oracle_productblending.py row reads: rows built from physical mass balances, solved by exact rational vertex enumeration; properties from physical inventories.")
q(1, "The optimizer's default pool blends Reformate 516.0028, FCC gasoline 414.8506, Isomerate 0.0000 and Butane 69.1466 bbl. What does it report about its bounds?",
 "Components at their availability: nothing. At zero: Isomerate.",
 ["Butane at its availability, as in the Apapa cargo.",
  "Every component at a bound, either its availability or zero.",
  "Isomerate is skipped, since it takes no barrels."],
 "The default pool prints \"Components at their availability: nothing. At zero: Isomerate.\" With no availability limit pressing, its marginal barrel and unit cost both print 86.1228.")
q(2, "What does the Product Blending Optimizer show with nothing typed?",
 "Its default gasoline pool, 1000 bbl, on the 50 ppm template.",
 ["The Apapa PMS pool, 8000 bbl, on the 50 ppm template.",
  "Its default gasoline pool, 1000 bbl, on the 10 ppm template.",
  "The Apapa AGO pool, 6000 bbl, on the 50 ppm diesel template."],
 "With nothing typed the optimizer shows its default gasoline pool, 1000 bbl, the 50 ppm template. The Apapa PMS cargo is 8000 bbl and the AGO cargo 6000 bbl.")
q(0, "The default pool's price table prints rowPrice -0.0720 on the Sulfur maximum and -0.2674 on the RVP maximum. How are those figures read?",
 "As the rows' duals, which are not prices per ppm or per psi.",
 ["As the dollars saved per ppm and per psi, turned negative because the default pool is a maximisation of margin.",
  "As the binding tolerances the kernel allows on each row.",
  "As the giveaway on the sulfur and RVP rows, in ppm and psi."],
 "The prices of relief are 55.0114 $ per ppm and 578.9052 $ per psi. rowPrice is kept beside each.")

# target rank 3
q(1, "A planner poses an LP whose coefficients run into millions, far from the barrel-scale cargoes of the two apps. Given held item L4, how should the result be quoted?",
 "With the limit beside it: outside the kernel's shown range.",
 ["As wrong, since the course shows that the kernel fails on any problem scaled in millions and so the recipe cannot be used.",
  "As any other result, because the kernel's tolerances rescale with the largest coefficient in each row of the problem.",
  "As provisional until the kernel is re-run with its tolerances tightened by the planner to the scale of the problem."],
 "L4: the LP kernel uses absolute tolerances on its pivots and on phase one. They are right for the barrel-scale problems the two apps pose; a problem scaled in millions is outside what it is shown to handle.")

# target rank 2
q(3, "Held item C12 prints the Obigbo export blend at 7.4743 cSt with the Refutas index on mass and 7.3107 cSt on volume. What does the course do with the two figures?",
 "States what the engine does and the limit, and leaves the basis to a course and owner decision.",
 ["Takes 7.3107 cSt as correct, since ASTM D7152 blends on volume and so the engine's mass figure is only a screen.",
  "Takes 7.4743 cSt as correct, since the engine's basis is the one every other property in the course is blended on.",
  "Averages the two figures and quotes the mean as the blend."],
 "The engine blends on mass fraction and names it, \"Refutas index on mass fraction\". The two disagree, both are printed, and no basis is keyed as right.")

# target rank 0
q(0, "Of the three held items, which one concerns the LP kernel, and what does the engine do there?",
 "L4: absolute tolerances on its pivots and on phase one.",
 ["C12: absolute tolerances on the pivots.",
  "C13: a binding test of 1e-7 times the limit on each row.",
  "L4: the Refutas index taken on mass fraction in the AGO rows."],
 "SECTION 27 lists three held items: L4, the LP kernel's absolute tolerances on its pivots and on phase one; C12, the Refutas index on mass fraction; C13, Watson K taken at the blend's T50.")
q(2, "oracle_lp.py checks the kernel on 181 problems (124 optimal, 44 infeasible, 13 unbounded) by exact rational vertex enumeration with no simplex at all. What fact from the first module makes that route possible?",
 "The optimum of a linear programme, when there is one, sits at a vertex.",
 ["The kernel's absolute tolerances make every problem exact once its coefficients are written as rational numbers.",
  "Bland's rule, which picks the entering variable and cannot cycle.",
  "Phase one, which drives the artificial variables to zero."],
 "Enumerating vertices finds the optimum because the optimum, when there is one, is found at a vertex. The oracle does it in exact rationals with no simplex at all.")

# target rank 3
q(1, "Why do 44 infeasible and 13 unbounded problems sit among the LP oracle's golden cases?",
 "Infeasible and unbounded are answers the kernel returns, like optimal.",
 ["They are problems the kernel cannot solve, kept to show where the tolerances of L4 fail on real cargoes.",
  "They are malformed problems, kept to check that the kernel throws on a row with the wrong coefficient count.",
  "They are the cases that the oracle cannot enumerate and so hands back to the simplex kernel for its answer."],
 "The oracle_lp.py row counts 124 optimal, 44 infeasible and 13 unbounded. Infeasible and unbounded are answers; a malformed problem is not, and there the kernel throws.")
q(3, "oracle_productblending.py holds the blending engine on 9 pools. How does it compute a price of relief?",
 "By exact re-solve with the limit moved.",
 ["By reading rowPrice from the engine and multiplying it by the scale the engine printed.",
  "By the same scaled derivative the engine uses, restated in Python.",
  "It does not price relief; it checks recipes and properties only."],
 "The oracle_productblending.py row reads: relief by exact re-solve with the limit moved. Each oracle is written from the rules and not from the JavaScript.")
q(0, "The engines state RVP_INDEX_EXPONENT 1.25 and BINDING_TOLERANCE 1e-7 in their modules. What does that give a reader?",
 "A value read from the module itself, as the engines state it.",
 ["A regulation, since each constant is the limit the regulation in force sets.",
  "A graded value the capstone checks to four decimals.",
  "A default price per unit of relief for every binding row."],
 "The digest lists the constants the engines state, read from the modules: CII_BANDS.STABLE 0.7, CII_BANDS.UNSTABLE 0.9, RVP_INDEX_EXPONENT 1.25 and BINDING_TOLERANCE 1e-7. SPEC_TEMPLATES are starting points; the regulation in force governs.")
q(2, "oracle_lp.py holds the kernel to 181 problems. How does it compute shadow prices?",
 "As exact one-sided derivatives, by re-solve.",
 ["By rescaling the kernel's duals.",
  "By a whole-unit re-solve, averaged.",
  "It checks statuses and objectives only."],
 "The oracle_lp.py row reads: exact rational vertex enumeration with no simplex at all; shadow prices as exact one-sided derivatives by re-solve.")
q(1, "Reading the Apapa pool and the default pool side by side, which reading holds in both?",
 "The same two specifications bind, Sulfur and RVP.",
 ["The marginal and average barrels print the same figure.",
  "Butane sits at its availability in both pools.",
  "Isomerate enters the recipe at zero in both pools."],
 "Both pools bind on Sulfur and RVP. The marginal barrel differs from the average at Apapa by 0.1731 and matches it in the default pool, where nothing sits at its availability.")

# target rank 2
q(0, "The digest counts the refusals it prints: 17. What stands behind that count?",
 "Each was asserted against the engine before it was printed.",
 ["Each was written by the course from the engine's rules, so the wording is the course's own paraphrase.",
  "Each is a status the kernel returns from phase one.",
  "Each is graded against the capstone's own figures."],
 "The digest closes: \"Refusals printed in this digest, each asserted against the engine before it was printed: 17.\"")

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/advanced/cra_m06.json', label='cra_m06', expect_n=15)
finish()
