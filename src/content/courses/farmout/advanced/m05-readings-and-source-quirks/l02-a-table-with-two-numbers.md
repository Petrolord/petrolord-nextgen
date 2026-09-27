# A table with two numbers

{{panel:farmout-valuation-calculator}}

Reading a source critically includes noticing where it is untidy. This lesson takes the one published worked figure in the course and a small inconsistency in how its page labels it.

## The one published worked figure

No public text prints a farm-in schedule. The validation record says so in its own words:

> No public text prints a farm-in schedule or a break-even promote: those goldens come from the stated deal arithmetic in the oracle.

The earning, cap, break-even, fee and carry figures of this course are the stated deal arithmetic, run by the engine on stated terms. The one published worked figure is a drill yourself or farm out problem on the Penn State EME 801 course page, Lesson 6, Expected Monetary Value and Value at Risk, prepared by Seth Blumsack and Mark Kleinginna. Its licence is CC BY-NC-SA 4.0. That licence is non-commercial and this course is sold, so no sentence of the page is quoted anywhere in the course. Its printed figures are cited as figures.

## The figures

The page states a producer chance of 35.000000 percent and a dry-hole chance of 65.000000 percent. Drilling yourself pays -250000.000000 on a dry hole and 500000.000000 on a producer; farming out pays 0.000000 and 50000.000000. It prints EMVs of 12500.000000 and 17500.000000. The engine reproduces both (engine, deal-psu-eme801):

| position | dry hole (engine) | producer (engine) | EMV (engine) | EMV the text prints |
| --- | --- | --- | --- | --- |
| drill yourself | -250000.000000 | 500000.000000 | 12500.000000 | 12500.000000 |
| farm out | 0.000000 | 50000.000000 | 17500.000000 | 17500.000000 |

The engine's farm out EMV carries float residue in its last binary digits. It prints as 17500.000000 at six decimals, and the check passes within 0.000001.

## The engine's reading of the page

The page states payoffs and no deal terms. To run it as a deal, the golden input states a 100 percent owner, a success-case value of 750000.000000, a well of 250000.000000, and an incoming party paying the whole well to earn 93.333333 percent. The page's farm out payoff of 50000.000000 is 6.666667 percent of the 750000.000000 success value, which is why the owner keeps 6.666667 percent. The page itself states no interest. On those terms the engine finds that the incoming party breaks even paying 98.000000 percent of the well for 93.333333 percent, and at a chance of 35.714286 percent. The page prints neither figure.

## One table, two labels

The page labels its payoff table as Table 6.1 where it first prints it, and refers to it as Table 10.1 when it computes the EMVs and the value at risk from the same figures. The two labels point at one table. The course cites the page and its printed figures and calls the table by its first label, Table 6.1.

A reader who meets two labels checks that both carry the same figures before assuming two tables exist. Here they do. A citation of the page names the lesson, the table's first label and the date read, so another reader can find the same figures.

## Exercise

Open the valuation calculator on the view **The value of the deal to each side** and choose the start **The Penn State figures**. Read both positions' payoffs and EMVs and compare them with the table above. Read the break-even tiles and name the two figures the page does not print. Then open the view **A price for a working interest**, choose the Penn State start there, and read the risked value per percent.
