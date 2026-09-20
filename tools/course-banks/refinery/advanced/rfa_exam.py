import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Expert tier exam, 42 questions over the whole tier: digest sections
# 18 to 24. Written last, phrased apart from the module banks. No question keys
# an NPV or IRR figure; H1, H2 and H3 are asked as limits only.

# m01: one shape, three ledgers (sections 18, 19)
q(0, "Which pair does makeEvent return for a flare of 100 bbl: its signedQuantity and its emits flag?",
 "-100, flagged as emitting by its nature",
 ["-100, with the emits flag left false",
  "0, since a flare moves nothing out of the site",
  "100, flagged as emitting by its nature"],
 "The table prints flare at -100 for 100 bbl with emits by its nature true, the same as burn and vent. A loss also reads -100, and its flag reads false.")

q(2, "A receipt of 100 bbl goes through makeEvent. What signedQuantity comes back?",
 "100",
 ["-100", "0", "-500"],
 "A receipt is the one event type that signs 100 bbl to 100. Deliveries, burns, flares, vents and losses sign to -100; transfers, unit runs and blends to 0. A quantity typed as -500 is refused.")

q(0, "Which of these events signs a quantity of 100 bbl to 0?",
 "a blend",
 ["a loss", "a vent", "a delivery"],
 "A blend signs to 0, as a transfer and a unit_run do. A loss, a vent and a delivery each sign 100 bbl to -100.")

q(3, "What quantity does the ODIOMA plan ledger's jet delivery line hold?",
 "136000.00 bbl",
 ["160000.00 bbl", "101200.00 bbl", "163400.00 bbl"],
 "The jet delivery line reads 136000.00 bbl at 104.9000. 160000.00 bbl is the Jet A-1 ceiling in the configuration, 101200.00 bbl the month's actual jet delivery, and 163400.00 bbl the plan's gasoline.")

q(0, "Which figure is the ODIOMA month's planned gross margin per barrel?",
 "4.7763",
 ["14.0100", "1.4000", "3.1000"],
 "The plan reads total crude 1000000.00 bbl, margin 4776300.00 and gross margin per barrel 4.7763. 14.0100 is the expansion screen's figure, and 1.4000 and 3.1000 are the two units' operating costs a barrel.")

q(2, "The reformer's unit_run line in the plan ledger reads 589000.00 on 190000.00 bbl. Which per-barrel figure is that?",
 "3.1000, its operating cost",
 ["1.4000, the crude unit's cost",
  "3.2000, the month's actual",
  "4.2000, the expansion's cost"],
 "The reformer line reads 190000.00 bbl and 589000.00, 3.1000 a barrel, the reformer's operating cost in the configuration. 3.2000 is the reformer's actual unit value in the month.")

q(3, "Which cargo size was the ODIOMA plan scheduled with?",
 "350000.00 bbl",
 ["400000.00 bbl", "190000.00 bbl", "600000.00 bbl"],
 "The plan is cascaded from 2027-03-01 over 31 days with a cargo size of 350000.00 bbl. 400000.00 bbl is the Forcados receipt in the plan and 600000.00 bbl the Escravos receipt.")

# m02: volume and price variance (section 20)
q(1, "Which ODIOMA line reads an actual unit value of 61.0000?",
 "fuel_oil delivery",
 ["gasoline delivery", "diesel delivery", "jet delivery"],
 "The fuel_oil line reads an actual unit value of 61.0000 against a plan of 60.2000. Gasoline reads 112.0895, diesel 98.4000 and jet 104.0998.")

q(0, "What price variance does the crude unit's line carry?",
 "51450.00",
 ["13100.00", "-371000.00", "-319550.00"],
 "The cdu line ran at 1.4700 a barrel against the plan's 1.4000 on 735000.00 bbl and reads a price variance of 51450.00. -371000.00 is its volume variance and -319550.00 its total; 13100.00 is the reformer's price variance.")

q(2, "Jet A-1 sold 101200.00 bbl against a plan of 136000.00 bbl. Priced at the plan's 104.9000, that barrel gap gives which figure?",
 "-3650520.00",
 ["-80980.00", "-3731500.00", "-34800.00"],
 "Volume variance = (actual quantity - plan quantity) x plan unit value, and the jet line prints -3650520.00. -80980.00 is its price variance, -3731500.00 its total and -34800.00 its quantity gap in bbl.")

q(1, "What plan unit value does the Forcados (illustrative) line carry?",
 "76.8000",
 ["78.9000", "80.2000", "74.0000"],
 "Plan unit value = plan value / plan quantity: 30720000.00 over 400000.00 bbl. 78.9000 and 80.2000 are Escravos in the plan and in the month, and 74.0000 is the expansion's crude.")

q(1, "The escravos line's total variance is 11607000.00. How does the engine split it?",
 "10651500.00 volume and 955500.00 price",
 ["955500.00 volume and 10651500.00 price",
  "11607000.00 volume and 0.00 price",
  "10651500.00 volume and 955500.00 unexplained"],
 "The escravos line reads a volume variance of 10651500.00, a price variance of 955500.00 and 0.00 unexplained. The barrel gap of 135000.00 is priced at 78.9000; the price rise to 80.2000 is taken on the 735000.00 bbl that arrived.")

q(0, "Gasoline sold 112660.00 bbl against a plan of 163400.00 bbl. Which quantity gap does its line print?",
 "-50740.00",
 ["-34800.00", "-90000.00", "-104000.00"],
 "Quantity gap = actual quantity - plan quantity, and the gasoline line prints -50740.00. -34800.00 is jet's gap, -90000.00 diesel's and -104000.00 fuel_oil's.")

q(2, "The actual ledger holds a movement with no plan line to meet. Where does attributeVariance put it?",
 "In a separate unmatched list, with the ledger it came from.",
 ["In the unexplained column of the nearest delivery line on the plan.",
  "In a new variance line of its own, priced at its actual unit value.",
  "Nowhere, since it is dropped before the match is made."],
 "The match on material and type finds no partner, so the row stands apart. ODIOMA's lpg sale of 9000.00 bbl for 441000.00 is marked present in actual, and no volume, price or unexplained figure absorbs it.")

# m03: variance on margin (sections 20, 21)
q(3, "The reformer is a cost line with a total variance of -169800.00. What does it read on margin?",
 "169800.00, since less was spent",
 ["-169800.00, as a negative stays",
  "13100.00, its price variance",
  "-182900.00, its volume variance"],
 "A cost gap counts with its sign reversed on margin. The reformer ran 131000.00 bbl against 190000.00 bbl, so less was spent running it, and its margin effect reads 169800.00.")

q(2, "Diesel is a revenue line. What margin effect does it carry?",
 "-9590800.00",
 ["-9054000.00", "-536800.00", "-6092800.00"],
 "A revenue gap counts as it is, so the diesel total of -9590800.00 is also its margin effect. -9054000.00 and -536800.00 are its volume and price variances, and -6092800.00 is the fuel_oil margin effect.")

q(3, "What total variance do the revenue lines read, added as recorded?",
 "-24842800.00",
 ["-19390350.00", "-44233150.00", "-20622400.00"],
 "The revenue lines as recorded read -24842800.00: the month received less than the plan from products. -19390350.00 is the cost lines' total and -20622400.00 their volume variance, and -44233150.00 is every line's total added as recorded.")

q(2, "In which calendar year does the expansion's capex column first read 0.0000?",
 "2029",
 ["2027",
  "2028",
  "2032"],
 "Years 0 and 1, calendar 2027 and 2028, carry capex of 58.9160 each. Year 2, calendar 2029, is the first operating year and reads capex 0.0000 with gross revenue 346.1195. 2032 is the first year with tax to pay.")

q(3, "How many events does dualLedgerTotals count in the plan ledger?",
 "34",
 ["9", "8", "5"],
 "dualLedgerTotals reads 34 events in the plan ledger and 9 in the actual ledger, with 0 uncosted events in each. 5 is the event count on each unit_run and delivery line of the plan ledger.")

q(1, "The plan ledger's margin and the plan's own margin both read 4776300.00. What does that agreement show?",
 "That the ledger summed from the schedule carries the plan's margin.",
 ["That the month's actual margin matched the plan's own margin figure.",
  "That every one of the eight variance lines reads costed true.",
  "That the unmatched lpg sale is counted once."],
 "The plan ledger is summed from the scheduled events, and reconcilePeriod reads its margin as 4776300.00 beside the plan's own margin of 4776300.00. The actual margin reads -235150.00, and the lpg delivery is unmatched, in no variance line.")

# m04: the investment case (section 22)
q(3, "What annual throughput does the ODIOMA expansion screen print?",
 "3753600.00 bbl",
 ["735000.00 bbl", "1000000.00 bbl", "1200000.00 bbl"],
 "The screen prints annual throughput of 3753600.00 bbl, the production the screening engine receives in the first operating year. The other three are figures of the ODIOMA month.")

q(3, "From which reference point is the expansion's capital scaled by the modular law?",
 "100000000.00 at 10000 bpd",
 ["117831965.35 at 12000 bpd",
  "14000000.00 at 12000 bpd",
  "58915982.67 at 10000 bpd"],
 "Capital is scaled by the modular law from 100000000.00 at 10000 bpd, and the 12000 bpd plant comes out at 117831965.35. 14000000.00 is the fixed operating cost a year.")

q(1, "The expansion screen prints a gross value of 92.2100 and a gross margin per barrel of 14.0100. What lies between the two?",
 "The crude cost and the variable operating cost",
 ["The crude cost alone, at 74.0000",
  "The fixed operating cost and the tax",
  "The royalty and the crude cost"],
 "Per barrel of crude, the engine takes the crude cost and the variable operating cost off the gross value to give the gross margin. The fixed operating cost is a yearly figure in the streams, the royalty rate is 0, and tax has its own column.")

q(2, "What gross revenue does each operating year of the expansion carry, in millions?",
 "346.1195",
 ["307.5315", "291.7664", "38.5879"],
 "Each operating year reads gross revenue 346.1195, opex 307.5315 and, before any tax, a net cash flow of 38.5879. 291.7664 is opexFixed.")

q(0, "At what discount rate and tax rate, in that order, is the expansion valued?",
 "12 and 30",
 ["30 and 12",
  "12 and 0",
  "0 and 30"],
 "The inputs read discountRate 12 and taxRate 30, beside royaltyRate 0. The expansion is valued at a discount rate of 12 percent and a tax rate of 30 percent.")

q(0, "On a matched variance line where no barrels arrived, what actual unit value does the engine print?",
 "0.0000",
 ["The plan unit value, 76.8000",
  "The bill on the line, 212000.00",
  "null, since it cannot divide"],
 "The engine's rule for a matched line's unit values gives 0 when no barrels arrived. Forcados received 0.00 bbl, prints 0.0000 beside its plan unit value of 76.8000, and carries its 212000.00 in the unexplained column.")

q(2, "The expansion is valued with start year 2031. What does the first calendar year read?",
 "2031",
 ["2027", "2029", "2033"],
 "Year 0 takes the start year as its label. The money in every row is unchanged, which the digest confirms by printing the same NPV and total tax for both runs.")

# m05: tax losses carried forward (section 23)
q(1, "How much loss is left in the pool at the end of 2029?",
 "79.2440 million",
 ["117.8320 million", "40.6561 million", "2.0682 million"],
 "The loss carried forward at the end of 2029 reads 79.2440 million. At nine decimals, 117.831965348 carried in less taxable income of 38.587936000 leaves 79.244029348. 40.6561 and 2.0682 are the pool at the end of 2030 and 2031.")

q(3, "At nine decimals, what tax does year 5 pay with the loss carried forward?",
 "10.955933596 million",
 ["11.576380800 million", "2.068157348 million", "38.587936000 million"],
 "Year 5 reads a loss carried in of 2.068157348 million, taxable income of 38.587936000 million and tax of 10.955933596 million. Year 6 pays 11.576380800 million.")

q(3, "How is a year's tax formed once a loss is being carried?",
 "(taxable income - the loss carried in) x 30 percent, once above zero",
 ["taxable income x 30 percent, less the loss carried in, once above zero",
  "(taxable income - the tax paid last year) x 30 percent, once above zero",
  "the loss carried in x 30 percent, taken off the year's income"],
 "The digest states: the tax = (taxable income - the loss carried in) x the tax rate of 30 percent once that is above zero. The loss is set against income before the rate is applied.")

q(2, "What difference in total tax over the life does carrying the loss forward make?",
 "35.3496 million",
 ["196.1780 million", "11.5764 million", "64.8440 million"],
 "The two lifetime totals are 196.1780 carried and 231.5276 with the option off, and the engine prints the gap between them itself. 11.5764 is one full year's tax, and 64.8440 is a screen reading of another kind.")

q(1, "How is the option-off tax column of the ODIOMA expansion produced?",
 "The same inputs through calculateEconomics directly, with the option off",
 ["feasibilityEconomics with lossCarryForward true and the rate at 0",
  "attributeVariance run over the plan and the actual cash flows",
  "reconcilePeriod read across the 22 years of the project life"],
 "feasibilityEconomics switches lossCarryForward on. The comparison runs the same inputs through calculateEconomics directly with the option off, where each year is taxed on its own taxable income.")

q(3, "If the construction loss is not carried, which year pays the plant's first tax?",
 "2029, year 2",
 ["2032, year 5", "2027, year 0", "2033, year 6"],
 "With the option off, year 2, calendar 2029, pays 11.5764. With the loss carried forward, the first year with tax to pay is year 5, 2032.")

q(3, "With the loss carried forward, what net cash flow does 2032 read?",
 "27.6320",
 ["27.0116", "38.5879", "10.9559"],
 "2032 is year 5, the first year with tax to pay, a tax of 10.9559, and its net cash flow reads 27.6320. 2029 to 2031 read 38.5879 with no tax, and from 2033 each year reads 27.0116.")

# m06: the expert reading (section 24, read with 19 to 23)
q(2, "Which movements does materialBalance treat as leaving a tank?",
 "Deliveries, burns, flares, vents and losses",
 ["Receipts and deliveries alone",
  "Unit runs, blends and transfers",
  "Receipts, unit runs and blends"],
 "Receipts are the one movement it counts in, and a unit run counts as nothing. H3 is held and taught as a limit, and this course prints no material balance.")

q(1, "What does modularrefinery_cases.json hold?",
 "8 feasibility cases, 5 scale points",
 ["6 plans, 3 variance lines, 1 schedule",
  "8 plans and 5 variance lines",
  "5 feasibility cases, 8 scale points"],
 "oracle_modularrefinery.py writes it, keeping annual accounts and a dated tax-loss ledger used oldest first, and restating the mid-year NPV from the screening engine.")

q(0, "Held item H2 leaves a fuller capital allowance model open. Which part of the Academy owns it?",
 "The Economics module",
 ["The supply course", "The crude course", "This course's Expert tier"],
 "The held item names the Economics module as the owner of a fuller allowance model, and says carrying the loss forward covers the refinery case.")

q(3, "Is there a published source in the engines repository for the 0.6 and 0.9 exponents?",
 "No; none is in the engines repository.",
 ["Yes, one is cited beside each exponent in the code.",
  "Yes, it is held in the feasibility oracle's file.",
  "Yes, it is the ODIOMA vendor quotation itself."],
 "The held item states it: the engines repository holds none. The exponents are held, taught as a stated limit, and never graded.")

q(0, "What do the engines state about crude yields?",
 "They are fixed vectors.",
 ["They vary with the unit's throughput.",
  "They carry quality through the plan.",
  "They are fitted afresh each period."],
 "Each crude in the configuration carries one row of yields, naphtha to offgas, and the engine treats that row as a fixed vector. Escravos (illustrative), for one, carries a naphtha yield of 0.2100.")

q(1, "At a month-end review of ODIOMA, which figure is the month judged against?",
 "The plan margin, 4776300.00",
 ["The actual margin, -235150.00",
  "The crude unit capacity, 1200000.00 bbl",
  "The screen's NPV, 88.6345 million"],
 "The plan's margin of 4776300.00 and its gross margin per barrel of 4.7763 are what the month is read against. The actual margin of -235150.00 is what the month did.")

q(0, "In every year of the expansion, what does the screening engine's depreciation column equal?",
 "The capex column of the same year",
 ["One twentieth of the capital a year",
  "Zero until commissioning in 2029",
  "The loss carried forward at year end"],
 "Under held item H2 capital is depreciated in the year it is spent, and the screen confirms the two columns match year by year: 58.9160 in years 0 and 1, then 0.0000 from year 2.")

q(1, "What does attributeVariance do with money that moved with no barrels?",
 "It shows it in its own column, the unexplained.",
 ["It folds it into the line's volume variance.",
  "It spreads it over the line's price variance.",
  "It drops it from every total on margin."],
 "The engine keeps it in the unexplained column: 212000.00 on the Forcados line as recorded, and -212000.00 in the headline row on margin. The volume and price variances take none of it: the Forcados line reads -30720000.00 and 0.00 on those two.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/advanced/rfa_exam.json', expect_n=42)
finish()
