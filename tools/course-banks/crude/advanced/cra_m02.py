import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Expert m02, Blending Rules as Rows. Digest sections 20 and 24.

q(1, "A maximum L on a blended property reads sum(w_i v_i) / sum(d_i v_i) <= L. Why may both sides be multiplied by the denominator without turning the inequality round?",
 "The denominator is a sum of positive weights times volumes of zero or more, so it is positive whenever anything is blended.",
 ["The denominator is the batch volume on every basis, and the batch row fixes it at the target, so multiplying by it is multiplying by a known constant.",
  "The kernel turns the inequality round after the step whenever a weight is negative.",
  "A ratio row is always written as an equation, so its direction does not matter."],
 "Multiplying through and gathering terms gives sum((w_i - L d_i) v_i) <= 0, a row linear in the volumes. The step is safe because the denominator cannot be negative.")

q(3, "A specification declares the mass basis. What are its two weights in the row sum((w_i - L d_i) v_i) <= 0?",
 "w_i is SG x the property, and d_i is SG.",
 ["w_i is the property and d_i is 1, as on the volume basis, with the SG applied afterwards.",
  "w_i is the property and d_i is SG, so the mass enters the denominator only.",
  "w_i is SG x the property's index and d_i is SG, the viscosity weights."],
 "SG x volume is proportional to mass, which is why both weights carry the specific gravity on the mass basis. The index-on-mass basis is the one that puts the property's index in w_i.")

q(0, "At Apapa the template's Sulfur maximum is 50 ppm, and the components carry 4 ppm (Reformate), 110 ppm (FCC gasoline), 1 ppm (Isomerate) and 1 ppm (Butane). Which component carries a positive coefficient in the sulfur row?",
 "FCC gasoline, the one component above 50 ppm, so each barrel of it uses up room.",
 ["Reformate, since it carries the most sulfur of the three low-sulfur components.",
  "All four, because the row counts every barrel's sulfur toward the limit.",
  "Isomerate and Butane, the two components carrying 1 ppm each."],
 "On the mass basis the coefficient is SG x the property less 50 x SG, so its sign is the sign of the component's sulfur against the limit. Only 110 ppm sits above 50, so FCC gasoline alone pushes on the limit.")

q(2, "The 9 psi RVP limit enters its row as the index 15.5885. Reformate carries 4.2799, FCC gasoline 9.7834, Isomerate 24.4477 and Butane 142.3287. Which components make room under the limit for the others?",
 "Reformate and FCC gasoline, whose indices sit below 15.5885.",
 ["Isomerate and Butane, whose indices sit above 15.5885 and so carry the positive coefficients.",
  "Butane alone, the component taken up to its availability.",
  "None of them, since an index row gives no component room."],
 "On the index basis w_i is the component's index and d_i is 1, so a coefficient is the component's index less 15.5885. A negative coefficient makes room; Isomerate and Butane use it.")

q(1, "RVP_INDEX_EXPONENT is 1.25. What does the engine say about that figure?",
 "It is a named and overridable parameter, exported so it can be read and set.",
 ["It is fixed inside rvpIndex, so no other correlation can be used.",
  "It is the slope of the index at the 9 psi limit.",
  "It is set per template, fixed by the 50 ppm gasoline template."],
 "RVPI = RVP^n, blended on volume and inverted, with n the exported constant. A planner whose correlation uses another exponent can set it.")

q(3, "rvpIndex takes 12.9 psi to 24.4477, and rvpFromIndex takes 24.4477 back to 12.9000. What does that round trip show?",
 "The inverse returns the pressure the index started from, 12.9000.",
 ["The index is linear in RVP, so it blends as plain volume would.",
  "The inverse rounds to the nearest tenth of a psi.",
  "Isomerate's RVP was clamped to the template limit first."],
 "Every round trip in the table comes back to the pressure it started from: 3.2, 6.2, 9, 12.9 and 52.8 psi. The index is blended, then turned back by the same rule.")

q(0, "On the AGO pool, which index does the optimizer's Viscosity at 40 C row blend through?",
 "The Refutas index on mass, the same index the assay studio uses.",
 ["The RVP index at exponent 1.25, applied to viscosity in place of pressure.",
  "A linear average on volume, the treatment given to cetane and flash point.",
  "The Refutas index on volume, the ASTM D7152 basis."],
 "Viscosity at 40 C blends through the Refutas index on mass (indexOnMass), the same index as the assay studio, with weights SG x the property's index and SG. Cetane and flash point are treated linearly on volume. The mass basis is held item C12, stated as a limit.")

q(2, "SPEC_TEMPLATES give the 50 ppm gasoline template a Sulfur maximum of 50 ppm and an RVP maximum of 9 psi. What standing do those limits have?",
 "They are starting points and never a compliance source, and every limit is editable.",
 ["They are the regulation in force for PMS, carried into the optimizer so every cargo complies.",
  "They are fixed, and a user who wants another limit writes a new template in code.",
  "They are the buyer's contract terms, read from the cargo nomination for each run."],
 "The regulation in force governs, and every figure in the course is invented and illustrative. The template is a shape to start from.")

q(3, "propertyOfBlend recomputes each Apapa property from the finished recipe, and every difference against optimiseBlend is 0.0000, including Sulfur at 50.0000 and RVP at 9.0000. What does that agreement show?",
 "The rows carry the right weights, since a second route from the barrels gives the same figure.",
 ["The two functions share the LP rows, so the agreement holds by construction and checks nothing.",
  "The recipe was solved twice with the same rows, and both solves landed on one vertex.",
  "Sulfur and RVP were typed as targets, so the recipe is built to hit them to the digit."],
 "propertyOfBlend works by the specification's own rule, separately from the LP rows, so agreement is a check. A wrong weight in a row would show as a difference.")

q(1, "The Density specification of the 50 ppm gasoline template runs from 0.72 to 0.775 kg/l. How does it enter the kernel?",
 "As two rows, a maximum and a minimum.",
 ["As one equation fixing the density at the midpoint of the range.",
  "As a bound on each component's volume, taken from its density.",
  "As one row on the nearer end, chosen after the recipe is solved."],
 "A range gives one row for each end. The Apapa price table lists them separately as the Density maximum and the Density minimum.")

q(0, "The AGO template treats cetane and flash point linearly on volume. How does the template itself describe that treatment?",
 "As a screening approximation, which matters where a recipe binds on cetane.",
 ["As the exact blending rule for both, which is why neither has an index.",
  "As a mass basis in effect, since cetane and flash point follow the specific gravity.",
  "As a held limit, stated so that no recipe may bind on cetane or on flash point."],
 "The template notes that the linear treatment is a screening approximation. The AGO recipe binds on Cetane number, so the approximation sits under one of the two rows the recipe is pressed against.")

q(2, "The AGO recipe's viscosity reads 3.0036 cSt with the Refutas index on mass, the engine's basis, and 2.9518 cSt with the index on volume. Which reading is correct?",
 "The course holds the basis open, and both are printed.",
 ["2.9518 cSt, because ASTM D7152 blends on volume and so it supersedes the engine's figure.",
  "3.0036 cSt, since it is the basis the engine names.",
  "Neither of them, since the engine refuses a viscosity where the two bases disagree."],
 "This is held item C12. The engine blends on mass and names it, \"Refutas index on mass fraction\"; the choice of basis is a course and owner decision the course does not settle.")

q(3, "Re-solved with the viscosity index blended on volume instead of mass, the AGO recipe keeps every volume, a total cost of 594720.9475 $ and the binding pair Cetane number and Density. What did the basis change on this pool?",
 "The achieved viscosity alone, since viscosity is not a row the recipe is pressed against.",
 ["The recipe, because every row built on an index moves when its weights change basis.",
  "The binding list, which gains Viscosity at 40 C once its index blends on volume.",
  "Nothing the engine reports, since the viscosity figure is kept on mass either way."],
 "The achieved viscosity moves from 3.0036 cSt to 2.9518 cSt. With viscosity not binding, the recipe stays where the cetane and density rows hold it.")

q(1, "The AGO recipe's viscosity of 3.0036 cSt sits inside the template range of 2 to 4.5 cSt with a giveaway of 1.0036. What is that giveaway measured against?",
 "The nearer end of the range, the 2 cSt minimum.",
 ["The 4.5 cSt maximum, since a viscosity specification is a maximum first.",
  "The midpoint of the range, the target a range specification aims for.",
  "The 2.9518 cSt reading on volume, the other basis for the same barrels."],
 "For a range, giveaway is the smaller of the two gaps, so 1.0036 is the distance to the nearer end.")

q(0, "The batch row sum(v_i) = target is the one equation among the Apapa rows. What does its being an equation mean for the method?",
 "The origin does not satisfy it, so phase one must find a starting vertex first.",
 ["It is kept as a bound on the total volume, the way a tank limit sits on one component.",
  "It carries no dual, since an equation is always met and so has no price.",
  "It turns the problem into a maximisation of barrels, with the cost moved into a row."],
 "With the target at 8000 bbl, a recipe of all zeros breaks the batch row. Phase one drives artificial variables to zero to find a point that meets every row. The volume row does carry a price, the cost of one more barrel.")

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/advanced/cra_m02.json', label='cra_m02', expect_n=15)
finish()
