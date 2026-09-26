# An item against its minimum

{{panel:pr-award-calculator}}

Each Schedule line sets a minimum for one item. A bid meets the minimum for that item when its content, in the Schedule's unit, is at or above it. The engine tests every item of every bid and names each one that falls short. This lesson reads those tests on the well services tender, where every item is measured in man-hours.

## The well services tender, item by item

The Schedule minimums are 75% for coiled tubing services, 95% for pumping services and 85% for well overhauling and stimulation services, all in man-hours:

| bid | coiled-tubing | pumping | stimulation | items met |
| --- | --- | --- | --- | --- |
| WS1 | 78.000000 | 95.000000 | 85.000000 | 3 of 3 |
| WS2 | 70.000000 | 90.000000 | 87.500000 | 1 of 3 |
| WS3 | 82.000000 | 97.000000 | 90.000000 | 3 of 3 |
| WS4 | 60.000000 | 80.000000 | 75.000000 | 0 of 3 |
| WS5 | 75.000000 | 95.000000 | 75.000000 | 2 of 3 |
| WS6 | 80.000000 | 96.666667 | 87.500000 | 3 of 3 |

The engine measures every bid, including WS4 and WS6, which fail the technical envelope. Measuring content is a separate call from evaluating the tender, and it measures whatever bids it is handed.

## At the minimum meets it

WS1's pumping content is exactly 95.000000, the minimum, and it meets it. So does WS1's stimulation at 85.000000, and WS5's coiled tubing at 75.000000. The rule is "content >= the minimum": a bid AT the minimum meets it. The same boundary holds for the technical pass mark at Associate, where WS5 passes at exactly 70.000000.

## The engine's reasons

For every item below its minimum, the engine returns a reason naming the item, the content, the unit and the minimum. For WS2 and WS5, verbatim:

> WS2: item coiled-tubing: Nigerian content 70% by man-hours is below the minimum 75%

> WS2: item pumping: Nigerian content 90% by man-hours is below the minimum 95%

> WS5: item stimulation: Nigerian content 75% by man-hours is below the minimum 85%

The content measurement returns each shortfall as a reason, and nothing in it excludes a bid. What the Act does with content at the award is the subject of modules 5 and 6.

The item test matters because an overall figure can hide a shortfall. WS5's overall content is a single 78.750000, and that one figure says nothing about which of its items meets its minimum; the item test shows stimulation ten points short. A report gives both the items met and the overall figure.

## The materials tender

On the materials tender every bid falls short somewhere except MS3, which meets all four minimums. MS3's casing content is 100.000000 against a minimum of 100%, again exactly at the minimum. MS5 meets none:

| bid | items met |
| --- | --- |
| MS1 | 1 of 4 |
| MS2 | 2 of 4 |
| MS3 | 4 of 4 |
| MS4 | 2 of 4 |
| MS5 | 0 of 4 |

MS2 meets its cement and its baryte minimums and falls short on casing and valves. Its valves sit at 58.333333 against 60%.

## Exercise

Open the award calculator on the view "Nigerian content by item". It starts on the materials tender. Find MS2 in the bids and read its reasons. Raise MS2's Nigerian valve count by one and read whether valves now meet the minimum and how its items met changes. Then lower MS3's Nigerian casing tonnage by one and read the reason that appears. Restore both and say, for each, which unit the reason names.
