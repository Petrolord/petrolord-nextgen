# The pump price as a waterfall

The landed cost ends at the depot gate. Between the gate and the nozzle the litre passes a terminal, a bridging or equalisation scheme, a transporter, a marketer, a dealer and two government charges. `buildPumpPrice` adds each of them in order onto a running subtotal. The result is a waterfall: every step is visible, and the steps reconcile to the price.

{{panel:supply-price-explorer}}

## Where the waterfall starts

`buildPumpPrice` starts from the landed cost per litre at the depot gate. For BADAGRY that is 884.6753 naira a litre, the figure the third module reaches by dividing the landed total by the outturn and converting once at the course's invented exchange rate. The engine refuses to start without it: "A landed cost per litre is required."

## The BADAGRY build-up

Every element below is invented for this course. None is a published margin, levy, tax or regulated price, and none describes any market as it is.

| element | recipient | basis | rate (invented) | amount naira/L | running naira/L | share of price |
| --- | --- | --- | --- | --- | --- | --- |
| Landed cost (depot gate) | none | per litre | none | 884.6753 | 884.6753 | 0.823088 |
| Depot and terminal margin | Terminal | per litre | 21 | 21.0000 | 905.6753 | 0.019538 |
| Bridging or equalisation | Chain | per litre | 24.5 | 24.5000 | 930.1753 | 0.022794 |
| Transport to station | Transporter | per litre | 19.8 | 19.8000 | 949.9753 | 0.018422 |
| Marketer margin | Marketer | per litre | 18.4 | 18.4000 | 968.3753 | 0.017119 |
| Dealer margin | Dealer | per litre | 31.25 | 31.2500 | 999.6253 | 0.029075 |
| Statutory levies at the pump | Government | per litre | 9.6 | 9.6000 | 1009.2253 | 0.008932 |
| Value added tax | Government | percent_of_running | 6.5 | 65.5996 | 1074.8249 | 0.061033 |

The engine closes with the pump price, 1074.8249 naira a litre, complete true, and "All supplied rates applied."

## How to read it

Read the amount column and the running column together. A per-litre element adds its amount, so the course's invented depot margin of 21 naira a litre takes the running total from 884.6753 to 905.6753. Each per-litre row after it does the same. The running column is the price so far, and its last entry is the pump price.

The last element is different. Its basis is a percent of the running total, so it adds that percent of everything above it. The invented value added tax of 6.5 percent reads the running total of 1009.2253 naira a litre and adds 65.5996. The next lesson is about that row.

The share column divides each amount by the final price. The landed cost's share is 0.823088. The dealer margin's is 0.029075. Those shares are fractions of 1074.8249 naira a litre and nothing else, so they only mean something once the build-up is complete.

## Why a waterfall

In a waterfall every line is an amount, every amount has a recipient and a basis, and the running column shows the lines reconcile to the price. The BADAGRY build-up has the landed cost and seven elements, and its running column closes on 1074.8249 naira a litre with the note "All supplied rates applied."

The order matters for the same reason it mattered in the landed cost walk. A per-litre element is the same wherever it sits. A percentage element depends on everything above it, so its place in the order is part of its value.

## Exercise

Record the landed cost per litre, the running total after the dealer margin, the running total after the levies and the pump price, all in naira a litre. Say what the running column, read against the amount column, shows about how the engine reaches the pump price, and why the value added tax row is the one row whose amount depends on its place.
