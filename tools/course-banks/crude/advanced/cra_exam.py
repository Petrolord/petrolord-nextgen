import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Expert tier exam, written last. Draws on all six Expert modules,
# digest sections 19 to 27. Two-module questions are marked [2M].

# 1 [2M m01 m06]
q(2, "In the optimizer's default pool Isomerate enters at 0.0000 bbl. In the kernel's terms, what holds exactly for Isomerate there?",
 "Its lower bound of zero on the Isomerate volume.",
 ["Its availability, the upper bound, which the result reports as a tank drawn full.",
  "Its floor of 1200 bbl, the minimum the Isomerate case sets.",
  "No constraint at all, because a component at zero is dropped from the problem."],
 "The default pool reports \"At zero: Isomerate\" and \"Components at their availability: nothing\". A volume on a bound of zero is a bound holding exactly, one of the constraints that can pin a vertex.")
q(0, "At Apapa the sulfur dual is scaled by sum(SG x volume), 6037.3872, while the RVP dual is scaled by the 8000.0000 bbl batch. What decides the difference?",
 "The basis each row declares: d_i is SG on the mass basis and 1 on the index-on-volume basis.",
 ["Whether the row binds: a binding row is scaled by the batch and a slack row by its mass.",
  "The sense of the row: a maximum is scaled by mass and a minimum by the batch.",
  "The template: the 50 ppm gasoline template scales every row by mass except its RVP row."],
 "The scale is sum(d_i v_i), fixed by the declared basis. RVP also needs the index slope at the limit, 2.1651 index points per psi, because its limit sits in the row as an index.")

# 3 [2M m01 m05]
q(3, "Three Apapa requests: a target volume of 0, Reformate with a minimum of 3000 and a maximum of 2000, and the 10 ppm gasoline template. Which one does the course print with the status infeasible?",
 "The 10 ppm gasoline template asked of the Apapa PMS pool.",
 ["The target volume of 0, which comes back infeasible.",
  "The crossed Reformate bounds, which come back infeasible.",
  "All three of them, because each one comes back without a recipe for the cargo."],
 "The course prints the 10 ppm template with the status infeasible and \"REFUSED: No recipe from these components can meet every specification. Relax a limit, or bring in a component that can.\" The other two are among what optimiseBlend refuses, each in its own words: \"REFUSED: The target volume must be greater than zero.\" and \"REFUSED: Reformate has a minimum above its maximum.\"")

# 4 [2M m03 m04]
q(1, "The MON giveaway of 3.4928, priced at a typed 0.4, is worth 11176.9355 $ over the batch. What would lowering the MON minimum below 81 save on the Apapa cargo?",
 "Nothing: the MON minimum's value of relief is 0.0000.",
 ["11176.9355 $, the value of the giveaway the lower limit would recover from the buyer.",
  "3.4928 $ per barrel, the MON giveaway read as a saving on each barrel of the cargo.",
  "551.8026 $ per unit, the same as sulfur relief, as every limit on the cargo is priced alike."],
 "MON does not bind, so relieving it moves nothing. The priced giveaway answers what quality already delivered would fetch; the value of relief answers what moving the limit would save.")

# 5 [2M m04 m05]
q(2, "With Butane's maximum typed as 0 the recipe costs 710560.2149 $ and only Sulfur binds. By the engine's rule, what is the RVP maximum worth in relief in that recipe?",
 "Zero: relieving a limit the blend does not touch saves nothing.",
 ["4448.9659 $ per psi, the Apapa figure, which belongs to the specification in any pool.",
  "More than 4448.9659 $ per psi, now that Butane is gone.",
  "No figure: a recipe with a tank typed as 0 prints no prices."],
 "A non-binding specification has a price of zero. With Butane's maximum typed as 0 the binding list is Sulfur alone, so the RVP maximum is not binding and relieving it saves nothing.")

# 6 [2M m02 m04]
q(0, "RVP_INDEX_EXPONENT is 1.25. Where does it enter the Apapa problem?",
 "In the RVP row's coefficients and the 9 psi limit's index, and so in the slope at the limit.",
 ["In the objective, as a cost per psi added to each component's price per barrel.",
  "In the bounds of the high-RVP components, which it tightens as the exponent rises.",
  "Only in the report, where the achieved RVP is turned back into psi after the solve."],
 "RVPI = RVP^n sets both w_i and the limit's index in the row, and the slope at the limit is RVP_INDEX_EXPONENT x 9^(RVP_INDEX_EXPONENT - 1), which prints 2.1651.")
q(3, "With Butane at its 400 bbl availability the Apapa cargo costs 698701.5605 $. With the maximum left blank it takes 438.1863 bbl and costs 698569.3341 $. What does the pair show about Butane's bound at Apapa?",
 "The bound held exactly: with no limit, the recipe takes more Butane.",
 ["The bound was slack: both recipes bind on Sulfur and RVP whatever Butane's maximum.",
  "A blank maximum is read as a tank of zero, so the second recipe is a different pool.",
  "A blank maximum is rounded to a past availability."],
 "At Apapa the result prints \"Components at their availability: Butane.\" A maximum left blank is no limit, and that recipe takes 438.1863 bbl of Butane at 698569.3341 $, against 400.0000 bbl at 698701.5605 $ with the bound in place.")
q(1, "The Apapa cargo is re-solved with the sulfur maximum tightened to 49 ppm. What does it print?",
 "699253.4861 $, a saving of -551.9256 $.",
 ["698149.8809 $, a saving of 551.6796 $.",
  "695050.1663 $, a saving of 3651.3942 $.",
  "710560.2149 $, with Sulfur alone binding."],
 "The re-solve table prints Sulfur limit 49 at 699253.4861 $, a saving against the optimum of -551.9256 $. 698149.8809 $ is the sulfur limit of 51, 695050.1663 $ the RVP limit of 10, and 710560.2149 $ the recipe with Butane typed as 0.")
q(2, "The RON minimum of 91 blends on volume. In the ratio row sum((w_i - L d_i) v_i), what are w_i and d_i for RON?",
 "w_i is each component's RON and d_i is 1, the weights of the volume basis.",
 ["w_i is SG x each component's RON and d_i is SG, as on the mass basis.",
  "w_i is each component's RON index and d_i is 1, as on an index on volume.",
  "w_i is SG x each RON index and d_i is SG, as on an index on mass."],
 "SPEC_TEMPLATES declares RON on volume, and on the volume basis w_i is the property and d_i is 1. The mass basis and the two index bases carry the other weights in the same table.")

# 10 [2M m02 m05]
q(0, "The AGO recipe's density achieves 0.8450 against the template's 0.82 to 0.845 kg/l. What does the engine report for it?",
 "Giveaway 0.0000, binding true, pressed against the 0.845 maximum.",
 ["Giveaway 0.0000, binding false, as 0.8450 sits inside the range.",
  "Binding true at the 0.82 minimum, the end a range is read from.",
  "Skipped, since density blends on volume and the AGO rows are on mass."],
 "The AGO table prints Density achieved 0.8450, giveaway 0.0000, binding true, and the price rows list it as the Density maximum at 852453.4687 $ per kg/l.")
q(3, "At Apapa both the Density maximum row and the Density minimum row price at 0.0000 per kg/l. Why?",
 "The blend's 0.7547 kg/l sits inside both ends of the range.",
 ["The two rows cancel, as a range is priced as its maximum's dual less its minimum's.",
  "Density is on the volume basis, and the engine prices only the mass and index rows.",
  "No unit value was typed for density, so neither is priced."],
 "Density carries a giveaway of 0.0203 and binds at neither end. A non-binding specification has a price of zero.")

# 12 [2M m04 m06]
q(1, "Apapa's marginal barrel sits 0.1731 $/bbl above its average and the default pool's sits 0.0000 above. Which difference between the two pools accounts for that?",
 "Apapa holds Butane at its availability, and the default pool holds no component at its availability.",
 ["Apapa binds on Sulfur and RVP, and the default pool binds on no specification at all.",
  "Apapa is solved on the 10 ppm template, and the default pool on the 50 ppm template.",
  "Apapa blends 8000 bbl, and the default pool's 1000 bbl is too small for a gap to print."],
 "Both pools are on the 50 ppm template and both bind on Sulfur and RVP. What the course prints differently is availability: Butane at 400.0000 bbl at Apapa, and nothing in the default pool.")

# 13 [2M m04 m06]
q(0, "What does the Apapa PMS recipe take of Isomerate?",
 "784.1881 bbl, a volume fraction of 0.0980.",
 ["784.1881 bbl, a volume fraction of 0.0500.",
  "1200.0000 bbl, the volume on its floor.",
  "1500 bbl, its whole availability."],
 "The recipe prints Isomerate at 784.1881 bbl, a volume fraction of 0.0980, costing 69165.3861 $. 0.0500 is Butane's fraction, 1200.0000 bbl is the Isomerate floor case, and 1500 bbl is Isomerate's availability.")
q(3, "A user types -50 in Butane's maximum, meaning no limit. What does the engine return?",
 "A refusal that names Butane's maximum, asks for a number of zero or more, and says to leave it blank for no limit.",
 ["An optimal recipe with Butane unlimited: a negative maximum is read as the blank the user meant, and it takes 438.1863 bbl.",
  "An optimal recipe with Butane at 0.0000 bbl: a negative maximum is clamped to zero.",
  "The status infeasible: no volume of zero or more can sit below a maximum of -50 in the kernel's bounds."],
 "The engine returns \"REFUSED: Butane maximum must be a number of zero or more. Leave a maximum blank for no limit.\" A maximum left blank is no limit.")
q(2, "The Apapa pool on the 10 ppm template comes back infeasible. By the method's own account, what does that verdict mean?",
 "Phase one could not drive its artificial variables to zero, so no recipe meets every row.",
 ["The kernel stops after a fixed number of iterations and reports infeasible on timeout.",
  "The engine tries each limit of the template in turn and gives up after the fourth.",
  "Phase two visited every vertex and found none as cheap as the 50 ppm recipe."],
 "Phase one finds any point that meets every row by driving artificial variables to zero; if it cannot, the rows contradict and the answer is infeasible. The kernel's status is always one of optimal, infeasible or unbounded.")
q(1, "On the AGO recipe, what sulfur does the engine report as achieved, and on which basis does it blend?",
 "28.1533 ppm, on mass.",
 ["28.1533 ppm, on volume.",
  "50.0000 ppm, on mass.",
  "21.8467 ppm, on mass."],
 "The AGO table prints Sulfur achieved 28.1533 with giveaway 21.8467, binding false, and the diesel template carries Sulfur on mass. 50.0000 is the Apapa PMS sulfur, where the row binds.")
q(3, "How much Kerosene does the AGO recipe take, and at what cost?",
 "1505.9222 bbl, costing 161434.8562 $.",
 ["1505.9222 bbl, costing 53915.9391 $.",
  "624.0271 bbl, costing 161434.8562 $.",
  "2670.0508 bbl, costing 271010.1523 $."],
 "The AGO recipe prints Kerosene at 1505.9222 bbl and 161434.8562 $. 624.0271 bbl and 53915.9391 $ are Hydrotreated LCO's, and 2670.0508 bbl with 271010.1523 $ is Straight-run gasoil.")
q(0, "In the textbook plant a manager can buy one extra hour on either unit. Reading the kernel's duals, which purchase raises earnings more?",
 "An hour on the first unit, whose row prices at 0.7500 against 0.5000 on the second.",
 ["An hour on the second unit, whose row 2 has the smaller right-hand side of 6.",
  "Neither: both rows hold exactly, so an extra hour on either is worth nothing.",
  "Either of them, as the optimum of 21.0000 is shared between the two rows equally."],
 "Both rows hold exactly at x 3.0000, y 1.5000, so both carry a dual. Re-solved with row 1 raised to 25 the objective is 21.7500, a change of 0.7500; with row 2 raised to 7 it is 21.5000, a change of 0.5000.")

# 19 [2M m02 m03]
q(2, "The AGO recipe achieves a flash point of 73.7403 C against a minimum of 55, with a giveaway of 18.7403. What do the template and the giveaway say about it?",
 "It blends linearly on volume, and 18.7403 is the achieved value minus the minimum.",
 ["It blends through the Refutas index on mass, and 18.7403 is the smaller gap of a range.",
  "It binds, as a flash point minimum is a safety limit the engine holds exactly.",
  "It is skipped for lack of a density, and 18.7403 is the gap it leaves."],
 "For a minimum, giveaway is the achieved value minus the limit, and the AGO table prints 18.7403. SPEC_TEMPLATES carries Flash point on volume in the gasoil template.")
q(1, "On the AGO recipe the Cetane number minimum has rowPrice 0.1932 and price 1159.3909 $ per unit, both positive, while the Density maximum's rowPrice x scale and its price carry opposite signs. Why the difference?",
 "A minimum's relief is dCost/dL, and a maximum's is its negative.",
 ["Cetane blends on volume and density on mass, so only density's scale turns the sign.",
  "The engine flips the sign on any binding row it prices above a thousand dollars.",
  "Density does not bind, so its signs need not agree."],
 "Cetane is a minimum: lowering it is the relief, and its dual already reads as a saving. Density is a maximum, and for a maximum the course's rule turns the sign between the dual and the value of relief.")

# 21 [2M m03 m04]
q(3, "On the AGO recipe sulfur gives away 21.8467 ppm. What is sulfur relief worth there, and why?",
 "0.0000 per ppm, because sulfur does not bind.",
 ["551.8026 $ per ppm, the Apapa figure, because the two templates share the 50 ppm limit.",
  "21.8467 $ per ppm, the giveaway read as the value of relief on the same specification.",
  "No figure, because the AGO pool prints a price only for its rows on the volume basis."],
 "The AGO binding list is Cetane number and Density. A specification with giveaway has room to spare, and relieving it saves nothing.")

# 22 [m05]
q(0, "The Apapa 10 ppm refusal ends with advice. Which two ways out does it name?",
 "Relax a limit, or bring in a component that can.",
 ["Relax a limit, or lower the batch until the components on hand can meet it.",
  "Buy more Butane, or drop Isomerate from the pool and solve the recipe again.",
  "Re-solve on the 50 ppm template, or make a smaller cargo from the same tanks."],
 "Both ways out sit in the last sentence of the engine's message. The optimizer chooses neither; the status beside the message is infeasible and no recipe comes back.")

# 23 [2M m03 m05]
q(2, "With an Isomerate floor of 1200 bbl, Butane falls to 339.9340 bbl. Would the result's line \"Components at their availability\" name Butane?",
 "No: 339.9340 bbl is inside its 400 bbl availability.",
 ["Yes: Butane was at its availability at Apapa, and a floor elsewhere leaves that bound alone.",
  "Yes: a floor on one component forces every other component onto one of its bounds.",
  "Yes: the line names both Butane and Isomerate."],
 "At that optimum butane is 339.9340 bbl against its availability of 400: inside its availability. Isomerate sits on its 1200 bbl floor, a lower bound; an availability is an upper bound.")

# 24 [m03]
q(1, "At the textbook corner x 0.0000, y 3.0000, what does the kernel print?",
 "objective 12.0000, status optimal",
 ["objective 20.0000, status optimal",
  "objective 12.0000, status infeasible",
  "objective 21.0000, status optimal"],
 "The corner table prints x 0.0000, y 3.0000 at 12.0000 with the status optimal. 20.0000 is the corner x 4.0000, y 0.0000, and 21.0000 the optimum at x 3.0000, y 1.5000.")
q(3, "In SPEC_TEMPLATES, how does the Fuel oil, 380 cSt template declare Viscosity at 50 C?",
 "index, on mass, with a maximum of 380 cSt and no minimum",
 ["volume, with a maximum of 380 cSt and no minimum, the same basis as its density",
  "mass, with a minimum of 380 cSt and no maximum, the same basis as its sulfur",
  "index, on volume, with a maximum of 380 cSt, the same basis as the RVP rows"],
 "Viscosity blends through the Refutas index on mass. The fuel oil template also carries Sulfur on mass at 35000 ppm, Density on volume at 0.991 kg/l and Flash point on volume at 60 C.")

# 26 [m06]
q(0, "oracle_crudeassay.py holds the assay engine to 6 blends, 4 curve cases and 1 blended default curve. How does it find T50?",
 "By bisection, the same way it inverts the Refutas index.",
 ["At the first grid point past 50 percent, read straight off the blended curve.",
  "As the average of the component crudes' own midpoints, weighted on volume.",
  "By reading T50 back out of the golden files it checks."],
 "The oracle_crudeassay.py row lists T50 by bisection and Refutas inverted by bisection. It is written from the rules and not from the JavaScript.")
q(1, "Given held item C12, which report of the AGO viscosity matches what the course prints?",
 "The engine's 3.0036 cSt, stated as the Refutas index blended on mass fraction.",
 ["2.9518 cSt alone, the volume figure, as the course keys volume as the correct basis.",
  "The mean of 3.0036 and 2.9518 cSt, the engine's reading between the two bases.",
  "No viscosity at all, as the engine withholds a figure on a held basis."],
 "The engine prints 3.0036 cSt with the index on mass and 2.9518 cSt with the same index on volume. C12 is taught as a stated limit and never graded, and the basis is a course and owner decision.")
q(3, "A buyer asks Apapa for more cargo, and the desk quotes the extra barrels at the unit cost of 87.3377 $/bbl. What does that quote give away?",
 "0.1731 $/bbl on the next barrel, the marginal minus the average.",
 ["Nothing: every barrel of a least-cost cargo costs the unit cost at the margin, whatever the bounds.",
  "87.5108 $/bbl on every added barrel, the whole of the marginal barrel's cost.",
  "The value of the Butane already blended in the cargo."],
 "Marginal minus average is 0.1731: the volume row's price, 87.5108 $/bbl, is the marginal barrel, and the unit cost, 87.3377 $/bbl, is the average barrel.")
q(2, "The course solves each textbook corner with both coordinates fixed by bounds, and all four print the status optimal. Why optimal at every one?",
 "Each fixed point is feasible, so the kernel has a point to return.",
 ["Each corner is the optimum of the full problem, so all four report one objective.",
  "Optimal is reported whenever phase two runs, met rows or not.",
  "The two rows are dropped once both coordinates are fixed."],
 "Fixing both coordinates leaves one point, and the kernel's status says whether it meets every row. The objectives are 0.0000, 20.0000, 12.0000 and 21.0000, and 21.0000 is the optimum of the full problem.")

# 30 [m03]
q(0, "The engine reports Sulfur achieved at 50.0000 with binding true. Who decides that it binds, and how?",
 "The engine, by a test against BINDING_TOLERANCE, 1e-7, times the limit (or 1, if larger).",
 ["The user, who ticks binding on the specification before the solve is run.",
  "The reader, by judging whether 50.0000 is close enough to the limit of 50.",
  "The template, which marks Sulfur and RVP binding in the 50 ppm gasoline table."],
 "A specification counts as binding when the achieved value is within BINDING_TOLERANCE (1e-7) times the limit (or 1, if larger) of it. The same test marks RVP at 9.0000 binding.")

# 31 [2M m02 m04]
q(1, "The AGO viscosity row blends through the Refutas index on mass. What would its price of relief carry, and what is it at the AGO optimum?",
 "sum(SG x volume), 5070.0000, and the index slope; 0.0000 per cSt, as it does not bind.",
 ["The 6000.0000 bbl batch alone, as on the cetane row; 1159.3909 $ per cSt.",
  "The index slope alone, with no scale; 1.0036 per cSt, the figure printed on its row.",
  "No scale at all, as viscosity rows carry no dual; the price is left unformed."],
 "The rule is price = rowPrice x sum(d_i v_i) x dIndex/dL. On the index-on-mass basis d_i is SG, and the mass rows scale by sum(SG x volume), 5070.0000. Viscosity at 40 C carries a giveaway of 1.0036 and binds at neither end.")

# 32 [2M m01 m05]
q(2, "Isomerate is given a floor of 1200 bbl at Apapa. What does the kernel do with that floor as it solves?",
 "It shifts the floor to the origin, so every specification row sits off zero.",
 ["It writes the floor as an extra row, Isomerate at least 1200 bbl, beside the specifications.",
  "It fixes Isomerate at 1200 bbl with both bounds and drops it.",
  "It refuses the floor, as a minimum above zero needs a matching maximum."],
 "A minimum forces barrels into the recipe; every specification row then sits off zero after the kernel shifts the floor to the origin. The recipe comes back optimal with Isomerate at 1200.0000 bbl.")

# 33 [m06]
q(3, "The default pool's RVP relief is 578.9052 $ per psi, with rowPrice -0.2674. Which of the two does a planner quote as the value of one psi?",
 "578.9052 $ per psi, the figure in the price column.",
 ["-0.2674, read as the change in cost per psi of the RVP limit at the optimum.",
  "The product of the two, the price of relief multiplied once more by the rowPrice.",
  "Either one: the default pool's 1000 bbl batch makes the two figures equivalent."],
 "rowPrice is the row's dual, the change in cost per unit of the row's right-hand side, and the RVP row is in index units. The value of relief is per whole psi and positive when relief saves money.")

# 34 [m02]
q(0, "In SPEC_TEMPLATES, which limits does the Gasoline, 10 ppm sulfur template set?",
 "RON 95, MON 85, sulfur 10 ppm and RVP 8.5 psi, with density 0.72 to 0.775 kg/l.",
 ["RON 95, MON 85 and sulfur 10 ppm, with RVP kept at 9 psi and density 0.72 to 0.775 kg/l.",
  "RON 91, MON 81 and sulfur 10 ppm, with RVP 8.5 psi and density 0.72 to 0.775 kg/l.",
  "RON 95, MON 85, sulfur 10 ppm and RVP 8.5 psi, with density 0.82 to 0.845 kg/l."],
 "The 10 ppm template carries RON 95, MON 85, Sulfur 10 ppm and RVP 8.5 psi; the 50 ppm one carries 91, 81, 50 and 9. Both carry Density on volume from 0.72 to 0.775 kg/l. Templates are starting points. They are not a compliance source.")

# 35 [2M m03 m04]
q(1, "The AGO cargo's cetane minimum of 48 binds. What is one cetane number of relief worth, and which way does the relief run?",
 "1159.3909 $ per unit, by lowering the cetane minimum below 48.",
 ["1159.3909 $ per unit, by raising the cetane minimum above 48.",
  "0.1932 $ per unit, the rowPrice, by lowering the minimum.",
  "852453.4687 $ per unit, the density figure, which the cetane row shares."],
 "Relief is raising a maximum or lowering a minimum, and the price is the money saved by one unit of it. The Cetane number minimum prints rowPrice 0.1932, scale 6000.0000 and price 1159.3909 per unit.")

# 36 [m02]
q(2, "Suppose the Apapa sulfur row had been built with volume weights in place of SG weights. Where would the course's two-route check show it?",
 "As a difference other than 0.0000 on the Sulfur line.",
 ["Nowhere: both routes read the same row, so they share any error made in building it.",
  "As an infeasible status for the whole pool, reported by the kernel's phase one.",
  "As a refusal naming the sulfur row, printed where the engine's refusals are listed."],
 "propertyOfBlend recomputes a property from a finished recipe by the specification's own rule, separately from the LP rows, so agreement is a check. Both routes print 50.0000 for Sulfur, with a difference of 0.0000.")

# 37 [m04]
q(3, "Moving the RVP limit to 10 prints a saving of 3651.3942 $, and moving it to 8 prints -4751.5037 $, around 4448.9659 $ per psi. Which causes does the course name for that spread?",
 "The optimum moves to a different vertex, and the RVP row's index units are not a straight line in psi.",
 ["Rounding in the rowPrice of -0.2569, printed to four decimals and so drifting over a psi.",
  "The Butane bound, which the re-solves remove before moving the limit.",
  "The Density range, which binds once the RVP limit moves a whole psi."],
 "The RVP re-solves change what holds (at 10 psi only Sulfur binds; at 8 psi Reformate sits at its availability), so the optimum moves to a different vertex, and the RVP row is in index units, which are not a straight line in psi. Rounding is not among the causes the course names.")
q(0, "What does the Apapa recipe achieve for MON, and what does it give away?",
 "84.4928, a giveaway of 3.4928.",
 ["94.5010, a giveaway of 3.5010.",
  "84.4928, a giveaway of 3.5010.",
  "84.4928, a giveaway of 0.0000, binding."],
 "The Apapa table prints MON achieved 84.4928 against its minimum of 81, giveaway 3.4928, binding false. 94.5010 and 3.5010 are RON's.")
q(2, "At Apapa the RVP rowPrice times the 8000.0000 bbl batch prints -2054.8893. In what unit is that figure?",
 "$ per index point, as the row is in index units",
 ["$ per psi, the value of one psi of RVP relief at the limit",
  "$ per ppm, the unit the sulfur row's figure is in",
  "$ per bbl, the cost of one more barrel"],
 "The course prints: rowPrice x 8000.0000 bbl is -2054.8893 $ per index point. The RVP row is in index units.")
q(1, "How does solveLP carry a tank limit such as Butane's 400 bbl at Apapa?",
 "As an upper bound on Butane's volume in lo <= x <= hi, with no extra row for it.",
 ["As an extra row, Butane's barrels at most 400, priced like a specification.",
  "As a term in the objective that charges Butane more near its tank's limit.",
  "As a limit in the template, beside the Sulfur and RVP maximums."],
 "solveLP keeps bounds as bounds, lo <= x <= hi, and does not add them as rows. The result reports a component on its upper bound in its own line: \"Components at their availability: Butane.\"")

# 41 [m05]
q(3, "Compare a component whose cost is blank with one whose sulfur figure is blank. How does the engine treat each?",
 "The blank cost is refused; the blank sulfur skips that one specification and the recipe solves.",
 ["Both are refused: the engine never solves with a blank in the table, and names the component.",
  "Both are read as zero, so the component is free in one case and sulfur-free in the other.",
  "Both are skipped: the recipe solves without the component that carries the blank."],
 "The blank cost returns the refusal that begins \"No cost for Isomerate\". The blank sulfur figure returns optimal at 695245.0644 $, with Sulfur listed as skipped and its reason.")
q(2, "The course counts the LP oracle's golden cases as 181 problems. How does its method stand against the kernel's absolute tolerances?",
 "It works in exact rational arithmetic, with no simplex at all.",
 ["The kernel's own absolute tolerances, shared by running a simplex with Bland's rule.",
  "A larger tolerance than the kernel's, sized for problems scaled in millions.",
  "A relative tolerance on each pivot, set tighter than the kernel's absolute ones."],
 "oracle_lp.py uses exact rational vertex enumeration with no simplex at all. The kernel's absolute tolerances are what held item L4 is about.")

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/advanced/cra_exam.json', label='cra_exam', expect_n=42)
finish()
