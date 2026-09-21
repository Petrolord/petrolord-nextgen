import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Associate m02, One Name, Several Numbers.
# Sources: digest sections 2, 5 and 6. Every figure is printed there.

q(2, "The BLS example gives ABC Company 7 recordable cases and 3 DART cases in 400000 hours. What DART rate does the engine return on the 200,000 hour base?",
 "1.500000, from 3 x 200,000 / 400000.",
 ["3.500000, the recordable rate, since a DART case is a kind of recordable and the engine rates the whole class together.",
  "0.345030, the DART rate a site reads when 4 DART cases are spread over far more hours than ABC Company worked.",
  "1.5 only, because the BLS prints one decimal and the engine matches the published figure to the digit."],
 "3 x 200,000 / 400000 is 1.500000, matching the published 1.5 with a relative difference of 0. The recordable figure of 3.500000 uses the 7 recordables; the engine rates whatever count it is handed, so the DART rate needs the DART count. The engine prints six decimals whatever the source printed."),

q(0, "UGHELLI had 4 DART cases in 2318640 hours. What is its DART rate on the OSHA base?",
 "0.345030 per 200,000 hours, from 4 x 200,000 / 2318640 with the DART count and nothing else.",
 ["0.776317 per 200,000 hours, because a DART rate is reported on the full recordable count of 9.",
  "1.725149, since the DART rate is quoted per 1,000,000 hours wherever it appears.",
  "0.172515, since DART counts only the 2 cases where the worker was away."],
 "4 x 200,000 / 2318640 is 0.345030. 0.776317 is the recordable rate from all 9 cases, 1.725149 is the same DART count on the IOGP base, and 0.172515 is the lost time rate from the 2 lost time cases. The OSHA base was asked for, so the answer is the DART count on the 200,000 base."),

q(3, "A benchmarking pack asks for UGHELLI's lost time rate per 1,000,000 hours. It had 2 lost time cases in 2318640 hours. Which figure do you send?",
 "0.862575, from 2 x 1,000,000 / 2318640.",
 ["0.172515, which is the lost time rate UGHELLI already reports on the OSHA base and can be sent just as it stands.",
  "1.725149, the IOGP base figure for the 4 DART cases, which is how lost time is usually counted in a benchmarking pack.",
  "3.881586, the recordable rate on the IOGP base, since the pack's reader will only compare total recordables."],
 "2 x 1,000,000 / 2318640 is 0.862575, five times the OSHA figure of 0.172515. Sending 0.172515 into a column of per million figures makes the site look five times better than it is. The DART and recordable figures use larger counts and answer different questions."),

q(1, "UGHELLI's counts are 9 recordables, 4 DART cases and 2 lost time cases. Why must its three rates on one base fall in that order?",
 "The counts nest, 2 inside 4 inside 9, and all three share the same hours and base.",
 ["The engine weights recordables more heavily than DART or lost time cases.",
  "Each class is rated over its own share of the hours.",
  "A coincidence; another site could show the reverse order."],
 "Every lost time case is a DART case and every DART case is a recordable on a consistently classified site, so the counts nest and the hours and base are shared: 0.776317, 0.345030, 0.172515. The engine weights nothing and uses the same hours for every class. A lost time rate above the recordable rate on the same hours would mean the counting was wrong."),

q(1, "You have UGHELLI's DART rate of 0.345030 per 200,000 hours and no calculator for the hours. How can you check its lost time rate on the same base?",
 "Halve it: 2 lost time cases are half of 4 DART cases over the same hours, giving 0.172515.",
 ["Divide by five, because moving from DART cases to lost time cases is a change of base between the two definitions.",
  "Subtract it from the recordable rate of 0.776317, since lost time cases are the recordables left after the DART cases.",
  "You cannot, because a lost time rate carries a day count."],
 "With the hours and base fixed the rate is proportional to the count, so halving the count halves the rate: 0.345030 becomes 0.172515. A factor of five belongs to a change of base, and subtracting rates would treat nested classes as if they were separate ones."),

q(3, "A contractor's OSHA TRIR of 0.776317 has been pasted into a client's column of IOGP TRIRs. The contractor had 0 fatalities. What should the column read?",
 "3.881586, the same record on the 1,000,000 hour base, with the count unchanged.",
 ["0.776317, because the letters TRIR already make it comparable.",
  "388.158576, since IOGP figures are always quoted on the 100,000,000 hour base, which is where benchmarks live.",
  "1.725149, which is what the contractor's recordables convert to when they are moved onto the IOGP base."],
 "With no fatality, the one definitional difference the lesson names cannot move the count of 9, so only the base changes and the figure is multiplied by 5.000000 to 3.881586. Left at 0.776317 the contractor looks five times safer than it is. 388.158576 is the same count on the FAR base, which nobody uses for recordables."),

q(0, "A site had a fatality last year and reports its OSHA TRIR counted without fatalities. Why is multiplying by five not enough to set it beside an IOGP TRIR?",
 "IOGP's TRIR counts fatalities as well, so the count has to change along with the base.",
 ["IOGP's TRIR moves to the FAR base in a year with a fatality.",
  "The dead worker's hours must first be removed from the exposure.",
  "The engine refuses any count that includes a fatality."],
 "IOGP's TRIR counts fatalities, lost workday cases, restricted workday cases and medical treatment cases per million hours. The factor of five is the whole story only when the two counts are the same. The base of an IOGP TRIR does not change with a fatality, and the engine rates whatever count it is given."),

q(2, "A colleague argues that UGHELLI's 3.881586 per 1,000,000 hours is more precise than its 0.776317 per 200,000 hours, because it has more digits before the decimal point. What is right?",
 "Neither is more precise: both come from 9 events in 2318640 hours and carry the same information.",
 ["The IOGP figure is more precise, because a larger base averages the count over a larger block of hours before dividing.",
  "The OSHA figure is more precise, because a smaller base is closer to the hours this one site actually worked.",
  "The two cannot be compared, because they were produced by different functions in the engine."],
 "Both figures are 9 x base / 2318640; only the base differs, by a factor of 5.000000. A larger base describes the same risk over a larger block of hours. How well 9 events pin down a rate is a separate question, and it has the same answer on every base. Both come from `incidenceRate`."),

q(0, "UGHELLI's recordables are also run on the 100,000,000 hour base. What comes back, and how does it relate to the OSHA figure?",
 "388.158576, which is 500.000000 times 0.776317, since only the base changed.",
 ["A refusal, since that base is reserved for the fatal accident rate and the engine rejects it for any other count.",
  "3.881586, since the engine caps recordable rates at the IOGP base.",
  "0.776317 again, since a base changes only the label."],
 "Any positive base may be passed to `incidenceRate`, so 9 x 100,000,000 / 2318640 gives 388.158576, which is 500.000000 times the OSHA figure. Only the PSE rate restricts its bases, and the base moves the number exactly as much as it moves the label."),

q(3, "The ratio column in the table of UGHELLI's case classes reads 5.000000 on every row. What does that tell you?",
 "Moving from the OSHA base to the IOGP base multiplies every rate by the ratio of the bases, whatever the class.",
 ["The IOGP definitions add about five times as many cases to each class as the OSHA definitions do.",
  "UGHELLI's DART and lost time counts happen to be in the same proportion as its recordables.",
  "Every class was run for five years, so each IOGP figure is a five year sum."],
 "1,000,000 over 200,000 is 5, so each per million figure is 5.000000 times its per 200,000 partner: 3.881586 and 0.776317, 1.725149 and 0.345030, 0.862575 and 0.172515. The case counts did not change between the columns, so the ratio says nothing about definitions or about the counts' proportions."),

q(2, "A spreadsheet labels a figure LTIR, and it came from the engine's `incidenceRate`. What has the engine verified about that label?",
 "Nothing: it rated the count it was given, and the name beside the number is the reporter's claim.",
 ["That the count was lost time cases, because the function checks the count against the case class named in the call.",
  "That the rate is on the IOGP base, which LTIR implies.",
  "That fatalities were added, as an LTIR requires."],
 "The engine has one function for every case class, and the name a company prints beside the number, TRIR, DART rate, LTIF or LTIR, is not something it checks. It never sees the word and cannot tell what a count of 2 is. Its basis block reports the base the caller named, which may be either one."),

q(1, "ABC Company worked 400000 hours, twice the 200,000 hour base. Why is its rate of 3.500000 half its count of 7 recordables?",
 "The base rescales the count to 200,000 hours: 7 cases in 400000 hours happen at 3.5 per 200,000 hours.",
 ["The BLS halves the count for firms with more than 100 workers, so a large firm is not penalised for its size.",
  "Half of ABC Company's recordables were DART cases, which the engine rates separately from the rest.",
  "The engine divides every count by two on the OSHA base, whatever the hours worked."],
 "The rate is count x base / hours, so 7 x 200,000 / 400000 is 3.500000: twice the base in hours means the count is halved. Nothing is discounted for firm size; ABC Company's 3 DART cases sit inside its 7 recordables and are rated separately from the same hours. With 200,000 hours worked the rate would equal the count."),

q(2, "ABC Company's recordable rate is 3.500000 and its DART rate 1.500000, both per 200,000 hours. Why must the DART figure sit below the recordable one?",
 "Its 3 DART cases are among its 7 recordables, and both share the same 400000 hours and base.",
 ["DART rates are computed on a base five times larger, which makes the resulting figure smaller.",
  "The BLS discounts DART cases so that the two rates can be added without counting any case twice.",
  "DART cases are rated on the days lost, which are fewer than the cases themselves."],
 "Both rates are count x 200,000 / 400000, so the one with the smaller count is smaller: 3 against 7. The DART cases are the recordables serious enough to take days away, restrict duties or transfer the worker. Neither rate uses days or a different base, and nothing is discounted."),

q(0, "UGHELLI reads 0.776317 per 200,000 hours and ABC Company 3.500000 on the same base. What must still be checked before calling UGHELLI the safer site?",
 "That both counted recordables the same way, since the rates share a base already.",
 ["That both used the same base, since a TRIR is quoted on the OSHA base by one site and on the IOGP base by another.",
  "That UGHELLI's larger number of hours has been scaled down to ABC Company's hours before the comparison is made.",
  "That both are recomputed on the FAR base, since only that base makes rates from different firms comparable."],
 "The base is already the same, so the comparison is fair as arithmetic; the rate divides out the difference in hours. Whether it is fair as safety performance depends on the two sites classifying recordables the same way, which the rates cannot show. The FAR base is for fatalities."),

q(1, "UGHELLI had 0 fatalities in its year. Why does that make converting its OSHA TRIR to an IOGP TRIR a clean division?",
 "IOGP's TRIR counts fatalities; with none, no fatality can change the count of 9.",
 ["With no fatality the IOGP base drops to 200,000 hours.",
  "Sites with no fatalities fall outside IOGP's definitions.",
  "The conversion uses the FAR, and a FAR of 0.000000 contributes nothing to either figure."],
 "IOGP's TRIR counts fatalities, lost workday, restricted workday and medical treatment cases, so a site whose own count left a fatality out needs a count change as well as a base change. With 0 fatalities that question never arises, and if the other classes were counted alike only the base moves: 0.776317 to 3.881586. The IOGP base is fixed at 1,000,000 hours."),

emit(Q, '/root/hse-wip-safetystats/banks/h1b_m02.json', expect_n=15)
finish()
