import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Associate exam, 42 questions over the whole tier: digest.txt
# SECTIONS 1 to 8 and the 26 Associate lessons. Written last, after the six
# module banks, and asked from angles those banks do not take.

# m01, SECTIONS 1 and 2
q(2, "Which module in the counts table exports 7 functions and 4 lists and constants?",
 "streamModel",
 ["modularRefinery",
  "refineryPlanning",
  "the screening engine"],
 "The counts are measured from the modules themselves, and the row reading 7 and 4 is streamModel, the module whose LEDGER names the plan, schedule and actual ledgers of the later tiers.")

q(0, "Which four lists does modularRefinery export, each naming a thing chosen on the screen?",
 "SCALING_EXPONENT, CONFIGURATIONS, SUPPLY_SCENARIOS and LICENSING_STAGES",
 ["SCALING_EXPONENT, CONFIGURATIONS, SUPPLY_SCENARIOS and streamModel.LEDGER",
  "CONFIGURATIONS, SUPPLY_SCENARIOS, LICENSING_STAGES and one price table",
  "LEDGER, CONFIGURATIONS, LICENSING_STAGES and the three prices of crude"],
 "Capital comes from the exponents, the slate from the configurations, the run rate and crude price from the supply scenarios, and the paperwork from the licensing stages. LEDGER belongs to streamModel and names the ledgers of the later tiers.")

q(3, "On-stream days is typed as 400. What does the engine return?",
 "REFUSED: \"On-stream days must be between 1 and 366.\"",
 ["An answer with the days capped at 366, the top of the range",
  "REFUSED: \"Utilisation is a fraction between 0 and 1 (0.9 for 90 percent).\"",
  "An answer at 400 days, read as a run of more than one year"],
 "On-stream days have a range and the refusal states it. The engine does not cap a figure outside the range or read it as something else.")

q(1, "The variable operating cost box is left blank on OKORDIA. What comes back?",
 "A refusal that names the variable operating cost and asks for a typed 0",
 ["An answer with the variable cost read as 0.0000 a barrel of crude, the blank taken as zero",
  "An answer at a stated default of 3.2000 a barrel, the figure OKORDIA types",
  "REFUSED: \"Missing crude cost. Enter 0 where the value really is zero.\""],
 "The engine prints \"Missing variable operating cost. Enter 0 where the value really is zero.\" It takes no default for a money box and never reads the blank as zero.")

q(3, "Which calls to feasibilityEconomics draw the sentence \"A discount rate and a tax rate are needed to value the project.\"?",
 "Tax rate left out, tax rate left blank, and a discount rate of null",
 ["Tax rate left out, and any streams already refused for a blank crude cost",
  "A discount rate of null only, with a blank tax rate read as zero",
  "Any call whose streams carry a capital cost of 64000000.00"],
 "All three rate cases draw the one sentence. Streams refused for a blank crude cost come back with their own refusal, word for word, and the box is still named.")

q(0, "Which export reads the machine clock when periodStart is left out of the call?",
 "cascadeToSchedule",
 ["feasibilityEconomics",
  "calculateEconomics",
  "scaleCapex, in modularRefinery"],
 "periodStart is the schedule's own argument, and cascadeToSchedule is the export that falls back on the machine clock without it. The two valuation exports fall back on the clock for the year instead.")

q(2, "What start year does the course pass to every valuation?",
 "2027, on every call",
 ["The current year from the machine clock",
  "Year 2, the first producing year",
  "None, as a valuation needs no year"],
 "Every valuation is passed start year 2027, so a figure read in this course does not move with the day it is read.")

# m02, SECTION 3
q(1, "A 1000 bpd plant is scaled from OKORDIA's quotation. Which costs does scaleComparison print for it?",
 "15035122.47 modular and 24366770.42 stick-built",
 ["24366770.42 modular and 15035122.47 stick-built",
  "34296750.80 modular and 42224253.14 stick-built",
  "15035122.47 on both laws, as at the quotation size"],
 "At 1000 bpd the modular law (0.9) prints 15035122.47 and the stick-built law (0.6) 24366770.42, so modular cheaper reads true. 34296750.80 and 42224253.14 are the 2500 bpd row.")

q(0, "What capital per bpd does the stick-built law print at 20000 bpd?",
 "7351.67",
 ["11143.05",
  "9700.59",
  "12800.00"],
 "At 20000 bpd the stick-built law prints 7351.67 per bpd and the modular law 11143.05. 9700.59 is the stick-built law at 10000 bpd, and 12800.00 is the reference row.")

q(2, "The ratio at 20000 bpd reads 1.5157. What does it state?",
 "The modular cost is that multiple of the stick-built cost.",
 ["The stick-built cost is that multiple of the modular cost.",
  "The modular plant is cheaper there by that fraction.",
  "The two laws agree to within that figure at that size."],
 "The ratio is the modular cost over the stick-built cost. Above 1.0000 the modular plant is the dearer, and modular cheaper reads false on that row.")

q(3, "Which of these capital figures did a vendor actually quote?",
 "64000000.00 for 5000 bpd",
 ["222860944.20 for 20000 bpd",
  "128000000.00 for 10000 bpd",
  "187529987.30 for 30000 bpd"],
 "OKORDIA's reference point is one quotation, 64000000.00 for 5000 bpd. Every other figure is that quotation carried through an exponent. Nobody quoted them, and a vendor's answer at another size would replace the scaled figure.")

q(1, "SCALING_EXPONENT holds two named entries. Which?",
 "STICK_BUILT at 0.6, MODULAR at 0.9",
 ["STICK_BUILT at 0.9, MODULAR at 0.6",
  "MODULAR 0.9 and a PROPORTIONAL 1",
  "MODULAR 0.6 and a PROPORTIONAL 1"],
 "The stick-built exponent is 0.6, the strong economy of scale, and the modular exponent is 0.9, the weak one. An exponent of 1 is a comparison the lesson runs and is not an entry in the list.")

q(1, "Scaled to 10000 bpd with an exponent of 1, what does OKORDIA's quotation become?",
 "128000000.00",
 ["119428222.92",
  "97005860.26",
  "64000000.00"],
 "An exponent of 1 is cost in proportion to capacity. At 10000 bpd the modular law prints 119428222.92 and the stick-built law 97005860.26, so one plant from one quotation gets three costs from three exponents.")

# m03, SECTION 4
q(3, "In the conversion slate, what is gasoline worth per barrel of crude?",
 "35.3600",
 ["20.8000",
  "104.0000",
  "33.3300"],
 "Conversion yields gasoline at 0.3400, priced at 104.0000, so its row prints 35.3600. 20.8000 is gasoline in the hydroskimming slate and 33.3300 is conversion's diesel.")

q(0, "Which configuration yields kerosene at 0.1400?",
 "Topping, with crude distillation alone",
 ["Hydroskimming, with its naphtha reformer added",
  "Conversion, with its cracker added",
  "All three, as kerosene is a crude cut"],
 "Kerosene reads 0.1400 for topping, 0.1300 for hydroskimming and 0.1200 for conversion.")

q(2, "Which configuration carries a fluid catalytic cracker?",
 "Conversion, on top of the reformer and hydrotreater",
 ["Hydroskimming, in place of its diesel hydrotreater",
  "Topping, beside its crude distillation unit",
  "None; the cracker belongs to the next tier's monthly plan"],
 "The fluid catalytic cracker is what makes a plant conversion. It cracks heavy material into lighter products and sits beside the reformer and hydrotreater that hydroskimming already has.")

q(0, "What lpg yield does the conversion row carry?",
 "0.0500",
 ["0.0300",
  "0.0200",
  "0.3400"],
 "lpg reads 0.0200 for topping, 0.0300 for hydroskimming and 0.0500 for conversion. 0.0200 is also the loss on every row, and 0.3400 is conversion's gasoline.")

q(3, "16.5000 a barrel of crude: which product earns that on OKORDIA's hydroskimming plant?",
 "fuelOil",
 ["diesel",
  "gasoline",
  "kerosene"],
 "fuelOil yields 0.3000 at 55.0000, which prints 16.5000. Diesel prints 32.3200, gasoline 20.8000 and kerosene 12.6100 in the same slate.")

q(1, "Which of these entries does the engine answer with a figure?",
 "A naphtha price left blank on the topping slate",
 ["A crude cost left blank on the OKORDIA screen's inputs",
  "On-stream days typed as 0 for the plant",
  "A tax rate left blank on the valuation call"],
 "A blank product price is answered: gross value 63.6200, with naphtha named on the unpriced list. The other three are refused, which makes a forgotten price the quiet one to check for.")

q(2, "Which of these rows makes productSlate print yields close false?",
 "Hydroskimming typed with yields that total 0.9700",
 ["Topping at OKORDIA's own prices, naphtha included",
  "Any row carrying a loss yield of 0.0200 in its slate",
  "Conversion at OKORDIA's own prices"],
 "The typed hydroskimming row totals 0.9700 and prints yields close false, valued as typed at 81.1900. The topping and conversion slates at OKORDIA's prices print yields total 1.0000 and yields close true, and the loss of 0.0200 is part of each of those closing rows.")

# m04, SECTION 5
q(3, "Which multiplication gives OKORDIA's yearly variable opex of 4857600.00?",
 "1518000.00 bbl at 3.2000 a barrel",
 ["1518000.00 bbl at 76.0000 a barrel",
  "1650000.00 bbl at 3.2000 a barrel",
  "5000 bpd at 3.2000 over 330 days"],
 "Variable opex = crude run x variable operating cost. The crude run is the annual throughput, which carries the utilisation of 0.9200 as well as the on-stream days. 1518000.00 x 76.0000 is the crude cost column.")

q(1, "In which year does OKORDIA's fixed opex of 7500000.00 first appear in the streams?",
 "Year 2, when production starts",
 ["Year 0, beside the first capex",
  "Year 1, as building finishes",
  "Year 3, after a year of running"],
 "The fixed operating cost is paid in the years the plant runs, so the streams print 0.00 for it in year 1 and 7500000.00 in year 2.")

q(0, "OKORDIA is built over three construction years. Which is its first producing year, and how many years do the streams hold?",
 "Year 3, and 23 years",
 ["Year 3, and 22 years",
  "Year 2, and 23 years",
  "Year 2, and 22 years"],
 "Years in the streams are the construction years plus the operating years, 3 and 20. With two construction years the first producing year is year 2 and the streams hold 22.")

q(3, "The streams table prints years 0 to 3 and year 21 only. How does a reader know what the unprinted middle years carry?",
 "The screen checks each producing year against year 2 and prints true.",
 ["They are interpolated between the printed year 3 and year 21 rows.",
  "They are left for the valuation engine to fill in later.",
  "They carry the engine's defaults, 1530000.00 bbl a year."],
 "Every producing year carries the same figures as year 2: true. The streams are one year repeated from year 2 to year 21, and a hidden row holds nothing the printed rows do not.")

q(2, "A reader quotes 1518000.00 bbl as OKORDIA's size. What have they read?",
 "A year's crude run, after 330 days at 0.9200",
 ["The nameplate, 5000 bpd, run over a full calendar year",
  "The capacity of the plant in barrels a day",
  "The crude run at a utilisation of 1"],
 "Capacity is 5000 bpd of nameplate. 1518000.00 bbl is the annual throughput, capacity times 330 on-stream days times a utilisation of 0.9200. At utilisation 1 the run would read 1650000.00 bbl.")

q(1, "A reviewer wants more barrels a year from OKORDIA with its margin per barrel left untouched. Which single entry does that?",
 "A utilisation of 1 in place of 0.9200",
 ["Tight supply picked in place of firm supply",
  "A crude cost set higher than its 76.0000",
  "Conversion in place of hydroskimming"],
 "Utilisation sits in the throughput and not in the margin, so a utilisation of 1 gives 1650000.00 bbl at the same 4.5900. Tight supply lowers the run and the margin together, the crude cost moves only the margin, and conversion moves the gross value.")

# m05, SECTIONS 6 and 7
q(2, "\"Half the nameplate and a hard premium\": which utilisation and premium does the engine pair with those words?",
 "0.5000 and 6.0000",
 ["0.7500 and 3.0000",
  "0.5000 and 3.0000",
  "0.9200 and 6.0000"],
 "The words belong to the disrupted note, and disrupted supply carries a utilisation of 0.5000 and a crude premium of 6.0000. Tight carries 0.7500 and 3.0000.")

q(0, "OKORDIA buys its crude under tight supply. How much does the first operating year's crude bill come to?",
 "97762500.00",
 ["103690125.00",
  "115368000.00",
  "67650000.00"],
 "The tight row reads a crude cost of 97762500.00 beside a revenue of 103690125.00. 115368000.00 is the firm crude cost and 67650000.00 the disrupted one.")

q(3, "Stages lte and ltc are complete, in that order. What does the tracker report?",
 "A complete count of 2 with Licence to Operate named next, in order",
 ["A complete count of 2 with Licence to Construct named next, in order",
  "A complete count of 2 with no stage named next, as two is enough",
  "A complete count of 3 with Licence to Operate named next, in order"],
 "The next stage is the first in sequence not complete, which after lte and ltc is Licence to Operate, and out of order reads false. Only with all three complete does the next stage read null.")

q(1, "No licensing stage has been ticked. What does the tracker name as the next stage?",
 "Licence to Establish, with a count of 0",
 ["Licence to Operate, the last in line",
  "null, as there is nothing yet to count",
  "Licence to Construct, with a count of 1"],
 "Before anything is ticked the tracker counts 0 and points at the first stage in sequence, Licence to Establish, with out of order false.")

q(3, "Which stage lists a construction HSE plan and financing close among its typical evidence?",
 "The second, Licence to Construct",
 ["The first, Licence to Establish",
  "The third, Licence to Operate",
  "None of the three stages"],
 "The Licence to Construct asks whether the project can be built: detailed engineering design, approved environmental impact assessment, construction HSE plan and financing close.")

q(2, "Which scenario's note reads \"A term contract that is honoured, at the market price.\", and what premium does it add?",
 "Firm supply, adding 0.0000",
 ["Tight supply, adding 3.0000",
  "Firm supply, adding 3.0000",
  "Disrupted, adding 6.0000"],
 "Firm supply carries a utilisation of 0.9200 and a premium of 0.0000, so OKORDIA's crude stays at 76.0000 a barrel under it.")

q(0, "OKORDIA types its own utilisation of 0.9200, and disrupted supply is then picked. What utilisation does the screen run?",
 "0.5000, the scenario's own",
 ["0.9200, the plant's own figure",
  "0.7500, the tight scenario's",
  "0.9200 in the first year only"],
 "A scenario's utilisation replaces the plant's, whatever was typed. Disrupted supply runs OKORDIA at 0.5000 and 825000.00 bbl a year.")

# m06, SECTION 8 with 3 to 7
q(1, "What first operating year revenue does the nine-row table print for conversion under firm supply?",
 "137576340.00",
 ["127193220.00",
  "116794920.00",
  "112154625.00"],
 "Conversion under firm supply prints 137576340.00. 127193220.00 is hydroskimming and 116794920.00 topping under firm supply, and 112154625.00 is conversion under tight supply.")

q(0, "What gross margin per barrel does topping print under disrupted supply?",
 "-8.2600",
 ["-5.2600",
  "-2.2600",
  "-1.4100"],
 "Topping's rows read -2.2600, -5.2600 and -8.2600 as supply goes from firm to tight to disrupted, negative on every one. -1.4100 is the hydroskimming disrupted row.")

q(2, "A margin of 8.4300 a barrel of crude: which configuration and supply give it?",
 "Conversion under tight supply",
 ["Conversion under disrupted supply",
  "Hydroskimming under firm supply",
  "Conversion under firm supply"],
 "Conversion reads 11.4300 on firm, 8.4300 on tight and 5.4300 on disrupted. Hydroskimming on firm reads 4.5900.")

q(3, "Under disrupted supply, what crude cost with premium does OKORDIA's scenario table print?",
 "82.0000",
 ["79.0000",
  "76.0000",
  "6.0000"],
 "The premium is added to the crude cost before the streams are built: 76.0000 on firm, 79.0000 on tight and 82.0000 on disrupted. 6.0000 is the disrupted premium itself.")

q(1, "What does the Professional tier put on a barrel for the first time in this course?",
 "A calendar date, from a schedule cascaded from the month's plan",
 ["A price, taken from OKORDIA's illustrative product price table",
  "A licence stage, from the tracker in the Feasibility Studio",
  "A yield, from one fixed row for each of the configurations"],
 "The Professional tier cascades the month's plan into a schedule of cargoes, unit runs and lifts across the period. That is the first time this course dates a barrel.")

q(2, "Which module does the Professional tier move to?",
 "refineryPlanning, over lib/lp/simplex",
 ["modularRefinery, over the screening engine",
  "screening, through feasibilityEconomics",
  "streamModel, over the licensing tracker"],
 "The Associate tier lives almost entirely in modularRefinery. The Professional tier moves to the Refinery Planning Studio and refineryPlanning, which runs over lib/lp/simplex and streamModel.")

# across the tier
q(1, "Which change moves OKORDIA's gross margin per barrel?",
 "Picking tight supply in place of firm",
 ["Going from 2 to 3 construction years",
  "Changing the scaling exponent",
  "Typing a utilisation of 1"],
 "The margin is gross value less crude cost less variable operating cost. Tight supply adds a premium to the crude cost and the margin reads 1.5900. Construction years move when the plant earns, the exponent moves the capital and nothing else, and utilisation moves the throughput.")

q(2, "Which function hands OKORDIA's annual streams on to the screening engine?",
 "feasibilityEconomics",
 ["feasibilityStreams",
  "scaleComparison",
  "cascadeToSchedule"],
 "feasibilityStreams builds the streams and feasibilityEconomics hands them to the screening engine. scaleComparison prints the two capital laws, and cascadeToSchedule belongs to refineryPlanning.")

q(3, "Which of these outputs does the scaling exponent change?",
 "Capital at sizes other than 5000 bpd",
 ["The gross value per barrel of the slate",
  "The annual throughput of the plant",
  "The first producing year of the streams"],
 "The exponent changes the capital and nothing else, and at the reference size of 5000 bpd not even that, since both laws return the quotation there.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/beginner/rfb_exam.json', label='rfb_exam', expect_n=42)
finish()
