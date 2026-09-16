import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(1, "EGINA's oil P50 of 130.0000 MMbbl was summed from which rows, and with what else in it?",
 "Egina Main at 95.0000 and Egina Deep at 35.0000, the two oil rows, and nothing else.",
 ["The three reservoir rows at P50, with the Egina Gas Cap's 70.0000 converted to a barrel of oil equivalent before the column was added.",
  "Egina Main at 95.0000 and Egina Deep at 35.0000, each weighted by its recovery factor of 0.340000 and 0.280000 before the two were added.",
  "The oil P90 of 80.0000 MMbbl and the oil P10 of 205.0000 MMbbl averaged, since a P50 sits in the middle of the range the rows describe."],
 "Each column is the arithmetic sum of that column within one fluid, so the gas row of 70.0000 Bcf stays in its own unit and the recovery factors never enter the sum.")

q(3, "The engine reports the gas total as 1 row summing to 70.0000 Bcf. Why does that row count matter as much as the total does?",
 "A fluid with one row has no aggregation in it, so 70.0000 Bcf is one reservoir estimate carried straight through.",
 ["A single row is held as provisional until a second gas reservoir is entered, because the engine will not aggregate a distribution out of one estimate.",
  "The count sets the band on the total, so a one row fluid is given a wider spread from 40.0000 to 110.0000 than two rows of the same size would carry.",
  "The count divides the total to give an average reservoir size, catching a fluid whose rows were entered twice."],
 "The oil total of 130.0000 MMbbl is two rows added and carries the sum of low cases question with it, and the gas total of 70.0000 Bcf does not.")

q(0, "Egina Main carries a recovery factor of 0.340000 and Egina Gas Cap carries 0.650000. What do those two figures contribute to the totals the engine reports?",
 "Nothing at all: the engine adds the P90, P50 and P10 columns and never touches the recovery factor, which is context for the volume and not an input to the sum.",
 ["They scale each row before it is summed, which is why the oil P50 of 130.0000 MMbbl comes out below the two rows added at face value.",
  "They decide which rows may be summed together, since only rows sharing a recovery band are added into one fluid total.",
  "They turn each row from oil in place into a recoverable volume, so 95.0000 MMbbl is 0.340000 of what the Egina Main zone holds."],
 "A row with 0.340000 in it and a row with 0.650000 in it add exactly the same way; the factor says what fraction of the oil in place that estimate assumed.")

q(2, "A row named Aquifer is entered with its fluid typed as Brine. What does the engine return, and what decides the wording?",
 "\"Aquifer: fluid type is missing or unknown (Brine); expected one of Oil, Gas, Condensate\", led by whatever was typed in the name column.",
 ["The row is dropped from the totals and a warning lists the three fluids the engine knows, so the oil and gas figures still come back with the readable rows summed.",
  "The row is given a fourth column of its own, since the engine opens a column for any fluid label it has not met before.",
  "The row is refused by its position as \"row 2\", because a fluid the engine cannot read leaves it nothing to call the row by."],
 "An unnamed row is the one refused by position: \"row 2: fluid type is missing or unknown (undefined); expected one of Oil, Gas, Condensate\".")

q(3, "A slide adds EGINA's oil P50 of 130.0000 MMbbl to its gas P50 of 70.0000 Bcf and prints 200.0000. What has it produced?",
 "A figure in no unit at all, neither barrels nor cubic feet, which can be checked against nothing.",
 ["A barrel of oil equivalent total, which is defensible as long as the heating value used to convert the 70.0000 Bcf is stated beside it.",
  "The field's total recoverable volume at P50, which is the figure the generated document carries in its headline for the plan as a whole.",
  "A correct total in MMbbl, since Bcf is a reporting unit and both columns share one unit."],
 "The engine returns one total per fluid in that fluid's own unit: a million barrels and a billion standard cubic feet are different things sold into different markets.")

q(1, "The published three fluid case returns oil P50 105.0000 MMbbl, gas P50 30.0000 Bcf and condensate P50 4.0000 MMbbl. Why is the condensate kept out of the oil total when both are measured in MMbbl?",
 "A condensate barrel and a crude barrel are not the same barrel and are not priced the same way.",
 ["That case holds two oil rows and one condensate row, and the engine adds only rows whose count matches within a fluid.",
  "Condensate comes out of the gas phase, so the engine totals it with the 30.0000 Bcf and prints it in MMbbl for the reader.",
  "The engine holds it apart until a conversion factor is entered, then folds it into oil."],
 "Oil, Gas and Condensate are the three fluids the engine knows, and each one is totalled in its own column and its own unit.")

q(2, "A volumetric run on the Egina Main zone returns 403.5392 MMstb. What does the reader now hold?",
 "An in place volume, which becomes reserves only after a recovery factor carrying the concept, the drive mechanism, the well count and the producing years inside it.",
 ["A reserves estimate for that zone, since the calculation has already taken the water saturation of 0.220000 out of the pore space.",
  "A recoverable volume at surface, since the formation volume factor of 1.310000 has already shrunk it to stock tank barrels.",
  "A check on the reserves table, since a zone in place volume and the plan's oil P50 of 130.0000 MMbbl estimate one quantity."],
 "Quoting 403.5392 MMstb to somebody who hears reserves is the most expensive rounding error available in this studio, and no arithmetic in the plan catches it.")

q(0, "The oil column sums to 80.0000 MMbbl at P90. Why is that not the field's low case?",
 "It is 60.0000 plus 20.0000, a volume the field reaches only if both reservoirs disappoint in the same world, so the true field low case sits above it.",
 ["It leaves out the gas cap's P90 of 40.0000 Bcf, and a field low case is both columns added together once the gas has been converted onto a barrel basis for the sum.",
  "It is a median rather than a mean, and a median does not add, so the sum falls short of the field by that difference.",
  "It sums rows carrying different recovery factors, 0.340000 and 0.280000, and a column may only be added within one factor."],
 "Two reservoirs disappointing together is less likely than either one disappointing alone unless they share the cause, so a sum of low cases is pessimistic by construction.")

q(2, "Under what condition would 80.0000 MMbbl be a fair low case for the field as a whole?",
 "If the two reservoirs are the same play, charged from the same kitchen and sharing one structural interpretation, so they really would disappoint together.",
 ["If both rows had been entered at one recovery factor, since the column adds honestly only where a single factor runs across the field.",
  "If the plan carried a third oil row, since more rows in a fluid pull the sum towards the field distribution itself.",
  "If the rows had been aggregated rather than added, since aggregation and addition agree at the low case and part company higher up."],
 "Independent reservoirs pull the field distribution inwards and perfectly correlated ones do not; the engine cannot know which EGINA is, so it adds the columns and says what it did.")

q(0, "The oil P10 of 205.0000 MMbbl is 145.0000 plus 60.0000. Where does the field's own high case sit against that figure?",
 "Below it, because 205.0000 MMbbl asks both reservoirs to deliver their high cases at once, and that is less likely than either delivering alone.",
 ["Above it, because adding two high cases understates the upside of a field in the same way that adding two low cases understates how badly it could do.",
  "Exactly on it, because the P10 column is the one column that does add correctly across the rows of a single fluid.",
  "Nowhere readable, because the P10 is a percentile of a distribution the engine never built and only the P50 can be placed."],
 "The sum of low cases is too low and the sum of high cases too high, and the fix in both directions is to aggregate the distributions rather than the percentiles.")

q(3, "Which figure in the EGINA plan may carry a P90 label?",
 "The oil reserves low case of 80.0000 MMbbl.",
 ["The capex of 2250.0000 million USD, whose own uncertainty is written in the same percentile language the reserves rows use.",
  "The NPV of 2015.4123 million USD, since the uncertainty in the reserves is carried through the case into the value it returns.",
  "The recovery factor of 0.340000, which is a percentile of the range of factors that reservoir could turn out to deliver."],
 "P-labels belong to a reserves distribution and to one fluid at a time; a capex carries uncertainty and that uncertainty is written in P-labels nowhere in this studio.")

q(1, "A plan whose reserves came from a loaded example carries a P50 of 130.0000 and an empty table. What does it score, and what is that score for?",
 "33 percent with isValid true, loud enough to send the reader looking for the rows.",
 ["100 percent with isValid true, because the P50 the plan reports is the figure the rows would have totalled to anyway.",
  "0 percent with isValid false, because a summary carried in from an example is not an entry anybody made on this plan.",
  "89 percent with isValid false, because reserves is the one section of the nine the completeness check could not read here."],
 "A summary is something rather than nothing, so the plan stays valid; the 130.0000 reads with nothing underneath it to check, and the score says so.")

q(0, "A plan with a full reserves table and an empty summary box now scores 100 percent and is valid. What did the repair that preceded this course change about it?",
 "Before the repair it scored 78 and failed, because the check read the summary field alone and a table nobody had summarised counted for nothing.",
 ["Before the repair it read the rows but totalled them across fluids, so oil and gas were added together before the score was struck.",
  "Before the repair it refused the plan by name, reporting the blank summary the way a missing oil price is reported today.",
  "Before the repair it took the P50 from the concept's production shape, so the score was struck on a volume nobody had entered."],
 "The reserves were there the whole time, and the completeness check, the generated document and the economics now reach them through one accessor.")

q(2, "A plan whose reserves table cannot be read reports a P50 of 0.0000 beside a completeness of 89 percent. What is that pair telling the reader?",
 "That a reserves section was found and could not be parsed, so no volume was invented and the fix is in the table.",
 ["That the reserves really are zero, since a table the engine cannot read holds nothing that counts as an estimate.",
  "That the summary figure of 130.0000 MMbbl stood in for the rows, which is why the score stays as high as 89 percent.",
  "That eight of the nine sections failed validation and reserves is the one that survived."],
 "It reports 0.0000 rather than a plausible figure, and the published case of an unreadable table scores 22 percent with the error \"Reserves (P50) not estimated.\"")

q(1, "The implied recovery factor of 0.322150 is the oil P50 of 130.0000 MMbbl over an OOIP of 403.5392 MMstb. What is wrong with reading it as this field's recovery factor?",
 "The 130.0000 MMbbl totals two reservoirs and the 403.5392 MMstb is one zone's oil in place, so the ratio divides two different footprints.",
 ["It falls between the 0.340000 and the 0.280000 the reserves table states, so it is an average of those two and not a figure in its own right.",
  "It was built on an OOIP the studio measured rather than on the mapped area of 2400.0000 acres and the 140.0000 ft of net pay.",
  "It sets a P50 volume against an in place figure quoted at P90, so the two sides of the ratio are read at different percentiles."],
 "Two numbers that each came from the engine can still be the wrong pair: 0.322150 is a screening cross check and not a reservoir engineering result.")

emit(Q, '/root/ec-wip-fdp/banks/ec6b_m02.json')
finish()
