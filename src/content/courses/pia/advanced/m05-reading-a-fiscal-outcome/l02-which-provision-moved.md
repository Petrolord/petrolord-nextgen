# Which provision moved

{{panel:pia-ledger-calculator}}

The most useful question to ask of a fiscal outcome is what moves it. The way to answer is one change at a time: take a base case, change one stated term, run the engine again, and subtract the base from the changed run line by line. Each line that moves points at the provision that reads the term you changed. Each line that stays at zero is evidence too.

## Eight changes to Ekene Alpha

The base is Ekene Alpha (synthetic; shallow water, converted, 2026 to 2032, every year under the Nigeria Tax Act 2025). Each row states one change and prints the changed run less the base:

| stated change | royalties | hydrocarbon tax | companies income tax | TET | levy | take percent |
| --- | --- | --- | --- | --- | --- | --- |
| terrain onshore | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| a prospecting licence | 0.000000 | -102385291.793528 | 0.000000 | 0.000000 | 0.000000 | -12.247203 |
| a new lease, stated 30 | 0.000000 | -24691339.200000 | 0.000000 | 0.000000 | 0.000000 | -2.953548 |
| a new lease, stated 15 | 0.000000 | -114730961.393528 | 0.000000 | 0.000000 | 0.000000 | -13.723977 |
| oil at 95 USD/bbl | 43566660.591831 | 72668690.783886 | 73263359.822451 | 0.000000 | 9768447.976327 | 0.685923 |
| oil at 95 USD/bbl, Act base | 41321586.250479 | 73342213.086292 | 73936882.124856 | 0.000000 | 9858250.949981 | 0.614002 |
| every year forced to the Act alone | 0.000000 | 436533.662718 | 450000.000000 | 26785663.028773 | -35714217.371697 | -0.961977 |
| all gas used in-country | -863333.550000 | 0.000000 | 259000.065000 | 0.000000 | 34533.342000 | -0.068159 |

## Reading the rows

**Terrain onshore moves nothing.** Every year of Alpha produces below 10,000 bopd, where onshore and shallow water pay the same tranche rates, and the hydrocarbon tax rate of a converted lease is 30 percent in both terrains. A terrain change that moves nothing is still a finding: it says the field sits entirely in the part of the table the two terrains share.

**A prospecting licence moves only the hydrocarbon tax**, by exactly half, because it changes the class under s.267 and nothing else reads the licence type.

**A new lease moves the hydrocarbon tax twice**: once through the larger new-lease production allowance of Sixth Schedule para 1(2), and once through the rate it states. At a stated 30 only the allowance acts; at a stated 15 both act. The two stated rates are shown together because the texts leave the rate of such a lease open, and neither is graded.

**The price moves the royalty by price and everything after it.** A higher price raises the royalty by price, which the tax bases deduct, and raises every profit line. Stated on the Act base, the same price moves the royalty less and the taxes more, because the Act's benchmarks sit one year of escalation higher. Every figure on these two rows names its base year.

**Forcing the Act alone swaps the levy for the education tax** and changes the capital allowance and the restriction, which is why the hydrocarbon tax and companies income tax move a little.

**Gas used in-country moves the gas royalty and what reads it.** The hydrocarbon tax row stays at zero because gas royalty is outside its base.

## Why one change at a time

Two changes run together produce a difference that belongs to neither. The price and the base year show why: the Act base row differs from the plain price row in every column, and only running them apart makes the base year's part visible. The same holds for a change of your own: state it alone, run it, and read the rows before you combine it with anything. The arithmetic of the ledger rows is the cash flow course's; this course reads which provision each difference belongs to.

## Exercise

Open the ledger calculator on "Which provision moved" with ekene_alpha_shallow_converted_nta loaded. Reproduce four rows of the table by entering, in turn, {"pia_terrain": "onshore"}, {"pia_license_type": "PPL"}, {"oil_price_usd_bbl": 95} and {"pia_gas_in_country_share_pct": 100}. For each, name the provision behind every row that moves and every row that stays at zero. Then make one change of your own that the table does not hold and read it the same way.
