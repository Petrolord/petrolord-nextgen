import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Expert m02, What the Nigeria Tax Act Moved. Keys rest on the course's
# framework rows (NTA s.197(1), the Chapter 4 arrangement, the auto and forced
# framework table, what changes with the framework), the tertiary education tax
# table, the capital allowance table, the onshore ledger across 1 January 2026,
# the ledger forced to the Act alone, the restriction rows on the cost price
# ratio case, the editions table, the version note and the refusal table.

K = [2, 0, 1, 3, 0, 2, 3, 1, 0, 3, 2, 1, 3, 0, 2]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("Which list matches what NTA s.197(1)(a) to (d) deletes from the Petroleum Industry Act 2021?",
 "Chapter Four Parts I to X, the Fifth and Sixth Schedules, Seventh Schedule paras 6, 9, 10, 11 and 12, and para 14 (6)",
 ["Only Chapter Four Parts I to X, with every Schedule kept in the Act for the Nigeria Tax Act to cite",
  "The whole Seventh Schedule with the Fifth and Sixth, leaving Chapter Four's hydrocarbon tax Part in place",
  "Host communities in Chapter Three, together with the cost price ratio of the Sixth Schedule"],
 "S.197(1) reads: \"(a) Part I - X of Chapter Four; (b) the Fifth and Sixth Schedules; (c) paragraphs 6, 9, 10, 11 and 12, of the Seventh Schedule; and (d) paragraph 14 (6) of Part IV of the Seventh Schedule.\" The Schedules go too, Chapter Four's Parts go with them, and the Seventh Schedule loses only the listed paragraphs. Chapter Three is not on the list.")

# 2
x("NTA s.197(1)(a) deletes Parts I to X of Chapter Four of the Petroleum Industry Act 2021. What is Chapter Four?",
 "The Act's fiscal framework: Part I sets its objectives and administration and Part II is the hydrocarbon tax",
 ["Conversion, with ss.92 to 94 and the rules on relinquishing the acreage a holder leaves unselected under s.93(4)",
  "Host communities, whose trust contribution under s.240(2) is 3 percent of opex",
  "Royalty: the terrain tranches and the royalty by price with its benchmarks"],
 "The Act's arrangement of sections reads \"CHAPTER 4: PETROLEUM INDUSTRY FISCAL FRAMEWORK PART I: OBJECTIVES AND ADMINISTRATION 258. Objectives. 259. Administration. PART II: HYDROCARBON TAX 260. Application of this Part.\" So Chapter 4 opens at s.258, after the conversion sections and after s.240; the host communities trusts sit under Chapter 3, and the royalty tranches are in the Seventh Schedule.")

# 3
x("NTA s.72 and PIA s.267 print the same 30 and 15 percent classes. How does the course relate the two sections?",
 "S.197(1)(a) deletes the Act's fiscal Parts, and the Nigeria Tax Act re-enacts the same provisions in its own sections",
 ["Amendment in place: s.72 amends s.267, so both stay in force side by side and a ledger cites whichever of the two is later",
  "Deep offshore under s.267 and onshore and shallow water under s.72, side by side",
  "Only new leases fall under s.72, and s.267 keeps governing converted leases until they expire"],
 "The course reads it so: s.197(1)(a) deletes Parts I to X of Chapter Four, and the same provisions are re-enacted in the Nigeria Tax Act, which is why the NTA sections cited beside the PIA sections (s.65 beside s.260, s.72 beside s.267, s.68 beside s.263) say the same things. Neither s.267 nor s.72 prints a deep offshore rate, and neither splits converted from new leases.")

# 4
x("Under the engine's default override \"auto\", which years does it read as years under the Nigeria Tax Act 2025?",
 "2026 and every later year, read row by row, so one ledger can cross the switch",
 ["Every year after the gazette date of 26 June 2025, so that 2025 is split into two parts on one row",
  "Every year of a ledger that starts in 2026 or later; a ledger that starts earlier stays on the Act alone",
  "2025 and every later year, the year the Act was gazetted"],
 "Under \"auto\" a year before 2026 is \"pia_only\" and 2026 and every later year is \"nta_2025\", read row by row, so one ledger can cross the switch; a crossing ledger reports kpis.fiscal_framework \"pia_only_then_nta_2025\". The engine exports NTA_FIRST_YEAR as 2026 and splits no year. The 26 June 2025 date is the gazette date, and 2025 reads \"pia_only\".")

# 5
x("With pia_under_nta_2025_override set to \"force_nta\", how does the engine read the year 2023?",
 "As \"nta_2025\": force_nta puts every year of the ledger on the Nigeria Tax Act 2025",
 ["\"pia_only\", since an override reaches only 2026 onward and leaves earlier years on the Act alone",
  "Refused, since 2023 is before 2026",
  "\"pia_only_then_nta_2025\", the value the engine gives a year that sits before the switch"],
 "The framework table prints 2023 as \"pia_only\" under auto and force_pia and \"nta_2025\" under force_nta: \"force_pia\" and \"force_nta\" put every year on one framework. \"pia_only_then_nta_2025\" is the value of kpis.fiscal_framework for a whole ledger that crosses under auto and names no single year. No year is refused for its date.")

# 6
x("A learner types \"nta\" as the value of pia_under_nta_2025_override. What does the engine do?",
 "It refuses: \"pia_under_nta_2025_override must be \"auto\", \"force_pia\" or \"force_nta\"; got \"nta\".\"",
 ["Runs the ledger as force_nta and prints a note that \"nta\" was read as shorthand for that override",
  "Falls back to the default \"auto\" for an unknown value and runs the ledger with no note at all",
  "Refuses with a message naming NTA_FIRST_YEAR 2026 as the only year that an override can move"],
 "That is the engine's refusal, verbatim: the override takes exactly three values and anything else is a thrown error. A refusal returns no ledger, so there is no shorthand reading and no silent fallback to auto, and the message names the three accepted values, with no mention of NTA_FIRST_YEAR.")

# 7
x("On ekene_onshore_across_2026 (synthetic, onshore, converted, 2024 to 2028), what does the 2026 row carry on the education tax and levy lines?",
 "TET 0.000000 and a development levy of 4920525.461957",
 ["Education tax 4920525.461957 and levy 0.000000, the education tax running on to the end of the lease",
  "4152684.167129 of TET beside a levy of 4920525.461957, both charged in the first year under the new Act",
  "Nothing on either line, the levy first charged in the second year under the Nigeria Tax Act 2025"],
 "2026 is the first \"nta_2025\" row of this ledger. Its education tax line reads 0.000000, since NTA s.197(5) deletes the sections behind that tax, and its levy line reads 4920525.461957. The figure 4152684.167129 sits on the 2025 row, a \"pia_only\" year.")

# 8
x("On what base does the engine charge the development levy of NTA s.59(1)?",
 "The companies income tax assessable profit, in years under the Nigeria Tax Act 2025 only",
 ["Hydrocarbon tax assessable profit, at 4 percent, charged beside the income tax base every year",
  "Gross revenue less every royalty, at 4 percent, in every year of the ledger whatever its framework",
  "The companies income tax charged, as a 4 percent surcharge"],
 "The instruments table gives the levy's base as the companies income tax assessable profit in years under the Nigeria Tax Act 2025, and the framework table gives it as none in a year under the Act alone. NTA s.59(4) keeps it off profits computed for the hydrocarbon tax, and the levy reads a profit figure, so gross revenue and the tax charged are both the wrong base.")

# 9
x("Which statement matches the tertiary education tax rates the engine applies by year?",
 "3 percent from 2023, applied to the whole of 2023, and 2.5 percent before, a rate resting on a secondary source",
 ["3 percent from 1 May 2023 only, so 2023 is charged at two rates split by the months either side",
  "2.5 percent in every year under the Act alone, as the Finance Act 2023 scan could not be relied on",
  "4 percent from 2023, the same rate the development levy charges on the same base from 2026"],
 "The rate table prints 2.500000 for 2021 and 2022 and 3.000000 for 2023 to 2025. The Finance Act 2023 raised the rate with effect from 1 May 2023 (s.26, s.30); the annual model applies 3 percent to the whole of 2023, and the 2.5 percent before rests on a secondary source. The development levy's 4 percent is a different instrument.")

# 10
x("Ekene Alpha is rerun with every year forced to the Act alone. What happens to its education tax and levy totals?",
 "TET changes by 26785663.028773 and the levy by -35714217.371697",
 ["A straight swap at par: TET changes by 35714217.371697 and the levy by -35714217.371697",
  "Both move by 0.000000, since Alpha has no year before 2026 for the Act alone to govern in the first place",
  "Only the education tax moves, by 26785663.028773, the levy staying in the years the new Act reached"],
 "The one-change row prints TET 26785663.028773 and levy -35714217.371697. Forcing the Act alone swaps the development levy for the tertiary education tax and changes the capital allowance and the restriction, so the two lines do not trade at par. A forced run puts every year on one framework, whatever its date.")

# 11
x("The 2024 spend on ekene_onshore_across_2026 reaches its fifth year of life in 2028. What fraction does 2028 claim?",
 "20 percent, since 2028 is a year under the Nigeria Tax Act 2025 and the law of each year decides",
 ["19 percent, since the spend was made in 2024 under the Act alone and keeps that year's schedule",
  "20 percent for the year plus the 1 percent the Act alone retained, released at the switch",
  "19 percent, with the other 1 percent recorded as a notional amount that the new Act then lets the company claim"],
 "The capital allowance is read by the law of the year of assessment: year 4 of life is 0.190000 under the Act alone and 0.200000 under the Nigeria Tax Act 2025, and the course checks that the 2024 spend claims 20 percent in 2028. NTA First Schedule Part II para 4(2) says the 1 percent is \"a notional amount\" that \"shall not increase or reduce the amount of capital allowance claimable\".")

# 12
x("On ekene_force_pia_2027 every year is forced to the Act alone. What is the fifth-year capital allowance of the 2027 spend, claimed in 2031?",
 "11400000.000000, the 19 percent fifth-year fraction of a year under the Act alone",
 ["0.000000, since a spend's fifth year of life claims nothing under either law and the claim ends in 2030",
  "18000000.000000, the onshore ledger's 2028 claim",
  "11400000.000000 plus the 1 percent retained under the Fifth Schedule, which that ledger releases in 2031"],
 "The forced ledger prints the fifth-year allowance of the 2027 spend, in 2031, as 11400000.000000. Year 4 of life (0 is the year of spend) is the fifth year and claims 0.190000 under the Act alone; year 5 is the one that claims 0.000000. The 1 percent of para 5(2) is retained until disposal and never claimed in the ledger. 18000000.000000 belongs to a different case.")

# 13
x("On ekene_cpr_binding_forfeiture the two thirds restriction binds in 2024 and 2025. What happens to the carried capital allowance in 2026?",
 "It is claimed in full, the 2026 claim reaching 65038687.352504, as 2026 is a year under the Nigeria Tax Act 2025",
 ["Two thirds of the assessable profit is claimed again, with the rest carried on to a later year",
  "It is forfeited at the switch, as the cost price ratio carry is forfeited when a ledger ends",
  "None of it is claimed: the 2026 assessable profit of -457065.217391 leaves no room for a claim"],
 "The companies income tax rows print the claim as 15999597.939440 in 2024 and 8961714.708056 in 2025, two thirds of each assessable profit, and 65038687.352504 in 2026. A year under the Nigeria Tax Act 2025 carries no restriction and a carried amount is claimed in full, even against an assessable profit of -457065.217391; forfeiture belongs to the hydrocarbon tax cost price ratio.")

# 14
x("When does the engine print the note \"Nigeria Tax Act 2025 figures follow Official Gazette No. 117, Vol. 112, of 26 June 2025.\" in kpis.pia_notes?",
 "Whenever the ledger holds a year under the Nigeria Tax Act 2025",
 ["On every PIA ledger, as it prints the note on the daily rate the royalty tranches read",
  "Only when pia_under_nta_2025_override is \"force_nta\", which puts every year on the new Act",
  "Only on a deep offshore ledger, whose stated reading rests on the June 2025 wording of s.65(1)"],
 "The note table gives ntaVersion's condition as \"a year under the Nigeria Tax Act 2025\". A ledger under auto that reaches 2026 carries it without any override, a ledger wholly before 2026 or forced to the Act alone carries none, and nothing in its condition is about terrain. The daily-rate note is the one printed on every PIA ledger.")

# 15
x("What does the course know about the text of the Nigeria Tax Act 2025 that it quotes?",
 "It read the June 2025 gazette on 2026-09-26; re-gazetting was ordered in December 2025 and no Certified True Copy was read",
 ["The re-gazetted Certified True Copy of December 2025, which replaces the June text entirely",
  "Its text came from the State House statement, which carries the Act in full with its 1 January 2026 date",
  "June 2025 gazette text, whose commencement note sets the effective date of 1 January 2026"],
 "The editions table gives Official Gazette No. 117, Vol. 112, Lagos, 26 June 2025, effective 1 January 2026 by the State House statement, with re-gazetting ordered in December 2025 and no Certified True Copy read, all read on 2026-09-26. The statement is a secondary source for the date, and the gazette's commencement note prints \"[ 26th June, 2025 ]\".")

emit(Q, '/root/cat-wip-pia/banks/ec7a_m02.json', expect_n=15)
finish()
