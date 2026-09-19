# A missing rate makes a floor

The engine ships no rate, so every build-up starts with every rate missing. What it does with a missing rate is the tier's central engine fact. It does not read a blank as zero and report a cost. It adds up what it was given, counts what it was not, and labels the total as a floor.

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

The flag says the build-up is not finished. The list of missing lines tells a person which rates to go and find. The total is still printed, because a partial sum has a use: it is a figure the true landed cost cannot be below, provided every missing rate is zero or more. And the label is the engine's own words for exactly that status. Quote it as the engine writes it, in quotation marks, and never restate it in your own words as if it were a cost.

The fully blank build-up shows why that labelling matters. Its total is 23392000.00 USD, the same figure as the FOB line of the complete build-up. A page that printed that total without the flag would present a cargo's purchase price as its landed cost, and nothing in the number itself would warn a reader.

## A blank is reported missing

The course shows the engine reporting each blank rate by name, with complete false. That is what keeps an absence apart from a figure. A zero duty would be a statement about a regime. A blank duty is an absence. If a blank were read as zero, the build-up with its duty blank would carry the flag complete true and nothing would name the missing line. The template's rate column is empty on purpose, as the first module showed, so a default of zero would make every untouched line a claim that the charge does not exist.

## Reading the floor against the full build

The two rates left blank in the middle build are both percentages of CIF. The complete build prints the invented import duty at 1399086.04 USD and the financing line at 340647.04 USD. The floor build prints neither line, names both, and prints a total of 24774210.79 USD against the complete 26513943.86 USD. The engine's point is the label: one total is a cost and the other is a floor.

## Exercise

Record the landed total, the complete flag and the engine's closing sentence for the full BADAGRY build, the build with duty and financing blank, and the build with every rate blank. Say what the last total, read against the FOB line of the full build, shows about why the engine labels an incomplete build-up instead of printing its sum alone.
