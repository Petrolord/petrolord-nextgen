# Near duplicates and the digit rule

{{panel:dq-checks-explorer}}

Normalisation catches the differences that do not matter: case, hyphens, spaces, accents, leading zeros. It cannot catch a typing slip. "EKNE-4" normalises to EKNE4, and EKENE-4 normalises to EKENE4, and those are different strings. To find a slip, the engine measures how far apart two normalised names are, and calls a pair NEAR when the normalised forms are within `maxDistance` Levenshtein edits, 1 by default, AND carry the same digits in the same order.

The Levenshtein distance between two strings is the smallest number of single-character insertions, deletions or substitutions that turns one into the other. EKNE4 becomes EKENE4 by inserting one E, so their distance is 1.

## The digit rule

Distance alone is not enough for well names, and the Ekene list shows why.

| normalised pair | Levenshtein distance | digits | reported as near |
| --- | --- | --- | --- |
| EKENE2, EKENE12 | 1 | 2 and 12 | false |
| EKENE1, EKENE10 | 1 | 1 and 10 | false |
| EKNE4, EKENE4 | 1 | 4 and 4 | true |
| EKENE1, EKENE7 | 1 | 1 and 7 | false |

Every one of these pairs is one edit apart. Only one of them is a slip. EKENE-2 and EKENE-12 are two real wells, and so are EKENE-1 and EKENE-10, and EKENE-1 and EKENE-7. In a field where wells share a stem and differ by number, many pairs of real wells sit one edit apart, and a distance rule on its own would pair them.

The digit rule fixes that. A near pair must carry the same digits in the same order. EKNE4 and EKENE4 both carry 4, so they pair. The other three pairs carry different numbers and do not. The digit rule is why EKENE-2 and EKENE-12, two real wells one edit apart, are not called near duplicates, while EKNE-4, a typing slip, is paired with EKENE-4. Its reason, verbatim:

> "EKENE-4" and "EKNE-4" differ by 1 edit after normalisation (EKENE4, EKNE4)

## Switching the digit rule off

| setting, stated | exact | normalised | near |
| --- | --- | --- | --- |
| the defaults | 1 | 8 | 1 |
| digitsMustMatch false | 1 | 8 | 41 |

With the digit rule off, the near count on these 13 names rises to 41, from a list with one known slip in it. The digit rule trades a little reach for a list short enough to act on.

## What the digit rule costs

The rule is a choice, and it has a price. A slip in the number itself will never be reported as near: had EKENE-7 been a mistyped EKENE-1, the table above shows the pair would still read false. The digit rule assumes the number is the part people get right and the stem is the part they mistype. For a list where that assumption is wrong, set `digitsMustMatch` to false, and expect to read many more pairs.

The same goes for `maxDistance`. The default of 1 catches one dropped, added or replaced character. A larger value reaches further and can pair more names that are merely similar.

## Strongest class only

A pair is reported under its strongest class only: exact before normalised, normalised before near. So the near count never repeats a pair already counted as a duplicate by a stronger rule. With the defaults the Ekene list reads 1 exact, 8 normalised and 1 near pair.

## Exercise

Open the checks explorer on the well names view with all 13 Ekene names. Read the Near tile and find the near pair and its reason. Now set Digits must match to no and read the Near tile again. Then set it back to yes, find EKENE-1 and EKENE-7 in the list, and explain in one sentence why the engine would not pair them even if one were a slip for the other.
