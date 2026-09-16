import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Professional final exam. 42 questions across digest Sections 6 to 10,
# with the tier reading. Eight questions need two modules at once: Q5, Q32,
# Q33, Q34, Q35, Q36, Q37 and Q42. No question repeats a module bank's angle.

q(1, "On the padding sweep the row at 40.000000 psia reads 86.736058 ft of pressure head and 87.236058 ft available, and the row at 24.500000 psia reads 52.308173 ft and 52.808173 ft. What separates the two rows?",
 "The drum pressure, and nothing else, because the liquid, the gravity, the static height and the friction are held across the sweep.",
 ["The drum pressure and the static column, since a padded drum carries a taller liquid level above the pump.",
  "The drum pressure and the gravity, since the conversion out of pressure is done at the gravity of the liquid at that pressure.",
  "The drum pressure and the vapour pressure, since a liquid held at a higher pressure boils at a higher one."],
 "A sweep whose gravity or vapour pressure drifts between rows is a set of different liquids, and the shape it draws is not the shape of padding.")

q(3, "The OKONO survey states a source 6.000000 ft above the pump. What would change in the assembly if the source stood below it?",
 "The static term would work against the suction, because its sign is a fact about the layout.",
 ["The static term would be dropped, since only a source above the pump contributes head.",
  "The static term would keep its sign and the friction would change its own, since the liquid is now being lifted through the line.",
  "The engine would refuse the survey, since a suction lift is outside what this package assembles."],
 "A source above the pump arrives with its height in hand and it adds. A source below it has to be lifted first.")

q(0, "Which stated condition reaches the pressure head of 52.308173 ft and never reaches the static column of 6.000000 ft?",
 "The specific gravity of 1.040000, because the conversion out of pressure runs at the gravity of the liquid being pumped.",
 ["The suction friction of 5.500000 ft, because it is spent before the liquid reaches the flange and the pressure head is what is left.",
  "The drum pressure of 24.500000 psia, because a static column measured in feet is already a head and needs no conversion.",
  "The warning field, because a flashing liquid changes the conversion and leaves the geometry alone."],
 "The static column is a height the liquid already has, stated in feet. The pressure head is a pressure turned into feet, and the gravity is what turns it.")

q(2, "A suction sitting exactly at its vapour pressure, 6.200000 psia against 6.200000 psia, returns a pressure head of 0.000000 ft and an available head of 25.000000 ft. Which part of that return carries the state of the liquid?",
 "The warning, since the pressure head of 0.000000 ft is an ordinary arithmetic result and the available head of 25.000000 ft is positive.",
 ["The pressure head, since 0.000000 ft is the value the engine reserves for a liquid that has reached its own boiling pressure at the flange.",
  "The available head, since 25.000000 ft is below the figure at which a suction of this kind would normally sit.",
  "The error key, since a liquid at its vapour pressure is one of the states this call refuses to answer."],
 "The pressure head of 0.000000 ft is an ordinary arithmetic result and there is no error key on that return, so one field and one only carries the state of the liquid.")

q(0, "The available head of 19.143662 ft from the flashing suction is handed to the margin check against a stated required NPSH. What comes back?",
 "A margin, a required margin, a ratio, a pass flag and a severity, with nothing on that return to say the liquid was already flashing.",
 ["A refusal, since the available head arrived from a call that carried a warning and the check will not judge a warned figure.",
  "A severity of \"cavitating\" whatever the required head, since the pressure head behind 19.143662 ft was negative.",
  "A verdict with the flashing warning carried through, since the check copies any warning on its inputs into its own return."],
 "The available head is the whole of what this function judges, and 19.143662 ft is finite and readable. A head assembled from a survey and a head somebody typed in are judged identically.")

q(3, "The 5.500000 ft of suction friction arrives as a stated number. Which work does this package leave to another course?",
 "What a suction line's length, bore, fittings and rate cost in feet of head.",
 ["What the required NPSH of the machine is at the duty flow.",
  "What the vapour pressure of the liquid is at the suction temperature.",
  "What the static height between the source and the pump is on the built installation."],
 "That seam matters when a suction is marginal, because the friction is then the term most likely to have been guessed.")

q(2, "In the crossover table, what is the column headed \"the available head that exactly satisfies it\"?",
 "The available head at which the margin is exactly the required margin, which is 16.200000 ft at a required NPSH of 12.000000 ft.",
 ["The available head a padding sweep would have to reach before the required margin column stopped holding at one figure across every row of it.",
  "The smallest available head the engine will judge without a warning at that required NPSH.",
  "The available head at which the floor and the fraction return the same required margin."],
 "The boundary is where the margin equals the required margin exactly. At a required NPSH of 30.000000 ft it is 40.500000 ft.")

q(1, "Which required NPSH in the crossover table is governed by the floor, and what does the engine apply there?",
 "4.000000 ft, where the required margin is 3.000000 ft.",
 ["12.000000 ft, where the required margin is 4.200000 ft.",
  "16.000000 ft, where the required margin is 5.600000 ft.",
  "30.000000 ft, where the required margin is 10.500000 ft."],
 "Below the crossover of 8.571428571 ft the floor is the larger of the two halves. The other three rows in that table are governed by the fraction.")

q(2, "Why is the figure in the last column of the crossover table called a boundary ratio rather than the rule?",
 "It is an output of the rule at a stated required NPSH, and turning an output into a rule fails as soon as the case crosses 8.571428571 ft.",
 ["It is a ratio while the rule is stated as a margin in feet, so the two carry different units and a reader cannot substitute one for the other.",
  "It is measured at the boundary of the rule while the rule itself applies across the whole range of required NPSH, so the two agree only at that point.",
  "It is derived from the floor and the fraction together, so it belongs to neither half on its own."],
 "On the three rows the fraction governs it reads 1.350000000 every time. On the floor row it reads 1.750000000.")

q(0, "The note on a marginal case names two things the case needs. What are they?",
 "Vendor agreement and a stable suction.",
 ["A larger pump and a stable suction.",
  "Vendor agreement and a re-read of the required NPSH at the duty flow.",
  "A padded drum and vendor agreement."],
 "Those are the two things the engine asks for on a marginal case, and neither of them is a figure this course grades.")

q(3, "Code that tests the error key, then the severity, then the pass flag reads three answers apart. What does code written on the pass flag alone collapse?",
 "A refusal, a cavitating suction and a marginal one into a single failed check.",
 ["A refusal and a cavitating suction into one, leaving the marginal case correctly separate.",
  "A marginal suction and an adequate one into one, since both clear the vendor's own requirement.",
  "A refusal and an adequate suction into one, since neither of them reports a shortfall."],
 "A refusal is a returned object carrying an error key. It is not a severity and it is not a pass of false, and the engine reported that it never ran a check.")

q(1, "What does the margin check NOT return when it refuses?",
 "A severity and a pass flag, because there is nothing left to compare the rule against.",
 ["A message, because the refusal names the input rather than describing it.",
  "The required margin, because that half of the answer is computed from the required NPSH and survives the refusal.",
  "The ratio, because it is computed last and the other fields are returned as far as the check reached."],
 "The whole of the return is a single error key. Nothing partial travels beside it, because there was no comparison to report on.")

q(2, "At a speed ratio of 0.900000 the head quotient is 0.810000000 and the power quotient is 0.729000000. What would a reader miss who saw only those two columns?",
 "The size of the departure from the law, which the difference columns put at 0 and 1.1102230246251565e-16 on that row.",
 ["The direction of the departure from the law, which only the difference columns carry and which a quotient column can never be read for.",
  "That the row was warned, which is recorded in a column the quotients do not reach.",
  "That the quotients were derived rather than returned, which the difference columns are not."],
 "A quotient column shows what happened and a difference column shows how far that is from the claim. Only the second is evidence of anything.")

q(1, "A speed ratio of 0.800000 returns 93.717444 brake hp and a trim ratio of 0.800000 returns 93.717444 brake hp, while their flows are 987.562375 gpm and 943.122068 gpm. Why do the power figures agree?",
 "The power leg of a trim is left as the ideal cube, so only the head and flow legs are de-rated.",
 ["The shortfall model is applied half to the flow and half to the power, and the halves cancel in the brake power.",
  "Brake power is computed from the ideal columns of a trim, and the ideal flow at 0.800000 is 987.562375 gpm on both.",
  "The two changes are the same change expressed two ways, so every column of the two rows agrees."],
 "Less flow and less head for the same power is an efficiency statement, and the return carries it as a field of its own.")

q(3, "The implied efficiency ratio reads 1.000000000 on the trim rows at 1.000000, 0.980000 and 0.950000. Why?",
 "The shortfall is zero there, so nothing was de-rated and there is nothing for the ratio to report.",
 ["Those three rows are inside the casing limit the trim warning names, so no efficiency change is modelled.",
  "The ratio is normalised to the untrimmed row, so the rows nearest it round to one.",
  "The power leg is the ideal cube on every row, and on shallow trims it dominates the ratio."],
 "A ratio between two legs that were not touched is one. The model leaves a trim of that depth alone.")

q(0, "The implied efficiency ratio is 0.827200000 at a trim ratio of 0.700000, and the worked case at a trim ratio of 0.750000 reaches 0.827200000 as well. What do those two trims have in common?",
 "Both sit at the cap, so both carry a shortfall percent of 12.",
 ["Both are deeper than the vendor limit the warning names, and the model holds the ratio flat beyond it.",
  "Both return the same ideal flow, so the two legs of the ratio are the same on each.",
  "Both were measured by bisection rather than returned, so both carry the same rounding."],
 "The shortfall is capped at 0.12, which is a head leg of 0.880000000 and a flow leg of 0.940000000 whatever the trim beyond the cap.")

q(2, "At a trim ratio of 0.550000 the engine returns a trim percent of 44.99999999999999 and a shortfall percent of 12. What is that row for?",
 "It shows the cap holding well past the trim at which it was reached.",
 ["It shows the trim percent failing to reach a whole number, which is why the warning fires there.",
  "It shows the shortfall growing at 0.006 per further percent all the way down.",
  "It shows the deepest trim the engine will answer before it refuses."],
 "The cap is reached at a trim ratio of 0.750000, where the trim percent is 25 and the shortfall percent is 12. It does not move after that.")

q(1, "At a trim ratio of 0.550000 the engine describes a 45.0 percent trim. What does that message say about the vendor limit?",
 "That it usually sits near 20 percent, which is the same sentence attached at a trim ratio of 0.799900.",
 ["That it has been passed by more than double, so a second and deeper limit is named alongside it.",
  "That the limit moves with the depth of the cut, which is why the message restates it on each row.",
  "That the limit is the cap of 0.12 on the shortfall, written as a percentage of the diameter."],
 "One sentence covers the whole range beyond the threshold, and it names efficiency falling away as what the limit is about.")

q(0, "The extrapolation warning at a speed ratio of 100.000000 singles out one of the three legs. Which, and why does it say so rather than leave it to be inferred?",
 "The power leg, because it goes as the cube and it is the figure that sizes the driver.",
 ["The head leg, because it goes as the square and the head is what the vendor quotes a machine against.",
  "The flow leg, because 123445.296915 gpm is the figure that is absurd on its face.",
  "The power leg, because 183041883.582474 brake hp is the largest of the three figures returned."],
 "Naming the leg is the point. A reader is told which figure the extrapolation reaches instead of being left to work it out.")

q(3, "At a unit duty a trim ratio of 0.950000 returns a flow factor of 0.950000000. What does that tell you about the model inside those factors?",
 "It leaves a trim of that depth alone, which is why the factor is the plain ratio there.",
 ["It has been switched off for the factor table, which is why the trim rows read as the affinity laws.",
  "It applies to the head factor only at that depth, which is why the flow factor is the plain ratio.",
  "It rounds the flow factor to the trim ratio wherever the shortfall is below a tenth of a percent."],
 "A trim ratio of 0.800000 returns 0.764000000 rather than 0.800000000, because the shortfall model is inside these factors.")

q(1, "At a trim ratio of 0.850000 the two answers are 851.147837 gpm at 308.788996 ft and 1017.806473 gpm at 283.749561 ft. What do the heads add to what the flows already say?",
 "That the two answers differ in opposite directions on the two coordinates, with the re-solved head the higher of the two.",
 ["That the two answers differ in the same direction on both coordinates, with the re-solved figures lower on each.",
  "That the head gap is the shortfall and the flow gap is the system, which is how the two mechanisms separate.",
  "That the re-solved answer lies further down the system curve, so both of its coordinates fall."],
 "The quotients on that row are 1.195804570 and 0.918910857. The crossing slides along a fixed system curve and the map slides along the machine's own law.")

q(2, "Where do the two answers for one change appear in the Pump Station Designer?",
 "The crossing is the chart and the duty headline; the map is a card headed \"What a change would buy\".",
 ["The crossing is printed in the card; the map is what the chart and the duty headline are both drawn from.",
  "Both appear in the duty headline, one above the other, so a reader can compare the two answers without opening a card.",
  "The crossing is the chart and the map is printed only when the two disagree by enough to matter."],
 "The chart and the headline are one answer and the card is the other. Computing one and labelling it generically is what creates the confusion.")

q(0, "The quotient columns are the one-point answer over the re-solved answer. Reading 0.949032669 at a speed ratio of 1.100000, what follows from that ordering?",
 "The one-point flow of 1357.898266 gpm is below the re-solved flow of 1430.823522 gpm.",
 ["The one-point flow is above the re-solved flow, since a quotient below one puts the denominator first.",
  "The two flows are within five percent of each other, which is what a quotient near one records.",
  "The re-solved flow is the smaller of the two on every speed row above 1.000000."],
 "A quotient below one puts the numerator, which is the one-point answer, below the denominator.")

q(3, "Which of the two heads printed on the 0.950000 row is the larger, and how does the quotient of 0.980245113 say so?",
 "384.664421 ft is the larger, because a quotient below one puts 377.065419 ft under it.",
 ["377.065419 ft is the larger, because the numerator of a quotient below one is the bigger of the two.",
  "Neither, because a head quotient records how far the head moved rather than which figure is above which.",
  "384.664421 ft is the larger, because the re-solved head is above the mapped head on every row of both tables."],
 "The quotient is the one-point answer over the re-solved one. On that row the shortfall percent is 0, so the model owes nothing to either figure.")

q(1, "The three-machine parallel row reads 1219.484579 gpm at 527.036531 ft with 406.494860 gpm per machine. What question does that last figure answer?",
 "What each machine is carrying, which is where it sits on its own curve.",
 ["What the station delivers, which is the figure a manifold is sized on.",
  "What a fourth machine would add, which is the difference between the rows.",
  "What one machine would deliver on its own, which is the reference the other columns are read against."],
 "One machine on its own carries 1103.518695 gpm. Quoting a per-machine flow as a station flow, or the reverse, is the error the table invites.")

q(0, "Two machines in series give 1465.998506 gpm at 734.940178 ft, with a head over one machine of 1.661125814. Which figures moved from the single-machine row, and why?",
 "Both, because a taller curve crosses the same system further to the right and the system charges more head there.",
 ["The head only, because series operation adds head at equal flow and the flow is therefore unchanged.",
  "The flow only, because the head over one machine is what the combination fixes and the duty head follows it.",
  "Neither in a way that matters, because the head over one machine is the figure the stack is judged on."],
 "One machine gives 1103.518695 gpm at 442.434987 ft. The heads add exactly at every flow, and the crossing landed somewhere else.")

q(2, "A station makes enough flow and cannot reach the head it needs. Which arrangement answers that shortage?",
 "Series, because the machines pass the same liquid one after another and their heads add.",
 ["Parallel, because the combined curve is built by adding flows at equal head.",
  "Either, because both arrangements raise the duty head of the station on a friction-dominated system.",
  "Neither, because the shortage is a property of the system curve and no arrangement of machines reaches it."],
 "Parallel answers a shortage of flow at a head the station can already make. The system decides which shortage you have.")

q(3, "At 20.000000 cSt the flow and head factors are both 0.997024668 while the efficiency factor is 0.946562979. What does that spread say?",
 "The efficiency is the first of the three to move away from water, and by far the most.",
 ["The flow and head factors are equal by measurement on this row and part company further out.",
  "The efficiency factor carries the square of the other two, which is why it falls faster.",
  "The row is near enough to water that the correction has not yet taken hold on any of the three."],
 "At 320.000000 cSt the pair is 0.894963166 and the efficiency factor is 0.637190119. Correcting the capacity and leaving the efficiency at its water value is the mistake this invites.")

q(1, "Three of the nine viscosity rows carry a warning and the section prints two of those messages in full. Which row's message is not printed?",
 "The 2400.000000 cSt row.",
 ["The 850.000000 cSt row.",
  "The 9000.000000 cSt row.",
  "The 320.000000 cSt row."],
 "The two printed are at 850.000000 cSt and at 9000.000000 cSt. The 320.000000 cSt row carries no warning at all.")

q(0, "At 5.000000 cSt the engine reports B = 0.951900876 with the note \"B at or below 1: no correction applies\". What kind of statement is that note?",
 "A statement about the correlating parameter being small enough that the method leaves the curve alone.",
 ["A statement about the fluid being water, which is the other of the two branches on which no correction is applied at all.",
  "A statement that B could not be computed on that row, so no factors were produced.",
  "A statement that the correction was applied and came back at unity on all three factors."],
 "The note at 1.000000 cSt is the other one and reads \"at water viscosity there is nothing to correct\". Two branches, two notes, two reasons.")

q(2, "On the water row the corrected flow is 1150.000000 gpm against a stated best efficiency flow of 1150.000000 gpm, a difference of 0 gpm. Why are those fields present at all on a branch that corrects nothing?",
 "Because the catalogue values unchanged are an answer, and the return shape is the same on every branch.",
 ["Because a caller needs the fields to detect which branch it landed on without reading the note.",
  "Because the engine computes the correction on every branch and suppresses it afterwards on this one.",
  "Because the fields carry the stated inputs back to the caller wherever no output was produced."],
 "They are present on the water row, on the row a millionth above it and on a corrected row. A caller does not have to know which branch it landed on to read them.")

q(3, "A pure speed row in the factor table reads as the plain ratio and its square, and a pure trim row does not. What is the difference between the two rows made of?",
 "The shortfall model sits inside the trim factors and there is nothing corresponding inside the speed factors.",
 ["The speed factors are read at a unit duty and the trim factors at the base duty, so the two are on different references.",
  "The trim factors carry the implied efficiency ratio and the speed factors do not.",
  "The speed factors are exact because they were measured and the trim factors are modelled, so the trim carries a rounding."],
 "A trim ratio of 0.800000 gives a flow factor of 0.764000000. A speed ratio of 0.800000 gives 0.800000000.")

q(1, "A speed ratio of 0.700000 appears in two places with two answers, 864.117078 gpm and 502.692592 gpm. What is each of them?",
 "The first is where the old duty point lands on the new curve; the second is where the new curve crosses the system.",
 ["The first is the ideal flow and the second the real flow, since a speed change is de-rated like a trim.",
  "The first is the flow at the base speed scaled by the ratio and the second the same flow scaled by the ratio cubed.",
  "The first is a curve reading at a stated flow and the second the duty of the same machine."],
 "Both are correct answers to two different questions. The affinity map is a real point on the new curve, and the crossing is where the machine will run.")

q(0, "A margin check takes two numbers. On the OKONO case, where does each of them come from?",
 "The available head of 52.808173 ft came from the survey; the required NPSH is a vendor figure this package does not compute.",
 ["The available head came from the survey and the required margin of 5.600000 ft came from the vendor's datasheet.",
  "Both came from the survey, since a required NPSH is one of the stated suction conditions.",
  "The required NPSH came from the survey and the available head is computed by the check itself."],
 "A required figure comes off a pump test and belongs to one impeller in one casing. This package does not compute it and does not pretend to.")

q(2, "Two held models in this tier print something beside their own answer. Which prints an ideal column beside a real one?",
 "The trim, where the affinity laws applied to a diameter ratio sit beside the de-rated figures on every row.",
 ["The viscosity correction, where the catalogue values are printed beside the corrected ones on every row of the table.",
  "The margin rule, where the required margin is printed beside the margin itself on every row of the padding sweep.",
  "Both of them, since each returns the uncorrected figure beside the corrected one."],
 "A single de-rated answer would carry no evidence of the de-rating. On the no-correction branches of the viscosity method the corrected fields are the catalogue values themselves.")

q(3, "The margin check and the parallel combination each refuse, and the two messages name two different inputs. What does each name?",
 "One names an available NPSH that is not finite; the other names a machine count that is not a whole number at least one.",
 ["One names a required NPSH that is not finite; the other names a pump curve that does not fall with flow.",
  "One names a machine count; the other names a curve whose crossing with a system is not a duty point.",
  "One names an available NPSH that is not finite; the other names a trim ratio outside the range the model covers."],
 "The margin check needs a finite available NPSH. Parallel and series each need a pump curve and a whole number of machines, at least one.")

q(1, "The trim warning names a vendor limit and the margin rule names a customary cover. Does the engine ever refuse on either?",
 "No. Both are reported, and neither is used to withhold an answer.",
 ["Yes, the trim warning refuses beyond the cap of 0.12 and the margin rule refuses a cavitating suction.",
  "Yes, the margin rule refuses when the severity would be cavitating, and the trim warning only comments.",
  "No, but the trim warning suppresses the real columns beyond the vendor limit it names."],
 "At a trim ratio of 0.550000 the engine returns the full row with a message. A cavitating suction comes back with a severity and a pass of false.")

q(0, "The speed table and the trim table are both anchored on 1234.452969 gpm at 417.801018 ft with 183.041884 brake hp. What is that anchoring for?",
 "It is one duty on one machine, so two kinds of change are measured from the same starting point.",
 ["It is the published duty case, so both tables can be checked against a golden.",
  "It is the point at which the affinity laws are defined, so neither table can begin anywhere else.",
  "It is the duty at which the shortfall is zero, so the trim table opens with nothing de-rated."],
 "Both are asked there. A shared starting point is what makes the rows of the two tables readable against each other at all.")

q(2, "At a speed ratio of 100.000000 the flow comes back as 123445.296915 gpm. Where is the extrapolation comment actually earning its keep?",
 "Just outside the band, where the returned figures look perfectly ordinary and nothing else marks them.",
 ["At ratios like this one, where the figures are large enough that a reader might take them for a unit error and check.",
  "Inside the band, where the absence of a comment is what tells a reader the ratio was accepted as reasonable.",
  "At the two ends themselves, where the behaviour changes state and the band can be walked out of the engine."],
 "A flow of 123445.296915 gpm is absurd on its face. Suppressing a comment because the answer looked reasonable is the mistake it guards against.")

q(3, "Of the three parts of NPSH available, which does this package compute and which is it handed?",
 "It computes the pressure head; the static height and the suction friction are both stated conditions.",
 ["It computes the pressure head and the friction; only the static height is a stated condition.",
  "It computes all three out of the suction survey, which is what makes each of them movable.",
  "It computes the static height from the survey; the pressure head and the friction are stated."],
 "What a suction line costs in feet of head belongs to the course that owns line losses, and a height between a source and a pump is surveyed rather than derived.")

q(1, "This tier cites another course rather than re-deriving what it owns. Which material, and where does it live?",
 "The affinity laws, the best efficiency point and the operating range, taught by the ESP course in the Production module.",
 ["The system curve and the duty point as a solved intersection, taught by the ESP course in the Production module.",
  "The Hydraulic Institute viscosity correction, taught by the ESP course in the Production module.",
  "The NPSH margin rule, taught by the ESP course in the Production module."],
 "This course takes up the narrower question of which changes to a pump the laws describe and which they do not.")

q(2, "A trimmed machine and a parallel stack both change the machine curve while the system stays where it is. What does the engine do in each case?",
 "Solves a fresh crossing of the new curve with the old system, which is the same operation both times.",
 ["Scales the old duty point in the first case and solves a fresh crossing in the second.",
  "Solves a fresh crossing in the first case and adds the machines' flows at the old duty head in the second.",
  "Scales the old duty point in both cases, since the system curve did not move in either."],
 "The combined curve is a new machine curve and the duty is solved the way any duty is solved. The affinity map is the other, separately labelled answer to a different question.")

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/intermediate/fc3i_exam.json', expect_n=42)
finish()
