import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(2, "The same FPSO concept returns an NPV of -197.2391 million USD at 40.0000 USD a barrel and 3121.7380 at 85.0000 USD a barrel. What differs between those two runs?",
 "Only the price at the head of each run: the capex of 2250.0000, the 20 year shape and the fiscal terms are identical.",
 ["The peak rate, because the engine trims the plateau of 60.0000 kbpd when a price cannot support it, so the cheaper run lifts fewer barrels as well.",
  "The discount rate, because a run priced at 40.0000 is discounted above the default 10.0000 percent.",
  "The fiscal terms, because the royalty of 12.5000 percent is charged only once a case can pay it."],
 "Four evenly spaced prices give -197.2391, 909.0866, 2015.4123 and 3121.7380, and the value steps up by the same amount each time because only what a barrel earns moves."),

q(0, "A scenario priced at 0 returns an NPV of -3554.2621 million USD, while a scenario whose price box is left empty returns no value at all. What separates the two inputs?",
 "A typed zero is a number somebody chose, so the engine answers it; a blank is refused by name with the message that the scenario oil price is missing.",
 ["Nothing in the inputs, because a blank reads as zero and both runs land on -3554.2621, with the missing price only noted.",
  "The sign of the entry, because zero is inside the accepted band while a blank reads as a negative price and is stopped as one.",
  "The default, because a blank price falls back to the 70.0000 USD a barrel the studio substitutes and quietly returns the Base value of 2015.4123."],
 "Zero is accepted and returns -3554.2621; the silent substitution of 70.0000 USD a barrel ended in September 2026, and a missing price is now refused by name."),

q(3, "The Stress scenario at 18.0000 USD a barrel reports an NPV of -1834.1220, an IRR status of no-root and a payback of never. What does that payback state?",
 "That the cumulative cash position never crosses zero, so a refusal is reported in place of a number.",
 ["That payback falls in the last year of the 20.0000 year life, since a case ending at -1834.1220 has recovered all but that part of its capex of 2250.0000.",
  "That payback could not be computed because the rate of return has status no-root, and the engine withholds both figures whenever either one of them fails.",
  "That the capex of 2250.0000 is recovered exactly at the end of the profile, so the crossing sits on the last of the 21 rows the case carries."],
 "The cumulative opens at -2250.0000 and never climbs out at that price; 5.7734 years at 48.0000 USD a barrel and never at 18.0000 are answers of the same kind, one measured and one refused."),

q(1, "The Base case takes 2011.8812 of royalty and 3276.9239 of tax out of gross revenue of 16095.0492. A reader quotes the tax alone as what the state receives. What has that reader left out?",
 "The royalty of 2011.8812, so the state's 5288.8051, which is 0.328598 of gross revenue, is understated by that whole line.",
 ["Nothing of the state's money, because royalty is charged to the operator's own account beside the operating cost of 3049.6464 and never enters the government take.",
  "The capex of 2250.0000, which is recovered from the state before tax is charged.",
  "The discounting, because the take of 5288.8051 is a present value while the tax is money of the day."],
 "Government take is royalty plus tax, 5288.8051 against gross revenue of 16095.0492, which is a share of 0.328598."),

q(0, "Year 1 of the Base case earns gross revenue of 1533.0000 and is charged a royalty of 191.6250. Where does the 191.6250 come from?",
 "The default royalty of 12.5000 percent applied to that year's own gross revenue, charged year by year rather than on the life total.",
 ["The life royalty of 2011.8812 spread evenly across the producing years, which gives each of them the same charge.",
  "The royalty of 12.5000 percent applied after the operating cost of 204.5000 is taken off the year's revenue.",
  "The tax rate of 30.0000 percent applied to the net cash flow of 795.8125 that the year closes with, before any discounting."],
 "12.5000 percent of 1533.0000 is 191.6250, and years 1, 2 and 3 carry the same charge because each earns the same 1533.0000 on the plateau."),

q(2, "The concept carries a fixed operating cost of 95.0000 million USD a year, yet year 1 of the Base case is charged 204.5000 and year 4 is charged 193.5500. What accounts for both figures?",
 "A variable 5.0000 USD on every barrel is added to the fixed 95.0000, and year 4 lifts fewer barrels than a plateau year.",
 ["The operating cost is grown each year at the discount rate of 10.0000 percent, so year 4 carries four years of that escalation on the 95.0000.",
  "The 95.0000 is stated after the royalty of 12.5000 percent, and the engine grosses it back up before charging it, which lifts every row above it.",
  "The decommissioning provision of 260.0000 is spread across the 21 rows of the case."],
 "Fixed 95.0000 plus 5.0000 USD a barrel gives 204.5000 on a full plateau, and the fixed part does not move when the rate declines, so year 4 falls only to 193.5500."),

q(1, "Year 0 of the Base case shows gross revenue of 0.0000 and capex of 2250.0000. What should a reader do with that row?",
 "Read it as the answer: the whole capex is spent in the year before production, and first oil is 36 months after sanction on this concept.",
 ["Treat the blank revenue as missing data and enter the plateau rate of 60.0000 kbpd against it, since no year is empty.",
  "Read the -2250.0000 in its cumulative column as the loss the plan makes and the later rows work to cover.",
  "Spread the capex of 2250.0000 over the three plateau years, since the subsea system is installed while the field produces."],
 "Year 0 is the build, so the cumulative opens at -2250.0000, the deepest cash position the case reaches, and the capex column reads 0.0000 for the rest of the life."),

q(3, "The Base case reports a deepest cash position of -2250.0000 million USD. What is that figure?",
 "The furthest the plan is ever out of pocket, reached at year 0 and closed by year 3.",
 ["The loss the case carries to the end of its life, which the NPV of 2015.4123 states once the discount of 10.0000 percent has been applied to it.",
  "The part of the capex still outstanding after the plateau, since years 1 to 3 each return 795.8125 of net cash flow against a spend of 2250.0000.",
  "The cumulative position at the end of the 21 rows, once the decline has run down to 10.0063 kbpd and the field stops earning."],
 "The cumulative opens at -2250.0000 and stands at 137.4375 after year 3, so the deepest position is a moment in the case and not its result."),

q(2, "Payback on the Base case is 3.8273 years. Which two cumulative cash positions does that crossing sit between?",
 "-658.3750 after year 2 and 137.4375 after year 3, with the crossing placed inside year 3.",
 ["-1454.1875 after year 1 and -658.3750 after year 2, because the hole is closed once two plateau years of 795.8125 have been earned against it.",
  "137.4375 after year 3 and 847.0187 after year 4, because the crossing is dated from the first row whose cumulative column is positive onward.",
  "-2250.0000 at year 0 and -1454.1875 after year 1, counting from the spend."],
 "The cumulative reads -658.3750 after year 2 and 137.4375 after year 3, and the engine places the crossing by how far into that year the remaining hole is closed."),

q(1, "Year 4 of the Base case earns 709.5812, year 5 earns 631.9731, and the decline runs on to the end of the 21 rows. How much of that money reaches the payback figure of 3.8273 years?",
 "None of it, because payback stops at the crossing, while the NPV of 2015.4123 counts every one of the 21 rows.",
 ["All of it, because payback is measured on the same discounted flow as the NPV of 2015.4123 and therefore reads the whole of the life.",
  "Year 4 alone, because the crossing at 3.8273 years counts the rest of that year.",
  "The money earned before the decline begins, so 709.5812 counts and the later rows do not."],
 "Two cases with the same payback can hold quite different money after the crossing, and only a value figure such as 2015.4123 can tell them apart."),

q(0, "The tie-back pays back in 3.2035 years and the FPSO in 3.8273 years at the same 70.0000 USD a barrel. What does a reader who ranks the two on payback alone give up?",
 "The larger value, because the quicker concept is worth 1013.7182 against the FPSO's 2015.4123 at that price.",
 ["Nothing measurable, because the tie-back also carries the higher of the two rates that zero its flow, 40.4136 against 29.5779, so every measure agrees with it.",
  "The lower capex, because a payback ranking selects the FPSO's spend of 2250.0000 over the tie-back's 730.0000, which is the harder of the two to fund.",
  "The longer life, because a ranking on payback prefers 20.0000 years to 15.0000."],
 "The quicker concept is the smaller one, 1013.7182 against 2015.4123 at one price, so a payback ranking puts the smaller value first."),

q(3, "At 70.0000 USD a barrel the tie-back returns 1.388655 per million USD of capex and the FPSO returns 0.895739. What does that pair of ratios not say?",
 "How much value each concept leaves in total, because a ratio has no size in it.",
 ["Which of the two spends less, because the ratio is built on the capex of 730.0000 and 2250.0000 and reports the cheaper concept as the higher figure.",
  "Which concept the studio selects, because a ratio above one marks a development the engine passes and 0.895739 marks one it holds back.",
  "How the two would rank on the rates that zero their flows, because the ratio is one of those rates restated for each million USD of capex."],
 "On a budget that can carry 2250.0000 the FPSO leaves 2015.4123 where the tie-back leaves 1013.7182, and the ratio of 1.388655 says nothing about that gap."),

q(1, "The FPSO concept's lifecycle cost is 4150.0000 million USD and the tie-back's is 1330.0000. What is each figure made of?",
 "Capex of 2250.0000 with 1900.0000 of operating cost over 20.0000 years, against 730.0000 with 600.0000 over 15.0000 years.",
 ["Capex of 2250.0000 with the decommissioning provision of 260.0000 and the 3049.6464 of operating cost the Base case charges across its life.",
  "The capex each concept carries grossed up by the royalty of 12.5000 percent and the tax of 30.0000 percent.",
  "The capex each concept asks for added to the value it earns, 2015.4123 on 2250.0000."],
 "Lifecycle is capex plus operating cost over the concept's own life, so 2250.0000 and 1900.0000 give 4150.0000, and 730.0000 and 600.0000 give 1330.0000."),

q(2, "A tie-back is entered with drilling capex of 240.0000 and facilities capex of 180.0000, and its subsea line of 310.0000 is never typed. What does the engine do with it?",
 "It screens the concept on the two fields it carries, because only a concept with no capex at all is refused.",
 ["It refuses the concept by name, because the message about a concept carrying no capex is raised whenever one of the three capex fields is empty.",
  "It substitutes the missing line from the FPSO concept's subsea capex of 380.0000, scaled to the tie-back's peak of 25.0000 kbpd, and marks it as estimated.",
  "It falls back to the concept capex of 100 million USD that nobody typed."],
 "The engine reads all three fields and totals what is there, so the concept is screened on less than the 730.0000 it costs, and the refusal is kept for a concept carrying no capex at all."),

q(0, "The Base case reports 2015.4123 million USD at a discount rate of 10.0000 percent taken mid year. What does that figure state?",
 "What the case is worth against earning 10.0000 percent elsewhere, with the cash treated as arriving through each year.",
 ["The cash the plan pays out, because the undiscounted total of the 21 rows comes to 2015.4123.",
  "What is left once the government take of 5288.8051 is paid, with the discount applied to the capex alone.",
  "The value at the end of the 20.0000 year life, carried forward at 10.0000 percent from year 0."],
 "Nothing in a plan pays out 2015.4123: the figure is a comparison against a 10.0000 percent alternative, and mid year treatment puts the cash through the year rather than on its last day."),

emit(Q, '/root/ec-wip-fdp/banks/ec6b_m04.json')
finish()
