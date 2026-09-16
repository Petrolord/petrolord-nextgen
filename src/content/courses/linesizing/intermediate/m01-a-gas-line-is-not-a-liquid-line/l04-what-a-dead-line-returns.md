# What a dead line returns

Asked for the rate on the SOKU trunk with 900.000000 psia at the outlet against 850.000000 psia at the inlet, the engine returns { error: "no flow: outlet pressure meets or exceeds inlet head" }. It does not return zero.

{{panel:fc-gasline-explorer}}

## Three states of the same trunk

| outlet psia | what comes back |
| --- | --- |
| 620.000000 | 66104956.1404 scfd |
| 845.000000 | 10466013.4729 scfd |
| 900.000000 | { error: "no flow: outlet pressure meets or exceeds inlet head" } |

The middle row is the interesting one. Five psi below the inlet is very nearly a dead line and it still has an answer, 10466013.4729 scfd, because the driving group is small rather than absent.

## Zero is an answer and this is not one

A rate of zero would be a claim: that the engine considered the line and found it carries nothing. The refusal is a different statement, that the question as asked has no answer in this method, because a form built on a driving group cannot be evaluated when the group has gone. Returning zero would put a number into a sizing sweep that reads like a working answer and would be indistinguishable from a line that is genuinely shut in.

## The refusal is returned rather than thrown

The refusal arrives as an ordinary returned object carrying an error string, so the caller checks a property on the result. Nothing has to be wrapped to catch it, and a studio that forgets to check does not crash. That last point cuts both ways and is the reason the check matters: an unchecked refusal flows onward as an object where a number was expected.

## What the message covers

The wording is "meets or exceeds", and it means what it says. An outlet standing exactly at the inlet is refused on the same terms as an outlet standing above it, because the group is zero in the first case and negative in the second, and neither is a state the form can be evaluated at. There is no tolerance band and no nearly-equal case that quietly returns a very small rate.

## No nearest sensible answer

The engine could have chosen something to return here. It could have clamped the outlet to the inlet, or handed back the smallest rate it can represent. It does neither, because there is no nearest sensible answer to a question whose premise is wrong, and supplying one would conceal the premise rather than correct it.

## The mistake

The mistake is reading the refusal as a zero and carrying it into a total. A shut line contributes nothing to a gathering system and a refused calculation contributes no information at all, and averaging the second into a report is how a number nobody computed reaches a decision.

The second mistake is inferring from a refusal that the line is too small. This message says nothing about the bore. It says the pressures as given do not describe flow from the inlet to the outlet.

## Exercise

Give the three readings of the SOKU trunk at outlets of 620.000000 psia, 845.000000 psia and 900.000000 psia. Say what distinguishes a returned rate of zero from the refusal, and state which of the two the engine gives when the outlet meets the inlet exactly.
