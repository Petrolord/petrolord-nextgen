import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Associate final exam, 42 questions across the tier's six modules.
# Built on facts and figures the module banks do not key, so that no exam
# question near-duplicates a module question (dupaxes at 0.45). Sources: the
# Associate-owned digest sections only. Every keyed engine figure is re-run in
# /root/cat-wip-pia/scratch/bank-beginner/witness.mjs.

# ---- m01 who decides what
q(2, "Which taxes does PIA s.259(a)(ii) add to the Service's list, beside the hydrocarbon tax?",
 "Companies income tax and tertiary education tax on taxable petroleum operations.",
 ["Royalties, rents and signature bonus, with their enforcement under the Act.",
  "The development levy and the NDDC levy on the total annual budget of each company.",
  "Petroleum profits tax on leases that have not converted."],
 "The text reads: \"(ii) companies income tax and tertiary education tax in accordance with this Act as it relates to taxable petroleum operations\". Royalties, rents and bonuses are the Commission's under s.259(b)(i); the development levy comes from NTA s.59, years later, and the NDDC levy from the NDDC Act; and an unconverted lease sits outside the Act's fiscal Part.")

q(0, "Under NTA s.59(2), who collects the development levy, and where does it go first?",
 "The Service, into a special account created for that purpose.",
 ["The Commission, straight into the Federation Account with every royalty the lease pays.",
  "The Tertiary Education Trust Fund, which then passes shares to six other bodies.",
  "The Nigerian Sovereign Investment Authority."],
 "The text reads: \"(2) The Service shall collect the levy and pay it into a special account created for that purpose.\" The revenue is then shared under s.59(3), with 50% to the Tertiary Education Trust Fund, which receives a share and collects nothing. The Commission's role is royalty, and the sovereign fund receives the royalty by price.")

q(3, "Which companies do the closing words of NTA s.59(1) leave outside the development levy?",
 "Small companies and non-resident companies.",
 ["Every company in upstream or midstream gas operations, whatever its size or residence.",
  "Companies holding a deep offshore lease in a year under the Nigeria Tax Act 2025.",
  "Companies that already pay a tertiary education tax to the Service in the same year."],
 "The text reads: \"other than small companies and non-resident companies.\" The levy draws no line by gas operations or by terrain, and in the engine a year that carries the development levy carries no tertiary education tax.")

q(1, "How does this course use the Finance Act 2023, and why?",
 "It paraphrases it, because the copy read is a scan published by the Budget Office.",
 ["It quotes it in full as a primary gazetted text, read on 2026-09-26 from the Official Gazette.",
  "It treats it as a secondary source, read only through law firm alerts and commentary on it.",
  "It leaves it out, as the Nigeria Tax Act 2025 repealed it."],
 "The texts table lists the Finance Act 2023 as \"Final Signed by PMB\", published by the Budget Office of the Federation on 7 June 2023, a scanned copy read page by page: primary, paraphrased. The secondary source is the Finance Act 2021's 2.5 percent, read through EY and Forvis Mazars alerts, and the course still uses the 2023 Act for the 3 percent rate and its effective date.")

q(1, "Which phrase does the course reserve for a year of assessment the engine reads as \"pia_only\"?",
 "A year under the Act alone, before 2026 under \"auto\".",
 ["A year under the Nigeria Tax Act 2025, which is 2026 onward under \"auto\".",
  "A converted year.",
  "A stated reading of the framework, whichever year the learner types into the case box."],
 "The vocabulary gives \"a year under the Act alone\" to a year of assessment the engine reads as \"pia_only\" (before 2026 under \"auto\"), and \"a year under the Nigeria Tax Act 2025\" to one it reads as \"nta_2025\". The course has no phrase \"converted year\", and a stated reading is the answer a run gives to one of the three open questions of the texts.")

q(0, "What does the course say about the data in its Ekene teaching cases?",
 "Every case, volume, price and cost is synthetic, written for this platform.",
 ["The cases are anonymised records from a real Nigerian lease, with the names removed.",
  "Prices are the Commission's fiscal prices for each year of the ledger.",
  "The volumes follow a real field and the costs are invented."],
 "The course states that every Ekene case, field, volume, price and cost is synthetic, written for this platform, and that no real company, licence, field or price list appears. No record is anonymised, and the Commission's fiscal price is concept-only: the realised price of the case stands in for it.")

# ---- m02 licences, leases and terrains
q(2, "Which rights does the Act's producing instrument grant on an exclusive basis, in the words of s.70(1)(c)?",
 "To win, work, carry away and dispose of crude oil, condensates and natural gas.",
 ["To carry out petroleum exploration operations over the acreage, shared with other licensees.",
  "To drill exploration and appraisal wells for up to 10 years in deep offshore acreage.",
  "To take a royalty by price on crude oil from other holders."],
 "Section 70(1)(c) grants a mining lease the right \"to: (i) win, work, carry away and dispose of crude oil, condensates and natural gas on an exclusive basis\". Shared exploration work belongs to the exploration licence, wells for appraisal to the prospecting licence, which in deep offshore may last up to 10 years under s.77(2), and a holder pays royalty to Government and takes none from anyone.")

q(3, "How long does a petroleum exploration licence last under PIA s.71(3)?",
 "Three years, renewable for three more on prescribed conditions.",
 ["A maximum of 20 years, including the development period of any discovery made on it.",
  "Not more than 10 years, with an initial period of five and an optional five-year extension.",
  "Until the conversion date of the oil prospecting licence it replaced under s.92(4)."],
 "The text reads: \"(3) A petroleum exploration licence shall be for three years and may be renewable for additional period of three years subject to fulfilment of prescribed conditions,\". Twenty years is the mining lease (s.86(1)), ten years the deep offshore and frontier prospecting licence (s.77(2)), and the conversion date belongs to oil mining leases and oil prospecting licences.")

q(0, "A converting holder keeps some acreage only to appraise a discovery. Under which instrument and fiscal terms does that acreage continue?",
 "A petroleum prospecting licence, on the fiscal terms of s.267(b).",
 ["Petroleum mining leases on the fiscal terms of s.267(a).",
  "Relinquished areas under s.93(4).",
  "Marginal fields under s.94(1)."],
 "PIA s.93(6)(a) puts acreage designated under s.93(1)(a), (b), (c) or (2) \"into a petroleum prospecting licence in accordance with section 78 of this Act\", on the s.267(b) terms. Mining leases on s.267(a) terms are for developed or producing acreage, relinquishment under s.93(4) is for acreage nobody selects, and s.94(9) closes the door on new marginal fields.")

q(1, "What may a holder do under PIA s.93(2) when its selected areas cover less than 40% of the oil mining lease?",
 "Select additional areas of the lease for conversion to a petroleum prospecting licence.",
 ["Keep the whole lease on its old terms until it expires, with no areas relinquished at all.",
  "Claim a production allowance on the unselected areas until the conversion date passes.",
  "Declare the unselected areas marginal fields."],
 "The text reads: \"(2) Where the total acreage selected under subsection (1) is less than 40% of the area to which the applicable oil mining lease applies, the holder may select additional areas covered by the oil mining lease for conversion to a petroleum prospecting licence\". Areas left unselected are relinquished under s.93(4), the subsection grants no allowance, and no new marginal fields may be declared.")

q(2, "For leases under NTA Chapter Three Parts II and III, what gas royalty does Seventh Schedule Part IV para 7(3)(c) set, and does the engine compute it?",
 "7% onshore and 5% offshore; concept-only, as the engine models converted and new leases alone.",
 ["5% everywhere and 2.5% for gas used in-country, computed by the gas royalty function on every case.",
  "7% onshore and 5% offshore, computed whenever pia_lease_status is stated as \"converted\".",
  "12.5% in shallow water and 15% onshore, the terrain rates."],
 "Para 7(3)(c) sets natural gas royalty for those leases at \"(i) onshore areas: 7 %, and (ii) offshore areas: 5%\". The engine models converted and new-acreage terms only and computes no royalty for those leases, so the provision is concept-only. The 5 and 2.5 percent gas rates belong to para 10(6) of the Act, and a converted lease is under the Act's terms.")

q(0, "What does NTA s.90(1) apply its Part on petroleum profits tax to?",
 "Oil prospecting licences and oil mining leases that are yet to convert under the Act.",
 ["Petroleum mining leases granted out of new acreage after the Nigeria Tax Act 2025.",
  "Deep offshore leases in a year under the Nigeria Tax Act 2025.",
  "Every lease in a year of assessment read as nta_2025."],
 "The text reads: \"90. (1) This Part shall apply to oil prospecting licences and oil mining petroleum leases that are yet to convert under the provisions of the Petroleum Industry\" Act. So an unconverted lease pays petroleum profits tax under the Nigeria Tax Act from its commencement, on the old royalty terms; the engine models converted and new-acreage terms only, so this is concept-only. New leases, deep offshore leases and other leases in NTA years sit under the hydrocarbon tax Part.")

# ---- m03 royalty by terrain
q(1, "At 7500 bopd, which rates does the engine return for onshore, deep offshore and frontier?",
 "0.058333 onshore, 0.050000 deep offshore and 0.075000 frontier.",
 ["0.058333 onshore, 0.058333 deep offshore, and 0.058333 frontier, as the small-field tranches apply in every terrain.",
  "0.075000 onshore, 0.050000 deep offshore and 0.075000 frontier.",
  "0.050000 in all three, the first tranche."],
 "Onshore at 7500 bopd blends 5 percent on the first 5,000 bopd and 7.5 percent on the rest: 0.058333. Deep offshore pays exactly 5 percent up to and including 50,000 bopd, and frontier pays 7.5 percent at every rate. The small-field tranches are for onshore and shallow water only, and the first tranche covers only the first 5,000 bopd.")

q(2, "Onshore and shallow water fields both produce 120000 bopd. How do their weighted royalty rates compare?",
 "0.142708 onshore and 0.119792 in shallow water.",
 ["15 percent onshore and 12.5 percent in shallow water, the two terrain rates of para 10(2) on the whole volume.",
  "0.119792 onshore and 0.142708 in shallow water.",
  "0.064583 in both terrains."],
 "Above 10,000 bopd the barrels past the edge pay the terrain rate, so the weighted rate climbs toward 15 percent onshore and 12.5 percent in shallow water without reaching either: 0.142708 and 0.119792 at 120000 bopd. The flat terrain rates ignore the tranches, the reversed pair swaps the terrains, and 0.064583 is the deep offshore rate at that daily rate.")

q(0, "What royalty rate does r.13(1)(b) give deep offshore acreage producing 120000 bopd?",
 "0.064583: 5 percent on 50,000 bopd and 7.5 percent on the rest, divided by the total.",
 ["7.5 percent, the terrain rate, since most of the barrels lie above the 50,000 bopd tier.",
  "0.119792, the rate the shallow water scale returns at the same daily rate.",
  "0.054167, the rate at 60,000 bopd."],
 "Regulations r.13(1)(b) makes the deep offshore rate \"a weighted average rate of 5% of 50,000bopd plus 7.5% of the incremental daily production above 50,000bopd divided by the total production per day\": 0.064583 at 120000 bopd. The flat 7.5 percent ignores the first tier, 0.119792 is shallow water and 0.054167 is the rate at 60,000 bopd.")

q(3, "What does the engine return just below the second edge, at 9999 bopd onshore?",
 "0.062499.",
 ["0.062500, the rate at exactly 10,000 bopd, which holds for the whole band below it as well.",
  "0.058333, the rate at 7500 bopd, which holds from there up to the edge of the second tranche.",
  "0.075000, the second tranche's rate on every barrel."],
 "The rate is a weighted blend that rises barrel by barrel: 0.062499 at 9999 bopd and 0.062500 at exactly 10,000 bopd. It does not hold flat across a band, and 7.5 percent reaches only the barrels between 5,000 and 10,000 bopd while the first 5,000 pay 5 percent.")

q(2, "Which rates does the engine return for gas when 40 percent and when 60 percent of it is used in-country?",
 "0.040000 at 40 percent and 0.035000 at 60 percent.",
 ["0.035000 at 40 percent and 0.040000 at 60 percent, since more gas used in-country raises the rate.",
  "0.025000 at both shares, since any in-country use earns the lower rate on all the gas.",
  "0.050000 at both shares."],
 "Each point of in-country share moves the blend from 5 toward 2.5 percent, so a larger share gives a smaller rate: the engine returns 0.040000 at 40 and 0.035000 at 60. Reversing them gets the direction wrong, 0.025000 is reached only when all the gas stays in Nigeria, and 0.050000 is the rate with none of it used in-country.")

q(1, "Gas sold abroad: what production royalty rate does Regulations r.16(5) set on it?",
 "It pays production royalty at 5% of the chargeable volumes.",
 ["It pays 2.5%, the rate that para 10(6) gives to gas, wherever the gas is finally used.",
  "It pays the terrain rate of the field it comes from, as the liquids do under para 10(2).",
  "It pays no royalty, as exported gas is outside the Act."],
 "The text reads: \"(5) The royalty based on production of natural gas for export shall be at a rate of 5% of the chargeable volumes\". The 2.5% rate is only for gas produced and utilised in-country, gas pays no terrain rate, and exported gas is charged.")

q(3, "Which figure does Alpha's 2029 row carry in the liquids royalty rate column, at 5669.846575 bopd?",
 "0.052954.",
 ["0.050000, since the field is within a few hundred barrels of the first edge and rounds down to it.",
  "0.062500, the rate at the upper edge of the small-field band that Alpha sits in.",
  "0.055546, the rate of 2028, held until the field drops below 5,000 bopd."],
 "In 2029 Alpha is still above 5,000 bopd, so its weighted rate blends in a little of the 7.5 percent tranche: 0.052954. The engine does not round a daily rate to an edge, 0.062500 applies only at 10,000 bopd, and each year reads its own daily rate, so 2028's 0.055546 does not carry over.")

q(0, "What does the engine do with a daily rate of -1 handed to deriveOilRoyaltyRate?",
 "It refuses: the crude oil and condensate daily rate must be a finite number of 0 or more; got -1.",
 ["It returns 0.050000, the first tranche rate, as it does for every daily rate at or below 5,000 bopd.",
  "It returns a negative royalty rate.",
  "It clamps the rate to 0 bopd and adds a note."],
 "The refusal reads, in the engine's own words: The crude oil and condensate daily rate must be a finite number of 0 or more; got -1. A refusal returns no rate at all. The engine does not read a negative daily rate as a small one, does not return a negative rate and does not clamp a bad input behind a note.")

# ---- m04 royalty by price
q(1, "Which levels does the Regulations reading hold for 2020, a year before its base year?",
 "50.000000, 100.000000 and 150.000000, the base levels, held until the base year.",
 ["Levels deflated backwards by 2 percent a year from the 2021 base.",
  "51.000000, 102.000000 and 153.000000, the first escalation.",
  "No benchmarks: 2020 is outside the Regulations."],
 "Before its base year each base keeps 50, 100 and 150, so the Regulations base returns 50.000000, 100.000000 and 150.000000 for 2020 as for 2021. Neither text deflates backwards, 51.000000, 102.000000 and 153.000000 are the Regulations' 2022 levels (and the Act's 2021), and the engine returns benchmarks for any year.")

q(3, "At 170 USD/bbl in 2025, what royalty by price rate does each base return?",
 "0.100000 on each.",
 ["0.100000 on the Regulations base and 0.097057 on the Act base, whose high benchmark is higher.",
  "More than 10 percent on the Regulations base, as the line keeps rising past the high benchmark.",
  "0.050000 on each, the middle benchmark rate."],
 "At or above the high benchmark of both bases the rate is 10 percent: 170 is above 162.360000 and 165.610000, so both bases return 0.100000. 0.097057 is the Act base at 162.360000, where the Act's own high benchmark is not yet reached; the rate does not rise past 10 percent; and 5 percent sits at the middle benchmark.")

q(0, "Price 120, year 2025: set the two base-year readings side by side. What do they return?",
 "0.060865 with the Regulations, 0.058694 with the Act.",
 ["0.058694 with the Regulations base and 0.060865 with the Act base, since the Act's benchmarks are higher.",
  "0.060865 on both, since the two readings agree above the middle benchmark of each base.",
  "0.100000 on both bases."],
 "The engine returns 0.060865 on the Regulations base and 0.058694 on the Act base: the Act's higher benchmarks put 120 lower on its scale, so the Act base charges less. The readings differ between the benchmarks, and 120 is below both high benchmarks of 2025.")

q(1, "What total royalty, production royalty and royalty by price together, does the 95 and 88 USD/bbl case return under each base-year reading?",
 "69663505.866593 USD under the Regulations and 68707857.789855 USD under the Act.",
 ["69663505.866593 USD on either base, since only the royalty by price depends on the base and it is the same.",
  "20694235.033259 USD on the Regulations base, the total royalty of the year.",
  "68707857.789855 USD on the Regulations base, and 69663505.866593 USD on the Act base."],
 "The engine returns a total royalty of 69663505.866593 USD on the Regulations base and 68707857.789855 USD on the Act base. The production royalty is the same on both, but the royalty by price differs, so the totals differ; 20694235.033259 USD is the Regulations base royalty by price alone; and the reversed pair swaps the bases.")

q(3, "Regulations r.15(2) names a price as the basis of the royalty by price. Which price, and what stands in for it in the engine?",
 "The fiscal oil price; the engine uses the realised price and says so in a note.",
 ["The daily rate of crude oil and condensate, which the engine reads as the year over its calendar days.",
  "The Commission's fiscal oil price, which the case states and the engine reads for every year.",
  "Last year's average price."],
 "r.15(2) reads: \"(2) The royalty by price shall be based on the fiscal oil price for crude oil\". The fiscal oil price the Commission sets is concept-only: the realised prices stand in for it, and the engine's note says so. The royalty by price reads price alone, the case carries no fiscal price, and nothing is carried from the previous year.")

q(0, "From when does each text escalate the royalty by price levels?",
 "The Act from the beginning of 2021; the Regulations from 1 January 2022.",
 ["Both from 1 January 2021, since the Regulations adopt the Act's own escalation date unchanged.",
  "Both from 1 January 2026, the first year of the Nigeria Tax Act 2025.",
  "The Regulations from 2021 and the Act from 2022."],
 "The Act raises the levels \"at the beginning of 2021 and of each succeeding calendar year\", and the Regulations' Schedule escalates \"commencing 1st January 2022\". That one-year gap is the open reading of the base year. The Nigeria Tax Act 2025 restates the Act's wording and moves no date, and reversing the two dates reverses the texts.")

# ---- m05 the instruments stacked
q(1, "Ekene Alpha's 2027 HCDT is 720000.000000 USD. What produced it?",
 "3 percent of 2026's opex of 24000000 USD.",
 ["3 percent of the year's own opex and capex, the total annual budget that also sets the NDDC levy.",
  "A fixed contribution the case states for every year after the first one.",
  "3 percent of the 2027 revenue from crude oil and condensate."],
 "From its second year the engine reads the ledger's own previous opex for HCDT. Alpha spent 24000000 USD of opex in 2026, and 3 percent of it is 720000.000000 USD in 2027, as PIA s.240(2) sets. The budget of opex plus capex belongs to the NDDC levy, Alpha states no fixed contribution, and no revenue enters the HCDT base.")

q(3, "Which of Alpha's 2027 rows set its 1620000.000000 USD NDDC charge on the default base?",
 "Opex of 24000000 and capex of 30000000 USD.",
 ["The 2026 opex of 24000000 USD alone, the preceding year's cost, which is the base HCDT reads as well.",
  "The year's gross revenue from crude oil, condensate and associated gas, at 3 percent of the total.",
  "Capex of 30000000 USD alone."],
 "The default NDDC base is the total annual budget, the year's opex plus capex (from a secondary source): 3 percent of 24000000 plus 30000000 USD gives 1620000.000000 USD. Preceding-year opex is the HCDT base, revenue is no part of the levy, and capex alone leaves out the opex the budget counts.")

q(0, "What does PIA s.257(1) say about the settlor's annual host communities trust payment?",
 "It is deductible for the hydrocarbon tax and companies income tax as applicable.",
 ["It is deductible for companies income tax only, and is added back in the hydrocarbon tax base.",
  "It is paid out of the royalty and so is never deducted.",
  "It replaces the NDDC levy in years under the Act."],
 "The text reads that the payment \"shall be deductible for the purposes of hydrocarbon tax and companies\" income tax. It is deductible in both bases (in the hydrocarbon tax at the crude-plus-condensate share), it is a contribution separate from royalty, and the NDDC levy is charged beside it under its own Act.")

q(2, "Which contributions does PIA s.263(1)(h) let a company deduct for hydrocarbon tax?",
 "Amounts paid to host communities trusts, the Environmental Remediation Fund, the NDDC and similar approved funds.",
 ["Tertiary education tax and companies income tax.",
  "Royalties on crude oil and associated gas alone.",
  "The development levy under NTA s.59."],
 "Section 263(1)(h) covers \"any amount contributed to any fund, scheme or arrangement approved by the Commission pursuant to the establishment of host communities development trusts under Chapter 3 of this Act, Environmental Remediation Fund, Niger Delta Development Commission and other similar contributions.\" The profit taxes are barred by s.264(l), royalties are deductible under a different paragraph, s.263(1)(b), and the development levy is never charged on hydrocarbon tax profits.")

q(1, "The gas field ekene_nag_gas_in_country_half returns a 2026 hydrocarbon tax of 0.000000 and companies income tax of 10713000.000000 USD. Why?",
 "It sells no crude oil or condensate, the only products that tax charges, while income tax reads gas profit.",
 ["Half its gas is used in-country, and the in-country share exempts a field from the hydrocarbon tax entirely.",
  "Shallow water gas fields sit outside the hydrocarbon tax in every framework by PIA s.260(3).",
  "Its gas royalty is deducted in full, so no profit is left."],
 "The hydrocarbon tax charges crude oil and condensate only, so a field with none pays no hydrocarbon tax, while companies income tax is charged on the whole oil and gas profit, 10713000.000000 USD in 2026. The in-country share moves only the gas royalty, s.260(3) concerns frontier and deep offshore, and the field still shows a companies income tax profit.")

q(3, "The worked example states an NDDC sum of 15000000 USD. What does the engine do with it?",
 "Uses it in place of the percentage.",
 ["Adds it to 3 percent of the total annual budget, and charges the two together as the year's NDDC levy.",
  "Ignores it, since the levy is always 3 percent of the total annual budget under the NDDC Act.",
  "Uses it as the prior-year opex for HCDT."],
 "A fixed sum in pia_nddc_levy_fixed_usd replaces the percentage when given, so the worked example's NDDC line is 15000000.000000 USD. Nothing is added on top, the engine applies the stated sum, and HCDT reads the separately stated prior-year opex of 170000000 USD.")

q(0, "On the Regulations base, which seven lines add up to Ekene Alpha's government cash flow of 556475163.954050 USD?",
 "Royalties, hydrocarbon tax, income tax, education tax, development levy, HCDT and NDDC.",
 ["Royalties, hydrocarbon tax, income tax, capex, opex, HCDT and NDDC.",
  "The three royalty lines and the four taxes, with HCDT left out.",
  "Hydrocarbon tax alone, over the life."],
 "The decomposition sums total royalties, the hydrocarbon tax, companies income tax, the tertiary education tax (0 on Alpha), the development levy, HCDT and the NDDC levy to 556475163.954050 USD. Capex and opex are the project's own costs; HCDT and the NDDC levy sit on the government side of the take; and the hydrocarbon tax is one line of seven.")

q(2, "On the Regulations base, which development levy does Ekene Alpha pay over its life at a 50 percent working interest?",
 "17857108.685849 USD, half the 100 percent figure.",
 ["35714217.371697 USD, as the levy is charged at field level before any working interest share.",
  "A quarter of the 100 percent figure, since the levy halves twice.",
  "The same share of profit at a lower rate."],
 "Every money line is scaled to the working interest share after the field-level arithmetic, so at 50 percent the development levy is 17857108.685849 USD against 35714217.371697 USD at 100 percent. The engine reports money at the share, it halves once, and the 4 percent rate is unchanged.")

q(1, "What does the shared wording call government cash flow over revenue less opex, with capex added back?",
 "The government share of net revenue, a second metric.",
 ["Government take, the engine's kpis.government_take_pct, read undiscounted over the life of the lease.",
  "The effective royalty rate of the lease.",
  "The pre-take net cash flow of the project."],
 "fiscalConventions.js defines \"Government share of net revenue\" as \"Government cash flow divided by revenue less opex over the project life, so capex is added back to the contractor side.\" Government take divides by revenue less opex less capex; royalty is only one part of government cash flow; and the pre-take net cash flow is the take's denominator.")

q(3, "The government take is undiscounted and nominal. What follows for a dollar of tax paid in 2032 against one paid in 2026?",
 "Both count the same.",
 ["The 2032 dollar counts for less, discounted at the case's 10 percent nominal rate to the base year.",
  "The 2032 dollar counts for more, escalated by 2 percent a year as the benchmarks are.",
  "Only the first year is read, so the 2032 dollar is left out of the take."],
 "The engine's take sums the whole life undiscounted and nominal, so a dollar in 2032 counts the same as a dollar in 2026. The 10 percent discount rate serves NPV, the 2 percent escalation belongs to the royalty by price benchmarks, and the take reads every year of the ledger.")

# ---- m06 the Associate reading and the vocabulary
q(0, "Which three questions does this course call open readings?",
 "The royalty by price base year, the new-lease rate onshore or in shallow water, and the deep offshore rate under the NTA.",
 ["The terrain of a field in two terrains, the fiscal oil price and the terms of leases that do not convert.",
  "The NDDC levy base, the tertiary education tax before 2023 and the Act's effective date.",
  "The daily rate reading, the shared costs and the take."],
 "The three open readings are the questions the texts leave open: the royalty by price base year, the hydrocarbon tax rate of a new lease onshore or in shallow water, and the deep offshore hydrocarbon tax under the Nigeria Tax Act 2025. The first distractor lists concept-only provisions, the second lists values from secondary sources and a date, and the third lists the engine's stated notes and a metric.")

q(2, "What does the course mean when it calls an input a stated reading?",
 "The answer to an open reading that a run states as an input.",
 ["The reading of a text the course judges to be the law after comparing the Act with the Regulations.",
  "Any figure the engine prints in kpis.pia_notes below the table of a run.",
  "The Regulations' reading of any provision."],
 "The vocabulary defines a stated reading as the answer to an open reading that a run states as an input, and it is never presented as the law. A note in kpis.pia_notes is the engine's statement about a default, a conflict or an approximation, and the Regulations' base year is only one of two readings of one question.")

q(1, "When this course says royalty with no qualifier, what does it mean?",
 "The production royalty on liquids and gas plus the royalty by price, the engine's total royalty.",
 ["Any payment a lease makes to the state, taxes and contributions included, over its life.",
  "The production royalty on crude oil and condensate alone, leaving out gas and price.",
  "The royalty by price, the Act's newest royalty."],
 "The vocabulary fixes royalty as the production royalty on liquids and gas plus the royalty by price, the engine's total royalty, and asks a writer to name the part when only one is meant. Taxes and contributions are separate lines, and the gas royalty and royalty by price are both inside royalty.")

q(3, "Why can a partner's working interest share never move the tranche a field falls into?",
 "Rates are read at field level first.",
 ["The share is applied to the daily rate before the tranches are read, so every partner's rate is the same.",
  "The tranches read the price, which the working interest share does not scale in any year.",
  "Regulations set one tranche for every partner by law."],
 "The engine reads the tranches, the caps and every rate at field level, then scales every money line to the share, so the daily rate and its rate are the field's whatever the share. Applying the share to the daily rate first would move the tranche, the tranches read volume, and no text assigns tranches to partners.")

q(0, "What does the engine say when a case arrives with no production rows at all?",
 "No production data found. Upload and process a CSV first.",
 ["It returns a ledger of zeros with a note in kpis.pia_notes saying that no production was stated.",
  "A run on the golden rows of Ekene Alpha.",
  "It refuses with a note naming the missing terrain."],
 "computeCashFlow refuses a case with no production rows, in its own words: No production data found. Upload and process a CSV first. A refusal returns no ledger and no note, the engine never substitutes another case's rows, and the message concerns the rows, whatever the terrain.")

q(2, "Para 10(3) gives deep offshore production of not more than 50,000 bopd a month 5%. What does the engine return at exactly that edge?",
 "0.050000, since the edge belongs to the 5 percent tier.",
 ["0.054167, since the 50,000th barrel falls in the 7.5 percent tier above the edge.",
  "7.5 percent, the deep offshore terrain rate of para 10(2), charged on every barrel.",
  "0.112500, the rate of a field at that daily rate."],
 "Para 10(3) reads: \"(3) For deep offshore fields with a production during a month of not more than 50,000 bopd, the royalty rate shall be 5%\". At exactly 50,000 bopd the engine returns 0.050000; 0.054167 is its rate at 60,000 bopd, the 7.5 percent reaches only barrels past 50,000, and 0.112500 is the shallow water rate at 50,000 bopd.")

emit(Q, '/root/cat-wip-pia/banks/ec7b_exam.json', expect_n=42)
finish()
