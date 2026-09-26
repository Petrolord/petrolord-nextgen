# Marginal fields

{{panel:pia-ledger-calculator}}

Marginal fields reached the Act with farm-out agreements and royalty terms of their own already in place, as the wording of s.94(1) shows. The Petroleum Industry Act 2021 gives the producing ones a path into the Act and closes the category behind them. This lesson reads that path and shows how little of it the engine needs to carry.

## Two sentences of the Act

PIA s.94(1) lets a producing marginal field "operate under the original royalty rates and farm out agreements, but shall convert to a petroleum mining lease under this Act, with terms applicable under sections 267 (b), 302, and other provisions under the Act within 18 months from the effective date." The deadline matches the 18 months of s.92(4), and the fiscal terms point at s.267(b), the 15 percent class.

PIA s.94(9) closes the category: "(9) No new marginal fields shall be declared under this Act." A marginal field in this course is therefore always one that was producing before the Act and converted under s.94(1).

## A marginal field sits in a terrain

The Act's royalty table names marginal fields inside the onshore and shallow water tranches. Seventh Schedule para 10(4) opens: "(4) Royalties for onshore fields and shallow water fields, including marginal fields, with crude oil and condensate production not more than 10,000 bopd during a month shall be at a rate per centum of the chargeable volume". The engine holds to that reading:

> pia_terrain "marginal_field" is not a terrain under the Petroleum Industry Act 2021: a marginal field is onshore or in shallow water (PIA Seventh Schedule para 10(4); Petroleum Royalty Regulations 2022 r.13(2)). Set pia_terrain to "onshore" or "shallow_water", and set pia_marginal_field_pre_2021 to true for a producing marginal field converted under PIA s.94(1).

## The flag and what it moves

The stated flag `pia_marginal_field_pre_2021` puts an onshore or shallow water lease in the 15 percent class of s.267(b). The royalty follows the terrain. On ekene_marginal_shallow_flag (synthetic, shallow water, 2026):

| line | engine value |
| --- | --- |
| daily rate, bopd | 20000.000000 |
| liquids royalty rate | 0.093750 |
| hydrocarbon tax rate | 0.150000 |

The royalty rate is the shallow water tranche rate at 20,000 bopd, the same figure any shallow water field at that rate pays.

## What stays concept

S.94(1) speaks of "the original royalty rates and farm out agreements". The engine models neither. It applies the Act's tranches, which para 10(4) extends to marginal fields by name, and the original rates of s.94(1) stay concept-only. Reading the two provisions side by side is part of reading the Act critically: one keeps the old royalty for a producing marginal field, the other names marginal fields inside the new tranche table. The course states both, computes the second and grades neither against the other.

## Exercise

Open the ledger calculator on "The whole ledger, year by year" and load ekene_marginal_shallow_flag. Read the hydrocarbon tax for 2026. Switch to "Which provision moved", load the same case and enter {"pia_marginal_field_pre_2021": false} as the change. Before you run it, predict the ratio of the changed hydrocarbon tax to the base from the two classes of s.267, then check it against the base and changed columns. Explain why the royalty row stays at zero. Finally set pia_terrain to "marginal_field" in the case and read the refusal.
