# Scenarios and roll-ups

Every fit you have made so far belonged to one well and one stream. That is not an accident of the interface, it is the shape of the data model: the fitting state is per stream, so there is no such object as "the field's decline". When you need a field number, something has to assemble it out of single-well work, and the thing that does the assembling is the group roll-up.

Understanding what it assembles from is the whole lesson, because a roll-up total is only as trustworthy as the objects it added up, and most people never look at those objects.

## What a roll-up actually reads

`rollupGroup` takes four arguments: a group (a name and a list of well ids), the project's well map, the list of saved scenarios, and one stream. It returns four things: a per-well list, a missing-wells list, a total EUR, and a combined rate series binned by calendar month.

Notice what is not in that argument list. There is no rate table. The roll-up never sees production data, never fits anything, and never re-forecasts. It reads **saved scenarios**, which are the durable artifacts a user writes after fitting and forecasting one well. If nobody saved a scenario, the roll-up has nothing to add up, and it says so.

The selection rule is worth reading twice. For each well in the group, the engine finds every scenario whose `stream` matches the stream you asked for, keeps the one with the newest `createdAt`, and uses that. One scenario per well. Not the best one, not the one you were looking at, not an average of them: the most recently created one for that stream.

Then, for each selected scenario, it does two things. It adds `forecastResults.eur` to the running total, and it walks `forecastResults.rates`, binning each point into a calendar month by the point's own date.

## Wells without a scenario are reported, never dropped

This is the design decision that makes the function safe to use. A well in the group with no matching scenario does not silently contribute zero to the total. It goes into `missingWells` with its id and its name, and it is your job to look.

Here is why that matters. Take the four Ekene producers, save one base oil scenario for each, then ask the same group for a roll-up of the **gas** stream. The engine returns a total EUR of exactly 0, an empty per-well list, and zero months in the combined series, because no scenario carries `stream: 'gas'`. The only evidence that anything went wrong is a `missingWells` array with four entries in it. A zero that comes with four names attached is a data-coverage problem. A zero read off a summary tile with the names ignored is a field with no gas, which is a different and false statement.

Stop and internalise the habit now: read `missingWells` before you read `totalEur`. Every time. It takes one second and it is the only line in the output that can tell you the total is not about the field you think it is.

## The staleness trap

The second failure mode is quieter, and no field in the output flags it. The rule is "most recent scenario", and recency is measured by `createdAt`, not by quality, not by relevance, and certainly not by whether the fit behind it is still defensible.

Suppose an analyst fitted Ekene-6 in 2022 on primary data, saved a scenario, and left. In 2024, after the flood response, someone else refits the oil stream on a post-response window and saves a better scenario. From that moment the roll-up uses the 2024 scenario, and that is correct. But reverse it: if a colleague later saves a quick throwaway scenario to test something, that throwaway becomes the newest, and it silently replaces the considered work in every roll-up of every group that contains the well. The total will change and nothing in the total will explain why.

The named misconception here is **"the roll-up is the field model"**. It is not. It is a photograph of whatever four people last saved, and the per-well list, with its scenario names and `createdAt` stamps, is the caption. Read the caption.

## Worked example: what a three-well total looks like

Run the roll-up over all four producers with all four base oil scenarios present and the total EUR comes back 461475.535264973 stb, with an empty missing list.

Now delete Ekene-5's scenario and run the same group again. The group still lists four wells, so nothing about the request changed. The engine returns:

- `totalEur` 308014.850023706 stb
- `missingWells` one entry, Ekene-5

That total is a perfectly formed number. It has the right units, it sits in the right order of magnitude for a four-well field, and it is 66.7456509578234 percent of the four-well total. The 153460.685241267 stb of Ekene-5's booking are simply not represented. Nothing in the number itself hints at that, and a screenshot of the tile is indistinguishable from a real field total.

## Exercise

Work out, before you look at anything, what each of these does to a roll-up over the four Ekene producers, and what evidence in the output would let a reviewer detect it.

1. A fifth well is added to the group with no scenario saved.
2. Two scenarios exist for Ekene-3, an old primary-window one and a newer one saved from an accidental full-history fit.
3. The group is rolled up for the water stream instead of oil.

Then write the three-line check you would run on any roll-up output before quoting its total: one line about `missingWells`, one about the per-well scenario names, and one about the `createdAt` stamps. Keep it. The next lesson totals the Ekene field for real, and the lesson after that shows that even a complete, current roll-up has two fields in it that do not mean what they are called.
