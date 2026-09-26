import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Expert m04, Gas and Incentives. Keys rest on the course's gas royalty
# table and gas field rows, the Regulations r.16 quotations, the one-change row
# for gas used in-country, the liquids share rows and the shared-costs note,
# the concept-only quotations of PIA s.260, NTA s.85, PIA s.302(6), NTA s.80,
# PIA s.305 and NTA s.88, and the restriction's gas operations exemption. The
# gas credit, the pipeline reliefs, stabilisation and the associated gas split
# are concept-only: asked as text, never keyed to a number the engine does not
# compute.

K = [0, 2, 3, 1, 1, 0, 2, 3, 0, 3, 1, 2, 2, 0, 3]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("At a stated in-country gas share of 40 percent, what gas royalty rate does the engine return?",
 "0.040000, in every terrain",
 ["0.040000 onshore and 0.050000 offshore, since the in-country rate is written for land fields",
  "0.025000, since any gas used in-country takes the whole volume down to the 2.5 percent rate",
  "0.035000: 40 percent of the gas at 5 percent and the other 60 percent at 2.5 percent"],
 "The gas royalty table prints 0.040000 at a stated 40 in all four terrains: the rate is the share-weighted blend of 2.5 percent on the in-country share and 5 percent on the rest, and every terrain pays the same gas rate. 0.035000 is the rate at a stated 60, the blend turned the wrong way round.")

# 2
x("Why does the Ekene gas field ekene_nag_gas_in_country_half pay no hydrocarbon tax in any year?",
 "It produces no crude oil or condensate, so its cost price ratio cap is 0 and the tax has nothing to charge",
 ["Half of its gas is used in-country, and s.302(6) exempts in-country gas from the tax",
  "It is in shallow water, where gas meets the tax only once it passes 10,000 bopd",
  "The greenfield gas credit of NTA s.85 offsets its hydrocarbon tax in full"],
 "The course prints the case with CPR cap 0.000000, HCT chargeable profit 0.000000 and HCT 0.000000 in 2026 to 2028, and says the field has no crude oil or condensate, so there is no hydrocarbon tax; companies income tax is charged on the gas profit (10713000.000000 in 2026). The engine does not compute the s.85 credit, and s.302(6) is about midstream and pipeline incentives.")

# 3
x("Stating all of Ekene Alpha's gas as used in-country moves which provision totals?",
 "Royalties by -863333.550000, companies income tax by 259000.065000 and the levy by 34533.342000",
 ["Royalties by -863333.550000 and hydrocarbon tax by 259000.065000, gas royalty sitting in that base",
  "Royalties alone, by -863333.550000, the smaller gas royalty reaching none of the lines after it",
  "Nothing at all, since Alpha's associated gas pays the crude oil tranche rate on its gas"],
 "The one-change row prints royalties -863333.550000, hydrocarbon tax 0.000000, companies income tax 259000.065000, levy 34533.342000 and take -0.068159. Gas royalty is not deducted in the hydrocarbon tax base (gas is outside the tax), so that line stays at 0.000000, while the income tax base, which deducts every royalty, grows.")

# 4
x("Which one-change row on Ekene Alpha moves royalties while the hydrocarbon tax difference stays at 0.000000?",
 "All gas used in-country",
 ["Oil at 95 USD/bbl on the Regulations base, which lifts the royalty by price with it",
  "A prospecting licence under s.267(b), whose class sits on the same crude oil profit",
  "Every year forced to the Act alone, which swaps the levy for the education tax"],
 "Of these rows only the gas one has a royalty difference (-863333.550000) with a hydrocarbon tax difference of 0.000000. Oil at 95 moves both (43566660.591831 and 72668690.783886), a prospecting licence moves the hydrocarbon tax only, and the forced row moves royalties by 0.000000.")

# 5
x("What royalty rate do the Petroleum Royalty Regulations 2022 give natural gas liquids produced separately?",
 "5%, whether the natural gas liquids are used in-country or exported",
 ["2.5% when they are used in-country and 5% when exported, as for the gas they come from",
  "The crude oil tranche rate, since natural gas liquids count as condensate for royalty purposes",
  "7% onshore and 5% offshore, from NTA Part IV"],
 "R.16(4): \"The royalty rate of natural gas liquids produced separately, shall be 5% regardless of whether the natural gas liquids are used in-country or exported.\" For royalty, natural gas liquids count as natural gas (PIA Seventh Schedule para 6), and the 7 and 5 percent rates are for leases under NTA Chapter Three Parts II and III.")

# 6
x("PIA s.260(2) allocates the costs of associated gas to crude oil. What does the engine do in its place?",
 "Enters shared costs in the hydrocarbon tax at the crude-plus-condensate share of gross revenue, since it cannot tell the two gases apart",
 ["Reads a gas tag on each production row and puts every associated gas cost on crude oil",
  "All condensate treated as non-associated, with every barrel of it kept out of the tax",
  "It charges gas revenue to the tax at the crude-plus-condensate share of the revenue"],
 "The engine's note: \"Opex, HCDT, NDDC, capital allowances and any decommissioning contribution enter the hydrocarbon tax at the crude-plus-condensate share of gross revenue. The Act allocates associated-gas costs to crude oil (s.260(2)) and excludes non-associated gas condensate from the tax (s.260(1)(b)(ii)); the engine cannot tell the two gases apart.\" Gas revenue stays outside the tax.")

# 7
x("Ekene Alpha's liquids share of gross revenue is 0.970075 in every year from 2026 to 2032. What does the engine use it for?",
 "Opex, HCDT, NDDC and the capital allowance enter the hydrocarbon tax at that share",
 ["Charging that share of gas revenue to the hydrocarbon tax base alongside crude oil",
  "Scaling the government take to that share of its value before it is reported",
  "Setting the cost price ratio cap at that share of the 65 percent limit on revenue"],
 "The liquids share rows are derived as liquids revenue over gross revenue, and the course says the NDDC levy is deducted in the hydrocarbon tax base at the liquids share, as HCDT is, with opex and the capital allowance entering at the same share. Gas revenue is outside the tax, the take is government cash flow over the pre-take value, and the cap is 65 percent of crude oil and condensate revenue.")

# 8
x("When does the engine print its note on shared costs in kpis.pia_notes?",
 "On a ledger with gas production in some year",
 ["On every PIA ledger, whatever it produces, as it prints the note on the realised price",
  "Only on a field with gas and no crude oil, such as ekene_nag_gas_in_country_half",
  "Only when pia_gas_in_country_share_pct is stated above 0 for the ledger"],
 "The note table gives sharedCosts' condition as \"a ledger with gas production in some year\". Ekene Alpha, which sells associated gas beside its crude, carries it as well as the gas field does, and the in-country share has no part in the condition. The fiscal price note is the one printed on every PIA ledger.")

# 9
x("Under NTA s.85(1)(a), what credit does a qualifying non-associated gas field in the leanest liquids band earn?",
 "The lower of US$1.00 per thousand cubic feet and 30% of the fiscal gas price",
 ["The lower of US$0.50 per thousand cubic feet and 30% of the fiscal gas price",
  "US$1.00 per thousand cubic feet or 30% of the realised gas price, whichever is higher",
  "A production allowance of US$1.00 per thousand cubic feet against the tax base"],
 "S.85(1)(a) grants the credit at the \"rate of US$1.00 per thousand cubic feet or 30% of the fiscal gas price, whichever is lower;\" for gas whose liquids do not exceed 30 barrels per million standard cubic feet. The US$0.50 figure is the middle band of s.85(1)(b), and s.85(2) is the provision that grants an allowance. The credit is concept-only in this course.")

# 10
x("For how long does the NTA s.85 gas tax credit run, and how long may an unused credit be carried?",
 "10 years of sales from first gas production, carried forward at most three years",
 ["Three years of sales from first gas production, with an unused credit carried forward for 10 years",
  "Until 1 January 2029, unused credit lapsing each year",
  "10 years of sales from first gas production, with an unused credit carried forward without limit"],
 "S.85(1)(d): the credit \"shall apply on Non-Associated Gas sales for 10 years only, beginning from the date of attaining first gas production\". S.85(4): \"Unrecouped tax credit in one year may be carried forward for a maximum of three years.\" 1 January 2029 closes the window for first gas, and the carry is capped.")

# 11
x("A non-associated gas greenfield project first produces commercial gas after 1 January 2029. What does NTA s.85(2) give it?",
 "A gas production allowance at the lower of US$0.50 per thousand cubic feet and 30% of the fiscal gas price",
 ["The same credit at US$1.00 per thousand cubic feet, the s.85 window having been extended past 1 January 2029 for late projects",
  "No relief at all, since s.85 closes to every project on 1 January 2029",
  "A tax credit at US$0.50 per thousand cubic feet with no limit tied to the fiscal gas price at all"],
 "S.85(2): \"In the case of all other Non-Associated Gas Greenfield projects with first commercial gas production after 1 January, 2029, gas production allow- ance shall be granted at US$0.50 per thousand cubic feet or 30% of the fiscal gas price, whichever is lower,\". The relief is an allowance, still limited by the fiscal gas price.")

# 12
x("How does this course treat the NTA s.85 greenfield gas credit?",
 "As concept-only: the engine does not model it, and it reads realised prices where s.85 names the fiscal gas price",
 ["Computed as a line on the gas field's ledger, and graded once the credit's inputs are stated",
  "Only for fields whose first gas arrives before 1 January 2029 is it computed, on a stated date",
  "As part of the gas royalty rate, where it appears as the 2.5 percent rate for gas used in-country"],
 "The engine's list of what it does not model includes the non-associated gas credit, and its note says \"The realised oil and condensate prices stand in for the Commission's fiscal prices\". A concept-only provision is taught from its text and never graded on a number, and the 2.5 percent in-country rate is a royalty rule of para 10(6).")

# 13
x("What do PIA s.302(6) and NTA s.80(1) give investors in gas pipelines?",
 "A tax-free period of five years at the expiration of an earlier tax-free period or certificate",
 ["Royalty holiday of five years on all gas the pipeline delivers to the domestic market, on top of the in-country royalty rate",
  "2.5 percent gas royalty on every volume the pipeline carries, whatever its destination",
  "A credit of US$0.50 per thousand cubic feet on the gas they carry for five years from startup"],
 "S.302(6): \"investors in gas pipeline will be granted an additional tax-free period of five years at the expiration of the tax-free period\"; NTA s.80(1): \"shall be granted a tax-free period of five years at the expiration of the economic\" development incentive certificate. Both are company-level reliefs the engine does not compute, and neither is a royalty rule or a credit per unit.")

# 14
x("What do PIA s.305 and NTA s.88(1) say about stabilisation clauses in contracts made after the Act's commencement?",
 "They do not shield contractors from changes to the listed fiscal provisions, favourable or unfavourable; NTA s.88(1) adds that changes must not discriminate",
 ["Fiscal terms of a converted lease frozen at its conversion date for the life of the lease",
  "Protection from unfavourable changes only, favourable changes passing straight through",
  "They bind only production sharing contracts signed before commencement"],
 "S.305: such clauses \"shall not be applicable to the fiscal provisions listed in this section, regardless of whether these changes affect the contractor favorably or unfavorably,\". NTA s.88(1) restates it, \"provided such changes in fiscal provi- sion are being made in a manner that is not discriminatory to the petroleum industry or the contractor.\" Stabilisation is concept-only.")

# 15
x("On ekene_nag_gas_in_country_half (2026 to 2028) the flag pia_cit_company_gas_operations is set to true. What can it change?",
 "Nothing on this case: it exempts a company from the two thirds restriction, which applies only in years under the Act alone",
 ["The gas royalty rate, which falls from 0.037500 to 0.025000 for a company in gas operations",
  "The hydrocarbon tax, which the exemption lifts from 0.000000 to the 30 percent class of s.267(a)",
  "Companies income tax in 2026, which falls as a restricted and carried capital allowance from earlier years is released in full"],
 "The flag exempts a company in upstream or midstream gas operations from the two thirds restriction on the companies income tax capital allowance. The restriction applies in a year under the Act alone and not in a year under the Nigeria Tax Act 2025, and every year of this case is an NTA year. The gas royalty reads only the in-country share.")

emit(Q, '/root/cat-wip-pia/banks/ec7a_m04.json', expect_n=15)
finish()
