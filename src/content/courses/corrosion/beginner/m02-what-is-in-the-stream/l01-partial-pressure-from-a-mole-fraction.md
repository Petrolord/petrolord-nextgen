# Partial pressure from a mole fraction

{{panel:fc-chemistry-explorer}}

Everything this engine says about chemistry starts from two mole fractions and a total pressure. The partial pressure of a gas in the stream is the total pressure times the mole fraction of that gas, and that single line of arithmetic is the first step of every chain on the screen.

Work it on the shipped case. The total pressure reaching the engine is 51.000427 bar. Carbon dioxide is 0.030000 as a mole fraction, and the engine reports a carbon dioxide partial pressure of 1.530013 bar. Hydrogen sulphide is 0.001000 as a mole fraction, and the engine reports a hydrogen sulphide partial pressure of 0.051000 bar, which it also prints as 0.739699 psia. Nothing in those three figures involves a correlation constant, which is why the stream bookkeeping is the part of this engine a course can grade without leaning on a held number.

## Mole percent and mole fraction are one keystroke apart

The studio takes mole percent because that is how a gas analysis arrives. Carbon dioxide typed as 3 mol% is a mole fraction of 0.030000, and hydrogen sulphide typed as 0.1 mol% is 0.001000. The conversion is a division by a hundred and it is the commonest place to lose a factor of ten in this app. If a partial pressure looks a hundred times too large, check that box before you check anything else.

The engine guards the fraction rather than trusting it. A carbon dioxide mole fraction of 3, which is what a mole percent typed into a mole fraction box would look like, is refused in the engine's own words:

> the CO2 mole fraction must be between 0 and 1: 3 is outside it

A blank box is refused differently, because a blank is a question the engine cannot answer rather than a value it can reject:

> a finite CO2 mole fraction is required

## Why the bookkeeping deserves care

Two of the screen's most useful answers rest on partial pressures alone. The hydrogen sulphide screening comparison is a partial pressure against a threshold, and the ratio that decides which corrosion product governs is one partial pressure over another. Both are reached without a single correlation constant, so an error in either is an arithmetic error you can find by hand.

The range guard on a fraction covers the water cut as well as both gases. The engine also checks a pH between nought and fourteen, a temperature above absolute zero, and the two partial pressures together against the total pressure they are taken from. The published validity bands of the correlations themselves are held, so a screening well outside them still returns a number and says nothing about it.

## Exercise

Take the shipped total pressure of 51.000427 bar with the mole fractions of 0.030000 and 0.001000. Compute both partial pressures yourself and check them against the 1.530013 bar and 0.051000 bar the engine reports. Now suppose a mole percent of 3 reached the engine as a mole fraction of 3. Record the refusal this lesson quotes for that value, and write one sentence on what a screen that quietly accepted it would have printed for the partial pressure instead.
