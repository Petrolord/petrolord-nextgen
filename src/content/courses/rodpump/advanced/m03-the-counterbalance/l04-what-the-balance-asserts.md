# What the balance asserts

Omit the balance and `torqueGroup` comes back 0.000000000 where the real value is 0.261911618. One field away, `torquePct` comes back null.

{{panel:pd-balance-explorer}}

## The call you cannot make once

`balanceUnit` needs the surface card, and the card comes out of `predictCard`, which `runRodPumpDesign` calls internally. So no single call returns a balanced design: the card has to be solved on its own, balanced, and then the design run, which solves the same card a second time from the same inputs. That is why the natural first call is the one with the balance left out.

## What the two fields do when it is left out

| Field | Balance passed | Balance omitted |
| --- | --- | --- |
| `groups.torqueGroup` | 0.261911618 | 0.000000000 |
| `rating.torquePct` | 140.630030060 percent | null |

Zero is a meaningful point on the RP 11L torque chart, the no load axis, so a missing balance reads as a weightless gearbox rather than as an unanswered question. `torquePct` in the same return says null. The module already knows how to say not computed, and does say it, one field away. That is what makes the zero indefensible rather than merely unfortunate, and the fix costs no arithmetic.

## Nothing else moves

Everything outside those two fields is identical with and without the balance: plunger stroke equal, peak polished rod load equal, worst section loading equal. A reader comparing two runs sees one number change from 0.261911618 to zero and no other sign that anything was dropped.

The shipped run on ODUMA-4 makes the point. It returns ok true, zero errors and no warnings, with a `torqueGroup` of 0.000000000 listed beside an `Fo` over `Skr` of 0.145616883 and an `Sp` over `S` of 0.923505123, which are real.

## What the balance actually asserts

That the two peaks are equal, 450016.096192 in-lb each, differing by 0.0000e+0 in-lb. That the card they were taken from is the decimated one. Nothing else. It does not assert that a crew has hung that weight, that the unit is balanced today, or that the moment is achievable on the crank.

## What it refuses

The design refuses to distinguish a torque group of zero from a torque group it could not compute. Two fields in one object disagree about whether an answer exists, and only one of them says so.

## Exercise

Run ODUMA-4 with the balance passed and with it omitted, and record `torqueGroup` and `torquePct` for both.

Then say which of the two fields a caller can safely trust, and what a report built on the other one would claim about the gearbox.
