# Missing stays missing

{{panel:supply-tank-explorer}}

## The engine fact this tier owns

A missing value stays missing. No dip, no table entry, no coefficient and no opening stock is ever read as a zero, and each absence is answered in the engine's own words. This lesson reads the answers the tank calls give when one measured input is left blank, null or absent.

| call | what is missing | the engine answers |
| --- | --- | --- |
| volumeAtDip | the strapping table | REFUSED: No strapping table for this tank. |
| volumeAtDip | the dip (null) | REFUSED: No dip reading. |
| volumeAtDip | the dip (blank) | REFUSED: No dip reading. |
| dipToStandardVolume | the VCF | gross 3461.489 m3, standard none; note: No volume correction factor supplied, so only the gross observed volume is reported. |
| volumeCorrectionFactor | the density | REFUSED: Density at 15 C and observed temperature are both needed. |
| reconcileStock | the opening stock | REFUSED: No opening stock, so the day cannot be closed. The opening stock is yesterday's closing dip. |
| reconcileStock | the closing dip | expected closing 4508.100 m3, unaccounted none; note: No closing dip, so the day cannot be closed. |

## Three shapes of answer

Read down the last column and you find three shapes.

The first is a refusal. The call returns no figure at all, only a sentence. volumeAtDip with no table has nothing to interpolate between, so any volume it printed would be invented. reconcileStock with no opening stock has no starting point for the day, so its sentence tells you where the figure should come from: yesterday's closing dip.

The second is a partial answer with a named gap. dipToStandardVolume without a VCF still has everything it needs for the gross observed volume, so it reports gross 3461.489 m3 and gives the standard volume as none, with a note saying why. reconcileStock without a closing dip can still form the expected closing stock, 4508.100 m3, because that side of the ledger needs only the opening stock and the day's movements. It cannot form the unaccounted figure, so that reads none.

The third shape belongs to the price module and appears in the Expert tier. A cost or price build-up with rates left out is labelled incomplete and counts the missing rates, so a partial total is never read as a finished one.

## Why a zero would be worse

Every blank in that table has an easy zero waiting to fill it. A blank dip read as 0 mm is an empty tank. A blank opening stock read as 0 m3 turns a whole tank of yesterday's product into an apparent gain. A blank VCF read as 0 wipes the stock out entirely, and a blank closing dip read as 0 m3 reports the day's whole expected stock as lost. Each of those zeros produces a clean looking figure, and each figure is wrong with nothing on its face to say so. None reads as none because the honest statement about an unmeasured quantity is that nobody measured it.

The same rule reaches past the tank. The throughput economics call, met in the Professional tier, reports its emissions as none when no emission factor is supplied, and its note says an invented factor would be worse than none.

Try it in the panel. Clear the opening stock in the day box and read what replaces the unaccounted figure. Then clear the closing stock instead.

## Exercise

Take the two reconcileStock rows in the table. One refuses; the other prints an expected closing of 4508.100 m3 and an unaccounted figure of none. Say which input each call lacked and why one of them can still print a figure.

Self check: without the opening stock there is no starting point, so nothing can be formed and the call refuses. Without the closing dip, the expected closing is still opening plus receipts less deliveries and known losses, so 4508.100 m3 prints. The unaccounted figure needs the dip, so it reads none.
