# Which quantity drives what

{{panel:fc-chemistry-explorer}}

One molecule, two quantities, and they are not the same number. Keeping track of which one feeds which calculation is among the most useful habits in this module, because the screen prints both and they sit next to each other.

The carbon dioxide fugacity drives the rate. Both terms of the rate correlation, the reaction term and the transport term, take the fugacity. The protective film factor takes the fugacity too, and so does the temperature at which that film factor leaves one. Nothing in the rate chain takes the carbon dioxide partial pressure directly.

The partial pressures drive the screening answers. The hydrogen sulphide comparison is a partial pressure against a threshold. The ratio that decides which corrosion product governs is one partial pressure over another. Neither of those two uses a fugacity at any point.

## The shipped case, read as three numbers

On the shipped case the carbon dioxide partial pressure is 1.530013 bar, the coefficient is 0.878581 and the fugacity is 1.344240 bar. The rate chain runs on the third of those. The hydrogen sulphide partial pressure of 0.051000 bar goes to the threshold comparison, and the ratio of the two partial pressures, which the engine reports as 0.033333333333, goes to the regime word, which here is mixed.

That ratio has a property worth learning early. Both of its arguments are the total pressure times a mole fraction, so the total pressure divides out and the ratio equals the ratio of the two mole fractions at any pressure at all. The shipped mole fractions are 0.030000 and 0.001000. Divide the second by the first and you have the reported ratio, with no pressure anywhere in the work.

## How far apart the two quantities get

The separation between them is a pressure effect, and the engine's own sweep shows it at a fixed composition. At a total pressure of 1.000000 bar the carbon dioxide partial pressure is 0.030000 bar and the fugacity is 0.029924 bar. At 50.000000 bar the partial pressure is 1.500000 bar and the fugacity is 1.321222 bar. At 200.000000 bar the partial pressure is 6.000000 bar and the fugacity is 3.611511 bar. Read the three rows downward and a low pressure habit of treating the two as interchangeable stops looking safe.

## Why a course cares about the distinction

A fugacity fed where a partial pressure belongs gives a plausible answer rather than an obvious one. A threshold comparison made against the wrong quantity shifts the verdict, so the engine keeps the two apart, labels which is which in its returned fields, and the panel beside this lesson puts them side by side.

The Fluid Properties course owns fugacity and partial pressure as thermodynamic quantities and teaches where a coefficient comes from. This course takes them as given and teaches the routing, which is what is specific here.

## Exercise

Open the panel and set a total pressure of 10.000000 bar, then 200.000000 bar, at the shipped composition. Record the carbon dioxide partial pressure and the fugacity at each, and record the hydrogen sulphide to carbon dioxide ratio at each. Say which of the three figures moves with pressure and which does not, then state in one sentence what that tells you about the arguments each is built from.
