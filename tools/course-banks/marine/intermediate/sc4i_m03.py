import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC4 Professional m03, Vessels Required.
# Every figure is quoted from digest.txt or returned by the vendored engine on
# the stated input (single-field edits verified by the writer's probe). The
# Ekene cluster is synthetic. No capstone name, input or value appears.

q(2, "The Ekene PSV milk run week needs 10.345455 vessel-days, and each vessel is available 6.5 days of the 7-day period. Which figure does the engine return as the vessels before rounding?",
 "1.591608, the vessel-days over the days one vessel is available",
 ["2, the whole vessels after the stated rule rounds the need up",
  "0.795804, the fleet utilisation of two vessels on the same week",
  "2.654545, the vessel-days left spare once two vessels are held"],
 "Vessels before rounding are the need over one vessel's available days: 10.345455 over 6.5 is 1.591608. The 2 is that figure after rounding up. 0.795804 is the fleet utilisation and 2.654545 the spare vessel-days, both read after the vessels are whole.")

q(0, "A planner states 7.5 available days a vessel in a 7-day period. What does the engine return?",
 "A refusal: vesselAvailableDays must be at most periodDays (7); got 7.5",
 ["A result with 7 days used, the extra half day trimmed and noted in a reason",
  "A result with fewer vessels, since each one now supplies 7.5 vessel-days",
  "A refusal: vesselAvailableDays must be a finite number above 0; got 7.5"],
 "Available days above the period describe a week longer than itself, so the engine refuses them by name and says the bound. It trims nothing. The other message, above 0, is what a missing availability gets; 7.5 is above 0 and fails only against the period.")

q(3, "A single dedicated installation's week is sized with 7 of 7 days available a vessel, available days equal to the period. How does the engine treat that input?",
 "It accepts it and returns 0.202381 vessels before rounding for that case",
 ["It refuses it, since a vessel must keep some days for crew change",
  "It refuses it, since available days must stay strictly below the period",
  "It accepts it and sets the vessels before rounding to 1 on that case"],
 "The boundary is inclusive: available days may equal the period, and the course's case returns 0.202381 vessels before rounding. Only days above the period are refused. Any allowance for crew change is the planner's to state, and the engine holds none. The fraction is before rounding.")

q(1, "One installation's week needs 9.916667 vessel-days with 7 days available a vessel, so 1.416667 vessels before rounding. vesselRounding is \"nearest\". What does the engine return?",
 "1 vessel, 7.000000 vessel-days of capacity, short by 2.916667 vessel-days",
 ["2 vessels, 14.000000 vessel-days of capacity and 4.083333 vessel-days spare",
  "1.416667 vessels, a capacity equal to the need, nothing spare and nothing short",
  "2 vessels, since the nearest rule never leaves a period's need uncovered"],
 "The nearest whole vessel to 1.416667 is 1, and one vessel supplies 7.000000 vessel-days against 9.916667 needed, so the week is short by 2.916667. 2 vessels with 4.083333 spare is what \"up\" returns, and the fraction with nothing short is \"none\". \"nearest\" can leave the need uncovered.")

q(2, "Keep that need and switch the vessel rule to \"up\". What spare vessel-days does the engine report?",
 "4.083333, the 14.000000 vessel-days of two vessels less the need",
 ["2.916667, the gap the nearest rule leaves between need and one vessel",
  "0.000000, since rounding up sizes the fleet exactly to the need",
  "7.000000, one whole vessel's available days held in reserve"],
 "\"up\" gives 2 vessels, a capacity of 14.000000 vessel-days, and 14.000000 less 9.916667 is 4.083333 spare. 2.916667 is the shortfall of the nearest rule. A fleet sized exactly to the need is what \"none\" returns. The spare is the capacity less the need.")

q(0, "Rounding to the nearest vessel meets a fraction of exactly one half: 10.500000 vessel-days are spread over 7 available days, which is 1.500000 vessels. What does the engine return?",
 "2 vessels, by its stated reading that a half rounds up, with 3.500000 spare",
 ["1 vessel, since halves round down, leaving the week short of vessel-days",
  "1.500000 vessels, since a half lies equally near both whole vessels",
  "A refusal, since a half is ambiguous and the rule must then be \"up\""],
 "The engine returns 2 vessels and 3.500000 spare vessel-days. Rounding a half up is a reading the engine states; the alternative rounds halves down, which would give 1 vessel and a short week. \"nearest\" always returns a whole vessel, and the engine refuses nothing here.")

q(3, "On the Ekene PSV milk run, 1.591608 vessels before rounding. Why do \"up\" and \"nearest\" return the same fleet and the same 2.654545 spare vessel-days?",
 "The fraction is above one half, so the nearest whole vessel is also the next one up",
 ["The engine reads \"nearest\" as \"up\" whenever a milk run is stated as the route",
  "Both rules round the vessel-days first, and 10.345455 rounds to the same whole figure",
  "The shortfall under \"nearest\" is printed as spare when it falls below one vessel"],
 "The part of a vessel beyond the first is past the half, so the nearest whole vessel is 2, which is also the ceiling. The two rules part only when the fraction falls below one half. Rounding acts on the vessels, and the route plays no part in it. A shortfall and a spare are separate fields.")

q(1, "Which output is the engine's own reason for a fleet whose rounding leaves the need uncovered?",
 "1 vessel gives 7 vessel-days against 9.916667 needed: short by 2.916667 vessel-days",
 ["vesselRounding must be one of \"up\", \"nearest\", \"none\"; got \"nearest\" for a short week",
  "voyage X takes 9.25 days, longer than the 6.5 days a vessel is available in the period",
  "fleet is short: 9.916667 vessel-days needed exceeds the capacity, so no fleet is returned"],
 "A shortfall is a result with a reason: the engine sizes the fleet the rule asks for and prints what it fails to cover, with the short vessel-days also in their own field. \"nearest\" is an accepted value, so it is never refused. The 9.25-day message is the reason for a voyage longer than the days available, and a fleet is always returned.")

q(3, "A week's voyages need exactly 14.000000 vessel-days, with 7 days available a vessel and vessels rounded up. What does the engine return?",
 "2 vessels, 0.000000 spare, 0.000000 short and a fleet utilisation of 1.000000",
 ["3 vessels, since a need that fills the capacity exactly leaves no margin at all",
  "2 vessels with a shortfall reason, since a need at capacity counts as uncovered",
  "2.000000 vessels before rounding and a refusal to round a whole figure again"],
 "The need is compared with the capacity at twelve significant digits, and a need equal to the capacity is covered: 2 vessels hold 14.000000 vessel-days, nothing is spare or short, and the fleet utilisation is 1.000000. Rounding up a whole figure leaves it whole. The engine adds no margin vessel.")

q(2, "On that exactly-two-vessel week, a planner adds one port hour to each voyage, so the need rises above 14.000000 vessel-days. Vessels are still rounded up. What does the engine return?",
 "3 vessels, since the need is now above what two vessels can supply",
 ["2 vessels with a small shortfall reason, since the rise is under a day",
  "2 vessels and nothing short, since the extra hour sits inside the tie rule",
  "A refusal, since the need now exceeds the capacity of the stated fleet"],
 "Two vessels supply 14.000000 vessel-days, and one hour a voyage lifts the need past it, far beyond twelve digits, so \"up\" moves to 3 vessels. A small shortfall with 2 vessels is what \"nearest\" returns for the same need. The planner states no fleet here: the rule sizes it.")

q(0, "What does the engine's fleet utilisation of 0.795804 on the Ekene PSV milk run week measure?",
 "The week's 10.345455 vessel-days over two vessels' available days",
 ["The deck area utilisation of one voyage, averaged over the four voyages",
  "The share of the deck area capacity the week's demand fills on each voyage",
  "The binding constraint's utilisation, read over the week's voyage set"],
 "Fleet utilisation is always of the fleet: the need over the capacity in vessel-days, 10.345455 over two vessels at 6.5 days. A constraint's utilisation on one voyage, and the average utilisation of each constraint over the period in the constraint table, are separate figures about the vessel's capacities.")

q(1, "Three weeks return fleet utilisations of 0.688811 (vessels rounded up), 1.000000 (vessels kept as the fraction) and 1.416667 (vessels to the nearest). Which reading of these figures is right?",
 "Above 1 means a short fleet, exactly 1 is a fleet sized to the need by construction",
 ["Above 1 means spare time, since utilisation grows with the vessels the week keeps",
  "Exactly 1 means a short fleet, since no margin is left for weather or late cargo",
  "The three figures are equal in meaning, as each is a deck area utilisation"],
 "Fleet utilisation is the need over the capacity. With \"none\" the capacity equals the need, so it is exactly 1.000000. 1.416667 is a fleet whose need is larger than its capacity, which the short vessel-days quantify. 0.688811 is the calm Ekene week rounded up, with room to spare.")

q(3, "The Ekene PSV milk run week sails 4 voyages (voyages rounded up), and one rainy-season voyage burns 19.876364 t. What fuel for the period does the engine return?",
 "79.505455 t, four voyages times one voyage's fuel",
 ["19.876364 t, since fuel is quoted for one voyage only",
  "66.494545 t, the same four voyages in calm weather",
  "85.461818 t, the week as dedicated voyages"],
 "Fuel for the period is each set's voyages times the fuel of one of its voyages: 4 times 19.876364 is 79.505455 t, costing 69169.745455 at 870 a tonne. 19.876364 is one voyage. 66.494545 is the calm week, whose voyages are shorter. 85.461818 is the dedicated week of eight voyages.")

q(2, "On the Ekene PSV milk run week, a planner switches only vesselRounding from \"up\" to \"none\". What does the engine return for the fuel cost of the period?",
 "69169.745455, unchanged, since fuel follows the voyages and ignores the vessel rule",
 ["Nothing, since the rule \"none\" prices no fuel for a fraction of a vessel",
  "57850.254545, since keeping the fraction removes the rainy-season allowance",
  "17292.436364, since \"none\" prices the fuel of a single voyage only"],
 "Fuel for the period is the voyages sailed times one voyage's fuel, so it follows the voyage rounding. The vessel rule changes only how many vessels hold the vessel-days, and an idle vessel burns nothing in this engine. 57850.254545 is the calm week and 17292.436364 is one voyage's fuel cost.")

q(1, "The same week of demand on the Ekene AHTS milk run (412.5 m2 of usable deck) returns 5 voyages driven by deck area, 12.541667 vessel-days and 2 vessels. How much spare vessel-days does the pair hold?",
 "0.458333, far less slack than the PSV pair's 2.654545",
 ["2.654545, the same as the PSV, since both round to 2",
  "1.566667, the spare the AHTS holds on dedicated voyages",
  "0.964744, the share of two vessels that the week uses"],
 "Two AHTS at 6.5 days each hold 0.458333 vessel-days more than the 12.541667 the week needs. Both vessels round to 2, and the spare still differs because the needs differ. 1.566667 is the AHTS on dedicated voyages. 0.964744 is the fleet utilisation, a ratio of need to capacity.")

emit(Q, '/root/cat-wip-marine/banks/sc4i_m03.json', expect_n=15)
finish()
