import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Expert final exam, forty-two questions across the six modules. It asks
# the tier's question again on other cases than the module banks (PA's share
# of the sidetrack, the last-barrel and two-defaulter cases, the uncured and
# compounded defaults, the IMF figure, the contract back-in, the carry
# variants), and eleven of its questions need two modules at once. Keys rest
# on the engine's returns on the golden inputs, recomputed by
# scratch/bank-advanced/witness.mjs, or on the digest's verbatim lines. The
# three readings are keyed only as the engine's. No capstone figure appears.

K = [2, 0, 3, 1, 1, 2, 0, 3, 3, 1, 0, 2, 1, 3, 2, 0, 0, 3, 1, 2, 2,
     0, 3, 1, 3, 1, 0, 2, 0, 2, 1, 3, 1, 0, 3, 2, 2, 3, 0, 1, 0, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1 (m01)
x("PA holds a participating interest of 25.000000 and consents, with EKO and NOC, to the 18000000.000000 Ekene-4 sidetrack that PB declines. What does PA pay toward it?",
 "5294117.647059, since PA holds 29.411765 of the project",
 ["4500000.000000, its licence interest of the cost, 25 percent",
  "7941176.470588, its part of a later entry payment by PB",
  "2700000.000000, the share PB turned down, passed on to PA"],
 "The engine divides PA's 25.000000 by the 85 consenting points, 29.411765, and PA pays 5294117.647059 (engine). 4500000.000000 would leave PB's share unpaid; 7941176.470588 is what PA receives on the Norwegian buy-in; 2700000.000000 is PB's proportionate share, the premium base.")

# 2 (m01)
x("PB's premium recovery ledger on the Ekene-4 sidetrack opens 2033 at 5250000.000000 and PB's share of net value that year is 2100000.000000. What closes 2033?",
 "3150000.000000, carried to 2034",
 ["5250000.000000, the opening carried forward whole",
  "2100000.000000, the part taken back in 2033",
  "1800000.000000, the share of net value of 2034"],
 "The engine recovers the smaller of the due amount and the year's share, 2100000.000000, and writes PB 2033: 2100000 recovered of 5250000 due; 3150000 carried to 2034. The opening is only what was due; 2100000.000000 is the year's take; 1800000.000000 is 2034's share, which recovers the next part.")

# 3 (m01)
x("Two partners, A at 50.000000 and B at 30.000000, fund a 1000.000000 well that C (20.000000) stays out of (nc-premium-last-barrel). How much of the project is A's?",
 "62.500000, its 50 over the 80 consenting points",
 ["50.000000, its participating interest in the licence",
  "60.000000, its 50 plus half of C's 20 points",
  "37.500000, the smaller consenting party's share"],
 "The engine's reason reads well: cost 1000 paid by the consenting parties A 62.5%, B 37.5% (in proportion to their participating interests), so A pays 625.000000. 50.000000 ignores that C is out; no back-in is stated on this call; 37.500000 is B's share.")

# 4 (m01)
x("On the same last-barrel well C declines at a stated multiple of 300.000000 percent. What premium does the engine compute for C?",
 "600.000000, C's 200.000000 of the cost at 300 percent",
 ["400.000000, the balance its ledger carries into 2031 after one year",
  "200.000000, its proportionate share with no multiple applied to it at all",
  "1000.000000, the whole cost of the well it refused to fund"],
 "The engine prints C: participating interest 20.000000, proportionate share of the cost 200.000000, premium 600.000000. The premium rests on the cost of the well alone; 200.000000 is the base at 100 percent; the whole cost is paid by A and B.")

# 5 (m02)
x("PA, 25.000000 in the licence, is one of the three parties paid when PB buys in at the Norwegian 1000.000000 percent on the sidetrack. What is PA's part?",
 "7941176.470588, the payment times PA's 29.411765 share",
 ["A quarter of the payment, PA's licence interest applied to it",
  "5294117.647059, the cost PA itself paid for the sidetrack",
  "6352941.176471, the share of the payment that NOC receives"],
 "The engine apportions the payment to the consenting parties in their shares of the project: PA 7941176.470588 (engine). A quarter would use the licence interest and leave PB's 15 points unassigned; 5294117.647059 is PA's cost paid; 6352941.176471 is NOC's receipt.")

# 6 (m01 and m02)
x("The sidetrack runs once in mode recover-from-production at 400.000000 percent and once in mode buy-in at 1000.000000 percent. Which figure for EKO comes back the same from both calls?",
 "Its cost paid, 8470588.235294, since the consenting parties fund the operation alike under either mode",
 ["Its receipt from PB, 12705882.352941, since the base of PB's payment never changes between the two modes",
  "Its reversion year for PB, 2035, since the buy-in call also ends in the payout year of the ledger",
  "Its paying interest of 50.000000, since NOC's carry is live on both calls and moves EKO's cost"],
 "In both calls EKO, PA and NOC pay the cost in proportion to their participating interests among themselves, and EKO's cost paid is 8470588.235294 (engine). 12705882.352941 is EKO's share of the 27000000.000000 entry payment, which exists only under buy-in; only the recovery call has a reversion year; neither call states a carry.")

# 7 (m02 and a back-in)
x("A buy-in call is refused when it states production years. Which back-in call does the engine refuse in the same shape?",
 "One with refundForm \"upfront\" that also states years, refused by naming `years`",
 ["One under basis \"contract\" that states exploration among its refundable kinds of cost",
  "One under basis \"pia-s85-4\" that recovers the refund from future entitlement over years",
  "One whose years run past the last year the back-in party's refund can be recovered"],
 "Both refusals name `years` and print what they were given: years must be left out when mode is \"buy-in\", and years must be left out when refundForm is \"upfront\". A contract may state exploration as refundable (backin-ekene-contract-upfront does), recovery from future entitlement is how the Act's refund runs, and a refund not recovered by the last year is a result.")

# 8 (m03)
x("Under monthly compounding at 8.25 percent on a 360-day year, a cure four days late with a 72-hour grace (default-grace-compound-exceeded) yields which default interest on PB's 2000000.000000, under the engine's stated grace reading?",
 "1833.333333, 4 days at the daily rate, as 0 whole months have passed",
 ["0.000000, as monthly compounding starts only after the first whole month",
  "1375.000000, as the 72 hours of grace come off the 4 days before interest",
  "20210.781250, the Kenya figure for 1 whole month and 14 days"],
 "The engine's reason reads interest 2000000 x ((1 + 8.25% / 12)^0 x (1 + 8.25% x 4 days / 360) - 1), 0 whole months and 4 days = 1833.33, with the grace exceeded so interest runs from the due date. Under its stated reading nothing comes off for the grace, and 20210.781250 belongs to a cure on 2027-04-15.")

# 9 (m03 and m06)
x("default-ekene-monthly-compound-kenya states 8.25 percent compounded monthly, 360-day basis, a grace of 72 hours, and a cure on 2027-04-15 of PB's 2000000.000000. What does the engine return, and what does a report state beside it?",
 "20210.781250, with the stated method, day basis, rate and grace, as the grace reading acted",
 ["20625.000000, the same as simple interest, since both methods run for the same 45 days in all",
  "20210.781250 alone, since a compounded figure depends on no stated term of the contract",
  "0.000000, since the 72-hour grace of the Kenya clause waives the first whole month's interest"],
 "The engine computes 1 whole month and 14 days: 20210.781250, and its reason adds the stated grace of 72 hours is exceeded, so interest runs from the due date. Simple interest on the same default gives 20625.000000; a figure that depends on a term is quoted with it, and default interest is quoted with its rate, method, day basis and grace.")

# 10 (m03)
x("Moving the Ekene PSC's 60.000000 percent limit from gross to revenue after royalty (psc-ekene-after-royalty) lowers the 2030 limit. What income tax does 2030 then carry, on the engine's stated tax base?",
 "13797000.000000, 30 percent of a larger contractor profit oil",
 ["10840500.000000, the 2030 tax the engine returns on the gross base",
  "12417300.000000, the tax of 2031 with the limit after royalty",
  "9756450.000000, the 2031 tax with the limit stated on the gross base"],
 "With the lower after-royalty limit of 114975000.000000, less cost is recovered in 2030 and the contractor's profit oil is 45990000.000000, taxed at 30 percent: 13797000.000000 (engine). 10840500.000000 is 2030 on the gross base; the other two are 2031 figures. The base is a stated input, and the tax line is the engine's stated reading.")

# 11 (m03)
x("On default-two-defaulters PB pays nothing of its 2250000.000000 and PA leaves 3000000.000000 unpaid, while NOC is carried in full. Who covers the 5250000.000000, under the engine's stated cover reading?",
 "EKO alone, 100.000000 percent, the only non-defaulting party that pays cost",
 ["EKO and NOC, in proportion to their participating interests of 40 and 20 in the licence",
  "EKO and PA, since PA's own default does not stop it covering PB's unpaid share of the call",
  "Nobody, as a call with two defaulters is refused until one of them pays"],
 "The engine's reason reads the unpaid 5250000 is advanced by EKO 5250000, in proportion to their paying interests among the non-defaulting parties. NOC pays no cost while carried, so it covers none under the engine's reading; a defaulter covers nobody; and the call is refused only when no paying party is left.")

# 12 (m03 and m05)
x("On default-ekene-uncured the engine reports both a cover of PB's unpaid amount and the interests after a demanded assignment of PB's interest. Which rules set the two?",
 "The cover by paying interest (EKO 61.538462 percent), the interests after by participating interest (EKO 47.058824)",
 ["Both by participating interest, since the Norwegian text words each rule that way and the engine follows its words",
  "Both by paying interest, since the carry of NOC's cost share is still live on the day of the forfeiture",
  "The cover by participating interest (EKO 47.058824), the interests after by paying interest (EKO 61.538462) of the remaining parties"],
 "The cover is the engine's stated reading, by paying interests among the non-defaulting parties; the interests after an assignment follow Norway JOA Art. 9.4, pro rata by participating interest, with the compensation not computed. That second rule is no reading, and it brings NOC in at 23.529412.")

# 13 (m03)
x("The Ekene default is left open to asOf 2027-07-01, 122 days after the due date. What default interest does the engine return on simple interest at 8.25 percent, 360-day basis, no grace, and on monthly compounding?",
 "55916.666667 simple and 55569.791577 compounded monthly over 4 whole months",
 ["55916.666667 on both, as a default still open is charged simple interest",
  "20625.000000 simple, as interest stops at the forfeiture trigger of 2027-06-10",
  "55569.791577 simple and 55916.666667 compounded, the higher figure compounded"],
 "The engine charges from and including the due date to, but excluding, asOf when the default is still open: 55916.666667 simple and 55569.791577 compounded monthly, 4 whole months and 0 days (engine). Interest runs past the forfeiture trigger, and on these figures the monthly compounding gives the smaller sum.")

# 14 (m03)
x("On psc-ekene, with the limit on gross, the pool is recovered in 2036. On psc-ekene-after-royalty, with the same 60.000000 percent on revenue after royalty, what is still carried after 2038?",
 "33686775.000000, carried to 2039",
 ["0.000000, as the pool is recovered in 2036 on either base",
  "41313600.000000, the pool carried into 2036 on gross",
  "55179575.000000, the pool the base carries into 2038"],
 "The engine's last after-royalty reason reads 2038: recoverable 83179575 is above the cost oil limit 49492800; 33686775 carried to 2039. The base moves every year's limit, so the pool is not recovered in the period; 41313600.000000 belongs to the gross ledger and 55179575.000000 is the after-royalty pool going into 2038.")

# 15 (m03 and m05)
x("A pscCostRecovery call on the Ekene terms leaves `openingCostPool` out, as if a haircut on disputed costs were still to be settled. What does the engine answer?",
 "A refusal naming openingCostPool, a required input with no default",
 ["Zero, taken as the pool, with a note that the haircut is pending",
  "A pool cut by the minimum 55% haircut of s.311 from the stated capex",
  "A pool carried from the cash call ledger of the same joint venture"],
 "A missing pool stops the call before any year runs, in the engine's words: openingCostPool must be a finite number at or above 0; got nothing. The haircut is outside the engine, so whatever survives it is what the contract states as its pool; no ledger is borrowed and no zero is assumed.")

# 16 (m04)
x("IMF FARI TNM/16/01 (February 2016), Figure 5, runs one barrel at 100.000000 with a limit of 50.000000 percent of after-royalty, a contractor share of 40.000000 percent and tax of 30.000000 percent. What government total does the engine return beside the printed 36?",
 "36.000000, government profit oil 30.000000 and income tax 6.000000",
 ["A figure a few cents off 36, as the engine keeps decimals the figure rounds away",
  "30.000000, as the IMF figure leaves the income tax out of its total",
  "56.800000, the government take of the World Bank two-barrel note"],
 "The engine returns cost recovered 50.000000, government profit oil 30.000000, contractor profit oil 20.000000, income tax 6.000000 and government 36.000000, each equal to the printed figure. The figure says the government revenue consists of USD30 in profit oil and USD6 in income tax; 56.800000 is the World Bank example.")

# 17 (m03 and m04)
x("IMF FARI Figure 5 states \"Normal tax deductions in the tax/royalty regime are assumed to be equal to the cost recovery in the PSC.\" Why does that leave the engine's PSC tax reading open?",
 "With costs recovered in full the two tax bases coincide, so no printed year shows the limit binding with its tax",
 ["A different tax on the same barrel is printed, which the engine must round to match",
  "The figure's income tax of USD6 is taken on gross revenue, which the engine then applies to every year",
  "The assumption is licensed IMF text, so the course may quote it but may not build a reading on it"],
 "In the worked examples the costs are recovered in full, so taxing the contractor's profit oil and deducting costs as incurred give one base. The course says no public text prints a year where the limit binds with its tax, so the engine states its reading and grades none. The IMF paper is a public text, and the engine matches Figure 5 exactly.")

# 18 (m04)
x("IMF FARI Table 12 prints 2005's cost petroleum as 1264; on psc-fari-table-12 the engine's cost recovered is 1265.000000. How does the course read the gap?",
 "Within the printed precision: the cost lines agree to within 1.000000, inside the 1.5 three printed whole numbers can carry",
 ["As an error of the IMF table, which the course corrects to 1265 wherever it quotes Table 12",
  "An engine defect found by the check, since a published figure is the answer to match",
  "As a sign that the stated ceiling of 80.000000 percent binds in 2005 on the engine alone"],
 "The IMF tables print whole numbers of an unrounded model, and the course finds the largest difference on a cost line is 1.000000, inside the 1.5 a line made of at most three printed whole numbers can carry. A printed figure is quoted as the text's, and the validation record reports no defect. The printed ceiling of 1327 is not what 2005 recovers.")

# 19 (m04)
x("On default-forfeiture-last-day PB's default is still open at asOf 2027-06-10, the forfeiture trigger date; on default-forfeiture-day-after asOf is 2027-06-11. Where does the forfeiture apply?",
 "Only at 2027-06-11: an open default reaches it only after the whole trigger date",
 ["At both, since a default open on the trigger date has already reached it",
  "At neither, since a forfeiture needs the operator to notify the management committee first",
  "Only at 2027-06-10, since the engine counts the trigger date as the first day"],
 "The engine's reason for the last day reads not triggered, the default being open only to asOf 2027-06-10, and for the day after triggered, the default being open after 2027-06-10. The operator's notice enters as the stated start, 2027-03-10, from which the 3 months run.")

# 20 (m04)
x("On carry-one-short N's carried cost of 200.000000 meets an available 199.800000 in 2028, with no uplift and recovery from 100 percent of its share. What does the engine do?",
 "Recovers 199.800000 and carries 0.200000 to 2029, where it is recovered",
 ["Treats 199.800000 as recovering the carry, since the gap is a rounding",
  "Writes 0.200000 off in 2028, as a carry below one unit is not pursued",
  "Adds an uplift to the 0.200000 left, since a year passes before it is paid"],
 "The engine's reasons read 2028: 199.8 recovered of 200 due; 0.2 carried to 2029, then 2029: the balance 0.2 is recovered with 0.2 of the 200 available. It rounds no balance away, writes off only under a stated cap, and the call states no uplift.")

# 21 (m04)
x("budget-norway-pct-holds states the Norwegian tolerance of the lower of 5 percent and 75 on an approved 1000, spent at 1050; budget-norway-lower-of states the same on an approved 2000, spent at 2080. What does the engine return?",
 "An overrun of 50 equal to its allowance is inside; 80 against an allowance of 75 is beyond",
 ["Both are inside, since each overrun is within the 10 percent item tolerance the text prints",
  "Both are beyond, since an overrun must stay strictly below the allowed overrun to pass the test",
  "The first is beyond at 50, the second inside, the percentage being the one that binds"],
 "The engine takes the lower of 5% of the approved total and 75: 50 on 1000, inside at exactly 50, and 75 on 2000, where 80 is beyond. The item tolerance is a separate test that both items pass; the budget test is its own, and a figure equal to the allowance is inside.")

# 22 (m04)
x("On default-months-end-of-month a forfeiture is stated at 3 months from 2027-01-31. What trigger date does the engine compute?",
 "2027-04-30, the last day of the shorter month",
 ["2027-05-01, the day after the last day of April",
  "Three months of thirty days each, ending in April",
  "Ninety days on from 31 January, early in May"],
 "The engine's convention reads months keep the day of the month (the last day when the month is shorter), and its reason says after 3 months from 2027-01-31, that is after 2027-04-30. It counts calendar months, and ninety days would be a stated unit of calendar-days.")

# 23 (m04)
x("On default-working-days-holiday C's suspension is stated at 5 working-days from 2027-12-22, with stated holidays on 2027-12-24, 2027-12-27, 2027-12-28 and 2028-01-01. When does the engine date the trigger?",
 "2028-01-03, working days being Monday to Friday less the stated holidays",
 ["Five weekdays on, with the stated holidays counted as working days like any other",
  "2027-12-27, five calendar days from the stated date of 2027-12-22",
  "2028-01-05, the asOf of the call, as the holidays push past it"],
 "The engine's consequences basis reads working days are Monday to Friday less the stated holidays, and the probe gives five working days from 2027-12-22 ending 2028-01-03. Stated holidays are skipped, the unit is working days, and 2028-01-05 is the asOf at which the suspension is found triggered.")

# 24 (m04)
x("No threshold is stated on cc-zero-call-month (lag 1 month, rule \"carry\"). January over-called by 200; February forecasts 0. What happens in February?",
 "Called: the call is the adjustment alone, 0, and the 200 credit is carried to March",
 ["Not called, since a forecast of 0 sits under any threshold the engine applies to a month",
  "Called as a negative call of -200.000000, the credit paid back in February",
  "Called at 200, the over-call billed back to the parties in February"],
 "The boundary table reads a forecast of 0 with no threshold: called (true); the call is the adjustment alone. Under \"carry\" the reason says the call is 0 and the rest of the credit is carried to the next cash call, and March applies the credit of 200. A negative call of -200.000000 is the \"refund\" rule's answer.")

# 25 (m04 and m05)
x("The Kenya Model PSC 2015 Art. 6.9 prints forfeiture after ninety days. On default-calendar-days a call states 90 calendar-days from 2027-01-01 with asOf 2027-04-01. What does the engine return?",
 "A trigger of 2027-04-01 that does not apply, the default being open only to asOf",
 ["A forfeiture that applies, since ninety days of the Kenya clause have run in full",
  "A refusal, since a forfeiture term must be stated in months to follow the text",
  "A forfeiture computed from the Kenya clause whether or not the call states one"],
 "The engine applies a consequence only as stated and when the default is open after the whole trigger date: 90 calendar-days from 2027-01-01 is 2027-04-01, and its reason reads not triggered, the default being open only to asOf 2027-04-01. Calendar days are a stated unit, and the engine holds no Kenya term.")

# 26 (m04)
x("A default call states its suspension in \"business-days\". What does the engine answer?",
 "A refusal naming suspension.unit, with \"business-days\" quoted back",
 ["Business-days read as working-days, the nearest unit it knows",
  "It counts calendar days, the unit left when a stated unit is unknown",
  "It drops the suspension and reports the forfeiture alone"],
 "The engine refuses the unit it cannot read and quotes it back, in its own words: suspension.unit must be one of \"calendar-days\", \"working-days\", \"months\"; got \"business-days\". It never swaps one unit for another or drops a stated consequence. Working days, calendar days and months are the three units it counts.")

# 27 (m05)
x("backin-ekene-contract-upfront backs NOC in from 20 to 40 percent under basis \"contract\", with refundable kinds stated as exploration and development and the refund paid upfront. What refund does the engine return?",
 "125200000.000000, with only the bonus, interest and markup, 20000000.000000, excluded",
 ["98000000.000000, as the Act's refundable kinds of cost apply to every back-in the engine runs",
  "196000000.000000, the refund of a back-in to 60 percent",
  "125200000.000000, paid from NOC's future entitlement"],
 "Under basis \"contract\" the stated kinds decide: exploration counts, so refundable costs are 626000000.000000 and the refund 125200000.000000, paid upfront (engine). 98000000.000000 is the refund under basis \"pia-s85-4\", which excludes exploration; 196000000.000000 is the back-in to 60.")

# 28 (m05)
x("Under the Act's basis, a call wants NOC's back-in refund settled in one upfront payment. How does the engine respond?",
 "refundForm must be \"from-future-entitlement\" under basis \"pia-s85-4\": no upfront payment by the Government (s.85(4)(d))",
 ["A refund paid at once, since the Act lets the contract choose between cash and kind",
  "A refund paid upfront with its uplift removed, as s.85(4)(c) excludes interest",
  "refundableKinds must be left out under basis \"pia-s85-4\" (development and production, s.85(4)(c))"],
 "The engine refuses a term the Act fixes: s.85(4)(d) forbids an upfront payment by the Government and s.85(4)(f) sets the refund in cash or in kind from future production or entitlements. The refundable-kinds refusal is another rule, raised when kinds are stated under the Act.")

# 29 (m05)
x("A back-in call on the Act's basis lists exploration as a refundable kind of cost. What comes back?",
 "A refusal: under the Act the kinds must be left out, since s.85(4)(c) fixes development and production",
 ["A refund on exploration alone, as the call states the kinds and the engine applies them",
  "A refund on exploration, development and production, the stated kind added to the Act's",
  "A refund on development and production, the exploration kind dropped with a note"],
 "The engine's message reads refundableKinds must be left out under basis \"pia-s85-4\" (development and production, s.85(4)(c)); got [\"exploration\"]. It neither applies nor merges nor drops a stated kind; under basis \"contract\" the kinds are required and stated.")

# 30 (a carry, recapped)
x("int-two-carries carries NOC in full pro rata and PB in full in stated shares of 50 each by EKO and PA. What paying interest does the engine give EKO?",
 "59.807692, its 40 plus NOC points 12.307692 and PB points 7.500000",
 ["50.000000, its paying interest under the NOC carry alone, as before",
  "47.500000, the share it pays under the stated half carry of NOC's cost",
  "65.000000, its 40 plus every one of the 25 points of the two carries"],
 "The engine pays NOC's 20 points EKO 12.307692 and PA 7.692308, pro rata to their participating interests, and PB's 15 points EKO 7.500000 and PA 7.500000 in the stated shares. Pro rata runs among the parties no carry names as carried, so EKO's 40.000000 becomes 59.807692 (engine).")

# 31 (m06)
x("Discounted at 0.100000 to 2027, NOC's NPV is 49870804.456959 on carry-ekene-compound. What is it on carry-ekene-pia, with no uplift and recovery from 100 percent of its share?",
 "54584252.437515, higher, as nothing is added to the carry NOC repays",
 ["49870804.456959, since an NPV does not move with whatever uplift is stated",
  "47640894.676658, NOC's NPV under the stated uplift multiple of 150 percent",
  "57822978.058592, NOC's NPV under the compound uplift with a cap of 25000000"],
 "The canonical npv discounts year-end flows to the stated base year at the stated rate: NOC's NPV is 54584252.437515 on carry-ekene-pia (engine). The uplift is repaid out of NOC's share, so the terms move the NPV; 47640894.676658 and 57822978.058592 belong to the multiple and capped cases.")

# 32 (m06)
x("Suppose the uplift is a 150 percent multiple (carry-ekene-multiple). How much uplift lands in 2027, when 16400000.000000 of NOC's cost is first carried?",
 "8200000.000000 in 2027 itself, half the carried cost of that year",
 ["0.000000 in 2027, as no uplift of any type earns anything in its own year",
  "1312000.000000 in 2028, as on the compound case",
  "24600000.000000, the whole cost times the multiple"],
 "The engine's reason reads 2027: the 150% multiple on the carried cost of 16400000 adds 8200000, and 2027 closes due 24600000.000000. The no-uplift-in-its-own-year convention is the compound uplift's; 1312000.000000 is the compound case; 24600000.000000 is the due amount, cost plus uplift.")

# 33 (m06)
x("carry-ekene-capped states the Ekene compound uplift of 8 percent with a cap of 25000000. What happens in 2032?",
 "4200000.000000 is recovered to reach the cap, and 12929407.979520 is written off",
 ["10400000.000000 is recovered as in the uncapped case, and the cap binds only in 2033",
  "The whole 17129407.979520 due is written off, as the cap was passed in 2031",
  "A refusal, since the cap of 25000000 is below the carry with its uplift"],
 "The engine's reason reads 2032: the stated cap 25000000 is reached with 4200000 recovered this year; the rest, 12929407.98, is written off, and the field is 12929407.979520. Recovery to 2031 totals 20800000.000000, below the cap; a cap is an optional stated term, applied when stated and refused on no call.")

# 34 (m03 and m06)
x("A partner report on psc-ekene quotes the 2030 cost oil limit, 131400000.000000. Which terms must it state beside the figure?",
 "The limit of 60.000000 percent and its base, gross, the base being a required input",
 ["The Act's 60 percent ceiling alone, since the engine applies that ceiling to every PSC",
  "Nothing further, since a cost oil limit depends on the royalty and gross revenue alone",
  "The tax reading, since the cost oil limit is set by the base the tax is charged on"],
 "A PSC figure is quoted with its limit and base: on after-royalty the same 60.000000 percent gives 114975000.000000 in 2030. The Act's ceiling is reported in the basis only; the tax reading acts on the tax line, which does not set the limit.")

# 35 (m03 and m06)
x("A defaultCover call lists EKO, PA and PB as defaulters on the Ekene call, where NOC is carried in full. What does the engine answer, and which stated reading explains it?",
 "A refusal naming `defaulters`, as no paying party is left to cover; the cover reading",
 ["A cover by NOC alone of all three unpaid shares, as the only party left that has not defaulted",
  "A result in which the three defaulters cover one another in proportion to their paying interests",
  "A refusal naming interest.graceHours; the grace reading, which acts whenever three parties default"],
 "The engine's message reads defaulters must be leaving at least one non-defaulting party with a paying interest above 0; got [\"EKO\",\"PA\",\"PB\"]. Under the cover reading only parties that pay cost advance cash, and carried NOC pays none, so nobody is left to cover.")

# 36 (m04)
x("On the Ekene March call PB's share is 2250000.000000. A default call states that PB paid exactly 2250000. What does the engine answer?",
 "A refusal naming defaulters[0].paid, as a party that paid its share is not in default",
 ["Zero unpaid and no default interest, since PB owes nothing on the call",
  "A cover of 0.000000 by EKO and PA with PB's consequences reported as not triggered",
  "A result that treats PB's payment as an over-call credited to its next cash call"],
 "The boundary table reads paid EQUAL to the share: refused: no default. In the engine's own words: defaulters[0].paid must be below the party's share of the call 2250000 (a party that paid its share is not in default); got 2250000. The engine refuses the call, so it returns no zero default, reports no consequences, and a cash call over-call is another function's matter.")

# 37 (m05)
x("A carry recovery call names the PIA s.85(4) basis and also a compound uplift of 8 percent a year. Which message results?",
 "uplift.type must be \"none\" under basis \"pia-s85-4\": the refund excludes interest, premium or markups on cost (PIA s.85(4)(c))",
 ["A recovery in 2033 with the uplift, as the contract's stated terms override the Act's list",
  "A recovery in 2031 with the uplift dropped and a note citing s.85(4)(c) beside the ledger",
  "basis must be one of \"pia-s85-4\", \"contract\"; the Act's basis cannot hold an uplift at all"],
 "The engine refuses a term the Act fixes, in its own words, and computes nothing: 2033 is the contract carry with its uplift, and 2031 the Act's carry with none. The basis \"pia-s85-4\" is a valid value, so the refusal names `uplift.type`.")

# 38 (m04)
x("Which of these printed figures does the course teach as an arithmetic error of its source?",
 "OpenOil's 11.75 million, where 0.25 x 49 is 12.25",
 ["The World Bank note's $57 for the government take",
  "IMF FARI Table 12's cost petroleum of 1264 for 2005",
  "The Kenya model's blank margin over LIBOR in Art. 6.7"],
 "OpenOil prints \"This is calculated by: 0.25 x 49 = 11.75 million dollars\", and the product is 12.25. The World Bank's 57 and the IMF's 1264 differ from the engine within their printed precision, and a blank margin is a figure left for the parties, which the engine takes as a required rate.")

# 39 (vocabulary)
x("The course names every recovery by its object. Which phrase meets that?",
 "Premium recovery from PB's share of net value on the sidetrack",
 ["The recovery of PB after the sidetrack comes back into production",
  "Recovery, with no object, as a line heading in the partner report",
  "Recovery of the operator's overhead on a scale over a stated base"],
 "The course's vocabulary says recovery is always of something named: carry recovery, premium recovery, or cost recovery under a PSC. A party does not recover, a heading needs its object, and overhead is the operator's charge on a stated scale over a stated base.")

# 40 (vocabulary)
x("On psc-ekene the engine writes \"2030: recoverable 532000000 is above the cost oil limit 131400000; 400600000 carried to 2031\". Which description follows the course's vocabulary?",
 "The unrecovered pool of 400600000.000000 is carried to 2031",
 ["The pool of 400600000.000000 is a carry the contractor holds for 2031",
  "The contractor carries the state for 400600000.000000",
  "The 400600000.000000 is carried interest of the contractor"],
 "The course reserves carry for a carried party's cost share paid by its carriers; a pool, a credit or a balance moved to a later period is carried forward or carried to a named period. Carried interest is a share of the venture, and no party is carried on psc-ekene.")

# 41 (m03 and m06)
x("How does the course keep the three stated readings out of the capstone grades?",
 "Every capstone field is the same number under each reading and under the alternative it names",
 ["Each capstone states which reading applies, so a learner who follows it gets the graded figure",
  "The readings are switched off in the capstone runs, so every field is computed on the plain text",
  "A field that depends on a reading is graded with a tolerance wide enough to cover both readings"],
 "The course says no graded figure depends on a reading the engine states: every capstone field is the same number under each reading the engine takes and under the alternative it names. The engine has no switch for its readings, and tolerances are set once for the course.")

# 42 (m01 and m06)
x("A partner report quotes PB's 2035 receipt of 150000.000000 on the Ekene-4 sidetrack. Which convention must it name beside the figure?",
 "Reversion inside the payout period, the engine's convention for the payout year",
 ["Only the premium multiple, as the receipt follows from the multiple and nothing else",
  "The cover reading, since the consenting parties advanced PB's share of the cost",
  "The carry uplift on the opening balance, as the premium ledger also accrues it"],
 "The conventions table lists non-consent: the premium on the proportionate share of the cost; reversion inside the payout period, an engine convention. The receipt of 150000.000000 exists only because the rest of the payout year's share reverts to PB; the ledger adds no uplift and no cover applies to a sole risk operation.")

emit(Q, '/root/cat-wip-joa/banks/ec9a_exam.json', expect_n=42)
finish()
