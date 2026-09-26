import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Professional m06, The Domestic Gas Delivery Obligation.
# Every figure is quoted from digest.txt (domesticGasObligation on the golden
# inputs and on the Ekene power plant's synthetic 2028 allocation). The texts
# are the Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108,
# 27 August 2021) and the Domestic Gas Delivery Obligation Regulations 2022
# (S.I. No. 74 of 2022, Official Gazette No. 206, Vol. 109, 23 November 2022),
# both read 2026-09-26. The 90-day investigation and the compensation of
# s.110(13) are asked about as concepts only.

q(3, "Under the Petroleum Industry Act 2021 s.110(1)(a), what must the Commission do before 1 March of each year?",
 "Prescribe the domestic gas delivery obligation and allocate it among all lessees",
 ["Determine the domestic base price under the Third Schedule",
  "Fix the penalty rate",
  "Approve every export supply project that lessees have put forward for the following contract year"],
 "s.110(1)(a) reads \"prescribe and allocate the domestic gas delivery obligation among all lessees before 1st March of each year based on the domestic gas demand requirements\". The domestic base price is the Authority's under s.167(1). The penalty rate is set in s.110(8) and may be adjusted by regulation under s.110(9), which is no annual step. Export approvals follow prior compliance under s.110(15); they are no part of the allocation.")

q(0, "A golden lessee holds voluntary contracts of 1000.000000 with the strategic sectors against an obligation of 1000.000000, and delivers 200.000000. What does the engine return?",
 "Deemed fulfilled under s.110(2)(a), with no penalty",
 ["800.000000 penalised at 3.500000, a penalty of 2800.000000, since deemed fulfilment needs contracts above the obligation",
  "800.000000 undelivered and excused",
  "A refusal, since delivered gas below the obligation cannot be read together with voluntary contracts that meet it"],
 "s.110(2) deems fulfilment where \"the volume of the contracts is equal to or higher than the domestic gas delivery obligation\", so equality is enough, and the engine's reason reads \"voluntary contracts of 1000 are at or above the obligation 1000: the lessee is deemed to have fulfilled its obligation (s.110(2)(a))\". 2800.000000 is what the engine returns when the contracts fall one short, at 999.000000. Nothing is excused here, since no excuse is stated. The engine accepts both inputs together.")

q(2, "One unit short: voluntary strategic-sector contracts of 999.000000 face an allocation of 1000.000000, and only 200.000000 reaches the buyers, with nothing excused. What penalty is due?",
 "2800.000000, on 800.000000 at 3.500000",
 ["0.000000, since contracts within one unit of the obligation are close enough for the lessee to be deemed to have fulfilled it",
  "3.500000, on the single unit by which the contracts fall short of the obligation that the Commission allocated",
  "2800.000000 less the value of the 999.000000 contracted, since contracted gas counts toward the penalty"],
 "Deemed fulfilment needs contracts equal to or higher than the obligation, and 999.000000 is one short, so the engine measures what was delivered: 1000.000000 less 200.000000 leaves 800.000000 undelivered, penalised at 3.500000 for 2800.000000. The Act gives no margin below the obligation. The penalty falls on gas not delivered, and the gap in the contracts is no measure of it. Contracts that do not reach the obligation reduce nothing.")

q(1, "The Ekene power plant's synthetic 2028 allocation sets an obligation of 6825000.000000 MMBtu, and 5460000.000000 is delivered. What undelivered quantity does the engine return before any excuse?",
 "1365000.000000, the obligation less the gas delivered",
 ["688800.000000",
  "676200.000000",
  "6825000.000000"],
 "Undelivered is the obligation less the gas delivered when that is positive, 6825000.000000 less 5460000.000000, and the engine's reason reads \"delivered 5460000 against the obligation 6825000 leaves 1365000 undelivered\". 688800.000000 is the part excused because the purchaser could not accept. 676200.000000 is what is left to penalise after that excuse. The whole obligation is not undelivered, since most of it was delivered.")

q(2, "In the power plant's 2028 allocation, 688800.000000 of the 1365000.000000 undelivered is excused because the purchaser could not accept the allocated volumes. What penalty does the engine return?",
 "2366700.000000, on 676200.000000 at 3.500000",
 ["0.000000, since a purchaser's outage excuses the lessee for the whole of the year and every quantity left undelivered",
  "The whole 1365000.000000 at 3.500000, since an excuse under s.110(10) reduces the export restriction and leaves the penalty",
  "676200.000000 at the take-or-pay price of the power plant agreement, since the obligation is settled in contract money"],
 "The excuse under s.110(10)(b) covers only the quantity stated, 688800.000000, so 676200.000000 remains and is penalised at 3.500000 US$ per MMBtu, which is 2366700.000000, as the engine's reason prints. The excuse does not reach past its own quantity. It reduces the penalised quantity itself. The rate is the Act's US$3.50 of s.110(8) and the Regulations' r.6(1), and a take-or-pay price plays no part.")

q(3, "A golden lessee leaves 500.000000 undelivered and states four excuses: purchaser non-payment 100.000000, force majeure 150.000000, purchaser cannot accept 50.000000 and transport unavailable 25.000000. What does the engine penalise?",
 "175.000000, a penalty of 612.500000",
 ["500.000000, since excuses stated out of the Act's order are refused one by one and none is applied",
  "400.000000, since only the first excuse listed in the call applies",
  "0.000000, since four excuses together clear any quantity"],
 "The engine applies the excuses in the order of s.110(10), (a) force majeure 150.000000, (b) 50.000000, (c) 25.000000 and (d) 100.000000, whatever order the call lists them in, 325.000000 in all, and penalises the 175.000000 left at 3.500000 for 612.500000. The order in the call changes nothing. Every stated excuse applies up to the undelivered quantity left. Four excuses that sum to less than the undelivered quantity leave a remainder.")

q(0, "A golden lessee leaves 400.000000 undelivered and states force majeure of 250.000000 and transport unavailable of 300.000000. How much of the transport excuse does the engine apply?",
 "150.000000, up to the undelivered quantity left",
 ["300.000000, the stated quantity, so that 550.000000 is excused in all",
  "0.000000, since force majeure alone covers the year",
  "200.000000, half of the undelivered quantity, split evenly between the two excuses because both of them are stated for the year"],
 "The engine applies force majeure first, s.110(10)(a), 250.000000, and then the transport excuse, s.110(10)(c), only up to the 150.000000 still undelivered; its reason reads \"150 is excused: the allocated gas could not be transported for reasons beyond the lessee's control (s.110(10)(c))\", and then \"the whole undelivered quantity is excused; no penalty\". No excuse is applied beyond the undelivered quantity. Force majeure covers only its stated 250.000000. The Act gives no rule for splitting.")

q(1, "A lessee has signed a gas purchase and sale agreement with a wholesale supplier of the strategic sectors that states a penalty of 5 per MMBtu, and leaves 400.000000 undelivered. What penalty does the engine return?",
 "2000.000000, at the agreement's rate of 5",
 ["1400.000000 at US$3.50, since the Act's rate replaces any rate a signed agreement states for the same failure",
  "Both rates added together and charged on the undelivered 400.000000, the Act's and the agreement's",
  "1700.000000 at 4.25"],
 "s.110(8) makes the penalty under such an agreement \"as stated in that agreement\", and r.6(2) of the Regulations sets it at \"not less than\" US$3.50, so a stated 5 applies: 400 x 5 is 2000.000000, and the engine's basis reads \"the agreement's rate 5 per MMBtu (s.110(8) proviso), at or above the US$3.50 minimum of r.6(2)\". The Act's own rate is the floor for an agreement. The two rates are not added. 4.25 is an illustrative adjusted rate from a different case.")

q(3, "Suppose the wholesale agreement names only 2 US$ per MMBtu as its penalty for failing to deliver, with 400.000000 short. Which figure does the engine charge?",
 "1400.000000, the rate lifted to the US$3.50 minimum of r.6(2)",
 ["800.000000, at the agreement's rate of 2",
  "A refusal: the rate is below 3.5",
  "2000.000000"],
 "The Regulations' r.6(2) says the penalty under a signed agreement \"shall not be less than\" the r.6(1) amount, so the engine's basis reads \"the agreement's rate 2 per MMBtu is below the US$3.50 minimum of r.6(2), so 3.5 applies\", and 400 x 3.5 is 1400.000000. Applying 2 would put the agreement below the stated minimum. The engine applies the minimum; it does not refuse. 2000.000000 is the penalty at an agreement rate of 5.")

q(2, "A call states both an agreementPenaltyRate and a penaltyRate. What does the engine return?",
 "A refusal: penaltyRate must be left out when an agreement rate is stated",
 ["The higher of the two rates",
  "The agreement's rate, with the other ignored",
  "Two penalties, one at each rate, so that the lessee sees what the undelivered gas costs under each basis"],
 "The engine's message reads \"penaltyRate must be left out when agreementPenaltyRate is stated (state one rate basis); got {\"value\":4,\"source\":\"x\"}\". The rate basis is one stated choice, so the engine does not pick between two, does not drop one silently and does not return two penalties.")

q(0, "A call states a penalty rate of 4.25 per MMBtu with its source, an illustrative Commission regulation (synthetic), and 400.000000 is undelivered. What does the engine return, and under which provision?",
 "1700.000000, at the adjusted rate the Commission may prescribe under s.110(9)",
 ["1400.000000, since the engine applies US$3.50 whatever rate a call states",
  "A refusal: the rate must be 3.5",
  "2000.000000, since an adjusted rate is rounded up to the nearest whole US$ per MMBtu before it is applied to the gas"],
 "s.110(9) reads \"The penalty amount of US $3.50 per MMBtu referred to under subsection (8) may be adjusted as the Commission may prescribe in a regulation made under this Act\", and the engine applies a stated rate with its source: 400 x 4.25 is 1700.000000. It does not hold to US$3.50 when a stated adjusted rate is given, and it neither refuses nor rounds the rate.")

q(1, "When the engine penalises a quantity above zero, what does it report about export supply, and what does it do with that finding?",
 "It reports the s.110(14)(a) and s.110(15) restriction and gives it no price",
 ["It adds a second penalty for the export restriction at US$3.50 per MMBtu on the quantity penalised",
  "It reduces the next year's obligation by the penalised quantity, so the export restriction lapses the year after",
  "Nothing about export"],
 "The engine's reason ends \"the lessee may not supply new midstream gas export operations (s.110(14)(a)) and export supply approvals require prior compliance (s.110(15))\", and it reports the restriction as a flag with no money attached. No second penalty is charged. The obligation is a stated input each year, and the engine does not carry a quantity into the next one. The flag is always reported when a quantity is penalised.")

q(3, "Regulation 6(3)(b) of the Domestic Gas Delivery Obligation Regulations 2022 deems the obligation met if the Commission fails to investigate a claimed excuse within 90 days. How does the engine treat this rule?",
 "It does not compute it; excuses apply as stated, and the rule is taught as a concept",
 ["It counts 90 days from the end of the contract year and deems the obligation met if no investigation date is given",
  "It treats every stated excuse as uninvestigated",
  "It refuses any excuse that is stated without an investigation date, since the date decides whether the obligation is deemed met"],
 "The engine's basis states that \"the 90-day investigation rule of r.6(3) and the compensation to customer-clients of s.110(13) are not computed\": excuses apply as stated, and the rule is a concept in this course. The engine takes no investigation date, so it can neither count days nor refuse for a missing one, and it deems nothing met on the rule's account.")

q(0, "Under the Petroleum Industry Act 2021 s.110(16), how are domestic gas delivery contracts signed before the Act's effective date treated?",
 "They count toward the lessee's obligation",
 ["They are void under the Act",
  "They are excused from it",
  "They count toward the obligation only for their first contract year after the Act took effect, and lapse from then on"],
 "s.110(16) reads \"Domestic gas delivery contracts entered into by lessees or licensees prior to the effective date and continuing after the effective date, shall be counted towards their domestic gas delivery obligation\". The Act does not void them, does not exclude their gas, and sets no one-year limit.")

q(2, "A call lists an excuse under the key pipelineOutage. What does the engine return, in its own words?",
 "excused.pipelineOutage is not an accepted key; the accepted keys of excused are forceMajeure, purchaserCannotAccept, transportUnavailable, purchaserNonPayment",
 ["The quantity excused as force majeure",
  "The quantity excused under s.110(10)(c), since a pipeline outage is gas that cannot be transported",
  "No excuse applied and the whole quantity penalised, since the engine drops an excuse it cannot read"],
 "The engine refuses the unknown key and lists the four excuses it reads, one for each of s.110(10)(a) to (d). A pipeline outage may well be a transport excuse in fact, but the call must state it under transportUnavailable; the engine never maps a key on a guess. It does not drop the excuse silently either, since the penalty would move.")

emit(Q, '/root/cat-wip-gsa/banks/ec8i_m06.json', expect_n=15)
finish()
