import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Expert m04, Shadow Prices. Digest sections 23, 24 and 26.

q(1, "The textbook case re-solved with row 1 raised to rhs 25 gives an objective of 21.7500, a change of 0.7500, and the kernel's shadow price on row 1 is 0.7500. What does the agreement show?",
 "A shadow price is the change in the optimum per unit of a row's right-hand side.",
 ["A shadow price is the objective divided by the right-hand side, so it moves whenever either of them moves on a re-solve.",
  "Row 1 has spare capacity, so its price is set by row 2 alone.",
  "The shadow price is row 1's coefficient on x, read off the row as written."],
 "One more unit of row 1's right-hand side is worth 0.7500 of objective. The re-solve on row 2, rhs 7, gives 21.5000 and a change of 0.5000, the same agreement.")

q(2, "At Apapa the Sulfur maximum row prints a rowPrice of -0.0914 and a price of 551.8026 per ppm. Which figure is a price a planner reads?",
 "The price, 551.8026 $ per ppm of the sulfur maximum.",
 ["-0.0914, which is the dollars saved per ppm with its sign turned the way the kernel keeps it.",
  "Both, since they are the same dual printed at two different roundings of the same number.",
  "Neither, since a binding row is priced only by re-solving the recipe at another limit."],
 "rowPrice is the change in cost per unit of the row's right-hand side. For a specification row it is not a price per ppm or per psi: moving the limit by one unit moves the row by sum(d_i v_i), and the engine scales the dual into 551.8026 $ per ppm.")

q(0, "The sulfur row's scale is sum(SG x volume) over the recipe, 6037.3872. Why does the dual need multiplying by it?",
 "Moving the limit by one ppm moves the row by sum(d_i v_i), and on the mass basis d_i is SG.",
 ["It converts the batch from barrels into tonnes, since the price is quoted per tonne.",
  "6037.3872 is the batch's sulfur content, and the dual is quoted per unit of it.",
  "It turns the sulfur maximum into a minimum, so relief and cost move together."],
 "The limit L sits inside every coefficient w_i - L d_i. rowPrice x 6037.3872 is -551.8026, the change in cost per ppm of the limit.")

q(3, "rowPrice x scale on the sulfur row is -551.8026, and the reported value of relief is 551.8026 $ per ppm. Why the opposite signs?",
 "Relief on a maximum is the negative of dCost/dL, and raising it lowers cost.",
 ["A minimum's relief is dCost/dL, and the sulfur row is a minimum, so the price keeps the sign the dual gives it.",
  "The scale is negative on a mass row, since sulfur is carried against the specific gravity of the batch.",
  "Rounding the dual to four places flips the sign of the product."],
 "Raising the maximum lowers the cost, so dCost/dL is negative and the saving is positive. A maximum's relief is the negative of dCost/dL and a minimum's is dCost/dL.")

q(2, "The RVP row gives -2054.8893 $ per index point, from rowPrice -0.2569 times the 8000.0000 bbl batch. Why is that still not the answer to what a psi of relief is worth?",
 "The limit sits in the row as an index, so index points still have to be turned into psi.",
 ["The batch must be replaced by sum(SG x volume), because RVP blends on mass through the index at the terminal.",
  "The figure is per barrel of the batch, and it still needs multiplying by 8000.0000.",
  "RVP relief carries no value at Apapa, since RVP gives away nothing."],
 "On the index basis d_i is 1, so the scale is the batch volume, and the result is dollars per index point. The slope of the index at the limit, dIndex/dL, turns index points into psi: 4448.9659 $ per psi.")

q(0, "The value of RVP relief, 4448.9659 $ per psi, divided by the negative of the per-index figure gives 2.1651 index points per psi. RVP_INDEX_EXPONENT x 9^(RVP_INDEX_EXPONENT - 1) also gives 2.1651. What does that agreement show?",
 "The price carries exactly the index slope at the limit.",
 ["The index is linear in RVP, so its slope is the same at every pressure and the limit could be read anywhere.",
  "The exponent 1.25 was fitted to the Apapa pool so the two routes would meet at this one cargo.",
  "The RVP row is scaled by sum(SG x volume), 6037.3872, which the index slope cancels."],
 "2.1651 index points per psi is the slope of the index at the 9 psi limit, and the same slope from the exported exponent is 2.1651. The RVP row is in index units and scales by the 8000.0000 bbl batch.")

q(1, "Why is the slope of the RVP index read at 9 psi and at no other pressure?",
 "The price uses dIndex/dL, the index's slope at the limit L, which is 9 psi.",
 ["It is Butane's RVP, since Butane is the component at its availability.",
  "The exponent is defined at 9 psi, and RVP_INDEX_EXPONENT holds only there.",
  "It is the RVP of FCC gasoline, the largest component in the recipe."],
 "optimiseBlend reports price = rowPrice x sum(d_i v_i) x dIndex/dL. At Apapa that slope, at the 9 psi limit, is 2.1651 index points per psi.")

q(3, "The Total volume row at Apapa reads 87.5108 as its price and 87.5108 as its rowPrice. Why do the two columns agree on this row?",
 "Its right-hand side is already barrels of product, so the dual is dollars per barrel.",
 ["The volume row is non-binding, so both of its columns carry the same default figure of the unit cost.",
  "The engine copies rowPrice into the price column for any row that sits on the volume basis.",
  "Both columns print the average barrel, which is the cargo's unit cost."],
 "For the volume row the dual is already the cost of one more barrel of product. A specification row's dual is not a price per unit of the property: the AGO cetane row blends on volume and prints rowPrice 0.1932 against a price of 1159.3909.")

q(2, "At Apapa the marginal barrel is 87.5108 $/bbl, the unit cost is 87.3377 $/bbl, and marginal minus average is 0.1731. What makes the next barrel dearer than the average?",
 "Butane sits at its availability and cannot supply the next barrel, so it is made from the other three.",
 ["The next barrel has to meet a tighter sulfur limit than the first 8000 barrels, since every added barrel dilutes the batch.",
  "The kernel adds a handling margin to the marginal barrel that the unit cost leaves out.",
  "The unit cost is read on the 50 ppm template and the marginal barrel on the 10 ppm one."],
 "The component at its availability cannot supply the next barrel, so the next barrel is made from the others. The average spreads the cost of every barrel already blended, Butane included.")

q(0, "The Apapa cargo is re-solved at 8001 bbl, and the cost rises by 87.5108. What does that check?",
 "The volume row's price is a cost the kernel reproduces.",
 ["That the unit cost of 87.3377 $/bbl is what one more barrel adds to the total cost of the cargo.",
  "That the marginal barrel is the unit cost plus a fixed handling charge the kernel adds per extra barrel.",
  "That Butane's availability rises by one barrel whenever the batch rises by one barrel on a re-solve."],
 "Solved again at 8001 bbl, the cost rises by exactly the price the volume row reported. The marginal barrel is a real cost, and the unit cost is a different figure.")

q(1, "The optimizer's default 1000 bbl pool prints marginal barrel minus unit cost of 0.0000 $/bbl, with nothing at its availability. Why do its two barrels cost the same?",
 "With no availability limit pressing, every row but the volume row has a zero right-hand side, so cost scales with the batch.",
 ["Isomerate sits at zero, and a component at zero sets the price of the marginal barrel.",
  "The batch is small, and at 1000 bbl the kernel rounds the gap away to 0.0000.",
  "No specification binds in the default pool, so every row but volume prices at zero."],
 "At Apapa the gap appears because Butane sits at a limit the next barrel cannot move. In the default pool no bound presses, Sulfur and RVP still bind, and both figures print 86.1228.")

q(3, "Raising the Apapa sulfur maximum to 51 ppm prints a saving of 551.6796 $, lowering it to 49 prints a saving of -551.9256 $, and the shadow price is 551.8026 $ per ppm. What explains three different figures?",
 "The price is a derivative at the optimum; a whole unit of relief is a finite move.",
 ["The re-solves were run on a different pool, so their savings measure another recipe entirely.",
  "The shadow price is read at the 51 ppm re-solve, so it prices a different limit from the recipe's.",
  "Four-place rounding of the re-solved totals opens the gap."],
 "A shadow price is the value of relief at the margin, a derivative at the optimum; the saving from one whole unit of relief is a different number, and the re-solve table prints both savings beside the price of 551.8026 $ per ppm.")

q(2, "The RVP shadow price at Apapa is 4448.9659 $ per psi. Where does the digest read what relieving the maximum by one whole psi saves?",
 "From the re-solve at an RVP limit of 10, which prints 3651.3942 $.",
 ["From the shadow price, since it holds for any move of the RVP maximum, however large.",
  "From the average of the two re-solves, taken as the value of a psi.",
  "From the unit cost of 87.3377 $/bbl, taken over the batch."],
 "The engine re-solved with the limit moved one whole unit each way, and relieving the 9 psi maximum to 10 prints a saving of 3651.3942 $ against the price of 4448.9659 $ per psi.")

q(1, "The AGO Density maximum is priced at 852453.4687 $ per kg/l. What must a reader hold in mind?",
 "The price is per whole kg/l of the density limit.",
 ["It is the value of the whole AGO cargo, which the density row carries because it is binding at the optimum.",
  "It is a rowPrice, so it has to be multiplied by the 6000.0000 bbl scale before a planner can read it.",
  "It is the cost of the giveaway on density, which the engine prices without a unit value being typed."],
 "A price per unit of the property is per whole unit of it, so the density relief is dollars per kg/l. The row prints rowPrice -142.0756, scale 6000.0000 and rowPrice x scale -852453.4687.")

q(0, "On the AGO recipe the cetane and density rows scale by 6000.0000, and the sulfur and viscosity rows by 5070.0000. What decides which scale a row takes?",
 "Its basis: a volume row scales by the batch volume, and a mass row by sum(SG x volume).",
 ["Whether it is a maximum: maximums take the batch and minimums take the mass sum.",
  "The sign of its rowPrice: a negative dual takes the batch, a positive one the mass sum.",
  "Whether it blends through an index: index rows take the mass sum, the rest the batch."],
 "The scale is sum(d_i v_i). On the volume basis d_i is 1, and on the mass basis it is SG, which gives 5070.0000 on this recipe. The cetane minimum takes the batch with a positive rowPrice of 0.1932, and sulfur takes the mass sum without an index.")

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/advanced/cra_m04.json', label='cra_m04', expect_n=15)
finish()
