import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Expert m03, The Cold Separator. Digest section 14, the cold separator
# block, with the seam from section 16. Lessons l01 water the cold gas can
# still hold, l02 what drops out and where, l03 dew point depression as the
# product, l04 the hydrate question this engine hands on, l05 cooling against
# dehydrating. 15 questions.

q(1, "The saturation routine used at the cold end is the same one the Associate tier builds end to end. What is different about the way this module uses it?",
 "It is asked twice on one stream, once at the state the gas arrives in and once at the state the separator holds it at.",
 ["It is asked at the cold state alone, because the inlet content is carried forward from the dehydration side of the course rather than recomputed here.",
  "It is asked with the march's mean coefficient supplied alongside the state.",
  "It is corrected for the real-gas departure before the two answers are subtracted."],
 "Nothing about the routine changes. Two reads of one routine at two states is the whole of the cold separator arithmetic.")

q(2, "What does the digest print for the cold water content read against the warm one, and what kind of quantity is it?",
 "0.555085832, a dimensionless ratio of the two saturated contents.",
 ["0.555085832 lb per MMscf, the content the gas leaves the separator with.",
  "15.038835973, the free water that appears in the boot, expressed against the inlet.",
  "0.916066108, which is the ratio the digest prints between two of the march's own coefficients."],
 "Both contents are in lb per MMscf, so their ratio carries no units at all. A figure that is a ratio and a figure that is a content answer different questions.")

q(0, "The engine's second answer is a saturated water content at the cold state. What does calling it the water the gas carries onward assume?",
 "That the separator reaches equilibrium and actually takes the liquid out.",
 ["That the gas is at its water dew point at the inlet as well, which is what makes the two reads comparable to one another.",
  "That the march was fine enough for the arrival temperature to be exact.",
  "That no hydrocarbon condenses at the cold spot, because a second liquid phase would take water with it as it separates."],
 "In a cold separator with a boot that assumption is close enough to be the design basis. It is still an assumption, and there is no stage efficiency and no approach to equilibrium anywhere in this module to soften it.")

q(3, "Both water contents are quoted per MMscf. What has to happen before either becomes a quantity an operator drains?",
 "A multiplication by the rate the stream carries, taken deliberately as a separate step.",
 ["A conversion from the saturated basis to the carried basis, which the engine performs when it is given a rate.",
  "A correction for the real-gas departure, since a load in pounds a day is a mass and the ideal-mixing estimate is a mole fraction.",
  "Nothing at all, because a content in lb per MMscf is already a quantity a boot fills with over a day."],
 "The saturation answer is an intensive property of the gas at a state, and the rate never enters it. Two skids at very different rates get the same two numbers here.")

q(1, "Of the inlet content, the cold content and the difference between them, which does the engine compute?",
 "The two contents, each from its own state, with the difference a subtraction between them.",
 ["All three, since the difference is returned beside the two contents on the same answer.",
  "The difference alone, since a saturation routine asked for a let-down returns what the cooling dropped out.",
  "The cold content alone, with the inlet content supplied by the caller as a condition of the stream."],
 "AGBADA carries 33.801656743 lb per MMscf at its inlet and can hold 18.762820770 lb per MMscf at the cold separator, and 15.038835973 lb per MMscf is what those two figures leave when one is taken from the other.")

q(2, "What state does the gas leave the cold separator in, and what does that oblige a designer to hold onto?",
 "Saturated at the cold spot, so any further cooling anywhere downstream puts more liquid out.",
 ["Dry at the cold spot, so the only remaining risk downstream is a pressure rise that would push the gas back through its dew point.",
  "Saturated at the inlet pressure, so the line downstream sees the inlet content.",
  "At the arrival temperature with the water split between two phases."],
 "A line, a control valve or an exposed length of pipe that runs colder than the separator drops more water. The skid moved the problem to a colder temperature rather than removing water in the absolute sense a contactor does.")

q(0, "Letting the gas down to 640.000000 psia without cooling it would leave it able to hold 62.321804620 lb per MMscf, against 33.801656743 lb per MMscf at the inlet. Why does the expansion on its own wet the gas?",
 "The saturated content is the vapour pressure of water over the total pressure, and the vapour pressure depends on the temperature alone.",
 ["The compressibility rises as the pressure falls, and the water a cubic foot can carry rises with it.",
  "The gas expands into a larger volume, and a larger volume holds proportionally more water.",
  "The Magnus fit is extrapolated below the inlet pressure and reads high there."],
 "Drop the total pressure and hold the temperature and the mole fraction of water rises, because its numerator has not moved and its denominator has fallen.")

q(3, "Cooling the gas to 59.683517 degF while holding it at 1180.000000 psia leaves it able to hold 10.176445163 lb per MMscf. What is that row of the table for?",
 "It isolates the cooling, so that the effect of the temperature can be read without the pressure change that came with it.",
 ["It is the content the gas reaches inside the valve, before the pressure has finished falling.",
  "It is the lower bound the separator would reach if the pressure were recovered.",
  "It is the content the same duty would deliver in a refrigeration unit."],
 "The first and fourth rows are the two states the plant has. The middle two exist only to isolate one change each, which is a thing an engine can do and a plant cannot.")

q(2, "What does the shape of that four-row table recommend as a method, wherever two inputs move together?",
 "Ask the engine for each single change as well as the combined one, so the combined answer stops being a number taken on trust.",
 ["Hold the input with the larger effect fixed and sweep the other, since a two-way sweep costs more calls than the answer is worth.",
  "Form the ratio of the two single-change answers, which is the figure that says how the two effects trade against one another.",
  "Take the combined answer and subtract each single change in turn, which leaves the interaction between the two inputs as a residual."],
 "The second and third rows are a designed comparison rather than two unrelated answers. Where the digest prints a table and no ratio between the rows, forming one produces a figure nothing stands behind.")

q(1, "Why is what a dew point skid sells described as a depression rather than as an outlet water content?",
 "The cooling is the property of the unit and the water content is the property of the state the gas ends at, which is a pressure as well as a temperature.",
 ["The outlet content cannot be quoted at all until a rate is supplied, and a depression in degF is quotable without one.",
  "The depression is what the engine returns, and no export here can give the content at the state the gas arrives in.",
  "The outlet content is a saturated figure, and a saturated figure is a limit rather than an answer, so only the temperature difference can be sold."],
 "On this let-down the cooling is 36.316483434 degF. Change the outlet pressure and the same cooling leaves the gas at a different content. The saturation routine will give the content at either state, so what is sold is the cooling rather than the read that follows it.")

q(0, "There is no hydrate boundary in this engine. Is that a held item or an absence, and what follows?",
 "An absence, because no correlation is coded and disabled and no figure is recorded and unchecked here.",
 ["A held item, because the boundary is a published correlation this package has not yet read a source against, which is what holding means.",
  "A held item, because the warning above 1000.000000 psia covers the boundary too.",
  "An absence here and a held item in Flow Assurance, which records it unchecked."],
 "A limit is a number this package holds and cannot check. An absence is a subject this engine does not contain, and it becomes an answer only in the engine that owns it.")

q(3, "Flow Assurance owns subcooling, the depression correlations and the inhibitor dose. What does it do about the hydrate boundary itself?",
 "It computes none of its own either, so the boundary arrives from outside both engines and what the platform computes is the margin against it.",
 ["It computes the boundary from the gas gravity, which is why the coefficient this module forms has to travel with the gravity it was formed from.",
  "It computes the boundary from the water content this engine hands over, which is the reason the hand-over carries a water figure at all.",
  "It reads the boundary off the same chart the outlet water spec is read off, which is the chart neither module carries."],
 "A module that guessed a boundary from a gravity correlation would be offering an answer its inputs cannot support, in the one place where being wrong is expensive.")

q(1, "The cold spot this engine reports is the state at the separator. What practical warning goes with handing it over?",
 "It is not necessarily the coldest point in the system, and a margin has to be taken at whichever point is worst.",
 ["It is a saturated state, so the margin has to be taken at the inlet and carried down.",
  "It is reported at the default step count, so a margin on it should be re-marched finer.",
  "It is the coldest point in the system, since nothing downstream can be colder."],
 "A choke, an exposed line or a second let-down downstream can be colder. This engine knows about the one let-down it was given.")

q(2, "Three units in two courses answer the water question. What does each of the three cost?",
 "A regeneration duty, a loss of pressure, and a chemical.",
 ["A regeneration duty, a compressor, and a chart reading the platform does not carry.",
  "A solvent inventory, a refrigeration duty, and an inhibitor recovery train.",
  "A reboiler, a cold separator vessel, and a hydrate boundary read from literature."],
 "A contactor removes water and costs a regeneration duty. A cold separator removes water and costs pressure, which is why a skid with pressure to spare is attractive. An inhibitor removes no water at all and costs chemical.")

q(0, "Which of the three outlet states is conditional on nothing downstream getting colder?",
 "The cold separator outlet, which is saturated at a low temperature.",
 ["The contactor outlet, which is dry at line pressure and stays dry only while the line pressure holds.",
  "The inhibited stream, which is wet and relies on its dose.",
  "All three, since every one of them leaves the gas at a state that a colder point downstream would take past its water dew point."],
 "A contactor outlet is dry at line pressure. An inhibited stream is wet and depends on the dose. Only the cold separator outlet is dry on the condition that the cold spot stays the cold spot.")

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/advanced/fc4a_m03.json', expect_n=15)
finish()
