import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC1 cashflow, advanced tier, The PIA Royalties. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC7 PIA re-cut applied;
# written by tools/course-waves/cashflow/pia-recut/build.py. Edit here, then re-run it.

q(1,
 "AKATA under the PIA is shallow water and its 2029 production royalty is 22944240.00 on 186032000.00 of gross revenue. A reader applying 0.125000 to the gross does not land on that figure. What did the reader miss?",
 "The gas. The 0.125000 is charged on the oil and a separate gas royalty of 0.070000 on the gas, and the row is the sum of the two.",
 ["The price royalty of 3605512.362941, which the engine folds into the production royalty column before reporting the row.",
  "The HCDT, which is deducted from gross revenue before the royalty rate is applied so that the royalty base is smaller than the gross.",
  "The water depth of 60 m, which places AKATA in a reduced shallow water band below the 0.125000 that a 100 m field pays."],
 "Onshore the same row reads 27454240.00 with the oil at 0.150000 and the gas still at 0.070000; the gas rate has its own table and its own terrain reading.")

q(3,
 "pia_deep_offshore_full lifts 21900000 bbl in 2025, 60000 bopd, and pays 131400000.00 of production royalty on 1752000000.00 of gross revenue. A reader prices the first 50000 bopd at 0.050000 and only the barrels above at 0.075000 and gets a smaller figure. What is wrong with the reader's method?",
 "Deep offshore steps once at 50000 bopd and the rate that applies to the year applies to the whole year; the blend exists in the marginal field terrain alone.",
 ["The reader has the threshold wrong: deep offshore steps at 50001 bopd, and at 60000 bopd the whole of the first 50001 bopd is charged at 0.050000 and only the rest at 0.075000.",
  "The reader has the tiers reversed: the first 50000 bopd of a deep offshore field pay 0.075000 and the barrels above the threshold pay the lower 0.050000 tier.",
  "The reader should have blended the two rates across the twelve months of 2025 and then applied the average to the year, since the engine prices the year on its monthly rates."],
 "pia_deep_offshore_naive_30k halves the volume to 10950000 bbl, under the threshold, and pays 43800000.00 on 876000000.00, 0.050000 of every barrel; there is no barrel priced at the other rate in either case.")

q(0,
 "The worked example and pia_deep_offshore_full both carry pia_water_depth_m 100, and one pays a production royalty rate of 0.125000 while the other pays 0.075000. What does deriveOilRoyaltyRate read?",
 "The terrain string and the daily rate. It does not read the water depth, the licence type, the lease status or the price.",
 ["The water depth, and 100 m sits on the boundary between the shallow water and deep offshore bands so the engine falls back to the terrain string to break the tie.",
  "The licence type, since a PML pays the shallow water rate and the deep offshore case is on a different licence.",
  "The oil price, which moves the field between the 0.125000 and 0.075000 tiers because the price royalty and the production royalty share one curve."],
 "The rate is chosen by a string somebody typed; the depth is carried in the config and never consulted, and the licence type moves the hydrocarbon tax rate, not this one.")

q(2,
 "AKATA's total royalties read 143184623.40 onshore, 122393644.64 as shallow water and 59501441.00 as deep offshore, with NPV 37060198.23, 43223505.88 and 141623594.88. Which of the NPV moves is due to the royalty alone?",
 "Onshore to shallow water. The deep offshore move under the conservative reading also zeroes the hydrocarbon tax; the aggressive reading keeps the same 59501441.00 of royalties and gives NPV 61725382.46.",
 ["Both moves. The terrain string changes only the royalty table, and every other line in the cascade follows from the royalty through the tax bases.",
  "Shallow water to deep offshore. The onshore move also raises the NDDC levy to the onshore rate, so it is not a pure royalty change.",
  "Neither. Each terrain also changes the gas royalty, 0.070000 onshore and shallow water against 0.050000 deep offshore, so no move is oil royalty alone."],
 "The same 59501441.00 of royalties gives NPV 141623594.88 or 61725382.46 depending on a reading of the hydrocarbon tax; the royalty explains the first move and only part of the second.")

q(1,
 "deriveOilRoyaltyRate for a marginal field reads 0.050000 at 5000 bopd, 0.062500 at 10000 and 0.106250 at 20000. Why is the 10000 bopd rate exactly halfway between the first two tiers while the 20000 bopd rate is not halfway to 0.150000?",
 "At 10000 bopd the year's barrels split evenly between the 5 percent and 7.5 percent tiers; at 20000 bopd half the barrels sit in the 15 percent tier and the other half are still priced at the two lower tiers.",
 ["The 10000 bopd row is an interpolation between two table entries and the 20000 row is a table entry, so only the first is an average.",
  "The blend is arithmetic below 10000 bopd and geometric above it, which is why the upper rows rise more slowly than a straight average would.",
  "The 20000 bopd rate is capped by the deep offshore step at 50000 bopd, so the marginal curve is bent toward 0.132500 rather than toward 0.150000."],
 "The rate is the average across the year's barrels, so the first 10000 bopd are always priced at the two lower tiers and the rate approaches 0.150000 from below, 0.142708 at 120000 bopd.")

q(3,
 "AKATA as a marginal field pays a 2029 production royalty of 10182990.00 against 22944240.00 as shallow water, yet its 2029 HCT is 29251153.65 against 25422778.65 and total tax rises to 223261390.90. Why did the tax rise when the royalty fell?",
 "pia_marginal_field_pre_2021 was not set, so the field pays 30 percent on a base that the smaller royalty has left larger; the blend does not switch the tax rate.",
 ["The marginal field terrain carries a hydrocarbon tax rate of its own, higher than shallow water, which the engine applies whenever the blended royalty is used, so the blend and the rate move together.",
  "The price royalty is charged at a higher rate on a marginal field and is added into the HCT base rather than deducted from it, which lifts the tax.",
  "The marginal terrain forfeits the production allowance, and the 5500000.00 that shallow water deducts from the base is charged in full on a marginal field."],
 "pia_marginal_field_blend has the flag true and pays 0.150000, 26361776.50 on 175745176.68; AKATA marginal pays 0.300000 and NPV is 61154067.34, with the tax taking back most of the royalty saved.")

q(0,
 "The PIA worked example sells at 80.000000 in 2025 and pays a price royalty of 34905145.759897 on 1460000000.00 of gross revenue, the 0.023908 in the table, where the 2021 curve reads 0.030000 at 80. What lowered the rate?",
 "The anchor prices escalate at 2 percent a year from 2021, so the same nominal price sits lower on the curve every year.",
 ["The rate is applied to revenue after the production royalty of 182500000.00 rather than to the gross, and the smaller base shows up as a smaller apparent rate.",
  "The price is deflated by the 3 percent inflation before the curve is read, so the real price of 2025 is below 80 and earns the lower rate.",
  "The twelve monthly rows of 2025 are each read on the curve and averaged, and the monthly reads fall below the annual read because the curve is convex."],
 "At 60 USD/bbl the rate is 0.010000 in 2021, 0.005431 in 2025 and 0.000205 in 2030; a flat price is a falling royalty because the anchors move under it.")

q(2,
 "In 2035 a price of 60 USD/bbl reads a price royalty rate of 0.000000, and in 2026 a price of 55 already does. What has happened to the curve?",
 "The 50 anchor, escalating at 2 percent a year from 2021, has moved past those prices, and below the first anchor the rate is nothing.",
 ["The engine floors the rate at 0.000000 whenever the price is below the year's applied oil price, and 60 is below every escalated price in the deck.",
  "The lower tier has been switched off by the 2025 framework change, which removed the price royalty below the 100 anchor for every terrain.",
  "The rate is rounded to six decimals, and by 2035 the true rate at 60 is a small positive number that rounds to zero."],
 "At 60 the rate is 0.010000 in 2021, 0.005431 in 2025, 0.000205 in 2030 and 0.000000 in 2035, a royalty in name only long before it vanishes.")

q(3,
 "pia_price_royalty_ceiling at 200.000000 pays 365000000.000000 on 3650000000.00 of gross revenue, exactly 10 percent, and the table reads 0.100000 at 200 in 2021, 2025, 2030 and 2035. What does a price above the 150 anchor earn?",
 "The ceiling of 0.100000 and no more, which is the only part of the curve that the years do not erode.",
 ["A rate that keeps climbing at the upper tier's slope, twice as steep as the lower tier, so that 200 earns more than 150 and 250 more than 200.",
  "The upper tier rate read at the escalated 150 anchor, which drifts upward with the years so that 200 earns a little more each year.",
  "A rate of 0.100000 plus the lower tier rate at 100, because the tiers stack and a price that has passed both anchors pays both."],
 "pia_high_price_royalty_tiers at 140.000000 pays 202709508.889684 on 2555000000.00, still between the escalated 100 and 150 anchors; 160 and 200 both read 0.100000 in 2021.")

q(0,
 "pia_gas_only_hct_zero sells 20000000.00 Mscf and no oil for 90000000.00 of gross revenue at an oil price of 80.000000, and its price_royalty column reads 0.000000 beside a production royalty of 6300000.00. Why no price royalty?",
 "The price royalty reads the oil price and charges the oil; there is no oil, and gas does not carry it.",
 ["The gas price of 4.5 USD per Mscf is far below the 50 anchor, and the engine reads the price royalty curve at the gas price for a gas field.",
  "The oil price of 80.000000 in 2025 reads 0.000000 on the curve because the 50 anchor has escalated past it by 2025.",
  "The field is treated as frontier when it has no oil, and frontier is exempt from the price royalty outright."],
 "The 6300000.00 is 0.070000 on the gas; the price royalty on a field with gas is charged on the oil revenue alone, not on the gross, which is the second common mistake.")

q(1,
 "pia_frontier_exempt prints a production royalty of 21900000.00 on 292000000.00 of gross revenue and a price royalty of 0.000000, at a price of 80.000000 in 2025. What two things does the frontier terrain do to the royalties?",
 "It fixes the production royalty at 0.075000 at every daily rate, and it exempts the field from the price royalty outright, 0.000000 even at 200 USD/bbl.",
 ["It steps the production royalty from 0.050000 to 0.075000 at 50000 bopd like deep offshore and defers the price royalty until the field reaches that threshold.",
  "It blends the production royalty across three tiers like a marginal field and reads the price royalty at the 2021 anchors without escalation.",
  "It fixes the production royalty at 0.075000 and caps the price royalty at the 0.100000 ceiling, which at 80.000000 in 2025 happens to round to 0.000000."],
 "pia_onshore_new_lease on the same 292000000.00 of revenue pays 43800000.00 of production royalty and 6981029.151979 of price royalty; the frontier string removes half of one and all of the other.")

q(2,
 "pia_deep_offshore_wi_50 and pia_deep_offshore_naive_30k both carry oil_bbl 10950000.00 on the 2025 row, yet the first pays 65700000.00 of production royalty and the second 43800000.00. Why do two rows with the same barrels pay different royalties?",
 "The tier is read on the field's barrels and the working interest is applied to the money afterward; the WI 50 row is still a 60000 bopd field at 0.075000, while the naive upload made a 30000 bopd field at 0.050000.",
 ["The WI 50 row adds its price royalty of 20943087.455938 into the production royalty column, and the naive row reports the same price royalty separately.",
  "The naive row is read at 2025 anchors and the WI 50 row at 2021 anchors, because a working interest below 100 percent fixes the curve at the year the licence was granted.",
  "The WI 50 row applies 0.075000 to the field's 21900000.00 bbl and then halves, while the naive row applies 0.050000 to the full 21900000.00 and does not halve, and the two scalings happen to land on those figures."],
 "cumulative_oil_bbl_lifetime reads 21900000.00 on the WI 50 row and 10950000.00 on the naive row; only that column and prod_alw_eligible_bbl remember the field.")

q(0,
 "pia_deep_offshore_naive_30k lands in the cheaper 0.050000 tier yet reports NPV 372530915.97, below the correct half share of 445282165.97. What pulls it down?",
 "It still bears the full 100000000.00 of capex, 100000000.00 of opex, 5100000.00 of HCDT and 15000000.00 of NDDC against half the revenue; two errors in opposite directions, and neither cancels the other.",
 ["The lower tier lowers the royalty but the hydrocarbon tax rises to take back the difference, since deep offshore under the conservative reading charges HCT on the royalty saved.",
  "The engine detects the pre-scaled upload and charges a penalty royalty at the 0.075000 rate on the barrels it infers were left out of the file.",
  "The naive row is discounted one extra year because the halved production is read as starting in 2026, and the extra division by 1.1 costs the difference."],
 "The take reads 44.8919 percent against 42.6183 for both honest runs; the naive row is a different field with the wrong costs, not a share of the real one.")

q(3,
 "AKATA under the PIA at pia_working_interest_pct 50 reports NPV 21611752.94, exactly half of 43223505.88, and a take of 75.5752 percent that has not moved. Under joint venture terms the same field reads take 66.1723 percent at a working interest of 100, 60 and 25 alike. Why is take invariant under both regimes?",
 "Both ledgers scale every monetary line and the volumes together, so each line the ratio reads is cut with the rest and the ratio is the number it was.",
 ["The PIA scales the whole ledger, while the JV take is invariant for a different reason, the partners' royalty and tax being charged at the operator's rates.",
  "Take is computed before the working interest is applied in either regime, so the ratio never sees a share at all and reports the field's number.",
  "The royalties are field-level tiers in both regimes and do not scale with the working interest, so the state's share stays the same fraction of a smaller revenue."],
 "Until engines 3.10.0 the JV rows kept field-level revenue and counted the partners' share as take, so the same field read 79.7034 percent at a 60 percent interest; PIA royalties halve to 61196822.32 while the eligible barrels stay 2200000.00.")

q(1,
 "A production file has been pre-scaled to the operator's share before upload. What can the engine report to warn the reader?",
 "Nothing. It cannot tell a pre-scaled upload from a small field: the naive run reports working_interest_pct not reported exactly as the full run does.",
 ["A working_interest_pct of 50 inferred from the ratio of the uploaded barrels to the lifetime cumulative, which it prints in the KPI block as a warning.",
  "A prod_alw_cap_applied flag of true on the first row, because a halved field reaches the wrong tier and the engine marks any tier it cannot reconcile.",
  "An ingestion refusal, since the volume columns of a pre-scaled file fail the per-well naming check that the production loader applies."],
 "The row's oil_bbl is the entitlement either way; the only honest scaling is pia_working_interest_pct on the full field, which keeps cumulative_oil_bbl_lifetime at 21900000.00.")

emit(Q, '/root/wt-ec7-recut/tools/course-banks/cashflow/advanced/ec1a_m02.json', expect_n=15)
finish()
