# The heating value basis

A gigajoule of fuel is stated on a heating value basis, lower or higher. The saving, the fuel price and the emission factor in a priced saving are all per gigajoule, so all three carry a basis. The lab prints what the engine does with the basis on the invented AGBOR saving.

{{panel:carbon-abatement-explorer}}

## The Agbor saving declares one basis

The saving is 11800 GJ a year, the fuel is priced at 7.5 USD a GJ and the SYNTHETIC factor is 56.1 kg CO2e per GJ, every figure invented for this course. The lab shows all three quantities are declared on LHV, and the engine returns basis LHV beside annualValue 88500.00 USD and annualTonnesCo2e 661.980.

## A mismatch is refused

With the saving on LHV and the factor on HHV, the call is refused:

REFUSED: The energy saving is on LHV, the emission factor is on HHV. A gigajoule on one heating value basis is a different amount of fuel on the other, so they cannot be multiplied together.

The refusal gives its reason in its second sentence: a gigajoule on one basis is a different amount of fuel on the other, so the engine does not multiply a saving on one basis by a factor on the other. Module six lists the rule in force: a saving, its price and its factor declared on different heating value bases are refused.

## No basis declared

When no basis is declared at all, the engine computes and attaches a note. The basisNote, verbatim: "No heating value basis declared. The saving, the fuel price and the emission factor must all be on the same one (IPCC default factors are on net calorific value, which is LHV)."

So a call with no basis is not refused. It is marked. The note names the three quantities that must share a basis. The parenthesis is part of the engine's note and is quoted here as the engine's words. This course names no published factor: the factor in the lab is synthetic.

## The same heater on two bases

The Professional tier read what a basis does to one heater. That tier printed the Isiokpo heater at the same stack oxygen at 86.4029 percent on LHV and 77.9288 percent on HHV, a difference of 8.4741 percentage points that the course computes from the engine's figures. The engine's warning on that result: "This efficiency is on LHV. An efficiency on the other basis is a different number for the same heater and the two must not be compared." A priced saving carries the same rule into money and carbon.

## What to check on a saving

Read the basis beside every saving, every fuel price and every emission factor before multiplying one by another. The engine refuses a declared mismatch, and it attaches the basisNote when nothing is declared. In practice the basis is read off the document the figure came from: a fuel price, a factor and a metered saving can each come from a different source.

## Exercise

Read the basis the Agbor saving returns, the refusal for a saving on LHV with a factor on HHV, and the basisNote for a call with no basis. Say what the three responses, read together, show about when the engine refuses, when it computes with a note, and when it computes cleanly.
