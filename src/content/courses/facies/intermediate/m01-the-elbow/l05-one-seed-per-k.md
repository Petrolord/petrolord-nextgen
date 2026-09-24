# One seed stream for each k

{{panel:ef-judge-explorer}}

An elbow is a table of k-means runs. For its rows to be checkable, each row has to be a run that someone else can repeat on its own. The engine makes that true by giving each k its own seed stream, and this lesson shows what that buys.

## How the seed is used inside one k

A single k-means call with nInit starts draws the starting rows of every start in turn from ONE mulberry32(seed) stream: start 0 takes the first draws, start 1 the next, and so on. Each start runs Lloyd passes to convergence, and the lowest inertia wins. At k 4, seed 3, 10 starts on the 180 cored rows, three of the ten starts print the winning inertia, 58.289042, and the earliest of them, start 3, keeps the win:

| start | passes | inertia |
| --- | --- | --- |
| 0 | 5 | 58.330411 |
| 1 | 4 | 75.958349 |
| 3 | 6 | 58.289042 |
| 5 | 5 | 58.289042 |
| 8 | 6 | 58.289042 |

The engine reports the largest difference between those three and the winner as 0, and a run that only equals the best so far does not replace it, so the earliest keeps the win.

## How the seed is used across k

The elbow does not continue one stream from k to k. Each k starts a fresh mulberry32(seed), so the k 6 row of an elbow at seed 3 is exactly the single `kmeans` call at k 6, seed 3, with the same starts. The engine's basis reads:

> kmeans(X, k, seed, nInit) for each k, each k with its own mulberry32(seed) stream, so a row equals the single kmeans call

At k 6 both return 47.642067. The k 4 row of the seed 3 elbow is the teaching clustering, 58.289042.

If one stream ran on from k to k, the k 6 row would depend on the draws k 1 to k 5 had used. With a fresh stream per k, any row can be checked on its own.

## A seed is part of the result

The one-against-ten table the Associate tier read shows why the seed stays attached to a figure. At k 4 with ten starts, 9 of the 10 seeds shown reach 58.289042 and seed 5 stops above it, at 58.297079. With one start, the figures run as high as 78.775612, at seed 5 and seed 7.

So an elbow row is quoted with its seed and its starts. Two elbows at different seeds can differ at a k where one of them stopped poorly, and that difference is a fact about the starts. It says nothing about the rows.

## Passes in the elbow

The elbow also prints the passes of the winning start at each k: 6 at k 4, 11 at k 5, 2 at k 1 to 3. Passes count assignment passes, the confirming pass included. A high count shows a run that took longer to settle, and says nothing of quality.

## Exercise

In the elbow view, run the Ekene cored rows with seed 5, largest k 8 and the default starts. Before you read the k 4 row, predict it from the one-against-ten table above, using the rule that each elbow row equals the single k-means call at that k and seed. Then read it and check your prediction. Run seed 3 again and compare the two elbows row by row, noting every k where they differ.
