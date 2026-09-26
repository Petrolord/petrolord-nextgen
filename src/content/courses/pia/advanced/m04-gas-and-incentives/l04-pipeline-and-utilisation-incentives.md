# Pipeline and utilisation incentives

{{panel:pia-ledger-calculator}}

Beyond the royalty discount for gas used at home and the greenfield credit, the texts carry a small set of provisions aimed at gas infrastructure and at the stability of the fiscal terms. None of them is computed by the engine except one narrow exemption. This lesson reads them, marks each as concept-only, and then runs the one the engine does carry.

## Tax-free periods for gas

PIA s.302(6) sends midstream and downstream gas companies, and large-scale gas utilisation, to an older incentive: they "shall be entitled to benefit from the incentives provided under section 39 of the Companies Income Tax Act, and investors in gas pipeline will be granted an additional tax-free period of five years at the expiration of the tax-free period".

The Nigeria Tax Act 2025 keeps the pipeline incentive in its own words. NTA s.80(1): gas pipeline investors "shall be granted a tax-free period of five years at the expiration of the economic" development incentive certificate. It also says where gas leaving the upstream is taxed, in s.80(2): "(2) Natural gas transferred or disposed from the upstream to the midstream or downstream shall be subject to tax under the relevant provisions of Chapter Two of this Act."

These are company-level reliefs with conditions and certificates the engine cannot see. They are concept-only.

## Stability of the terms

Investors in long-lived gas projects care about whether the terms will hold. PIA s.305 answers that stabilisation clauses in contracts signed after commencement "shall not be applicable to the fiscal provisions listed in this section, regardless of whether these changes affect the contractor favorably or unfavorably,". NTA s.88(1) restates the rule and adds a condition, that the changes are made "in a manner that is not discriminatory to the petroleum industry or the contractor." Its list in s.88(2)(a) names "generally applicable taxes, such as income tax, development levy, value added tax, stamp duties, and deduction of tax at source;".

Read against the switch of 2026, the point is concrete: the development levy that replaced the education tax sits on that list.

## The one gas relief the engine computes

The two thirds restriction on the companies income tax capital allowance applies in years under the Act alone, and a company in upstream or midstream gas operations is exempt from it. The engine carries that as a stated input, `pia_cit_company_gas_operations`. It can only matter in a year under the Act alone, because the restriction does not apply in a year under the Nigeria Tax Act 2025.

## Exercise

Open the ledger calculator on "Which provision moved" and load ekene_nag_gas_in_country_half. Enter {"pia_cit_company_gas_operations": true} as the change. Before you run it, predict the companies income tax difference from the framework of the case's years, then check. Load ekene_cpr_binding_forfeiture, whose 2024 and 2025 are years under the Act alone and whose restriction binds, and run the same change. Then set the flag to true in the case itself, open "The whole ledger, year by year" and explain which years' companies income tax moves, in which direction, and why the gas field showed no movement.
