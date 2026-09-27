import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC4 Professional m02, Voyages and Vessel-Days.
# Every figure is quoted from digest.txt or returned by the vendored engine on
# the stated input (single-field edits verified by the writer's probe). The
# Ekene cluster is synthetic. No capstone name, input or value appears.

q(1, "The Ekene PSV milk run week needs 3.100000 voyages of demand, and one voyage takes 2.586364 days. With voyageRounding stated as \"none\", what vessel-days does the engine return?",
 "8.017727, the fractional average of voyages times the voyage days",
 ["10.345455, the vessel-days of four whole voyages rounded up",
  "2.586364, the days of one voyage, which \"none\" leaves unmultiplied",
  "8.954545, the vessel-days of the same four voyages in calm weather"],
 "\"none\" keeps 3.100000 voyages, and 3.100000 times 2.586364 days is 8.017727 vessel-days. 10.345455 is what \"up\" returns with 4 whole voyages. \"none\" still multiplies by the voyage days. 8.954545 is the calm week, whose voyages are shorter.")

q(3, "A planner wants voyages rounded to the nearest whole number and states voyageRounding as \"nearest\". What does the engine return?",
 "A refusal: voyageRounding must be one of \"up\", \"none\"; got \"nearest\"",
 ["A fleet with 3 voyages for the Ekene week, since 3.100000 is closer to 3",
  "A fleet rounded up with a reason noting that \"nearest\" was read as \"up\"",
  "A refusal: vesselRounding must be one of \"up\", \"nearest\", \"none\"; got nothing"],
 "The voyage rule has two values, \"up\" and \"none\", and the engine refuses any other word by name, quoting what it got. It never swaps a rule silently. \"nearest\" is a value of the vessel rule, whose missing-input message is a different refusal about a different field.")

q(0, "What does voyageRounding \"none\" describe that \"up\" does not?",
 "The long-run average over many periods, a figure for a budget that no single week can sail",
 ["The fewest whole voyages that carry the demand, which is the week a planner actually sails at sea",
  "A week in which the fractional voyage is left ashore and its cargo waits for the next one",
  "The voyage count with the minimum visits removed, leaving the demand ratio on its own"],
 "\"none\" keeps the fraction: 3.100000 voyages is what the Ekene week averages over many periods, the right figure for a budget spread over a year. The fewest whole voyages is \"up\". No cargo is left ashore by either rule, and the visits still count under both, since rounding acts on the voyages needed.")

q(2, "A dedicated installation's deck demand is 2.1 m2 against a deck area capacity of 0.7 m2, voyages rounded up. The double arithmetic returns the ratio as 3.0000000000000004. What voyage count does the engine return?",
 "3, because it rounds up the ratio's twelve-significant-digit figure, which is 3",
 ["4, the ceiling of the raw double, since the ratio sits a hair above exactly 3",
  "3.0000000000000004, since a count rounded up keeps the exact ratio",
  "A refusal, since a demand ratio must be a whole number to round up"],
 "The engine's stated reading takes the ceiling of the twelve-digit figure, and 3.0000000000000004 agrees with 3 to twelve digits, so the engine returns 3 voyages. The alternative, a ceiling of the raw double, would plan a fourth voyage for binary noise. A rounded count is whole, and nothing here is refused.")

q(2, "One installation sized alone asks for 300.001 m2 of deck cargo against a deck area capacity of 100 m2, voyages rounded up. Why does the engine return 4 voyages?",
 "The demand is a thousandth of a square metre above three voyages, a real fourth voyage",
 ["The binary figure 3.0000099999999996 always rounds up whatever its first twelve digits say",
  "A thousandth of a square metre rounds away at twelve digits, so the extra voyage is noise",
  "Rounding up adds one voyage to every whole ratio so that no set runs at full capacity"],
 "300.001 over 100 differs from 3 in the sixth significant digit, well inside twelve, so the twelve-digit figure is above 3 and rounds up to 4. The comparison at twelve digits removes only binary noise in the last digits, which is why 300 over 100 gives 3. Rounding up adds nothing to a ratio that is whole.")

q(0, "In this course, what is a set's \"vessel-days\"?",
 "The voyages the set needs times the days one of its voyages takes, added over the sets",
 ["The vessels on hire times the days of the period, whatever the voyages of the sets happen to need",
  "The vessels times the days each is available, the time the fleet can put to work",
  "The days of one voyage, with the weather factor on every activity it names"],
 "Vessel-days are a demand on the fleet's time: voyages times voyage days, added over the sets. Vessels times available days is the fleet's capacity in vessel-days, the supply side. Vessels times days on hire is the everyday sense the course sets aside. One voyage's days are only the multiplier.")

q(3, "The Ekene PSV milk run week sails 4 voyages (voyages rounded up) in every weather case. In calm weather, weather factor 1, a voyage takes 2.238636 days. What vessel-days does the engine return for the calm week?",
 "8.954545, four calm voyages of 2.238636 days each",
 ["10.345455, since weather changes neither voyages nor vessel-days",
  "8.017727, the week with its voyages kept as the fractional average",
  "2.238636, since the calm week needs only one voyage's days"],
 "Weather reaches the fleet through time. The calm week sails the same 4 voyages, each shorter, so 4 times 2.238636 is 8.954545 vessel-days. 10.345455 is the rainy-season week. 8.017727 is the rainy-season week with voyages kept as the average. One voyage's days are the multiplier.")

q(1, "The Ekene week is sized on the PSV as dedicated voyages, voyages rounded up: EKA 2 voyages of 1.363636 days, EKJ 3 of 1.518182, EKB 1 of 1.372727 and EKF 2 of 1.613636. What vessel-days does the engine return for the fleet?",
 "11.881818, the four sets' own vessel-days summed row by row",
 ["5.868182, one voyage to each stop added once",
  "10.345455, the milk run's figure for the same demand",
  "12.541667, since dedicated voyages need one more voyage than the milk run"],
 "Each installation is its own set, so 2.727273 plus 4.554545 plus 1.372727 plus 3.227273 is 11.881818 vessel-days. 5.868182 counts one voyage to each stop and ignores the voyage counts. The same demand on a different route gives different vessel-days. 12.541667 is the AHTS milk run.")

q(0, "Why does the dedicated Ekene week need more vessel-days than the milk run on the same PSV and demand?",
 "Each dedicated voyage pays its own port time and its own sailing out and back, and eight sail where four did",
 ["Dedicated voyages carry less deck cargo each, so the demand ratio rises on every installation served",
  "The weather factor applies to port time on a dedicated voyage and to sailing time on a milk run",
  "Dedicated voyages are rounded up set by set, and the milk run's voyages are left fractional"],
 "The dedicated week sails 8 voyages, each with 12 port hours and its own round trip, where the milk run sails 4 through every stop; 11.881818 against 10.345455 vessel-days. The deck capacity per voyage is the same. The weather input names the same activities on both routes, and both round voyages up.")

q(2, "On the dedicated Ekene PSV week, a planner lowers EKJ's minimum visits from 3 to 1. EKJ's deck demand is 900.000000 m2 against 600.000000 m2 a voyage, its voyage takes 1.518182 days, voyages round up. What happens to EKJ's row and the fleet?",
 "EKJ sails 2 voyages driven by deck area, and the fleet's vessel-days fall by 1.518182",
 ["EKJ sails 1 voyage driven by minimum visits, and the fleet loses two EKJ voyages",
  "EKJ keeps 3 voyages, since its deck area still needs every one of the three visits it had",
  "Every set is re-sized, since one row's change moves the drivers of the other rows"],
 "EKJ's deck ratio is 900.000000 over 600.000000, which rounds up to 2 and now beats 1 visit, so deck area drives 2 voyages. One EKJ voyage of 1.518182 days drops out of the fleet total. The other rows keep their own demand, visits and drivers; a dedicated plan changes one row at a time.")

q(1, "One dedicated voyage takes 9.25 days because of 200 stated port hours, and a vessel is available 6.5 days of a 7-day period. What does the engine return?",
 "A result: 9.250000 vessel-days and 2 vessels, with a reason that the voyage is longer than the days available",
 ["A refusal naming portHours, since no voyage may be longer than the days a vessel has in the period",
  "A result of 1 vessel with 9.250000 vessel-days, since one voyage needs only one vessel to sail it out",
  "A result of 2 vessels with no reason, since two vessels hold more than the 9.250000 vessel-days"],
 "The engine computes the fleet and prints, in its own words: voyage X takes 9.25 days, longer than the 6.5 days a vessel is available in the period. It is a result with a reason, so every figure is shown. The division gives 2 vessels, and the reason warns that neither can sail a nine-and-a-quarter-day voyage inside the week.")

q(3, "Take the 9.25-day dedicated voyage again and state vesselAvailableDays as 7, equal to the 7-day period. What does the engine return?",
 "The reason stays, now naming 7 days, since 9.25 days is still longer than the days available",
 ["The reason disappears, since available days equal to the period cover any single voyage it sails",
  "A refusal, since vesselAvailableDays equal to periodDays leaves no time for maintenance",
  "The reason disappears and the fleet drops to 1 vessel, since 7 days now cover the need"],
 "The check is each voyage's days against the stated available days: 9.25 is above 7, so the engine still prints the reason, with 7 in it. Available days equal to the period are accepted; only above the period is refused. The vessel-days of 9.250000 over 7 still round up to 2 vessels.")

q(3, "Which of these fleetSize inputs does the engine refuse, where the others return a result?",
 "A period of zero days: periodDays must be a finite number above 0; got 0",
 ["One voyage of 9.25 days against 6.5 days a vessel is available in the period",
  "Vessels rounded to the nearest, leaving the week short by 2.916667 vessel-days",
  "A dedicated voyage set whose count is driven by the minimum visits alone"],
 "A period of zero cannot be computed, so the engine refuses it by name and returns no figures. A voyage longer than the days available and a short fleet are results with reasons: the engine computes them and prints what deserves attention. A set driven by its visits is an ordinary result.")

q(0, "One Ekene PSV milk run voyage takes 2.586364 days, and a vessel is available 6.5 days of the week. Does the engine print a reason about voyage length?",
 "No reason: each voyage fits inside the 6.5 days a vessel has, with room for two",
 ["A reason, since 4 voyages of 2.586364 days exceed the 6.5 days one vessel has",
  "A reason, since the week's 10.345455 vessel-days are more than 6.5 available days",
  "A refusal, since the vessel-days of the week are more than one vessel can supply"],
 "The reason compares one voyage's days with the available days, and 2.586364 is below 6.5, so nothing is printed. That the week's total needs more than one vessel is the ordinary job of the vessel count, 2 here. A total above one vessel's days is neither a reason nor a refusal.")

q(1, "The Ekene PSV milk run takes 62.072727 hours with the weather factor 1.2 on sailing and field time. What voyage days does fleetSize use for that set?",
 "2.586364, the voyage's hours after the weather factor over 24",
 ["2.238636, the calm voyage's days, since fleet sizing ignores weather",
  "2.686364, since fleet sizing applies the factor to every activity",
  "62.072727, the hours themselves, since fleet sizing counts in hours"],
 "Fleet sizing runs the voyage plan's arithmetic for each set: the hours with the weather factor on the activities the call names, over 24, so 62.072727 hours is 2.586364 days. The calm figure drops the factor the call states. 2.686364 would need port time named as well. Fleet sizing works in days, so the hours are divided by 24.")

emit(Q, '/root/cat-wip-marine/banks/sc4i_m02.json', expect_n=15)
finish()
