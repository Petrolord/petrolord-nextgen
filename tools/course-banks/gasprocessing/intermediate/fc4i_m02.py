import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Professional m02, the ceiling below unity and what stages cannot buy.
# Figures from digest Section 9: the surface, the 200 stage ceiling table and
# the refusal the section ends on.

q(1, "Stages and the absorption factor are bought in different currencies. Which pairing is right?",
 "Stages are steel and height; the absorption factor is solvent, with the pumping and regeneration that come with it.",
 ["Stages are solvent and regeneration; the absorption factor is steel, because a taller vessel is what raises it.",
  "Stages are capital and the absorption factor is capital too, since both are fixed once the column is ordered.",
  "Stages are set by the gas rate and the absorption factor by the spec, so neither is a purchase a project makes."],
 "The relation itself prices nothing. There is no capital cost of a tray in it and no regeneration duty attached to a higher factor, and putting the two halves together is the work.")

q(3, "What is the ceiling on a column whose absorption factor sits below one?",
 "The absorption factor itself, which the removal approaches as stages are added and never passes.",
 ["Total removal, reached more slowly than above unity but reached in the end.",
  "The removal the relation gives at 12 stages, past which further stages return nothing at all on any factor below one.",
  "One minus the absorption factor, so a starved column at 0.800000 is held to 0.200000 however many stages it carries."],
 "Stages only walk the answer towards the factor. At an absorption factor of 0.600000000000 the removal at 12 stages is 0.599476889 and at 200 stages it is 0.600000000.")

q(0, "On the lower rows of the ceiling table the gap between the removal at 200 stages and the absorption factor is exactly 0.000000000000. Why?",
 "The factor raised to the stage count has fallen below anything double precision can hold, so the relation collapses to the factor itself.",
 ["Those factors divide the stage count exactly, so the general form terminates rather than approaching a limit.",
  "The engine substitutes the factor for the removal once it detects a starved column, which is what makes the gap vanish.",
  "The table rounds the gap to twelve decimals, and on those rows the true gap falls below the last place printed."],
 "That is a statement about the arithmetic of a computer rather than about an absorber, and it is worth naming as such. Only near one does 200 stages fall measurably short.")

q(2, "Why does the ceiling column carry no meaning on the row at an absorption factor of 1.200000000000?",
 "There is no ceiling above unity to measure against, so the entry becomes the distance from a removal that cannot exceed one to a factor that can.",
 ["The engine refuses to evaluate 200 stages above unity, so the entry is a placeholder.",
  "Above unity the removal and the factor are equal by construction, so the entry can only ever be zero.",
  "The row lies outside the range the surface is sampled over, so nothing on it can be compared with the rows above."],
 "The entry there is -0.200000000000 and it goes more negative the larger the factor, which is arithmetic about a column of a table rather than physics about an absorber.")

q(3, "At an absorption factor of 0.950000000000 the removal at 200 stages is 0.949998335. What does that row show that the rows below it cannot?",
 "That 200 stages genuinely falls short of the ceiling, by -0.000001665057, rather than landing on it.",
 ["That the ceiling above 0.950000000000 is no longer the absorption factor but the removal at 200 stages.",
  "That the removal at 12 stages, 0.897258427, is already within a millionth of the ceiling.",
  "That the engine switches to the branch at unity once the factor is within a twentieth of it."],
 "On the lower factors the gap prints as exactly zero because of what double precision can hold. Approaching unity the shortfall becomes measurable.")

q(1, "The ceiling table is read at 0.999999999000, 1.000000000000 and 1.000000001000. What do those three rows establish together?",
 "That the branch the engine takes at unity is continuous with the general form either side of it, so it is a limit rather than a patch.",
 ["That the ceiling moves discontinuously through unity, which is why the engine needs a separate branch there.",
  "That the relation cannot be evaluated within a billionth of unity, so all three rows are served by one branch.",
  "That an absorption factor typed to nine decimals is the finest the relation can distinguish."],
 "All three report 0.923076923 at 12 stages and 0.995024876 at 200. A special case whose answer does not join up with the formula either side of it is the defect; a special case as such is not.")

q(2, "Asked for the stage count that meets a removal of 0.900000 at an absorption factor of 0.800000, the engine declines. What does the message name?",
 "The factor it was handed, the ceiling that factor implies, the spec asked for, and the remedy.",
 ["The factor, the spec and the stage count at which the removal stops improving.",
  "The factor, the ceiling and the nearest reachable spec, so the contract can be renegotiated against it.",
  "The spec, the ceiling and the number of stages already bought on the column in question."],
 "It reads: an absorption factor of 0.8 caps the removal at 0.8 however many stages are added, and the spec asks for 0.9: no stage count reaches it; raise circulation.")

q(0, "That refusal names a remedy. Which one?",
 "More solvent, which is what raises the absorption factor.",
 ["More trays, on the ground that the ceiling is approached asymptotically.",
  "A looser spec, fixed by the solvent chosen.",
  "A lower gas rate, which the factor carries."],
 "A stage count could never have carried that. The relation is indexed by the factor rather than by a rate, and the factor is the quantity that more solvent moves.")

q(1, "What would a very large stage count have cost a reader, had the engine returned one instead of declining?",
 "They would have priced a great many trays for a spec that height cannot buy.",
 ["They would have rounded it down to the nearest whole tray and met the spec anyway.",
  "They would have lost the ceiling, which is the only figure the answer object carries.",
  "They would have read it as a warning rather than as an answer, since no column is built that tall."],
 "Returning a huge stage count invites the wrong purchase. Returning the ceiling in place of the spec silently answers a question nobody asked, and that is the failure mode this programme has seen most often.")

q(3, "The refusal cannot tell a reader one thing about the spec it was handed. Which?",
 "Whether the spec is negotiable.",
 ["Whether the spec is a fraction or a mole percent, since the relation accepts either.",
  "Whether the spec was asked of the right solute, which the factor would have to carry.",
  "Whether the spec lies above the ceiling, which is the comparison that produced the refusal."],
 "A removal target may be a pipeline contract, a plant heat balance, or a round number somebody wrote into a specification years ago. The engine treats it as given.")

q(0, "Which two things would this engine need before a theoretical stage count could be turned into a vessel height?",
 "A rate-based absorber model and a stage efficiency, and it carries neither.",
 ["A tray spacing and a mist extractor K value, both of which belong to the Separation and Slug Catching course.",
  "A liquid density and an allowed velocity, which the contactor sizing call already forms.",
  "A gas rate and an operating pressure."],
 "A theoretical stage is a place where the gas and the liquid leave in equilibrium. That is the whole of the model, so the count is an answer about separation difficulty and no answer about steel.")

q(2, "What does rounding a theoretical stage count up to the next whole number and calling it a tray count quietly assume?",
 "That a tray does the work of a full equilibrium stage.",
 ["That the absorption factor was typed on the conservative side of the equilibrium data.",
  "That the removal the spec asked for was itself rounded to the precision the engine prints.",
  "That the column will be packed rather than trayed, since packing has no discrete stages."],
 "Rounding does happen eventually, because trays come in whole numbers. It happens after somebody who knows the tray efficiency of the service has made the conversion, and that conversion is not in this module.")

q(1, "A column at an absorption factor of 3 with 3 stages reaches 0.975000000. Which other entries on the surface land near it?",
 "A column at 1.5 with 12 stages reaches 0.997417616 and a column at 2 with 8 stages reaches 0.998043053.",
 ["A column at 1.2 with 12 stages reaches 0.975000000 as well, which is why the surface prints the pair.",
  "A column at 0.8 with 12 stages reaches 0.788365257, the nearest entry the starved half of the surface carries.",
  "A column at 1 with 8 stages reaches 0.888888889, which is the closest any unity column comes."],
 "Those are three different balances between capital and operating cost and the relation is indifferent to which is chosen. What it will not allow is rescuing a starved column with height.")

q(0, "When does the distance between a theoretical stage and a real tray stop mattering?",
 "When the absorption factor is at or below one, because neither stages nor trays reach past the ceiling.",
 ["When the stage count comes back whole, because no conversion is then needed.",
  "When the column is packed rather than trayed, because a packed height is quoted in theoretical stages directly.",
  "When the removal asked for is below the absorption factor, because the spec is then met on a single stage and no count has to be converted."],
 "Tray efficiency, packing, vendor experience and vessel height are all irrelevant at that point, because the constraint is on the solvent side.")

q(2, "A starved column at an absorption factor of 0.600000000000 is read at 12 stages and again at 200. What happens between the two?",
 "The removal moves from 0.599476889 to 0.600000000, which is the ceiling itself.",
 ["The removal moves from 0.599476889 to 0.788365257, so the stages go on paying all the way up.",
  "The removal moves from 0.540441176 to 0.600000000, which is most of the way to the ceiling.",
  "The removal stops moving after 12 stages."],
 "Adding trays to a starved column moves the answer closer to a ceiling it was always going to sit under. That is the single most useful fact in the staged half of this module.")

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/intermediate/fc4i_m02.json', label='fc4i_m02', expect_n=15)
finish()
