# A missing density is a missing answer

The gallon figures are built from the liquid densities, and the heating value is built from the component heating values. This lesson reads what characteriseGas returns when one of those figures is left blank.

{{panel:gasvalue-flare-explorer}}

## Two probes on EGBEMA

The engine was asked about EGBEMA's analysis twice more: once with propane's liquid density left blank, and once with n-butane's heating value left blank.

| probe | gpmC2Plus | gpmC3Plus | richness | missingLiquidDensity | ghvBtuScf | ghvNote |
| --- | --- | --- | --- | --- | --- | --- |
| EGBEMA as typed | 5.9942 | 3.2205 | rich | none | 1248.4110 | none |
| propane density blank | null | null | null | C3 | 1248.4110 | none |
| n-butane heating value blank | 5.9942 | 3.2205 | rich | none | null | A heating value missing on any component leaves the mixture value missing too. No partial average is reported. |

## A blank density

With propane's liquid density blank, gpmC2Plus is null, gpmC3Plus is null and the richness word is null. The engine names the component: missingLiquidDensity C3.

Propane is in both cuts, so both gallon figures are missing, and the richness word, read off gpmC3Plus, is missing with them. The heating value reads 1248.4110 Btu/scf, as in the typed row.

## A blank heating value

With n-butane's heating value blank, ghvBtuScf is null. The gallon figures read 5.9942 and 3.2205 and the richness word reads rich, as in the typed row.

The engine attaches a note to the missing heating value, ghvNote, and it reads: "A heating value missing on any component leaves the mixture value missing too. No partial average is reported."

## Missing means missing

The course states the rule for both probes in one line: a blank density leaves the liquids content and the richness word missing (null); a blank heating value leaves the mixture's heating value missing. Neither is a partial sum.

Read the rule against the two sums it covers. The heating value is a mole-weighted sum over the normalised analysis, and with n-butane's figure blank the engine returns null for it. The gallon figures are summed over the recoverable components, and with propane's density blank the engine returns null for both cuts. In each case the figure is missing, and the engine reports it as missing.

## Missing is not refused

These probes are not refusals. characteriseGas still answers, and it reports every figure it can form. The missing figure is null, and for the density the engine names the component whose value is blank.

That sets these probes apart from the refusals in module two. A negative mole fraction, a blank mole fraction and a sheet of zeros are refused, and nothing is returned. A blank density or a blank heating value leaves the rest of the answer in place and marks the one figure that cannot be formed.

## Trying it in the explorer

The flare explorer shows a missing figure as its own state. Load EGBEMA, blank propane's liquid density and read what the liquids and the richness word show. Then restore it, blank n-butane's heating value, and read the heating value.

## Exercise

Read the three rows of the probe table. Say which figures go null when propane's density is blank, which go null when n-butane's heating value is blank, what the engine names in missingLiquidDensity, and what the course says neither missing figure is.

Self check: with propane's density blank, gpmC2Plus, gpmC3Plus and the richness word are null, the heating value stays 1248.4110, and missingLiquidDensity reads C3. With n-butane's heating value blank, ghvBtuScf is null and the liquids stay 5.9942 and 3.2205. Neither is a partial sum.
