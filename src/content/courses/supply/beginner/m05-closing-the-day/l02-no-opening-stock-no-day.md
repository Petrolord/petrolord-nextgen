# No opening stock, no day

{{panel:supply-tank-explorer}}

## The refusal

Call reconcileStock on the AKODO day with every input in place except the opening stock, and the engine refuses:

REFUSED: No opening stock, so the day cannot be closed. The opening stock is yesterday's closing dip.

The first sentence is the verdict. Without a starting point the ledger has nothing to add receipts to, so there is no expected closing and no gap. The second sentence is the instruction. It names where the missing figure comes from: yesterday's closing dip, the standard total that closed the previous day.

## Why the engine does not start from zero

A blank opening stock could be read as 0 m3, and the engine does not read it that way. On the AKODO day the opening stock it needs is 4953.700 m3, and with that figure left blank the call returns the refusal above and no gap at all.

The engine refuses instead, because a starting stock is a measured quantity. Someone dipped the tanks at the end of yesterday; that figure is the opening stock. If nobody did, the day has no honest start.

## A missing closing dip

The other end of the day has its own rule. With the opening stock in place and the closing dip left out, the engine answers:

expected closing 4508.100 m3, unaccounted none; note: No closing dip, so the day cannot be closed.

This is a partial answer and it is not a refusal. The expected closing needs only the opening stock and the day's movements, so it can be formed: 4508.100 m3. The unaccounted figure needs the dip, so it reads none, and the note says the day cannot be closed.

Side by side, the two cases show the shape of the ledger: the opening stock is at its root, and the closing dip enters only its last line.

## Yesterday's dip is today's opening

The instruction in the refusal names one source for the opening stock: yesterday's closing dip. On the AKODO day that figure is 4953.700 m3. The next lesson takes the opening stock from today's closing dip instead, and shows what the day then reads: every day balances, and none of them measures anything.

In the panel, clear the opening stock and read the refusal. Then restore it and clear the closing dip instead, and read which figure survives.

## Exercise

Read the two ways the AKODO day fails to close: the refusal without an opening stock, and the answer without a closing dip, expected closing 4508.100 m3 and unaccounted none. Say what each case can and cannot form, and where the missing figure comes from in each.

Self check: without an opening stock nothing can be formed and the call refuses; the figure comes from yesterday's closing dip. Without a closing dip the expected closing, 4508.100 m3, is formed and the unaccounted figure is none; the missing figure is today's dip of the tanks.
