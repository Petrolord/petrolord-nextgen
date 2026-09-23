import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Associate m01, What Data Quality Means.
# Sources: digest sections 1, 2, 3, 4 (the three refusals m01 l05 teaches) and 32.
# Every figure is printed there.

q(2, "The engine is handed a two-entry series of daily oil rates whose second entry is -3. The one flag it returns carries `index` 1. What does that 1 refer to?",
 "The second entry of the series, because the engine counts entries from 0.",
 ["The first entry of the series, because the engine counts entries from 1 in the way a production sheet counts days.",
  "The count of flags on the series, which is one.",
  "The rule number of negative-rate in the engine's list of rules."],
 "The engine counts entries from 0, so `index` 1 is the second entry, the -3. A production sheet in this course counts days from 1, which is why day 1 is entry 0 and every quoted position must say which count it uses. The flag names its rule by the word negative-rate and carries no rule number, and the count of flags is not a field of any one flag."),

q(0, "A colleague says a call to the engine can come back as a number with a warning attached when the input is doubtful. Which description of the engine's replies is right?",
 "A reply is either a result object carrying a `basis` block, or an object carrying `error` and `field`, and there is no third shape.",
 ["A reply is a result object whose `basis` block holds a warning list, and a doubtful input fills that list while the number still arrives.",
  "A reply is either a result or an error, and an error carries the best estimate the engine could make from the inputs it did accept.",
  "A reply is a result object in every case, with `field` set to the doubtful input whenever the engine had to substitute a default."],
 "Every function returns one of two shapes: a result object with its `basis` block, or an object with `error` and `field`, where the field names the refused input. A refusal carries no number, a result never arrives without its basis, and the engine substitutes no defaults for a refused input, so a number with a warning attached is a shape the engine never returns."),

q(3, "EKENE-3's day 47 oil rate of -18.500000 bbl/d raises a negative-rate flag. What has the engine established about that value?",
 "That a stated rule fired on it, with the rule and a reason attached; whether the value is wrong is left to a person.",
 ["That the value is wrong, since a produced rate below zero cannot be true and the engine marks it for deletion.",
  "That the value is an allocation back-out, which the engine recognises from its sign and names in the reason.",
  "That the value should be replaced by zero, which the engine does in the returned series while it keeps the flag."],
 "A flag is a rule that fired, with its reason, and the engine does not decide whether a flagged value is wrong. It does not fill, repair or delete a value. The course knows day 47 is an allocation back-out because the generator states it; the engine's reason says only \"rate -18.5 is negative\"."),

q(1, "Which of the engine's five exported dimensions does `indexCheck` report against?",
 "Validity, beside the range check and the rate check.",
 ["Completeness, because a missing index entry is a value that was never recorded, which is what completeness counts.",
  "Consistency, because an index is checked against the channels that hang on it for agreement.",
  "Uniqueness, because a duplicate depth is one real object hiding under two entries of the index."],
 "The engine's function table puts `indexCheck` under validity with `rangeCheck` and `rateCheck`. Completeness belongs to `completeness` and `coverage`; consistency to the cumulative, water cut, phase sum and frozen run checks; uniqueness to `duplicateIdentifiers`, which compares names."),

q(1, "A frozen gas meter reports the same present, in-range value for eight days. Which dimension does the check that finds it belong to?",
 "Consistency, because `frozenRuns` asks whether a series agrees with what a live meter does.",
 ["Completeness, because a stuck meter records nothing new, so each held value counts as a missing reading.",
  "Validity, because a held value leaves the definitional gas rate limit.",
  "Plausibility, because a held value is a value that stands apart from the rest by a statistical measure."],
 "The engine files `frozenRuns` under consistency. Every held value is present, so completeness sees nothing, and every one is inside the rate limit, so validity sees nothing either. Plausibility is the dimension the Professional tier owns, and no check in it is used here."),

q(3, "The engine exports five dimension names in a fixed display order. Which list is that order?",
 "Completeness, validity, consistency, uniqueness, plausibility.",
 ["Validity, completeness, consistency, plausibility, uniqueness.",
  "Completeness, consistency, validity, uniqueness, plausibility.",
  "Completeness, validity, uniqueness, consistency, plausibility, with plausibility shown last."],
 "`DIMENSIONS` lists completeness, validity, consistency, uniqueness and plausibility, in that order. Each other order moves at least one dimension out of place, and the one that places plausibility last still puts uniqueness ahead of consistency."),

q(0, "This tier asks whether data are fit to use. Which of the five dimensions does it leave to the next tier?",
 "Plausibility, which asks which present, valid, consistent values sit far from the rest.",
 ["Uniqueness, since well names are a database question and belong with the policy work of the last tier.",
  "Consistency, since agreement between channels needs a statistical measure.",
  "Validity, since a range check needs a caller's plausibility range first."],
 "The Associate tier covers four of the five dimensions: completeness, validity, consistency and uniqueness. Plausibility is the Professional tier's question. Well names are checked in this tier's last module, the consistency checks are stated rules with tolerances, and a range check runs on the engine's definitional limits with no caller range at all."),

q(2, "A three-entry series has its middle entry changed and is passed to `completeness`. Which middle entry reads 0.666667?",
 "`NaN`, which the engine counts as missing like null and undefined.",
 ["-999.25, since it is the null value a LAS file declares and the engine reads it as absent.",
  "0, since a zero reading carries no measurement.",
  "Infinity, since a value with no finite size is counted as missing and the call still runs."],
 "Missing is null, undefined or NaN, so each gives 1 missing of 3 and 0.666667. -999.25 and 0 are present numbers and read 1.000000. Infinity is refused outright with the field `values[1]`, so it produces no completeness at all."),

q(3, "EKENE-7's gamma ray arrives with -999.25 left in place at its last four entries. What do completeness and the definitional range check report on the channel as delivered?",
 "Completeness 1.000000 with 0 missing, and 4 range failures.",
 ["Completeness 0.983333 with 4 missing, and 0 range failures.",
  "Completeness 0.983333 with 4 missing, and 4 range failures at the same entries.",
  "Completeness 1.000000 with 0 missing, and 0 range failures, since the sentinel is a declared value."],
 "As delivered the sentinel is a present number, so completeness is 1.000000, and -999.25 is below the gamma ray minimum of 0, so the range check fails 4. Converted to null, the channel reads 0.983333 with 4 missing and 0 range failures, because a missing value is not checked against a limit. The same four samples never count in both columns at once."),

q(0, "You convert EKENE-7's four gamma ray sentinels to null and run both checks again. What moves?",
 "Completeness falls to 0.983333 with 4 missing, and the range failures fall to 0.",
 ["Completeness stays at 1.000000, since the samples still have rows in the index, and the range failures fall to 0.",
  "Completeness falls to 0.983333 with 4 missing, and the 4 range failures stay, now reported as missing values.",
  "Nothing moves, because -999.25 was already missing to the engine."],
 "Once converted, the four samples are missing: completeness is 0.983333 with 4 missing, and a missing value is not checked against a limit, so the range check reads 0. The four samples move from the validity column to the completeness column together. The engine never treats -999.25 as missing on its own."),

q(2, "Why does the engine leave converting a placeholder such as -999.25 to the caller?",
 "The placeholder is declared in one file's header, and the same number could be a real reading in another channel or file.",
 ["Every LAS file uses -999.25, so a caller can convert it in one line, and the engine keeps its own code short on purpose.",
  "The engine converts it only when the channel is a gamma ray, where a negative value is impossible, and leaves the rest.",
  "A placeholder is a missing value by definition, so converting it changes no result and the engine sees no need to act."],
 "The null value is a convention of one file, declared in that file's own header, and guessing would quietly change data the caller never asked to change. So the engine keeps one rule, null, undefined or NaN, and applies it everywhere. Not every file uses -999.25, no channel is special-cased, and converting it does change the results, as the gamma ray shows."),

q(1, "A series passed to `completeness` holds an infinite value at entry 1. What comes back?",
 "A refusal naming the field `values[1]`, whose message says the value must be a finite number or missing (null).",
 ["A completeness figure that counts the infinite entry as missing, with a flag giving that entry's position in the series.",
  "A completeness figure that counts the infinite entry as present, since it is a number and is not null, undefined or NaN.",
  "A refusal naming the field `values`, whose message says the series must be a non-empty array of finite numbers."],
 "The engine's own words are: values[1] must be a finite number or missing (null). The field is `values[1]`, the one entry, counted from 0. An infinite value is neither a measurement nor an absence, so the engine counts it as neither. The field `values` with the non-empty array message is the refusal for an empty series."),

q(0, "An empty series is passed to `completeness`. What does the engine return, and why?",
 "A refusal on the field `values`, since with no entries any figure it returned would be unearned.",
 ["A completeness of 1.000000, on the argument that nothing in an empty series is missing.",
  "A completeness of 0.000000, on the argument that nothing in an empty series is present to count.",
  "A result object with a null completeness and a `basis` note that the series held no entries."],
 "The engine's own words are: values must be a non-empty array. With n of 0 there is nothing to divide by and nothing to describe. It could return 1 or 0 on either argument, and either would be a number a report could quote with confidence it has not earned, so it refuses and names the whole argument."),

q(3, "The engine tables 23 refusals across 20 functions. When one arrives in your script, which part should you read first, and why?",
 "The `field`, because it names the exact input the engine refused, so you know where to look before reading the message.",
 ["The message, because the field is only a code number that points into the engine's list of messages.",
  "The basis block, because a refusal keeps its convention there beside the partial result it managed to compute on the way.",
  "The number it carries, which is the value it could not use."],
 "A refusal is an object with `error` and `field`, and the field names the input to fix: `values`, `values[1]`, `unit` and so on, spelled as the function spells the input. A refusal carries no number and no basis block, since a basis arrives only with a result, and the field is a name with no code number behind it."),

q(2, "Why can every lesson and question in this course quote the Ekene data to the last printed digit?",
 "One generator draws every series on stated seeds, so the same inputs give the same file anywhere.",
 ["The Ekene data were recorded once in the field and archived, so every copy matches.",
  "Rounding to six decimals hides any difference between one generator run and the next.",
  "The generator uses a new seed each run, and the course keeps the run that found every defect."],
 "Every series comes from one generator, d1_fields.mjs, which draws through the canonical mulberry32 of lib/stats on stated seeds, so the file is reproducible. It then plants documented defects, 22 of them, each found by a named check. Nothing is archived from a real field, the seeds are stated and fixed, and rounding is not what makes the figures repeat."),

emit(Q, '/root/dai-wip-dataqc/banks/d1b_m01.json', expect_n=15)
finish()
