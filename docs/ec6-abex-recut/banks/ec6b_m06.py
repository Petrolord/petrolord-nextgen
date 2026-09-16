import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(2, "A slide reports the field's reserves as 200.0000 and the FPSO concept's capex as 1350.0000 million USD. Which two rules were broken?",
 "Oil and gas were added across their units, and the capex was read from the facilities field alone.",
 ["The reserves were summed at P50 where a screening slide wants the low case, and the capex was taken from the cost items rather than from the concept record.",
  "The reserves were quoted without their recovery factors, and the capex before drilling was estimated.",
  "The reserves were rounded before they were added, and the capex quoted in the wrong unit."],
 "Oil is 130.0000 MMbbl and gas is 70.0000 Bcf, which never add, and the concept's capex is 520.0000, 1350.0000 and 380.0000 read together as 2250.0000."),

q(0, "A reader sets the FPSO's 2015.4123 beside the tie-back's 1013.7182, and the oil P50 of 130.0000 beside the gas P50 of 70.0000. Which comparison stands?",
 "The two values, because both are million USD on the same field at 70.0000 USD a barrel, while the two reserves figures are different fluids in different units.",
 ["The two reserves figures, because both come from one plan through one accessor, while the values were run on concepts of different capex, life and peak rate.",
  "Both of them, because each pair is drawn from a single plan and the studio prints the members of a pair beside each other on the same card.",
  "Neither of them, because the values sit on capex of 2250.0000 and 730.0000 and the reserves sit in MMbbl and Bcf."],
 "Two values at one price are comparable, and the differences between the concepts are what the comparison is about; 130.0000 MMbbl and 70.0000 Bcf are not comparable at all."),

q(1, "A question asks for the plan's annual operating cost and the answer given is 3049.6464. What has been answered instead?",
 "The operating cost across the whole Base case, where the annual figure is 95.0000 a year.",
 ["The cost of one plateau year, which the case charges at 204.5000 once the variable part is added to the fixed part of it.",
  "The Operate phase roll-up of 355.0000 restated across the life, carrying the decommissioning provision of 260.0000 inside it.",
  "The concept's fixed cost over its 20.0000 year life of 1900.0000."],
 "3049.6464 is the life total the Base case charges, above the 1900.0000 that 95.0000 a year gives, and half the wrong answers in this subject are right answers to a different question."),

q(3, "A question gives a concept's drilling, facilities and subsea figures and asks for its capex. What is the method?",
 "Add the three fields the concept carries, as 520.0000, 1350.0000 and 380.0000 give 2250.0000.",
 ["Read the single total capex field the concept record holds, which somebody fills in once the three estimates have been added by hand.",
  "Read the CAPEX total of the plan's cost items, which the engine copies onto the concept.",
  "Take the facilities figure and gross it up for the rest of the work."],
 "The engine reads all three fields, and a capex read from a field the form never wrote is confidently wrong however plausible it looks."),

q(1, "What production profile does a concept imply in the screening tier?",
 "A plateau at its peak rate and then a decline of 0.900000 a year, dated from the concept's own start.",
 ["A reservoir forecast built from the recovery factor each reservoir row carries, which is why a profile and the reserves behind it always agree.",
  "A flat rate at the peak of 60.0000 kbpd across the whole 20.0000 year life.",
  "A decline from the first year at 0.900000, with no plateau at all."],
 "The FPSO concept holds 60.0000 kbpd to year 3 and then declines by 0.900000 a year, and the result is a screening curve rather than a reservoir forecast."),

q(2, "An NPV of 2015.4123 million USD is carried out of the studio with no conditions attached to it. What has been left behind?",
 "The price of 70.0000 USD a barrel, the capex of 2250.0000, the operating cost of 95.0000 a year, the royalty of 12.5000 percent, the tax of 30.0000 percent, the discount rate of 10.0000 percent and the 20 year shape.",
 ["Nothing, because a value is always stated after royalty and tax on the studio's default terms and so carries its own conditions wherever it goes.",
  "The reserves the value was earned on, because 130.0000 MMbbl of oil and 70.0000 Bcf of gas are what the case sold to reach 2015.4123.",
  "The rate of return and the payback of 3.8273 years, without which a value carries no measure of timing anywhere beside it."],
 "Every value in this course is conditional on something, and the same concept at 18.0000 USD a barrel returns -1834.1220 with nothing else changed."),

q(0, "The Base case reports 2015.4123 and 3.8273, and the government take beside them reads 0.328598. What kind of quantity is each of the three?",
 "Money in million USD, then a duration in years, then a plain ratio.",
 ["Money in million USD, a duration in years, and a percent, since 0.328598 is the share of gross revenue the state takes on this case.",
  "Money in whole currency units, a duration in years counted from the sanction date of the concept, and a plain ratio.",
  "Money in million USD, a percent, and a plain ratio of the kind 1.388655 is."],
 "Plan money prints in million USD, payback is 3.8273 years, and 0.328598 of gross revenue is a plain ratio: 0.328598 percent of it would be a different figure entirely."),

q(1, "The tie-back concept returns 1.388655 at 70.0000 USD a barrel. In what unit is that figure?",
 "A plain number, the value earned for each million USD of capex.",
 ["Percent, the rate of return the tie-back earns on the capex of 730.0000 it asks for across its life of 15.0000 years.",
  "Million USD, the value left once the capex has been taken out of the NPV of 1013.7182 the concept reports.",
  "MMbbl, the barrels the tie-back recovers for each million USD it spends over its 15.0000 year life."],
 "A ratio is a plain number and a rate of return is a percent, so 1.388655 is not a rate, and on this plan the tie-back reports no rate of return at all."),

q(3, "Why do the FPSO concept and the subsea tie-back differ so much in what they cost and what they earn?",
 "The FPSO carries capex of 2250.0000, a peak of 60.0000 kbpd and 20.0000 years against 730.0000, 25.0000 kbpd and 15.0000 years.",
 ["The FPSO is priced at 70.0000 USD a barrel while the tie-back is screened at the lower price that its shorter life of 15.0000 years implies.",
  "The FPSO is allotted the field's oil P50 of 130.0000 MMbbl while the tie-back is allotted the gas P50 of 70.0000 Bcf to produce.",
  "The FPSO pays the royalty of 12.5000 percent and the tax of 30.0000 percent, from which a tie-back of that size is exempt."],
 "Both rows run at 70.0000 USD a barrel on one set of terms, so the only differences are the capex, the operating cost, the peak rate and the life each concept carries."),

q(0, "What does the studio answer with when it cannot produce a number?",
 "A refusal naming the missing input, a payback of never, and a rate of return given as a status.",
 ["A value built on the studio's defaults, with a warning on the card naming each figure that was substituted for the plan's own.",
  "A zero in the field it cannot fill, since a zero is the neutral entry and lets the rest of the calculation go through.",
  "The last value the plan reported before the input went missing."],
 "A missing price is refused by name, a case that never recovers its capex reports never, and a rate that does not exist reports its status instead of a figure."),

q(2, "This course carries a development plan priced in million USD and a project schedule priced in whole currency units. What follows from that?",
 "A figure borrowed from one of them and used in the other is wrong even when it looks plausible.",
 ["The two can be compared once the plan money is multiplied out, because a million USD figure and a whole currency figure are one scale restated.",
  "The schedule is the smaller model, its costs being printed without decimals.",
  "Plan money should be restated in whole currency units before any arithmetic."],
 "The models share nothing, and the unit beside a figure is the first thing to check: plan money prints as million USD to four decimals."),

q(3, "What does rounding a figure as you work, rather than at the end, do to an answer?",
 "It puts an error in the final line that nothing later in the work can find.",
 ["Nothing at all, because the studio rounds every input before it runs.",
  "It is the safer practice, because a rounded input cannot carry more precision than the estimate behind it was entitled to claim.",
  "It changes the unit of the answer, because a figure rounded to whole numbers leaves the million USD scale for a whole currency one."],
 "Carry the figures at the precision they were printed at, such as 2015.4123 and 0.328598, do the arithmetic once, and quote at the precision the question asks for."),

q(1, "What does a field development plan hold in this studio?",
 "One field: its reserves, its concepts, the wells and facilities those imply, a schedule, a cost breakdown, a risk register and the economics.",
 ["One concept worked through in full, the alternatives being kept in plans of their own with their own reserves.",
  "The subsurface model and the well designs themselves, which the studio derives and holds beside the schedule.",
  "The economics alone, the reserves and the facilities staying in the applications that produced them."],
 "The plan is one field and the studio holds those parts together, re-deriving none of them."),

q(2, "A graded question fixes a price and asks what a concept is worth. What is written down first?",
 "What the question fixes and what has to be read out of the plan.",
 ["The formula for a discounted cash flow, so that the arithmetic is laid out before any of the plan's own figures are looked up.",
  "The value the same concept reported in the lesson, which gives a figure to check the working against once the arithmetic is done.",
  "Every figure the plan carries, in the order the card prints them, so that nothing in the record is left out of the working."],
 "A graded question is won or lost in the minute spent deciding which number is wanted and what it is measured in, before any arithmetic happens."),

q(0, "What does the Associate tier hand on to the rest of the course?",
 "That a number comes from the field it was typed in, that units travel with their figures, and that an engine which cannot answer says so.",
 ["A set of values to carry forward, led by the 2015.4123 the Base case reports, against which the later work is checked.",
  "The default terms of 12.5000 percent royalty and 30.0000 percent tax, which every later tier reuses unchanged.",
  "The completeness score of 100 percent, which the later tiers raise as each further section is filled in."],
 "The habits carry forward: a figure typed into the studio is only as good as the work behind it, and a refusal is an answer."),

emit(Q, '/root/ec-wip-fdp/banks/ec6b_m06.json')
finish()
