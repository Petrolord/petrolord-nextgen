# What this engine models

The Petroleum Economics Studio engine, version 3.9.0, turns three uploaded files and a configuration into a yearly ledger and a handful of headline readings. Knowing its edges is most of knowing how to use it.

## The inputs

Three files: production, capex and opex. Production rows carry volumes of oil in bbl, gas in Mscf and condensate in bbl, per well or bare, against a year, a date or a month index. Capex and opex rows carry a cost in USD against the same kinds of date. The configuration carries prices, escalators, inflation and the fiscal terms. The engine reads nothing else. If the volumes are wrong the ledger is wrong, and the engine has no way to know.

## The functions

Every table the course quotes is a return value of computeCashFlow, computeBreakevenOilPrice, npv, irr, paybackYears, the PIA rate derivations or the price resolver; computeCashFlow builds the ledger and the others read it. Money is USD to two decimals, volumes are bbl and Mscf, barrels of oil equivalent use 6 Mscf per barrel, and rates are percent unless a column says otherwise.

## The regimes

The fiscal_regime setting picks one of three cascades from gross revenue to net cash flow. JV is royalty, then deductions, then a single tax rate: the hand-derived case pays royalty 20000000.00 and tax 32500000.00 out of revenue 100000000.00 in 2030. PSC recovers cost from a capped share of revenue and splits what is left: psc_carryforward reports total tax 27000000.00 on revenue 200000000.00 and total net cash flow -1000000.00. PIA is five taxes on three bases: the published worked example pays total tax 604809283.90 on revenue 1460000000.00.

Every regime reports the same KPI set: NPV, IRR, payback, discounted payback, DPI, take and discounted take. This tier reads the ledger without the readings that put a value on time.

## The conventions it carries

The ledger carries a net_cash_flow and a real_net_cash_flow column, and their totals part once inflation is set: multiyear_pia_nominal and multiyear_pia_real are one field with one set of rows and report total net cash flow 329879515.51 and 286158487.25. Neither is wrong; one is money of the day and the other money of the base year, and a number without its basis is not a number.

## What it does not model

No reservoir, no facilities capacity, no decline: volumes come in and are believed. No months in the output. No zero on a bad upload: eight kinds of unreadable file are refused with a message rather than run as if the missing thing were zero. And no take or unit cost without a pre-take value to divide by: take is null whenever revenue less capex less opex is not positive, so zero_rates_capex_only, with total revenue 0.00, returns take null, unit technical cost null and payback beyond project life, and a field whose costs exceed its revenue returns take null with revenue on the books. Null is the engine declining to invent a ratio whose denominator is not positive.

## The mistake

The careful mistake is reading a total as a property of the field rather than of the run. Total revenue 857602518.80 for AKATA belongs to a price of 82 escalating at 2 percent on those volumes; change the escalator and the total moves while the field does not. Learn the settings that produced a number before you learn the number.

## Exercise

Name the three uploaded files and what each cannot lack. Then find a published case where take is null and say what was not positive.
