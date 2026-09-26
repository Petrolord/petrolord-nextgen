import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Professional m05, PSC Cost Recovery.
# Every figure is quoted from digest.txt, where the canonical applyPSC of
# engines/economics/cashflow.ts returned it through the engine on the Ekene PSC
# variant (synthetic) or a stated golden input. Every PSC figure is quoted with
# its limit and base. The tax is keyed only as the engine's stated reading. No
# capstone name, term, series or value appears.

P = "The Ekene PSC variant (synthetic) states royalty 12.500000 percent, a cost oil limit of 60.000000 percent of gross, a contractor profit share of 60.000000 percent, tax 30.000000 percent and an opening pool of 142000000.000000"

q(2, f"{P}. In 2030 gross revenue is 219000000.000000 and the pool entering the year with its capex and opex is 532000000. What cost does the engine recover, and what pool is carried to 2031?",
 "131400000.000000 recovered, the limit binding, and 400600000.000000 carried to 2031",
 ["114975000.000000 recovered on 60 percent of the revenue after royalty, and 417025000.000000 carried",
  "191625000.000000, all revenue after royalty",
  "131400000.000000 recovered, and 422000000.000000 carried, the year's own capex and opex held back until the older pool clears"],
 "The limit is 60 percent of gross, 131400000.000000, and the engine's reason reads \"2030: recoverable 532000000 is above the cost oil limit 131400000; 400600000 carried to 2031\". 114975000.000000 and 417025000.000000 are the same year with the limit stated on revenue after royalty, a different stated base. The limit caps the cost recovered, so the whole revenue after royalty is never taken as cost oil here.")

q(0, "The same percentage, 60.000000, is stated on two bases for the Ekene PSC variant (royalty 12.500000 percent). What cost oil limit does the engine return in 2030 on each?",
 "131400000.000000 on gross and 114975000.000000 on revenue after royalty",
 ["131400000.000000 on both, since a limit is always read on gross revenue as the World Bank note states it",
  "114975000.000000 on both, since applyPSC takes the limit on revenue after royalty whatever the contract says",
  "114975000.000000 on gross and 131400000.000000 on revenue after royalty"],
 "The course prints: \"In 2030 the limit is 131400000.000000 on gross and 114975000.000000 on after-royalty with the same percentage (engine). The base is a required input: a contract states which it means.\" The engine passes a gross limit to applyPSC as a fraction of revenue after royalty, so the base the contract states is kept.")

q(3, "A contract writes its cost oil limit as 60 percent of gross, with royalty at 12.5 percent. The canonical applyPSC takes a limit on revenue after royalty. How does the engine hand it the stated limit?",
 "As the fraction 60 / (100 - 12.5) of revenue after royalty",
 ["As 60 percent of revenue after royalty, the stated figure applied unchanged to applyPSC's own base",
  "As 60 percent of gross, after rewriting applyPSC's limit calculation for a gross base",
  "As the stated 60 less the royalty rate of 12.5, taken as a percentage of revenue after royalty"],
 "The engine's basis reads \"the limit is stated on gross revenue and passed to applyPSC as the fraction 60 / (100 - 12.5) of revenue after royalty\". Passing 60 unchanged would put the limit on the wrong base, and the engine re-computes nothing of applyPSC: \"nothing here re-computes the cost pool\".")

q(1, "A learner states a cost oil limit of 90 percent of gross with royalty 12.500000 percent. What does the engine return?",
 "A refusal: costOilLimitPct must be at or below the revenue left after royalty, 87.5% of gross, when costOilLimitBase is \"gross\"",
 ["A PSC run in which the limit is cut back to 87.5 percent of gross, with the cut reported among the reasons",
  "A PSC run with the limit at 90 percent of gross, the royalty taken from the contractor's cost oil",
  "A refusal citing the Act's ceiling of 60 percent on the cost oil limit of every production sharing contract"],
 "The engine refuses the stated limit in its own words, with the got value 90. A limit on gross above what royalty leaves cannot be passed to applyPSC as a fraction of revenue after royalty. The engine does not cut the limit back. The Act's 60 percent of s.311(2)(a)(iii) applies to a renegotiated PSC and is reported in a basis only; the limit is the contract's stated figure.")

q(2, "Tax is stated at 30.000000 percent, and in 2030 the Ekene variant leaves the contractor profit oil of 36135000.000000. As the engine states the PSC income tax, what tax does it return for the year?",
 "10840500.000000, 30 percent of the contractor's profit oil",
 ["30 percent of the whole profit oil of 60225000.000000, taken before the split",
  "0.000000, since cost recovery carries the contractor's tax inside the government's profit oil",
  "30 percent of the contractor entitlement of 156694500.000000, cost oil included"],
 "The engine's stated reading reads \"income tax is charged on the contractor's profit oil share, as FARI TNM/16/01 and World Bank Note 8 assume (applyPSC in engines/economics/cashflow.ts)\", and its 2030 row prints tax 10840500.000000 on contractor profit oil of 36135000.000000. It is the engine's stated reading, and the course grades no tax figure that depends on it.")

q(0, "On psc-ekene (royalty 12.5, limit 60 of gross, contractor share 60, tax 30, 142000000.000000 carried in), which year clears the last of the pool, and how does that year's cost recovered compare with its limit?",
 "2036: 67313600.000000 recovered against a limit of 69831600.000000, and 0.000000 carried",
 ["2035: 77590200.000000 recovered at the limit, which clears the pool of 41313600.000000 carried in",
  "2036: 69831600.000000 recovered at the limit, with the excess over the pool paid to the government",
  "2038: the pool is never cleared, and the rest is carried beyond the last year"],
 "In 2036 the recoverable amount is below the limit, so the engine recovers the pool with the year's opex and carries 0.000000: its row prints cost recovered 67313600.000000 against a limit of 69831600.000000. In 2035 the limit binds and 41313600.000000 is carried to 2036. The totals show 0.000000 unrecovered at the end on the gross base.")

q(3, "By 2037 the Ekene variant's pool is empty. Revenue after royalty is 91653625.000000, opex 27000000.000000 and the limit 62848200.000000. What profit oil comes back?",
 "64653625.000000, the revenue after royalty less the 27000000.000000 recovered",
 ["The revenue after royalty less the whole limit of 62848200.000000, as a limit is always taken in full",
  "91653625.000000, the whole revenue after royalty",
  "38792175.000000, the whole profit oil after the split"],
 "The engine's rule reads \"cost recovered = min(pool + capex + opex, limit); profit oil = revenue after royalty - cost recovered\". With no pool, cost recovered is the opex of 27000000.000000, below the limit, and the 2037 row prints profit oil of 64653625.000000. 38792175.000000 is the contractor's profit oil, its 60 percent share.")

q(1, "The golden input psc-ekene-after-royalty states the Ekene PSC variant (royalty 12.500000 percent, share 60.000000, tax 30.000000, opening pool 142000000.000000) with the limit at 60.000000 percent of revenue after royalty. What pool does the engine carry out of 2038?",
 "33686775.000000, the pool not being cleared within the years stated",
 ["0.000000, as on the gross base",
  "83179575, the recoverable amount of 2038",
  "33686775.000000 written off at the end of 2038, since applyPSC writes off what the years leave"],
 "The engine's reason reads \"2038: recoverable 83179575 is above the cost oil limit 49492800; 33686775 carried to 2039\". The smaller limit on revenue after royalty leaves the pool open at the end of the years stated. The engine carries it; it writes nothing off.")

q(2, "Summing 2029 to 2038 of the Ekene PSC variant, whose limit is 60.000000 percent of gross after a 12.500000 percent royalty, with 142000000.000000 carried in, what cost recovered and unrecovered balance does the engine report?",
 "Cost recovered 738000000.000000, with 0.000000 unrecovered at the end",
 ["Cost recovered 422000000.000000, the pool at the end of 2029, as later years' costs are not recoverable",
  "Cost recovered 738000000.000000, with 142000000.000000 left unrecovered from the pool the contract opened with",
  "Cost recovered 921059257.500000"],
 "The totals print cost recovered 738000000.000000, contractor entitlement 921059257.500000 and 0.000000 unrecovered at the end. The opening pool is recovered with the later capex and opex, and the entitlement is a different line from cost recovered.")

q(3, "A learner leaves openingCostPool out of the Ekene PSC call, meaning that no cost is carried in. What does the engine return?",
 "A refusal: openingCostPool must be a finite number at or above 0; got nothing",
 ["A run with an opening pool of 0.000000",
  "A run with the fixture's pool of 142000000.000000",
  "A refusal naming costOilLimitBase, which must be stated before the pool can be read"],
 "The opening pool is a required term with no default, and the engine refuses it by name. A contract with no pool carried in states 0. The engine holds no Ekene figure; the fixture's 142000000.000000 is a stated input.")

q(0, "A learner states costOilLimitBase as \"net\". What does the engine return?",
 "A refusal: costOilLimitBase must be one of \"after-royalty\", \"gross\"; got \"net\"",
 ["A run on revenue after royalty, per IMF WP/24/89",
  "A run on gross, the World Bank note's base",
  "A run on revenue net of royalty and cost"],
 "The engine accepts only the two bases it names and refuses any other word. A text saying production shared is \"usually net of royalties\" does not make the engine read \"net\" as a base: the base is stated by the contract, and a word the engine does not accept is refused with its value.")

q(1, "Suppose royaltyPct is typed as 100 in the recovery calculator's PSC view. What comes back?",
 "A refusal: royaltyPct must be a number from 0 up to, but excluding, 100; got 100",
 ["A PSC run in which the whole gross goes to royalty and the contractor recovers nothing in any year",
  "A PSC run in which the royalty is capped at 87.5, the most the Ekene limit leaves room for",
  "A refusal naming the cost oil limit, which cannot be passed on revenue after royalty of zero"],
 "The engine's message reads \"royaltyPct must be a number from 0 up to, but excluding, 100; got 100\". A royalty of 100 would leave no revenue after royalty for applyPSC to take the limit on, so the royalty itself is refused at its bound.")

q(2, "Partners EKO 40, PA 25, PB 15 and NOC 20 percent hold the Ekene PSC variant with no carry stated. How is its 2029 capex of 280000000.000000 split between them?",
 "By participating interest through calculatePartnerCosts: EKO -112000000.000000, PA -70000000.000000, PB -42000000.000000, NOC -56000000.000000",
 ["By paying interest under the Ekene carry, EKO 50.000000, PA 31.250000 and PB 18.750000 of the capex, NOC 0.000000",
  "Wholly to EKO as operator, which recovers it through cost oil before any partner split",
  "By beneficial interest to the three carriers only, NOC's share paid by them"],
 "The engine's basis reads \"the contractor entitlement and the costs are split by participating interest with calculatePartnerCosts from engines/economics/afe.js\", and its 2029 row prints EKO -112000000.000000, PA -70000000.000000, PB -42000000.000000 and NOC -56000000.000000. The PSC variant states no carry, so every partner pays by its participating interest.")

q(3, "A learner gives the first year of a PSC call its own contractorProfitSharePct of 120. What does the engine return?",
 "A refusal: years[0].contractorProfitSharePct must be a number from 0 to 100; got 120",
 ["A year run at a share of 100, the most a contractor can hold, with the excess 20 reported among the reasons",
  "A year run at the call's contractorProfitSharePct, the year's own figure set aside",
  "A sliding scale computed by the engine from the year's share and its daily rate"],
 "The engine refuses the year's share by name. A year's own share is how a sliding scale enters the engine: \"a year's own figure carries a sliding scale, e.g. by daily rate or R-factor, computed outside\". The engine computes no scale and caps no share.")

q(0, "Discounting at 0.100000 to 2029, what NPV does the canonical npv give EKO and NOC on psc-ekene (royalty 12.5, limit 60 of gross, share 60, tax 30, opening pool 142000000.000000)?",
 "EKO 53034092.139510 and NOC 26517046.069755",
 ["EKO 95024921.509253 and NOC 49870804.456959, the NPVs of the Ekene carry",
  "EKO 53034092.139510 and NOC 0.000000, NOC being carried and holding no stream under a PSC",
  "EKO 33146307.587194 and NOC 19887784.552316, the partners taken in the order of the carry"],
 "The engine returns EKO 53034092.139510, PA 33146307.587194, PB 19887784.552316 and NOC 26517046.069755 on the PSC variant, each an NPV at 0.100000 to 2029. The carry NPVs are of a different call with its own base year, 2027, and NOC is not carried in the PSC variant.")

emit(Q, '/root/cat-wip-joa/banks/ec9i_m05.json', expect_n=15)
finish()
