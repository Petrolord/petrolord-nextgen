# A missing rate makes a floor

The engine ships no rate, so every build-up starts with every rate missing. What it does with a missing rate is the tier's central engine fact: it adds up what it was given, counts what it was not, and labels the total as a floor.

{{panel:supply-price-explorer}}

## Three builds of one cargo

The course prices the BADAGRY cargo three ways. Every rate in each is invented for this course, and the only difference between them is which rates are left blank.

With every invented rate supplied, the engine reports complete true, a landed total of 26513943.86 USD, and the sentence "All supplied rates applied."

With the course's invented duty and financing rate left blank, the engine reports:

- complete false;
- missing Import duty, Financing and letter of credit;
- total 24774210.79 USD;
- and the label "A FLOOR, not a cost: 2 rate(s) not supplied."

With every rate blank, the engine reports complete false, 9 missing, and a total of 23392000.00 USD, which is the FOB alone, with the same label: "A FLOOR, not a cost: 9 rate(s) not supplied."

## What each part of the answer does

The flag says the build-up is not finished. The list of missing lines tells a person which rates to go and find. The total is still printed, because a partial sum has a use: it is a figure the true landed cost cannot be below, provided every missing rate is zero or more. The label is the engine's own words for that status; quote it in quotation marks, as the engine writes it.

The fully blank build-up shows why the label matters. Its total is 23392000.00 USD, the same figure as the FOB line of the complete build-up. Printed without the flag, it would present a cargo's purchase price as its landed cost.

## A rate typed 0 is a rate

The digest prices the cargo twice more, changing only the duty. With the course's invented duty typed 0, the build-up is complete true, total 25114857.82 USD. With the duty left blank, it is complete false, missing Import duty, total 25114857.82 USD, labelled "A FLOOR, not a cost: 1 rate(s) not supplied."

The two totals print the same figure. The flag and the missing list tell them apart. In the digest's words, a rate typed 0 is a rate, and the engine applies it. A blank duty is an absence, and the engine names it. The template's rate column is empty on purpose, so a default of zero would make every untouched line a claim that the charge does not exist.

## Reading the floor against the full build

The two rates left blank in the middle build are both percentages of CIF. The complete build prints the invented import duty at 1399086.04 USD and the financing line at 340647.04 USD. The floor build prints neither line, names both, and prints a total of 24774210.79 USD. The digest prints the full build less that floor: 26513943.86 - 24774210.79 = 1739733.07 USD. The engine's point is the label: one total is a cost and the other is a floor.

## Exercise

Record the landed total, the complete flag and the engine's closing sentence for the full BADAGRY build, the build with duty and financing blank, and the build with every rate blank. Then read the duty typed 0 against the duty left blank. Say what the last total, read against the FOB line of the full build, shows about why the engine labels an incomplete build-up instead of printing its sum alone.
