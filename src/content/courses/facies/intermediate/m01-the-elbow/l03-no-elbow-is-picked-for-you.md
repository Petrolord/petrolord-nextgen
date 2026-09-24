# No elbow is picked for you

{{panel:ef-judge-explorer}}

Many tools draw the inertia curve and mark a point on it as the elbow. This engine prints the curve, the drops and the fractions, and marks nothing. That is a stated choice, and this lesson is about why it is the honest one.

## What the engine says it does

The elbow result carries a basis sentence for its pick, and the sentence is about what it does not pick:

> bestSilhouetteK has the highest mean silhouette; a tie goes to the smaller k. No elbow is picked automatically: read the drops

The one k the engine does name, `bestSilhouetteK`, comes from a different measure, the silhouette, which the next module teaches. For the inertia curve itself, the reading is left to the person who will sign the result.

## Why an automatic pick would mislead

On the 180 cored rows, standard scaling, seed 3, 10 starts, the drop fractions read:

| k | drop fraction |
| --- | --- |
| 3 | 0.668972 |
| 4 | 0.282430 |
| 5 | 0.112303 |
| 6 | 0.079256 |

A rule such as "take the k with the largest drop fraction" returns k 3. A rule such as "take the last k before the fraction falls below some share" returns k 4 or k 5 depending on the share chosen. Each rule is a choice, and each would print a single number that looks like a finding. The core of these wells describes 4 facies. An automatic pick of k 3 would disagree with the rock without anyone having decided to disagree with it.

Inertia also cannot choose on its own terms: it keeps falling as k grows, down to 0 at one cluster per distinct row. Any rule on the curve is a rule about how much fall is enough, and that is a judgement about the purpose of the clustering, which the curve does not know.

## A reading is written down with its table

So the engine prints the table and the person reading it writes down where they see the elbow and why. On these rows a fair reading is: the fraction falls sharply after k 3 and again after k 4; by k 5 it has fallen to 0.112303, and no larger k shown reaches that figure again. A write-up that says "k 4" should carry that table beside it, so a reader can disagree with the reading from the same numbers.

The later modules add evidence the inertia cannot give: the silhouette of each k, and at the end a comparison with core. Where those disagree with the elbow, the write-up says so.

## A request the elbow refuses

The silhouette is optional in the elbow call, switched on by `withSilhouette`. It must be a true or false value, and a word in its place is refused:

> withSilhouette must be true or false

## Exercise

In the elbow view, run the Ekene cored rows, seed 3, largest k 8. Write your own reading of the drop fraction column in two sentences: the k you would choose and the numbers that support it. Then write a rule that would have picked a different k from the same table, and name the k it picks. Keep both sentences with the table you read them from.
