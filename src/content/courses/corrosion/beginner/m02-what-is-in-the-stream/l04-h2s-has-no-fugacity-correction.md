# H2S has no fugacity correction here

{{panel:fc-chemistry-explorer}}

Carbon dioxide gets a fugacity coefficient in this engine. Hydrogen sulphide does not. No fugacity correction of any kind is applied to hydrogen sulphide, and the engine declares that in a field rather than leaving a reader to work it out from the absence of a number.

The field is straightforward to find on any screening. Beside the hydrogen sulphide partial pressure the engine returns a flag saying whether a fugacity correction has been applied, and on every case it ships that flag reads false. At the shipped defaults the hydrogen sulphide partial pressure is 0.051000 bar, printed as 0.739699 psia, and it is the total pressure times the mole fraction with nothing else done to it.

## Why the asymmetry is declared rather than hidden

An engineer who has just read the carbon dioxide chain will reasonably expect the same treatment on the second gas. Two behaviours could follow from an undeclared absence. A reader might assume a correction is applied and quietly treat the printed number as a fugacity, or a caller might look for a coefficient field, find none, and supply one. Publishing the flag closes both doors. It also tells you exactly what the screening comparison is made on, which is a partial pressure.

The same convention carries through to the ratio that decides which corrosion product governs. Both of its arguments are partial pressures, neither is corrected, and the ratio is therefore free of any coefficient. At the shipped defaults it is 0.033333333333, the regime word is mixed, and the rate the engine reports is marked as an upper bound in that regime.

## What this does and does not let you say

You may say that this module compares an uncorrected hydrogen sulphide partial pressure against its screening threshold of 0.003500000000 bar, and that the comparison at the shipped defaults puts the stream 1.163506 decades above it. You may say the threshold value carries no source in this repository, because the engine says so in a field of its own.

You may not say that a corrected hydrogen sulphide pressure would land somewhere else, because this module computes no such quantity and nothing in it estimates one. Whether a correction belongs there is a question for the literature and for the Fluid Properties course, which owns fugacity as a thermodynamic quantity. Here the honest statement is the narrow one: the comparison is made on the partial pressure, the engine says so, and the threshold it is compared against is held.

## Exercise

Run the shipped case and write down the hydrogen sulphide partial pressure in both units, 0.051000 bar and 0.739699 psia, together with the flag the engine returns for the fugacity correction. Then set the total pressure to 200.000000 bar, leaving the composition alone, and record the carbon dioxide coefficient of 0.601919 alongside the hydrogen sulphide flag. Say in one sentence which of the two gases changes its treatment as the pressure rises, and what that means for the threshold comparison.
