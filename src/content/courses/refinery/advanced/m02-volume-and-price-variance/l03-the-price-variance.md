# The price variance

The volume variance priced the barrel gap at the plan's price. The price variance is the other half: what the change in price per barrel did, on the barrels that actually moved.

{{panel:refinery-variance-explorer}}

## The formula

price variance = (actual unit value - plan unit value) x actual quantity

The plan unit value is the plan ledger's value per barrel. The actual unit value is the actual line's value divided by its actual quantity: what each barrel really cost or really sold for. The difference is multiplied by the actual quantity, because a price change matters only on barrels that moved.

The two formulas split the work cleanly. The volume variance takes the change in barrels at the old price. The price variance takes the change in price on the new barrels. Between them they account for the whole gap in value on a line whenever barrels moved in both ledgers.

## The ODIOMA price variances

| material | type | direction | volume variance | price variance | unexplained | total variance |
| --- | --- | --- | --- | --- | --- | --- |
| escravos | receipt | cost | 10651500.00 | 955500.00 | 0.00 | 11607000.00 |
| forcados | receipt | cost | -30720000.00 | 0.00 | 212000.00 | -30508000.00 |
| cdu | unit_run | cost | -371000.00 | 51450.00 | 0.00 | -319550.00 |
| reformer | unit_run | cost | -182900.00 | 13100.00 | 0.00 | -169800.00 |
| gasoline | delivery | revenue | -5606770.00 | 179070.00 | 0.00 | -5427700.00 |
| jet | delivery | revenue | -3650520.00 | -80980.00 | 0.00 | -3731500.00 |
| diesel | delivery | revenue | -9054000.00 | -536800.00 | 0.00 | -9590800.00 |
| fuel_oil | delivery | revenue | -6260800.00 | 168000.00 | 0.00 | -6092800.00 |

## Reading the signs

A positive price variance means each barrel carried more money than the plan expected. On a cost line that is a dearer barrel. On a revenue line it is a better sale.

The escravos line reads 955500.00: the actual unit value is 80.2000 against the plan's 78.9000. The crude unit reads 51450.00 at 1.4700 against 1.4000, and the reformer 13100.00 at 3.2000 against 3.1000.

On the revenue side the signs split. Gasoline reads 179070.00 and fuel_oil 168000.00, with actual unit values of 112.0895 and 61.0000 against plan prices of 110.5000 and 60.2000. Jet reads -80980.00 and diesel -536800.00, at 104.0998 and 98.4000 against 104.9000 and 100.6000.

As in the previous lesson, these signs are as recorded. A positive price variance on escravos adds to cost. A positive price variance on gasoline adds to revenue. Module 3 sets each on the margin.

## The terms add up

The engine defines the third term as unexplained = total - volume - price. On every line where the unexplained reads 0.00, the volume and price variances together are the total. For escravos the volume variance is 10651500.00, the price variance 955500.00, the unexplained 0.00 and the total 11607000.00. For diesel the four figures are -9054000.00, -536800.00, 0.00 and -9590800.00.

Seven of the eight lines read 0.00 unexplained. The eighth, Forcados (illustrative), reads 0.00 in price and 212000.00 in unexplained. With no barrels in the actual ledger, the actual unit value reads 0.0000, the figure the engine gives when no barrels arrived, and the price variance is taken on an actual quantity of 0.00. The money on the line has to go somewhere. The next lesson reads where.

## What the price variance does not say

The price variance says the price per barrel differed. It does not say why. A crude premium, a product discount, a higher power bill on a unit: each would show as the same kind of figure. The line reports the gap and its size, and the reason is for the person reading it to find.

## Exercise

Read the jet line: volume variance, price variance, unexplained and total. Say what the sign of each of the first two tells you about barrels and about price. Then read the gasoline line and say why its price variance and its volume variance carry opposite signs. Finally, say why the Forcados line reads 0.00 in price variance.
