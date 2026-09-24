import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Associate m06, Names, and One Dataset End to End.
# Sources: digest sections 15 and 16, and the ids refusal in section 4.
# Every figure is printed there.

q(3, "The Ekene well list holds ÉKENE-7 at entry 10. Why does it normalise to EKENE7?",
 "NFKD splits the accented letter into a plain E and a separate accent mark, and the letter filter drops the mark.",
 ["The upper-case step maps every accented capital to its plain form.",
  "Trim removes the accent, since it sits at the start of the name.",
  "The engine keeps a table of accented spellings of Ekene names."],
 "The stated normalisation is NFKD, trim, upper case, keep A to Z and 0 to 9, and strip leading zeros in each digit group. NFKD decomposes the accented letter, and keeping only A to Z and 0 to 9 drops the accent mark. Trim removes spaces at the ends, upper case changes case only, and the engine holds no list of names."),

q(0, "EKENE-03 normalises to EKENE3. With `stripLeadingZeros` set to false, what happens to the pair counts on the 13 Ekene names?",
 "The normalised count falls from 8 to 5, since EKENE-03 no longer matches the other spellings of EKENE-3.",
 ["The normalised count stays at 8, since the other steps still remove both the hyphen and the leading zero.",
  "The near count rises from 1, since EKENE03 is then one edit from EKENE3 and carries the very same digits in order.",
  "The exact count rises from 1 to 2, since EKENE-03 then matches EKENE-3 as written."],
 "With leading zeros kept, EKENE-03 normalises to EKENE03, and its three normalised pairs with EKENE-3, Ekene 3 and the second EKENE-3 are lost: the settings table reads 1 exact, 5 normalised and 1 near. Keeping A to Z and 0 to 9 keeps the zero, the near count stays 1, and exact compares the raw strings, which still differ."),

q(2, "Entries 2 and 3 of the Ekene list are both written \"EKENE-3\". They also match after normalisation. How is the pair reported?",
 "Once, as exact, since a pair is reported under its strongest class only.",
 ["Twice, once as exact and once as normalised, since both rules fire on the pair.",
  "Once, as normalised, since the engine compares normalised forms before it compares raw strings.",
  "Once, as a near pair at a distance of 0, since near is the widest of the three classes."],
 "A pair is EXACT when the raw strings are equal, and a pair is reported under its strongest class only: exact before normalised, normalised before near. The engine's reason reads \"EKENE-3\" repeats entry 2 exactly. So the counts never repeat a pair, and the exact count is 1."),

q(1, "With the defaults, how many pairs of each class does `duplicateIdentifiers` report on the 13 Ekene names?",
 "1 exact, 8 normalised and 1 near.",
 ["1 exact, 9 normalised and 1 near, since the exact pair also matches after normalisation and is counted there too.",
  "2 exact, 8 normalised and 1 near, since EKENE-7 and EKENE 7 are the same name written twice by two databases.",
  "1 exact, 8 normalised and 41 near, since every pair one edit apart is reported as a near duplicate."],
 "The defaults give 1 exact (entries 2 and 3), 8 normalised (the four EKENE-3 spellings with one another less the exact pair, and the three EKENE-7 spellings with one another) and 1 near (EKENE-4 and EKNE-4). EKENE-7 and EKENE 7 differ as written, so they are normalised, and 41 near is the count with the digit rule switched off."),

q(0, "EKNE-4 and EKENE-4 normalise to EKNE4 and EKENE4. Why are they reported as a near pair?",
 "They are 1 Levenshtein edit apart, within the default maxDistance of 1, and carry the same digits in the same order.",
 ["They normalise to the same string once vowels are removed, which makes them a normalised pair.",
  "They share the digit 4, and the engine pairs any two names with the same digits.",
  "They are 1 edit apart, and the engine pairs any two names within 1 edit."],
 "EKNE4 becomes EKENE4 by inserting one E, a Levenshtein distance of 1, and both carry the digit 4, so both parts of the near rule hold. The engine keeps letters, so no normalisation step removes vowels. Shared digits alone pair nothing, and 1 edit alone is not enough: EKENE2 and EKENE12 are 1 edit apart and not near."),

q(3, "EKENE-2 and EKENE-12 normalise to EKENE2 and EKENE12, one Levenshtein edit apart. Are they reported as near duplicates?",
 "No, because the digit rule requires the same digits in the same order, and 2 and 12 differ.",
 ["Yes, since they are within the default maxDistance of 1, which is the only test a near pair must pass.",
  "Yes, since the digit rule ignores a leading digit added in front of the well number.",
  "No, since their distance is 2 once the hyphen is counted, above the default maxDistance of 1."],
 "The digit rule is why EKENE-2 and EKENE-12, two real wells one edit apart, are not called near duplicates. Distance alone would pair them, and in a field of wells sharing a stem, many real pairs sit one edit apart. The distance is measured on the normalised forms, where the hyphen is gone, and it is 1."),

q(2, "With `digitsMustMatch` set to false, how many near pairs does the Ekene list report?",
 "41, from a list with one known slip in it, which is why the digit rule is the default.",
 ["1, the same as with the rule on, since the only real slip in the Ekene list is EKNE-4 here.",
  "12, one for each name that is one edit from another name on the list.",
  "0, since without the digit rule the engine has no way to tell two names apart."],
 "The settings table reads 1 exact, 8 normalised and 41 near with the digit rule off. Distance alone pairs many real wells that share a stem and differ by number. The digit rule trades a little reach for a list short enough to act on. Exact and normalised counts do not move."),

q(1, "What does the digit rule cost you?",
 "It never reports a slip in the well number itself as near, as a mistyped EKENE-1 for EKENE-7 would read false.",
 ["It hides every typing slip in the letters of a name, such as EKNE-4 for EKENE-4.",
  "It doubles the near count on a list of wells sharing a stem, as the 41 near pairs show.",
  "It stops accented names from matching their plain spellings, as ÉKENE-7 shows."],
 "The digit rule assumes the number is the part people get right and the stem the part they mistype. A slip in the number, such as EKENE-1 typed for EKENE-7, carries different digits and is never near. Slips in the letters are exactly what it still finds, the 41 is the count with the rule off, and accents are handled by the normalisation."),

q(3, "What is the Levenshtein distance the near rule uses?",
 "The smallest number of single-character insertions, deletions or substitutions that turns one normalised name into the other.",
 ["The number of positions at which two names of equal length carry different characters.",
  "The difference in length between two names after normalisation, in characters.",
  "The number of characters two normalised names share, counted in order from the start."],
 "The Levenshtein distance counts insertions, deletions and substitutions, and the engine measures it on the normalised forms. EKNE4 and EKENE4 differ in length and are 1 insertion apart, so a positions count for equal lengths could not score them at all. A length difference or a shared prefix is a different measure."),

q(0, "On EKENE-3's production sheet, `frozenRuns` on the gas column shows 8 entries failed and 1 flag. Why do the two counts differ?",
 "frozenRuns returns one flag per run, and the one run of eight days is a single flag.",
 ["The engine flags only the first day of a frozen run and counts the rest of the run as missing.",
  "Seven of the eight days are checked by completeness instead, which raises the other flags.",
  "The run of eight holds one planted day and seven honest readings of the very same value."],
 "Entries failed counts the days the check faults; flags counts the flag objects the engine returns. frozenRuns, like completeness for its gap runs, returns one flag per run, so eight held days are one flag. The gas column has no missing day, and the run is eight days because the day 74 value belongs to it with the seven held days after it."),

q(1, "On EKENE-7's log, completeness on the neutron shows 3 entries failed and 3 flags, while the density shows 12 entries failed and 1 flag. Why?",
 "The neutron's three missing samples are three separate gap runs, and the density's twelve are one run, and each run is one flag.",
 ["The neutron is checked sample by sample and the density by the interval, so the two report differently.",
  "The density's flag is a summary for the channel, and the neutron has three flags because it also failed the range check on those entries.",
  "Completeness raises one flag per missing sample up to three, and a single summary flag beyond that."],
 "Completeness returns one flag per gap run: the density lost samples 80 to 91 in one run, the neutron lost entries 25, 118 and 205 in three runs of one. Both are checked the same way. The neutron's range failures are a separate row of the table with their own 10 flags."),

q(2, "EKENE-3's water cut check fails 6 days in the dataset summary. What makes 6 the right figure to report, and 83 the wrong one?",
 "The tolerance of 1e-4 matches the sheet's four-decimal reporting; at the default 1e-6 the rounding alone would add mismatches.",
 ["The count of 6 comes from the default tolerance, and 83 from a tolerance tightened by the caller to find more of the rounding errors.",
  "The count of 6 drops the days on which the oil was missing, which the default count includes.",
  "The count of 6 is the out-of-range days alone, and 83 adds every mismatch of any size."],
 "The water cut count is 6 only because the tolerance matches the sheet's four-decimal reporting: 5 out of range and the day 55 mismatch. At the default 1e-6 the same check reads 83, with 78 of them rounding. A count without its setting cannot be reproduced; missing-rate days are not judged at either setting."),

q(0, "Why does the order of checks put `indexCheck` before `coverage`?",
 "Coverage refuses an index that steps back, so the index is checked and cleaned before coverage runs on it.",
 ["Coverage fills the index gaps that indexCheck reports, so it has to see those flags before it can run at all.",
  "indexCheck is faster than coverage, and a cheap check goes before an expensive one.",
  "Coverage reads its maxStep from the expected step that indexCheck returns."],
 "Coverage needs a strictly increasing index and refuses the splice index at `index[5]`, naming indexCheck as the function that finds the offenders. So completeness and the index come first, then coverage. Coverage fills nothing, maxStep is the caller's statement, and the order is set by what each check needs."),

q(3, "In the one-dataset tables, which checks run on EKENE-3's sheet with 87 entries checked or n, and why is it fewer than 90?",
 "The rate check and the phase sum, since the three missing oil days are not judged by either.",
 ["The cumulative check and the water cut check, since days 20 to 24 are excluded from both of them.",
  "The completeness check and the frozen-run check, since both of them skip the shut-in days on the sheet.",
  "The water cut check alone, since it cannot compute a cut on the three meter outage days."],
 "rateCheck checks 87 of 90 days and phaseSumCheck 87, because a missing rate is not judged and a sum with a missing term is not a sum. The cumulative check shows 89, completeness, the water cut check and the frozen-run check 90. Missing values belong to the completeness check, which already flagged them."),

q(1, "A consultant's spreadsheet arrives with its well-name column blank, and your script hands the uniqueness check zero names. What comes back?",
 "An error object whose field is `ids`, with the message that ids must be a non-empty array of strings.",
 ["A result with 0 exact, 0 normalised and 0 near pairs, since an empty list holds no duplicates at all.",
  "A refusal naming the field `maxDistance`, since no distance can be measured on an empty list of names.",
  "A result with a null for each class and a note that the list was empty."],
 "The engine's own words are: ids must be a non-empty array of strings. A clean result of 0 pairs would be a claim about names nobody supplied, so the engine refuses and names the field. maxDistance is a setting and is not what was wrong."),

emit(Q, '/root/dai-wip-dataqc/banks/d1b_m06.json', expect_n=15)
finish()
