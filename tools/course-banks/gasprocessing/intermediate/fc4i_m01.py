import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Professional m01, a contactor read as a staged device.
# Every figure is from digest Section 9 at the rendering that section prints.
# The absorption factor is a typed input here and the module derives none, so
# no question asks a learner to form one.

q(2, "A theoretical stage in this module is fixed by one condition. Which condition is it?",
 "The gas and the liquid leave the stage in equilibrium with each other.",
 ["The gas and the liquid stay in contact for a stated time before they are allowed to separate again.",
  "The gas leaving the stage already meets the column's outlet spec.",
  "The liquid leaving the stage has picked up as much solute as its own rich limit allows it to carry."],
 "Height, tray spacing, contact time and mechanical design enter nowhere in that definition. A stage is a unit of separation difficulty, and it is the only absorber model this engine carries.")

q(0, "Which three quantities does the Kremser relation tie together?",
 "The absorption factor, the number of theoretical stages, and the fraction of the solute removed.",
 ["The gas rate in MMscfd, the number of theoretical stages, and the fraction of the solute removed.",
  "The liquid molar rate, the gas molar rate, and the equilibrium ratio of the solute between the phases.",
  "The number of theoretical stages, the tray efficiency of the service, and the fraction of the solute removed."],
 "Give it any two and it gives the third. That shape is why one piece of arithmetic answers both what a column of a given size removes and how large a column a spec demands.")

q(3, "The absorption factor is written A = L / (V K). What do the three symbols stand for?",
 "L is the solvent molar rate down the column, V is the gas molar rate up it, and K is the equilibrium ratio of the solute between the two phases.",
 ["L is the solvent rate in gpm, V is the gas rate in MMscfd, and K is the Souders-Brown K value in ft per s.",
  "L is the lean loading, V is the loading swing, and K is the equilibrium ratio at the column's conditions.",
  "L is the solvent molar rate, V is the gas molar rate, and K is the number of theoretical stages in the column."],
 "The factor is dimensionless and it is the one number in the relation that carries the equilibrium. None of L, V or K is an argument of any export in this module.")

q(1, "Where does the absorption factor come from when this module is asked what a column removes?",
 "It arrives as a typed input taken from equilibrium data, because none of the three quantities behind it is an argument of any export here.",
 ["It is built from the amine circulation and the acid gas rate that the sweetening call returns for the same stream, which is how the two halves of the module share one column.",
  "It is formed from the gas gravity and the column pressure by the correlation that also gives the compressibility.",
  "It is read from the property row of the amine named in the call, beside that amine's strength and rich limit."],
 "That seam is why every table in this section is indexed by the factor rather than by a rate. A removal figure is only as good as the factor somebody typed above it.")

q(0, "On the OBIAFU absorber the absorption factor is 1.600000 and the column carries 6.000000 stages. What does the relation return?",
 "A removal of 0.976783371, which is a fraction of the solute arriving.",
 ["A removal of 0.922576074, because 1.600000 is rounded down to the column at 1.2.",
  "A removal of 0.992125984, because 1.600000 is read on the surface column nearest above it.",
  "A removal of 0.976783371 mol percent of the inlet gas."],
 "The figure is a fraction of the solute present, so it says nothing about the rate, the pressure or the vessel. It is the column's efficiency at the duty it was given.")

q(2, "Why does this course tell a reader to work down the Kremser surface by column rather than across it by row?",
 "A column of the surface is one absorber being made taller, and a row is a set of columns that do not exist together.",
 ["A row mixes two units, because the stage entries are counts and the factor entries are dimensionless.",
  "A row is only valid above an absorption factor of one, and four of the seven columns fall below it.",
  "A column holds the factor steady, which is the only way to reach the 200 stage entries the surface extends to."],
 "Nobody builds one absorber and then walks its solvent circulation across a whole row. Above an absorption factor of one every column climbs towards total removal as stages are added.")

q(1, "At an absorption factor of exactly 1 the closed form cannot be evaluated. What does the engine return instead?",
 "The stages over the stages plus one, which at 4 stages gives 0.800000000 and at 12 gives 0.923076923.",
 ["A refusal naming the factor, because the relation is indeterminate there and no removal exists.",
  "The closed form evaluated a billionth above the factor it was handed, which is 0.923076923 at 12 stages.",
  "The absorption factor itself, since at unity the ceiling and the removal have met."],
 "Numerator and denominator both vanish at that factor, and the stages over the stages plus one is the limit there. One stage gives 0.500000000 on that column of the surface.")

q(3, "Two numbers go into the Kremser relation and one comes out. What is unusual about that in this package?",
 "Most of what the Facilities engines answer arrives as a chain of steps, each with its own input and its own unit.",
 ["Most of what the Facilities engines answer arrives as a surface sampled at seven points, which is what the table below it is.",
  "Most of what the Facilities engines answer is solved iteratively, and this relation is the only closed form among them.",
  "Most of what the Facilities engines answer carries a warning band, and this relation carries none at any absorption factor."],
 "Here the entire behaviour of a staged absorber sits in the shape of one expression, and the surface is that shape sampled. The sweetening chain in the next module is the other kind, five steps with a property on each.")

q(0, "The published cases behind the Kremser relation are solved a second way. Which way?",
 "A brute force stage cascade solved as a linear system, which reaches the same numbers by a genuinely different road.",
 ["The same closed form evaluated in higher precision, so the check is on the rounding rather than on the algebra.",
  "The inverse relation run backwards from the removal, so each case checks that the two directions agree.",
  "A published correlation chart digitised at the five factors the golden carries."],
 "A check that restates the relation it is checking can only confirm that the typing is consistent. This golden never writes the relation down, and the five ratios of engine over golden come back at 1.000000000000.")

q(2, "Why does the Kremser golden carry a case at an absorption factor of 1.000000 with 5 stages?",
 "Because the engine takes a separate branch at that factor, so the branch needs a published case of its own.",
 ["Because 5 stages is the count at which the general form and the branch at unity are known to cross over and agree.",
  "Because the cascade golden can only be solved as a linear system when the factor is one.",
  "Because it is the only case in the set whose removal, 0.833333333333, repeats to twelve figures."],
 "A golden made entirely of general-form cases would pass whatever the branch did. The case returns 0.833333333333 on both sides and its ratio is 1.000000000000.")

q(3, "The relation is inverted to give the stages a spec demands. Which form does the engine use away from unity?",
 "N = log( (A - f) / (1 - f) ) / log(A) - 1.",
 ["N = f / (1 - f), which is the general form and reduces to the closed form at unity.",
  "N = log( (1 - f) / (A - f) ) / log(A) + 1, with the ratio inverted.",
  "N = (A - f) / (A - 1), taken directly from the forward relation."],
 "Reading A^(N+1) = (A - f) / (1 - f) rather than the solved line is what makes the ceiling fall out: the left side is positive for any real N, so with f below one the factor has to exceed the removal. The f over 1 minus f form is the branch at unity.")

q(1, "A contract asks for a removal of 0.900000. What stage counts come back at absorption factors of 1.200000 and 1.600000?",
 "5.025685103 and 3.140202390.",
 ["3.140202390 and 5.025685103, the better supplied column needing the taller answer.",
  "5.025685103 and 7.746472598, which is the same spec read on the two supplied factors.",
  "9.000000000 and 5.658211483, the two entries the inverse carries at that removal."],
 "Both are answers to the same contractual requirement, and the difference between them is a decision about the solvent side taken before the relation was ever called.")

q(0, "Each row of the inverse table carries a final column putting the stage count straight back through the forward relation. What does that column establish?",
 "That the two directions are inverses of one another rather than two pieces of arithmetic that happen to sit near each other.",
 ["That the stage counts are converged, because the engine iterates towards them and stops when the removal stops moving.",
  "That the removals asked for are reachable at those factors, which is what the ceiling would otherwise have to be consulted for.",
  "That rounding the fractional stage count to a whole number leaves the removal within the precision the digest prints."],
 "It returns the removal that was asked for on every row. That is the cheapest possible test of a two-way relation, and most published correlations cannot pass it.")

q(2, "The inverse returns stage counts such as 3.140202390 and 7.746472598. How should a fractional count be read?",
 "As an exact answer to a question about separation difficulty, with the rounding left to whoever converts stages into trays.",
 ["As a figure to round up at once, since a column is built with whole trays and the next whole number up is the safe side to order.",
  "As a sign that the absorption factor sits too close to unity for the inverse to resolve a whole count.",
  "As the theoretical count already multiplied by a tray efficiency, which is what puts a fraction on the end of a count like that."],
 "A theoretical stage is a unit of separation difficulty, so a spec can perfectly well ask for a fraction of one. The conversion into real trays is not in this module.")

q(1, "What separates the rating direction of the relation from the design direction?",
 "The rating direction belongs to a column that exists and returns a removal, and the design direction belongs to a column that does not exist yet and returns a stage count.",
 ["The rating direction takes the absorption factor as an input and the design direction computes one from the spec.",
  "The rating direction is checked against the golden and the design direction is checked against the ceiling.",
  "The rating direction holds at and below an absorption factor of one, and the design direction only above it."],
 "One asks whether next quarter's gas still meets the spec on the stages already bought. The other asks how large a problem is about to be handed to a vendor.")

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/intermediate/fc4i_m01.json', label='fc4i_m01', expect_n=15)
finish()
