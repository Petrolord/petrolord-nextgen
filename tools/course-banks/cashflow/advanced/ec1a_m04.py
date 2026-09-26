import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC1 cashflow, advanced tier, Levies and Losses. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC7 PIA re-cut applied;
# written by tools/course-waves/cashflow/pia-recut/build.py. Edit here, then re-run it.

q(1,
 "On the published PIA worked example the tertiary education tax is 25999871.36 under pia_only and the development levy is 41599794.17 under nta_2025, and the course calls the levy 1.6 x TET. What makes the ratio exactly the ratio of the rates?",
 "Both are charged on the same line, the CIT assessable profit of 1039994854.24, so only the rates differ, 4 against 2.5.",
 ["The levy is charged on the HCT assessable profit of 1054994854.24, which is larger than the CIT base by the fixed NDDC, and the extra base happens to match the rate change.",
  "The levy is charged on the chargeable profit of 979994854.24 after the two-thirds restriction and then grossed up by the restriction, which returns the ratio of the rates.",
  "The levy includes the TET it replaces, so the 4 percent is the old TET with a surcharge stacked on the same base."],
 "Royalty 217405145.76, HCT 284810956.27 and CIT 293998456.27 are identical in both runs; only the last line changes, and total tax moves from 604809283.90 to 620409206.71.")

q(0,
 "A reader who knows the 2021 Act and has heard of the 2025 framework adds TET and the development levy to the same year of AKATA. What does the ledger say about that total?",
 "No run of the engine produces it: one of tet_tax and dev_levy_tax is 0.00 on every row, and the fiscal_framework column says which one was charged.",
 ["It is right for AKATA, whose 2029 base year sits on the trigger, so the engine charges TET of 3369056.19 under the Act and a levy of 5390489.91 under the framework in the same year.",
  "It is right whenever the override is set to auto, because auto blends the two frameworks in proportion to the years each one covers.",
  "It overstates by the TET only in the years after 2026, since the levy replaces TET from the switch date and the earlier rows keep both."],
 "AKATA on auto pays a levy of 5390489.91 in 2029 and 21007007.79 over the life with TET at 0.00; forced to pia_only it pays TET of 3369056.19 and no levy.")

q(3,
 "On pia_loss_relief the 2026 TET is 5755415.35 whether the 2025 CIT loss of 12056305.36 is relieved or clamped. Why does the pool never reach the levy?",
 "Relief acts on the chargeable profit and the levy sits on the assessable profit, a line the pool is never subtracted from.",
 ["The pool was already spent against the 2025 HCT of 508108.39, so nothing was left for 2026 to relieve against any base at all.",
  "The TET is charged on the HCT base, which never went into loss, so a CIT pool has no base to meet on the levy line.",
  "The clamp only deletes losses on the JV cascade; under the PIA the pool is relieved against every tax on the row including the levy."],
 "The 2026 CIT is 59448092.62 relieved against 63064984.23 clamped, while HCT 63814984.23 and TET 5755415.35 are the same in both runs.")

q(2,
 "A PIA ledger has a base year of 2027 and no value for pia_under_nta_2025_override at all. Which framework do its rows print?",
 "nta_2025, because an unset override behaves as auto and the date trigger selects the 2025 framework from 2026 onward.",
 ["pia_only, because with no override the engine has no instruction to leave the 2021 Act and keeps the framework it was written for.",
  "The engine refuses the run, since the framework is a required string and the decision table has no row for an unset override.",
  "nta_2025 for the rows from 2027 and pia_only for any earlier rows the upload carries, because the trigger is read on each row's year."],
 "The decision table reads base 2027 with the override unset as nta_2025, beside base 2025 auto as pia_only and base 2030 force_pia as pia_only.")

q(0,
 "pia_loss_relief has a 2025 base year with rows in 2025 and 2026, and its 2026 row prints pia_only with TET 5755415.35 and a development levy of 0.00. Why did the 2026 row not switch?",
 "The framework is chosen once from the base year and every row inherits it; the row year is never read.",
 ["The 2026 row is still inside the transition year, and the engine only switches a row that falls after the base year plus one.",
  "The loss pool of 12056305.36 carried into 2026 pins the row to the framework the loss was banked under, so relief and framework travel together.",
  "The engine switched the rate but kept the column name, so the 5755415.35 is a levy at 4 percent printed under the TET heading."],
 "The same holds on pia_cpr_carry_two_years, whose 2025 to 2027 rows all print pia_only, and on elt_pia_multiyear from 2025 to 2030.")

q(1,
 "The worked example at a 2025 base year forced to nta_2025 pays a levy of 41599794.17 with NPV 119585647.53; the same volumes at a 2026 base year on auto pay 41684425.66 with NPV 120347330.91. The framework is nta_2025 both times. What moved the levy?",
 "The price royalty anchors escalated a year further, so the price royalty fell from 34905145.759897 to 32789358.588134 and the assessable profit the levy follows rose to 1042110641.41.",
 ["The 3 percent inflation rate deflated the 2026 base year once more, lifting the real profit on which the levy is charged.",
  "The levy rate steps up in its second year under the framework, which is why the later ledger pays a little more at the same base.",
  "The 2026 run discounts one year less, and the levy is reported on the discounted profit rather than the row's nominal one."],
 "Total royalty fell from 217405145.76 to 215289358.59, and HCT rose from 284810956.27 to 285445692.42 and CIT from 293998456.27 to 294633192.42 on the same movement.")

q(2,
 "jv_loss_carryforward's 2031 row reads taxable income 65000000.00 and tax 30000000.00, which is not 50 percent of the column. A reader concludes the rate is wrong. What did the reader miss?",
 "The pool is applied after the taxable income column: loss_offset_used reads 5000000.00 and the rate is charged on the remainder.",
 ["The depreciation of 5000000.00 in 2031 was deducted a second time from the tax rather than from the income, which is how the engine relieves a loss year.",
  "The 2030 loss reduced the rate for the following year from 50 to 40 percent, since relief in this engine works on the rate and not on the base.",
  "The royalty of 20000000.00 is credited against tax under joint venture terms, and the credit happens to be 2500000.00 after discounting."],
 "The pool of 5000000.00 banked in 2030 falls to 0.00 in 2031; net cash flow is 40000000.00 and NPV -13636363.64 against -15909090.91 with the clamp on.")

q(3,
 "The engine's single-year function is given taxable income of 10000000.00 at the 50 percent rate with a pool of 15000000.00 brought forward. What does it report?",
 "Offset used 10000000.00, tax 0.00 and a pool after of 5000000.00.",
 ["Offset used 15000000.00, tax 0.00 and a negative taxable income of 5000000.00 banked as a fresh loss for the next year.",
  "Offset used 10000000.00, tax 0.00 and a pool after of 0.00, because a pool is spent whole in the first year with income.",
  "Offset used 5000000.00, tax 2500000.00 and a pool after of 10000000.00, because the offset is capped at half the year's income."],
 "The offset is capped at the year's taxable income, so tax bottoms at 0.00 and the rest waits: a pool of 40000000.00 leaves 30000000.00 after the same year.")

q(1,
 "With apply_loss_carryforward set to false, what happens to the 5000000.00 loss of jv_loss_carryforward's 2030 row?",
 "It is deleted: loss_carryforward reads 0.00, 2031 pays the full 32500000.00 and NPV falls to -15909090.91.",
 ["It is deferred until the ledger ends and then reported as tax losses unused at cessation, so NPV is unchanged and the memo line carries it.",
  "It is relieved against the HCT base instead of the CIT base, which is why the 2031 tax does not move.",
  "It is carried at face value but charged interest at the discount rate, so the 2031 offset is worth less than 5000000.00."],
 "The clamp does not defer the loss; the IRR moves from -20.0000 to -25.0000 percent because 2500000.00 of tax that relief would have removed is paid.")

q(0,
 "On pia_loss_relief the 2026 HCT of 63814984.23 is the same with relief on and off while the CIT is 59448092.62 relieved against 63064984.23 clamped. Why does relief touch one tax and not the other?",
 "The pools are kept per base: 2025's HCT chargeable profit stayed positive at 1693694.64, so no HCT pool existed, while the CIT base was -12056305.36 and banked a pool.",
 ["HCT is charged on liquids and the loss arose on gas, so the pool is a gas pool that only the CIT base, which includes gas, can absorb.",
  "The HCT pool was used first against the 2025 HCT of 508108.39 and exhausted, leaving only the CIT pool to reach 2026.",
  "The engine relieves the larger tax last, and the CIT pool of 12056305.36 was exhausted before the HCT line was reached."],
 "An HCT profit cannot absorb a CIT loss; the two are reported apart as hct_loss_carryforward and cit_loss_carryforward, and NPV moves from -8763295.32 clamped to -5475212.04 relieved.")

q(2,
 "jv_loss_unused_at_cessation reports NPV -50000000.00 and tax losses unused at cessation of 5000000.00. What is the unused pool worth in the NPV?",
 "Nothing: it is a memo line outside the NPV, a shield with nothing to shield, and adding it back counts a year the ledger does not contain.",
 ["2500000.00, the tax it would save at the 50 percent rate, which the engine has already netted into the -50000000.00.",
  "5000000.00 discounted one year, since the pool is carried to the year after cessation and valued there.",
  "2500000.00 in present value only if the reader adds it by hand, which the engine invites by printing the memo line beside the KPIs."],
 "Give the same capex one more year of production, as jv_loss_carryforward does, and the pool is spent: tax falls from 32500000.00 to 30000000.00 and the memo line disappears.")

q(1,
 "Each regime names the value the horizon left behind differently. Which regime prints no cessation memo at all?",
 "Production sharing: unrecovered cost at cessation is not reported, and the pool can only be read by marching the cost recovery function over the rows.",
 ["Joint venture, which banks the loss in the row's loss_carryforward column and therefore has no separate memo to print.",
  "The PIA, whose deferred CPR balance is relieved against the final year's CIT and so never reaches cessation.",
  "None of them: the JV prints tax losses unused, the PIA prints CPR forfeited and the PSC prints the unrecovered pool at cessation."],
 "cpr_forfeiture ends with CPR forfeited at cessation 8000000.00 and jv_loss_unused_at_cessation with tax losses unused 5000000.00; the PSC pool of 207346412.26 on AKATA at a 30 percent cap appears in no output.")

q(3,
 "With pia_apply_minimum_etr true at 85 percent the worked example grows a min_etr_topup column reading 279186342.20 and total tax becomes 883995626.10. Which taxes count as already paid when the floor is measured?",
 "HCT, CIT and TET, but not royalty, since royalty is charged on revenue rather than on profit.",
 ["HCT and CIT alone, 284810956.27 and 293998456.27, since the floor is a floor on the profit taxes and royalty is not a tax on profit.",
  "All of them: the 604809283.90 the floor is measured against includes royalty and the levies.",
  "Only the taxes charged on the chargeable profit of 979994854.24, which is the profit the 85 percent is applied to and the only line a rate can be measured on."],
 "The top-up is 85 percent of the CIT assessable profit of 1039994854.24 less the 604809283.90 in the tax column, and that column is HCT 284810956.27 plus CIT 293998456.27 plus TET 25999871.36; royalty 217405145.76, HCDT and NDDC sit outside it, and against HCT plus CIT alone the shortfall would come out larger than 279186342.20.")

q(0,
 "At 15 percent the floor does not bind on the worked example. What does the row show for min_etr_topup?",
 "Nothing: the column exists only where the floor was charged, and the KPI line reads min ETR top-up not reported.",
 ["A value of 0.00, printed so that a reader can confirm the floor was tested and found already satisfied.",
  "The shortfall as a negative number, the amount by which 604809283.90 exceeds 15 percent of 1039994854.24.",
  "The 15 percent of the assessable profit of 1039994854.24, printed as the floor tested, with a flag beside it reading false because it did not bind."],
 "The default for pia_apply_minimum_etr is false and every other published PIA case runs with it off; when it binds at 85 percent the column appears with 279186342.20.")

q(2,
 "The 85 percent run turns the worked example's net cash flow of 135185570.34 into -144000771.86 and its take of 86.1703 percent into 114.7315. How can a take exceed 100 percent?",
 "The top-up is charged on a profit measured before capex, so it can exceed the cash the year generates, and the engine refuses to cap it at the year's cash.",
 ["It cannot; a take above 100 percent is a display fault in the KPI line, and the 114.7315 should be read as 100 with the excess carried to the next year.",
  "The take ratio counts the 300000000.00 of capex as government revenue once the floor binds, since capex recovery is suspended under a minimum rate.",
  "The floor is measured on the chargeable profit of 979994854.24 while take is measured on the assessable one, and the two denominators differ by enough to push the ratio past 100."],
 "Payback moves from Year 0 to beyond project life and DPI from 0.450619 to -0.480003; the government collected more than the year's pre-take value.")

emit(Q, '/root/wt-ec7-recut/tools/course-banks/cashflow/advanced/ec1a_m04.json', expect_n=15)
finish()
