import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Professional m06, The Published PSC Checks.
# Every printed figure is quoted as the text prints it, with its citation, and
# every engine figure as the engine returns it on the golden input that states
# the example's own terms. A printed figure and an exact one are never keyed
# as equal. No capstone name, term, series or value appears.

W = "World Bank Petroleum Sector Briefing Note No. 8 (November 2007)"

q(1, f"The {W} two-barrel example states gross 100, costs 25, royalty 10 percent, a cost oil limit of 60 percent of gross, a contractor profit share of 40 percent and tax 30 percent. The note prints that the contractor retains US$43 and the government takes $57. What does the engine return?",
 "43.200000 and 56.800000, which round to the note's 43 and 57",
 ["The note's 43 and 57 exactly, since the engine reproduces a published example to the cent",
  "43.200000 and 56.800000, which shows the note is in error by 0.2 and must be corrected before it is taught",
  "26.000000 and 39.000000, the profit oil split alone"],
 "The engine returns 43.200000 and 56.800000 on the note's own terms; the note prints its totals in whole dollars, and the two engine figures round to 43 and 57. The printed figures are the text's rounding; the note is not in error. A printed figure and an exact one are quoted side by side and are not keyed as equal. 26.000000 is the contractor's profit oil alone, before tax and without its cost oil.")

q(3, "A limit of 60 percent of gross, a royalty of 10 percent and gross of 100 are the terms of World Bank Briefing Note No. 8 (November 2007). What limit comes back, and in what form does applyPSC receive it?",
 "60.000000, passed as the fraction 60 / (100 - 10) of revenue after royalty",
 ["60 percent of the revenue after royalty of 90, since applyPSC reads every limit on that base",
  "60.000000, passed to a gross-base copy of applyPSC written inside the engine for the note",
  "25.000000, the costs, since a limit cannot exceed what there is to recover"],
 "The engine returns a limit of 60.000000, as the note prints (\"60 percent of the gross revenue or US$60\"), and its basis reads \"the limit is stated on gross revenue and passed to applyPSC as the fraction 60 / (100 - 10) of revenue after royalty\". The engine keeps no copy of applyPSC of its own. The cost recovered is 25.000000, below the limit of 60.000000; the limit is a ceiling.")

q(0, f"The {W} example recovers its costs of 25 in full. What does the engine return for the contractor's profit oil and its income tax?",
 "Contractor profit oil 26.000000 and tax 7.800000, the taxable income of 26 being the contractor's profit oil here",
 ["Contractor profit oil 39.000000, the government's 60 percent read as the contractor's, taxed at 30 percent",
  "Contractor profit oil 26.000000 and tax 0.000000, since in a production sharing contract the government's profit oil stands in for any income tax",
  "Contractor profit oil 65.000000, the whole profit oil taxed at 30 percent before it is split"],
 "The note prints \"The government takes 60 percent of US$65, or US$39, and the remaining US$26 goes to the contractor.\", and the engine returns contractor profit oil 26.000000, government profit oil 39.000000 and income tax 7.800000. The course notes that its taxable income of 26 is the contractor's profit oil here, because the costs are recovered in full.")

q(2, "Which does World Bank Briefing Note No. 8 (November 2007) pay first in its two-barrel example, and what does the engine return for it?",
 "The royalty, at 10 percent: 10.000000",
 ["The cost oil, up to the limit of 60 percent of gross, before any royalty is taken",
  "The income tax on the contractor's share, at 30 percent, before royalty and cost oil",
  "The profit oil split, at 60 percent to the government, before royalty is charged"],
 f"The note prints \"the royalty is paid first. At 10 percent, this amounts to $10 going to the government.\" ({W}); the engine returns royalty 10.000000. The engine's order reads \"royalty = royaltyPct % of gross; cost oil limit = costOilLimitPct % of revenue after royalty (or of gross, as stated); cost recovered = min(pool + capex + opex, limit); profit oil = revenue after royalty - cost recovered\".")

q(2, "IMF FARI TNM/16/01 (February 2016), Figure 5, runs one barrel at 100 with the limit at 50 percent of revenue after royalty, a contractor share of 40 percent and tax 30 percent. The figure prints government revenue of USD30 in profit oil and USD6 in income tax. What does the engine return?",
 "Cost recovered 50.000000, government profit oil 30.000000, income tax 6.000000, and 36.000000 to the government",
 ["Cost recovered 50.000000, with income tax on cost petroleum plus profit petroleum and no deduction",
  "Cost recovered 60.000000, as the figure states its limit on gross like the World Bank note",
  "Government profit oil 20.000000 and income tax 6.000000, the 40 percent share read as the government's"],
 "The engine returns cost recovered 50.000000, government profit oil 30.000000, contractor profit oil 20.000000, income tax 6.000000 and 36.000000 to the government, as Figure 5 prints. Its limit is stated on revenue after royalty. The figure's tax base of cost plus profit petroleum less allowable deductions, with deductions assumed equal to cost recovery, leaves the contractor's profit oil.")

q(0, "IMF FARI Figure 5 says \"the base for CIT is equal to cost petroleum plus profit petroleum minus allowable tax deduction\" and assumes the deductions equal the cost recovery. What tax base does that leave in the one-barrel figure?",
 "The contractor's profit oil of 20, taxed at 30 percent to 6",
 ["The contractor's cost petroleum and profit petroleum together, since deductions come after the tax",
  "The whole profit oil of 50, taxed at 30 percent, as the government's share is part of the base",
  "Nothing, since the deductions assumed equal to cost recovery wipe out the profit petroleum as well"],
 "Figure 5 assumes \"Normal tax deductions in the tax/royalty regime are assumed to be equal to the cost recovery in the PSC.\", so cost petroleum less the deduction cancels and the base is the contractor's profit petroleum; the engine returns contractor profit oil 20.000000 and income tax 6.000000, which the figure prints as USD6.")

q(3, "IMF FARI Tables 12 and 13 (February 2016) are run through the engine on psc-fari-table-12: eleven years in USD million, royalty 0.000000 percent, a ceiling of 80.000000 percent of revenue after royalty. What does the course say about the agreement?",
 "It agrees at the printed precision: the largest cost line difference is 1.000000, inside the 1.5 three printed whole numbers can carry",
 ["It agrees exactly: every printed whole number equals the engine's figure once the engine's figure is rounded",
  "It disagrees in 2005 and 2006, where the tables' figures are shown to be arithmetic errors in the IMF model",
  "It agrees within 1.560000 on every line, the tolerance being applied to the ceiling and the pool as well"],
 "The course states the largest difference on a cost line (ceiling, cost petroleum, closing balance, profit) is 1.000000, inside the 1.5 a line made of at most three printed whole numbers can carry. The tables print whole numbers of an unrounded model, so the check is within the printed precision. 1.560000 is the largest difference on the profit split, and it has its own bound.")

q(1, "On psc-fari-table-12, how does the engine take each year's contractor share of profit petroleum, which IMF FARI sets by a daily-rate scale?",
 "As a stated contractorProfitSharePct for each year, read from Table 13's government share",
 ["By computing the daily-rate scale of Table 11 inside the engine from each year's production",
  "As one contractorProfitSharePct for the whole run, the average of Table 13's shares",
  "By applying the Ekene variant's 60 percent to every year of the IMF schedule"],
 "The golden input states each year's contractor share as contractorProfitSharePct, read from Table 13's government share, \"a daily-rate scale the tables compute outside this engine\". The engine's basis reads \"contractorProfitSharePct applies to every year that does not state its own (a year's own figure carries a sliding scale, e.g. by daily rate or R-factor, computed outside)\".")

q(0, "In 2003 of the IMF schedule (psc-fari-table-12: royalty 0.000000 percent, ceiling 80.000000 percent of revenue after royalty), the tables print a ceiling of 170 and cost petroleum of 170. What does the engine return?",
 "A ceiling of 170.400000 and cost recovered of 170.400000",
 ["A ceiling of 170, rounded to the table",
  "A ceiling of 433.600000, the 2004 figure",
  "A ceiling of 170.400000 with cost recovered of 250.000000, the whole pool carried in"],
 "The engine returns 170.400000 for both the ceiling and cost recovered in 2003, where the tables print 170 of an unrounded model. The ceiling binds in the third year, so cost recovered stops at it and the pool closes at 298.600000, printed as 299. The engine rounds nothing to the printed precision.")

q(1, "Before production starts, what do 2001 and 2002 of the FARI Table 12 run show (no royalty, an 80 percent ceiling on revenue after royalty)?",
 "No cost recovered, and a pool of 250.000000 carried through both years",
 ["A cost recovery of 250 in 2001, spent before production and recovered at once",
  "A pool of 250 written off at the end of 2002",
  "A ceiling of 250 each year, the pool setting its own limit before production starts"],
 "The engine returns a ceiling of 0.000000, cost recovered 0.000000 and a pool out of 250.000000 in 2001 and 2002, where the tables print 0, 0 and 250. The course states: \"The carry of 250 through the first two years and the ceilings that bind in the third and fourth are reproduced.\" A pool is carried; nothing is written off.")

q(2, "What does the engine's validation record conclude from the IMF schedule, in its own words?",
 "Result: NO DEFECT, the applyPSC cost pool arithmetic reproducing the IMF schedule year by year",
 ["A defect in applyPSC's limit, corrected so that the schedule's whole numbers are matched in every year",
  "Agreement on the profit split only, the cost pool being checked against the World Bank note alone",
  "A mismatch in 2005, left open for the reader to settle"],
 "The validation record reads: \"Result: NO DEFECT. The cost pool arithmetic of `applyPSC` (royalty on gross; the limit on revenue after royalty; cost recovered = min(pool + capex + opex, limit); the rest carried; profit oil = revenue after royalty - cost recovered) reproduces the IMF schedule year by year\". The course teaches no repair history, and the agreement covers both the cost lines and the profit split within their stated bounds.")

q(3, "Which edition of the IMF FARI methodology does the course read its Figure 5 and Tables 12 and 13 from, and how was it read?",
 "TNM/16/01, February 2016, read on 2026-09-26 from the Wayback capture of 12 October 2025",
 ["WP/24/89, April 2024, read from the live IMF site on 2026-09-26, the direct download being open",
  "TNM/16/01, February 2016, a licensed text taught by concept only and never quoted",
  "Briefing Note No. 8, November 2007, which the IMF republished with FARI's tables"],
 "The sources table lists IMF, Luca and Mesa Puyo, FARI Methodology, TNM/16/01, February 2016, read from the Wayback capture of 12 October 2025 because the direct download answered 403, on 2026-09-26. It is a public text and is quoted with its citation. WP/24/89 is a different IMF paper, read for concepts only.")

q(3, "World Bank Briefing Note No. 8 (November 2007) says: \"For paying income tax, there are no limits on deductible expenses in the way there are limits on cost oil.\" What does the engine's stated reading of the PSC income tax say it taxes?",
 "The contractor's profit oil share, as FARI TNM/16/01 and World Bank Note 8 assume",
 ["Every cost incurred deducted from the contractor's entitlement, as the note's sentence requires",
  "The contractor's entitlement after cost oil, the limit on cost oil being lifted for the tax",
  "The government's profit oil, since the contractor's tax is paid from the state's share"],
 "The engine's basis reads \"income tax is charged on the contractor's profit oil share, as FARI TNM/16/01 and World Bank Note 8 assume (applyPSC in engines/economics/cashflow.ts)\". It is the engine's stated reading, and the course grades no tax figure that depends on it. In both published examples the costs are recovered in full, and the engine reproduces their tax figures.")

q(0, "In the IMF schedule (psc-fari-table-12), the profit split differs from the printed tables by up to 1.560000. Why does the course accept that?",
 "It is inside 1.5 plus half a per cent of the year's profit petroleum, as Table 13 prints the government share as a whole per cent",
 ["It is inside the 1.5 that any line of three printed whole numbers carries, the same bound as the cost lines",
  "It rounds to 2, the printed precision of the tables, and so is treated as agreement",
  "It is a known IMF arithmetic error of the kind OpenOil's book prints, and is kept out of the gates"],
 "The course states the largest difference on the profit split is 1.560000, inside 1.5 plus half a per cent of the year's profit petroleum, because Table 13 prints the government share as a whole per cent, from which each year's stated contractor share is read. The bound of 1.5 alone is the cost lines' bound, and 1.560000 lies above it.")

q(1, "IMF WP/24/89 (April 2024) says \"Under a production sharing regime, revenues shared are usually net of royalties.\" World Bank Briefing Note No. 8 (November 2007) states its 60 percent limit on gross. What does the engine take as the limit base?",
 "A required input, costOilLimitBase, \"after-royalty\" or \"gross\", with no default",
 ["Revenue after royalty always, since the IMF paper describes the usual regime",
  "Gross revenue always, since a published worked example is the engine's reference",
  "Whichever base gives the larger limit, the contractor's reading of an unclear contract"],
 "The engine takes costOilLimitBase as a required input with no default; each golden input states its example's base, gross for the World Bank note and after-royalty for IMF FARI Figure 5. A call without it is refused by name, and the engine picks no base on the contractor's behalf.")

emit(Q, '/root/cat-wip-joa/banks/ec9i_m06.json', expect_n=15)
finish()
