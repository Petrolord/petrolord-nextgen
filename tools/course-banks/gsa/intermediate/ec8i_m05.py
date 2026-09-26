import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Professional m05, Domestic Gas Prices.
# Every figure is quoted from digest.txt (domesticPrice on the golden inputs).
# The domestic base price is a stated input: every figure reported for 2026 or
# 2025 is named as reported, and no key is a reported domestic base price.
# The Petroleum Industry Act 2021 is the gazetted text (Official Gazette No.
# 142, Vol. 108, 27 August 2021), read 2026-09-26.

q(0, "A learner asks the engine for a power sector price under the Petroleum Industry Act 2021 and leaves the domestic base price out. What does the engine return?",
 "It refuses the call: no base price is held in the engine",
 ["The figure reported for 2026, which the engine holds as its default until the Authority publishes the next one",
  "The US$0.90 per MMBtu floor",
  "A price of 0.000000 for the power sector"],
 "The engine's message reads \"domesticBasePrice must be stated in US$ per MMBtu: the Authority determines it each year (PIA s.167(1)) and the engine holds no default; got nothing\". The figures for 2026 and 2025 are reported by the press and a law firm, and the regulator's circular was not read, so the engine holds none of them as a default. The US$0.90 floor belongs to the gas based industries under s.168(2). The engine never prices at zero in place of a missing term.")

q(2, "Which rule does the engine state for the power sector price, reading the Petroleum Industry Act 2021 s.167(5)?",
 "power sector price = domestic base price, priced at the marketable natural gas delivery point",
 ["The base price plus US$0.50 per MMBtu",
  "A negotiated price capped at the base",
  "The Fourth Schedule formula, floored"],
 "s.167(5) reads \"The price of marketable natural gas applicable to the power sector shall be the domestic base price at the marketable natural gas delivery point.\", and the engine's rule is its own words, \"power sector price = domestic base price\", with the basis \"prices at the marketable natural gas delivery point\". The US$0.50 adder is the commercial sector's, under s.167(6). A negotiated price with a ceiling is the gas distributors' rule under s.167(7). The Fourth Schedule formula and its floor price the gas based industries.")

q(1, "A call states the domestic base price reported for 2026, 2.180000 US$ per MMBtu, and asks for the commercial sector price. What does the engine return?",
 "2.680000, the stated base price plus the s.167(6) adder",
 ["2.180000, the stated base price with nothing added, since the adder applies to gas distributors",
  "2.630000, the commercial price that the base price reported for 2025 gives, a stated figure of the year before",
  "2.980000"],
 "s.167(6) sets the commercial sector price at the domestic base price plus US$0.50 per MMBtu, so on the stated 2.180000 the engine returns 2.680000; the course quotes both as the figures reported for 2026 and keys only the engine's arithmetic on the stated input. Returning the base price unchanged is the power sector rule. 2.630000 is what the base price reported for 2025 gives. 2.980000 is the delivered power price of a case that states a transport tariff.")

q(3, "A gas distributor states a negotiated price of 2.9 on a call whose stated domestic base price is the figure reported for 2026. What does the engine return?",
 "The stated 2.900000 returned as it stands, with a reason flagging it above the ceiling s.167(7) sets for it",
 ["A price held at 2.680000, the commercial price on the stated base, since the engine clamps a distributor's price",
  "Refused by name at negotiatedPrice, since a negotiated price above the commercial sector price is not a valid input",
  "A price of 2.900000 with no reason, because a gas distributor negotiates its price freely under the Act"],
 "The engine returns the negotiated price and states the breach in its own words: \"negotiated price 2.9 exceeds the commercial sector price 2.68, which s.167(7) sets as the ceiling for gas distributors\". The 2.68 in that reason is the commercial price on the stated base price reported for 2026. It does not clamp the figure and it does not refuse the call; the reason carries the finding. The figure is no lawful distributor price while s.167(7) applies: it says a distributor's price \"shall not exceed\" the commercial sector price, so the negotiation is not free of limit, and the engine returns 2.900000 with the breach stated beside it.")

q(3, "A gas distributor's negotiated price is exactly equal to the commercial sector price that the stated 2026 reported base price gives. How does the engine read it?",
 "Within the ceiling",
 ["Above the ceiling, since the Act's words \"shall not exceed\" make the ceiling itself unavailable to the distributor",
  "Refused, since a negotiated price must sit strictly below the commercial sector price in every stated call",
  "Held at the power sector price"],
 "The ceiling is inclusive, and on the stated base price reported for 2026 the engine's reason reads \"negotiated price 2.68 is at or below the commercial sector price 2.68\". \"Shall not exceed\" allows equality, so the ceiling itself is available. The engine refuses nothing here. The power sector price plays no part in a distributor's price.")

q(0, "A gas based industries call for urea states a CMPP of 450 US$ per tonne. The Fourth Schedule table holds NRP 1 and PRP 250. What price does the engine return?",
 "1.800000, since EPF is 0.800000",
 ["0.900000, the floor, since the formula result is held at the floor price for every gas based industry",
  "1.000000",
  "2.400000, adding PRP"],
 "The Fourth Schedule gives EPF = (CMPP - PRP) / PRP = (450 - 250) / 250 = 0.800000 and CP = NRP x (1 + EPF) = 1.800000, which lies inside the floor of 0.900000 and the stated base price, so it stands. The floor binds only when the formula falls below it. 1.000000 is the price when CMPP equals PRP. EPF subtracts PRP; adding it misreads the Schedule.")

q(2, "The same urea call is run with a CMPP of 200 US$ per tonne. What does the engine return, and why?",
 "0.900000, the formula's 0.8 being held at the s.168(2) floor",
 ["0.800000, since the Fourth Schedule formula is applied as printed and the Act sets no lower bound for these industries",
  "A refusal, since a CMPP below the product reference price makes EPF negative and the formula undefined",
  "1.000000, the National Reference Price, which the engine applies whenever EPF falls below zero for a product"],
 "EPF is (200 - 250) / 250 = -0.200000, the formula gives 0.800000, and the engine's reason reads \"the formula gives 0.8, below the floor US$0.90 per MMBtu, so the price is held at 0.9 (s.168(2))\". s.168(2) sets that floor, so the formula figure does not stand. A negative EPF is a result, and the engine refuses nothing. The NRP is one term of the formula and is no fallback price.")

q(0, "Urea at a month-end product price of 600 US$ per tonne pushes the Fourth Schedule formula to 2.4, above the base price the call states (the figure reported for 2026). Where does the engine set the price?",
 "It holds the price at the domestic base price stated for the call, the ceiling of s.168(3)",
 ["It returns 2.400000, the formula figure",
  "It holds the price at the floor",
  "It refuses the call as out of range"],
 "s.168(3) makes the domestic base price of the year the ceiling for the gas based industries, and the engine's reason reads \"the formula gives 2.4, above the domestic base price 2.18, so the price is held at 2.18 (s.168(3))\"; the ceiling figure here is the stated input reported for 2026, which the course grades nowhere. The formula figure does not stand above the ceiling. The floor acts only below 0.900000. A formula above the ceiling is a held result, and the engine refuses nothing here.")

q(3, "For low sulphur diesel made by gas-to-liquids, the Fourth Schedule reads NRP 1 and PRP 325. With the month-end product price at 520 US$ per tonne, which gas price comes out?",
 "1.600000",
 ["The urea reference price of 250 applied to diesel, which the engine reads for every product in the table",
  "1.800000, the urea price at a CMPP of 450",
  "0.900000, the s.168(2) floor"],
 "EPF is (520 - 325) / 325 = 0.600000 and CP is 1 x 1.600000, which lies inside the floor and the stated base price reported for 2026; the engine's reason reads \"the formula gives 1.6, inside the floor 0.9 and the domestic base price 2.18\". Each product has its own PRP in the table, 325 for GTL diesel. 1.800000 is the urea result on other inputs. The floor does not bind at 1.600000.")

q(2, "Suppose a caller sets the domestic base price at 0.8 US$ per MMBtu and asks for a gas based industries price. How does the engine respond?",
 "A refusal: the base price must be at or above the US$0.90 floor",
 ["A price of 0.800000, the base price acting as the ceiling below the floor",
  "A price of 0.900000",
  "A refusal because 0.8 differs from the base price reported for 2026, the only figure the engine will accept"],
 "The engine's message reads \"domesticBasePrice must be at or above the gas based industries floor US$0.90 per MMBtu (s.168(2)) for a gas based industry price, which is capped at the domestic base price (s.168(3)); got 0.8\": a ceiling below the floor leaves no price both rules allow. The engine does not choose one rule over the other. The base price is a stated input, and any figure at or above the floor is accepted.")

q(1, "Someone pricing the power sector also fills in negotiatedPrice with 2. Quote the engine's response.",
 "negotiatedPrice must be given only for sector 'gas-distributor'; got 2",
 ["A power price of 2.000000, since a negotiated figure replaces the domestic base price for any sector",
  "negotiatedPrice must be stated for a gas distributor",
  "A power price with the negotiated figure ignored"],
 "The engine refuses the input by name: \"negotiatedPrice must be given only for sector 'gas-distributor'; got 2\". The power sector price is the domestic base price under s.167(5), so no negotiated figure replaces it. The message about a figure that must be stated is the refusal of a distributor call with no negotiated price. The engine never ignores an input it was given.")

q(3, "A power sector call states the base price reported for 2026 and a transport tariff, and the engine returns a price of 2.180000 and a delivered price of 2.980000. What does the engine's basis say about the two figures?",
 "The price is at the delivery point; the stated tariff is added for the delivered price",
 ["The tariff is folded into the power price, since s.167(5) prices the power sector at the power plant's own gate",
  "The delivered price replaces the price, since a transport tariff turns every sector price into a delivered one",
  "The tariff is deducted from the seller's side, since the Act puts the transport cost on the producing lessee"],
 "The engine's basis reads \"prices at the marketable natural gas delivery point; the stated transport tariff is added for the delivered price (s.167(8), s.168(4))\". s.167(8) puts the transport cost from the delivery point to the buyers' facilities on the buyers, so it is added on top and the delivery point price stands. Both figures rest on the stated base price reported for 2026. Folding the tariff in or deducting it from the seller misreads s.167(8).")

q(1, "A caller states NRP 1.2 and PRP 300 as an illustrative regulation (synthetic) for ammonia, with a CMPP of 450. The engine's reason prints the formula's result as the double it holds, a run of nines just under the round figure. Which figure does the course quote for the price?",
 "1.800000, the numeric field at six decimals",
 ["The run of nines in the reason, since the reason carries the double the engine holds and is the more exact figure",
  "1.500000, EPF with no NRP applied",
  "The Schedule's own NRP 1 and PRP 250"],
 "The course quotes the numeric field at six decimals, 1.800000, and quotes a reason only verbatim as the engine's words, where a figure is the shortest round-trip decimal of the double. EPF is (450 - 300) / 300 = 0.500000, and CP is 1.2 x 1.500000, so a figure without the NRP drops a term. The Fourth Schedule lets the Authority change NRP and PRP by regulation, and the engine uses the stated values with their source.")

q(0, "Where does the course's reported figure of 2.180000 US$ per MMBtu for the 2026 domestic base price come from, and how may it be used?",
 "It is reported by BusinessDay (31 March 2026) and by Advocaat Law Practice through Legal 500 (7 April 2026), the regulator's circular having not been read, and is used only as a stated input",
 ["It is read from the regulator's circular effective 1 April 2026, which the engine holds as its default",
  "It is printed in the Act's Third Schedule",
  "It is a graded figure that the capstone asks for"],
 "The engine's own basis says the figures \"are reported by BusinessDay (31 March 2026) and by Advocaat Law Practice through Legal 500 (7 April 2026); the regulator's circular was not read\", and it holds no default. The Third Schedule prints principles for the price and no figure. The course grades no domestic base price, and no capstone uses one.")

q(2, "The Third Schedule of the Petroleum Industry Act 2021 sets principles for the domestic base price. What does its paragraph 1(a) require of the price?",
 "A level that brings forward enough gas for the domestic market voluntarily",
 ["A level no higher than the Fourth Schedule's National Reference Price",
  "A fixed US$ figure printed in the Schedule, re-read by the Authority each year and adjusted for inflation",
  "The lowest supply price on the national supply curve, which the Commission identifies for the strategic sectors"],
 "Paragraph 1(a) reads \"the price must be of a level to bring forward sufficient natural gas supplies for the domestic market on a voluntary basis by the upstream petroleum industry\". The National Reference Price is a Fourth Schedule term for the gas based industries formula. The Schedule prints principles and no figure. The supply curve is a tool of the Domestic Gas Delivery Obligation Regulations 2022 (r.5(2)) for the supply price, a different instrument.")

emit(Q, '/root/cat-wip-gsa/banks/ec8i_m05.json', expect_n=15)
finish()
