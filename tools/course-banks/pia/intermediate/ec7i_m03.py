import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Professional m03, Deductions and the Cost Price Ratio.
# Every figure is quoted from digest.txt. The NDDC levy base rests on a
# secondary source and is said to. No capstone name, term, row or value.

q(2, "Which of these deductions sits outside the 65 percent cost price ratio limit of the Sixth Schedule para 2(1)?",
 "The royalties, HCDT and the NDDC levy",
 ["This year's operating costs, at the crude-plus-condensate share",
  "The capital allowance the Fifth Schedule gives for the year",
  "Cost carried in from last year"],
 "Para 2(1) caps deductions \"excluding those related to section 263 (1) (a), (b) and (h)\": rents, royalties, and contributions to host communities development trusts, the NDDC and similar funds. Opex, the capital allowance and the carried pool are exactly what the cap claims from, so each of them sits inside it.")

q(3, "On the worked example inputs (shallow water, crude oil only, 2025) the cost price ratio cap is 949000000.000000 against gross revenue of 1,460,000,000.000000. What is the cap measured on?",
 "Crude oil and condensate revenue",
 ["Gross revenue from every stream, gas included, before any deduction is taken off it",
  "Revenue after the liquids royalties, since para 2(1) lets royalties come off first",
  "The year's total costs, of which 65 percent may be claimed and the rest carried"],
 "The cap is 65 percent of crude oil and condensate revenue, and on this crude-only year that is 949000000.000000. Gas revenue never enters the cap (the Ekene gas field's cap is 0.000000). Royalties sit outside the cap and do not shrink its base. The limit is a share of revenue; a share of the costs would carry something forward every year.")

q(1, "When the engine fills the cost price ratio cap, in what order does it claim the pool?",
 "The carried pool and this year's opex first, then this year's capital allowance",
 ["This year's capital allowance first, then opex, then the carried pool",
  "All three at once, pro rata to their size, until the cap is reached",
  "Opex first, then the capital allowance, with the carried pool claimed only after cessation"],
 "The engine claims the carried pool and the year's operating costs first and the year's capital allowance last, so on a lease where the cap binds the capital allowance is the first thing carried forward. There is no pro rata split. A carried cost is claimed in any later year with room under the cap; at cessation what is still carried is forfeited.")

q(0, "On the Ekene CPR case the 2024 cap is 48750000.000000 and the claim equals it. What cost does the engine carry out of 2024?",
 "21250000.000000, the part of the pool the cap turned away",
 ["48750000.000000, the claim",
  "75000000.000000, the revenue",
  "5700000.000000, the NDDC levy"],
 "The claim fills the cap at 48750000.000000 and what does not fit, 21250000.000000, is printed as CPR carried out and claimed in a later year. 48750000.000000 is what the cap let through. 75000000.000000 is 2024 gross revenue, the base of the cap. 5700000.000000 is the NDDC levy, which is deducted outside the cap and never carried.")

q(1, "On the Ekene CPR case the claim equals the cap in 2024, 2025 and 2026, yet the carried pool grows from 21250000.000000 to 52250000.000000 to 93000000.000000. Why does it grow?",
 "Revenue falls each year, so the cap falls, while opex holds flat",
 ["Each year it waits, the carried cost earns a 65 percent uplift under para 2(2)(b) of the Sixth Schedule",
  "The capital allowance is claimed again in full every year on top of the carry",
  "Royalties join the pool once the cap binds"],
 "The cap is 65 percent of each year's revenue: 48750000.000000, 39000000.000000, 29250000.000000 as revenue falls from 75000000.000000 to 45000000.000000, while the carried pool and 40000000 USD of opex a year keep arriving, so less fits each year. Para 2(2)(b) limits the carry to the cap and adds no uplift; para 2(2)(a) says the total deducted may not exceed the actual costs incurred. The capital allowance is a scheduled fraction and is never claimed twice. Royalties stay outside the cap.")

q(2, "The Ekene CPR case ends in 2026 with 93000000.000000 still carried. What does the engine do with it, and under which provisions?",
 "Reports it as forfeited at cessation, non-deductible under para 2(2)(c) and s.264(q)",
 ["Deducts it in 2026 in full, since the last year of a field lifts the cap under para 2(2)(b)",
  "Moves it to companies income tax, where the cap does not apply",
  "Carries it to a later field of the same company under s.272"],
 "Para 2(2)(c) makes costs above the limit \"upon the termination of upstream petroleum operations related to crude oil\" non-deductible for the hydrocarbon tax, and s.264(q) lists them among items never deducted. The engine reports cpr_forfeited_at_cessation, equal to the last year's carry. No provision lifts the cap in the last year. Companies income tax already deducted the opex in full as it was spent, so nothing moves across. Consolidation under s.272 is concept-only and the engine does not compute it.")

q(3, "Sixth Schedule para 2(2)(a) allows a carried cost in later years \"provided that the total costs to be deducted shall not exceed the actual costs incurred\". What does that limit mean on a ledger?",
 "Each cost is deducted once",
 ["A carried cost may be claimed only in the year immediately after the one it was carried out of",
  "The carried pool may not exceed 65 percent of the costs actually incurred in the year of spend",
  "The cap is lifted in any year whose own costs are below the actual costs of the year before"],
 "The words cap the total over the life: a cost carried forward is claimed once and never inflated or repeated. Nothing in para 2(2)(a) restricts the carry to the next year; a carried cost waits for any later year with room. The 65 percent figure is the per-year limit of para 2(2)(b), measured on revenue. No provision lifts the cap.")

q(1, "Para 2(2)(b) says a carried cost claimed later \"shall be such an amount that if added to the sum of the total costs to be allowed as deduction under subparagraph (1) shall not exceed the specified cost price ratio limit of 65% ;\". What does that rule do?",
 "It makes the carried amount and that year's own costs share one 65 percent limit",
 ["It gives the carried amount a second 65 percent limit of its own each year",
  "It lets a carried cost be claimed ahead of the year's own costs whenever the limit is reached, with no cap on the year's claim",
  "It restricts the carried amount to 65 percent of what was first carried out"],
 "The text adds the carried amount to the year's own costs and caps the sum at 65 percent of revenue, so one limit covers both. There is no second limit. The engine does claim the carried pool with this year's opex before the capital allowance, but the whole claim still stops at the cap. Nothing scales the carried amount down by 65 percent.")

q(0, "Ekene Alpha claims 46563591.022444 against a cost price ratio cap of 147664400.000000 in 2026. What does the engine carry out of 2026?",
 "Nothing, because the whole pool fits under the cap",
 ["Whatever room is left between cap and claim",
  "Its 2026 capital allowance",
  "The gas share of opex"],
 "The engine claims the lesser of the pool and the cap; Alpha's pool is well below its cap, so all of it is claimed and nothing is carried. The difference between cap and claim is unused room and carries nothing forward. The capital allowance is carried only when the cap binds. The gas share of shared costs stays on the gas side of the tax and is never carried in the hydrocarbon tax pool.")

q(3, "A lease's recoverable pool in a year is exactly equal to that year's cost price ratio cap. What does the engine claim and carry?",
 "It claims the whole pool and carries nothing",
 ["Only 65 percent of the pool, with the rest carried, as the cap is 65 percent",
  "The pool less one unit, with that unit carried, as the cap is a strict limit",
  "Nothing at all, because a pool at the limit sends the whole year to the carry"],
 "The engine claims the lesser of the recoverable pool and the cap, so a pool equal to the cap is claimed in full and carries nothing. The 65 percent applies to revenue to set the cap; it is never applied to the pool. The limit reads \"shall not exceed\", which a pool equal to it meets. Nothing sends a year's whole pool to the carry.")

q(1, "The worked example states a preceding year's opex of 170000000 USD. What HCDT does the engine deduct in 2025, and under which provisions?",
 "5100000.000000, 3 percent of that opex, under s.240(2) and s.263(1)(h)",
 ["15000000.000000, the stated NDDC sum, which the case enters in the HCDT line",
  "3 percent of the 2025 opex itself, since s.240(2) reads the current year",
  "Nothing, since HCDT is paid from profit after tax and s.264(l) bars it"],
 "Section 240(2) sets the contribution at \"an amount equal to 3% of its actual annual operating expenditure of the preceding financial year\", so 3 percent of 170000000 USD is 5100000.000000, and s.263(1)(h) makes it deductible. 15000000.000000 is the fixed NDDC sum on its own line. The contribution reads the preceding year, which is why the case states it. Section 264(l) bars income and profits taxes; the trust contribution is deductible under s.257(1).")

q(2, "Ekene Alpha's HCDT is 0.000000 in 2026 and 720000.000000 in 2027. Why is 2026 zero?",
 "No preceding year's opex was stated for the first ledger year",
 ["HCDT waits for a field's first full producing year",
  "The 2026 capex of 120000000 USD absorbs the contribution inside the cost price ratio",
  "Alpha is a converted lease, and converted leases pay HCDT from the second year"],
 "HCDT is 3 percent of the preceding year's opex; the first ledger year reads the stated pia_prior_year_opex_usd, which is 0 when not stated, and 2027 reads 2026 opex of 24000000 USD, giving 720000.000000. No provision delays HCDT by production history or lease type; the engine simply had no prior-year figure. HCDT sits outside the cost price ratio and nothing absorbs it.")

q(0, "On the Ekene NDDC case, the 2026 NDDC levy is 450000.000000 on the opex base and 2250000.000000 on the total budget, and the hydrocarbon tax is 32109497.282609 against 31569497.282609. Why is the tax lower on the total budget base?",
 "The larger levy is deducted in the hydrocarbon tax base, which lowers the profit taxed",
 ["Its capex enters the cost price ratio a second time on that base",
  "A credit against the tax itself, equal to the larger levy",
  "The total budget base switches the lease to the 15 percent class"],
 "The NDDC levy is deductible for the hydrocarbon tax under s.263(1)(h) (at the liquids share), so a larger levy lowers the chargeable profit and the tax. The capex enters the levy base only; the levy sits outside the cap and adds nothing to it. A levy is a deduction in the base and gives no credit against the tax. The levy base has no effect on the s.267 class. In 2027, with no capex, both bases give 450000.000000.")

q(3, "The engine charges the NDDC levy as 3 percent of the total annual budget, taken as opex plus capex. What source does that figure rest on?",
 "A secondary source, said so where it is used",
 ["PIA s.263(1)(h), which sets the levy at 3 percent of the total annual budget of every company",
  "The Petroleum Royalty Regulations 2022, which set the NDDC levy beside the royalty rates",
  "PIA s.240(2), the same 3 percent that sets the host communities trust contribution"],
 "The course names the Niger-Delta Development Commission (Establishment, etc.) Act 2000 s.14(2)(b), as amended 2017, and that Act was not read: the 3 percent of the total annual budget comes from published commentary, a secondary source, and is stated as such. PIA s.263(1)(h) makes the contribution deductible and sets no rate. The Regulations set royalties only. Section 240(2) sets the HCDT on the preceding year's opex, which is a different instrument.")

q(1, "Which of these may the hydrocarbon tax base never deduct, under PIA s.264?",
 "Companies income tax and the tertiary education tax",
 ["Levies, stamp duties and fees owed to any government",
  "The host communities development trust contribution",
  "A contribution to an approved decommissioning fund"],
 "Section 264(l) bars \"amounts incurred in respect of tertiary education tax, companies income tax, any income tax, profits tax or other similar taxes, whether charged within Nigeria or elsewhere ;\". Levies, stamp duties and fees are deductible under s.263(1)(f), the trust contribution under s.263(1)(h), and an approved decommissioning fund contribution under s.263(1)(e).")

emit(Q, '/root/cat-wip-pia/banks/ec7i_m03.json', expect_n=15)
finish()
