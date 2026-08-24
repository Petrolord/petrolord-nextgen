# The conversion factor

The factor that turns feet into metres is

$$1\ \text{ft} = 0.3048\ \text{m}$$

and the important word in that line is not the number. It is the equals sign. This is a definition, not a measurement, and understanding the difference changes how you treat the factor everywhere it appears.

## Defined, not measured

Most conversion factors in engineering come from measurement. Somebody built an apparatus, took readings, and published a value with an uncertainty attached. Use such a factor and you inherit that uncertainty, and the more of them you chain together the more of it accumulates.

The international foot is not like that. It is defined as exactly 0.3048 metres by international agreement, which means the foot is specified in terms of the metre rather than being compared against it. There is no experiment behind the number and no error bar under it. The digits do not continue past the 8. Writing 0.30480000 adds nothing, and writing 0.305 loses something real.

Three consequences follow, and all three matter at import.

**The factor contributes no error.** When a converted depth differs from what you expected, the factor is not a candidate explanation. The arithmetic is exact, so the difference has to come from somewhere else, and the next lesson but one shows exactly where.

**There is nothing to tune.** No calibration, no per-region variant, no vendor-specific table to maintain. The engine holds the factor as a single named constant and every conversion in the codebase references it.

**Rounding it is a choice you make, never one the standard makes for you.** If a converted number comes out ugly, that is what the correct answer looks like. Beautifying it is a decision you are taking on your own authority, and the Associate tier already showed what rounding a converted step costs over the length of a well.

One historical footnote is worth carrying, since you may meet it in survey data. A second definition of the foot exists in older United States survey practice, and it differs from the international foot by a tiny amount that is nonetheless not zero. It is irrelevant at logging depths and it matters in land surveying, where positions are referenced over long distances. The importer uses the international foot for every foot-flavoured unit string it recognises, which is the right choice for well depths, and the fact to remember is that a foot is a defined quantity and you should know which definition you have when precision reaches that level.

## Why the factor is looked up, not guessed

The importer does not decide the unit from the data. It reads the unit string that the file declares for its depth curve, normalises it by trimming whitespace and folding case, and looks that string up in a table.

The table maps the metre spellings M, METRE, METRES, METER and METERS to a factor of 1, and the foot spellings F, FT and FEET to 0.3048. Anything else returns nothing at all, and the import stops with an error naming the unrecognised unit and pointing the reader at the ~Curve section.

Consider the alternative, which is to infer the unit from the numbers themselves. It is tempting, because the heuristic seems strong: a well running from 4900 to 5200 has values too large for a shallow metric well, so it must be feet.

The heuristic is wrong, and it is wrong in the case where the cost is highest. Plenty of wells reach 4900 m and beyond, and a deep metric well is exactly the well where a wrong guess does the most damage, because a deep well's depths carry the most weight in every structural interpretation built on it. A rule that works on shallow wells and fails on deep ones is worse than no rule, because it earns trust in the easy cases before it costs you in the hard one.

Guessing from the numbers also has no answer when the numbers are ambiguous. A well from 1500 to 1650 is a perfectly ordinary metric well and a perfectly ordinary short interval in feet. The data does not know. Only the declaration knows.

## Refusal is a feature

The behaviour worth defending is the refusal. When the unit string is not recognised, the pipeline does not fall back to metres, does not fall back to feet, and does not pass the column through with a warning. It stops.

Falling back to metres would be the friendliest failure and the worst one, because a foot well quietly relabelled as metres produces a well in the wrong place with no symptom. Falling back to feet would be the same error in the other direction. A warning in a log file is not better, because warnings are read by whoever is watching at the time, and the well outlives them.

A stopped import costs a person five minutes to look at the ~Curve section and tell the pipeline what the unit is. A wrong import costs whatever gets built on the well before somebody notices.

## Exercise

Write out the factor for feet, then answer three questions in one sentence each. First, what would change about the number if the definition of the metre were refined tomorrow. Second, why does the importer read the unit string rather than inferring the unit from the range of the depth values. Third, what does the pipeline do when the declared depth unit is a string it does not recognise, and why is that better than defaulting to metres.

Self-check: one foot is exactly 0.3048 metres. Nothing about the factor would change if the metre were refined, because the foot is defined in terms of the metre rather than measured against it, so the relationship is fixed by the definition itself. Inferring from the range fails because deep metric wells reach the same depths in metres that shallower wells reach in feet, and a range like 1500 to 1650 is entirely plausible in either unit, so the data cannot settle the question and only the declaration can. On an unrecognised unit the pipeline stops with an error naming the unit, which is better than defaulting to metres because a foot well relabelled as metres is wrong with no visible symptom, while a stopped import costs one person a few minutes.
