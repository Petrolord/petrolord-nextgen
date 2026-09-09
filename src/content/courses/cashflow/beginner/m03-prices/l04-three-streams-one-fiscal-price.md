# Three streams, one fiscal price

Oil, gas and condensate each carry their own price, escalator and deck, and the ledger folds them into one gross revenue per year.

{{panel:ec-ledger-explorer}}

## Three prices

oil_price_usd_bbl, gas_price_usd_mscf and condensate_price_usd_bbl, each with an escalator, each with its own deck entries. The three-stream published case sets oil at 80, gas at 4.5 and condensate at 70 in base_year=2025, escalators 0, and uploads w_oil_bbl=5000000, w_gas_mscf=30000000 and w_condensate_bbl=300000 for 2025. The row reads oil 5000000.00, condensate 300000.00, gas 30000000.00, applied_oil_price 80.000000 and gross revenue 556000000.00. One revenue number, three streams inside it.

Each stream escalates on its own rate. AKATA runs oil at 82 and gas at 3.2, both escalating at 2 percent from 2029.

| year | applied_oil_price | applied_gas_price | gross_revenue |
| --- | --- | --- | --- |
| 2029 | 82.000000 | 3.200000 | 186032000.00 |
| 2030 | 83.640000 | 3.264000 | 159564720.00 |
| 2031 | 85.312800 | 3.329280 | 136363147.20 |
| 2035 | 92.345318 | 3.603720 | 73325786.51 |

The 2031 revenue is oil 1550000.00 bbl at 85.312800 and gas 1240000.00 Mscf at 3.329280. Nothing else is in it.

## The decks are separate

The resolver run on deck_step_hold reports its parsed oil deck, 2030 at 100 and 2032 at 50, with gas deck entries 0 and condensate deck entries 0. A deck for oil leaves gas on its flat price and escalator. There is no single deck that moves all three, and no ratio that ties gas to oil: a gas price is set, or the run is refused when gas volumes are present.

## What the row shows and what it hides

The row shows applied_oil_price and, where the ledger carries it, applied_gas_price, and it shows gross revenue. It does not show revenue by stream. AKATA's 186032000.00 in 2029 cannot be split into oil revenue and gas revenue from the revenue column alone; the split needs the volumes and the prices, which the row does carry, and a reader who wants the oil share has to multiply. The joint venture cascade never needs the split, because royalty and tax are taken from the one gross revenue, which is why the engine keeps only the one number.

## What it refuses

It refuses to price a stream it has no price for: gas_price_unset when gas volumes are in the file and gas_price_usd_mscf is not set, and the oil twin. It refuses to price water: water_bbl is read into the annual volumes and never enters revenue. And it refuses to invent a condensate stream from oil: condensate is a column of its own, _condensate_bbl, and with condensate_price_usd_bbl=0 and no condensate rows, as in AKATA, the column reads 0.00 every year.

## The mistake

The careful mistake is dividing gross revenue by oil volume to recover the price. On AKATA in 2029 that gives a number larger than 82.000000, because gas is in the numerator and not the denominator, and the reader concludes the escalator started a year early or the flat price was mis-entered. The applied_oil_price column is the price; gross revenue is that price times the oil plus the gas price times the gas. The cousin of this mistake is a boe price: total revenue over total boe is a blended figure that no stream was sold at, and comparing it with oil_price_usd_bbl says nothing about either.

## Exercise

Read AKATA's 2031 row in the explorer: the two volumes, the two applied prices, the one gross revenue. Then say which of the two applied prices would change if only gas_price_escalator_pct were set to 0, and which row would be the first to show it.
