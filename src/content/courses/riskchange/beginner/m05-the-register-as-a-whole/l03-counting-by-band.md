# Counting by band

A register of a dozen risks can be read row by row. A register of several hundred cannot, so it is summarised by counting how many risks sit in each band. The engine function that does that is countByBand, and the one thing to understand about it is in its description: it counts whatever list it is handed.

{{panel:rc-risk-explorer}}

## What countByBand does

countByBand takes a list of risks and returns how many of them fall in each band: "Critical", "High", "Medium", "Low" and "None". It does not filter by status. If the caller hands it every risk in the register, drafts and closed risks included, it counts every one. If the caller hands it only the live risks, it counts those. The choice of population belongs to the caller.

It also counts one score at a time, inherent or residual, and that choice belongs to the caller too.

## Every risk, inherent

Handed all 12 OBODO risks and counting the inherent band:

| population | "Critical" | "High" | "Medium" | "Low" | "None" |
| --- | --- | --- | --- | --- | --- |
| every risk, inherent | 5 | 3 | 2 | 1 | 1 |

The counts add to 12: 5 plus 3 plus 2 plus 1 plus 1. Every risk lands in exactly one column. The five "Critical" risks are OB-01, OB-02, OB-03, OB-08 and OB-10, whose inherent scores are 15, 16, 20, 15 and 20. The one "Low" risk is OB-09, inherent 4. The one "None" is OB-11, whose impact of 6 is off the scale.

## Live risks, inherent

Handed only the 10 live risks:

| population | "Critical" | "High" | "Medium" | "Low" | "None" |
| --- | --- | --- | --- | --- | --- |
| live risks, inherent | 4 | 3 | 2 | 0 | 1 |

These add to 10. Compared with the first row, OB-10 has left the "Critical" column, 5 becoming 4, because it is "Closed". OB-09 has left the "Low" column, 1 becoming 0, because it is "Draft". Nothing else moves, because the other ten risks are in both lists.

## The "None" column

The count has a fifth column for a reason. OB-11 has no inherent score, and it must be counted somewhere or the column totals would stop adding to the list's length. Putting it under "None" keeps it visible. A report that shows only the four real bands drops OB-11 without a trace, and a reader totalling those four columns would find one risk missing with no clue which.

## Checking a count

Two checks are worth doing on any band count. First, add the columns and compare the total with the size of the list that was handed in. Second, look at the "None" column and name the risks in it. Both checks take seconds and catch two reporting errors: a population that is not the one the report claims, and unscored risks quietly dropped.

## The mistake

The mistake is to expect countByBand to know which risks matter. It does not look at status. A count that includes closed risks is exactly what the function was asked for if the caller handed them over, and the caller is the one who has to say so.

## Exercise

Record the band counts for every OBODO risk, inherent, and for live risks, inherent, and show that each row adds to the size of its list. Name the risk that moves out of "Critical" between the two rows and the risk that moves out of "Low", and state the rule that explains why countByBand counts them in one row and leaves them out of the other.
