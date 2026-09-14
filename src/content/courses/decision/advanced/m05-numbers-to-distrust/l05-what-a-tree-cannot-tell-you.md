# What a tree cannot tell you

A decision tree answers one question: which action has the highest expected money, given the payoffs and chances drawn. Everything it was not given, and everything it does not model, lies outside that answer.

{{panel:ec-judgement-explorer}}

## No discounting

Neither module applies a rate. The EKPAN tree's success payoff of 420.0000 and its dry hole of -25.0000 enter the rollback exactly as typed, and the tree rolls back to 105.0000. If someone typed undiscounted revenue, the tree rolls that back just as happily.

## No risk attitude

The rollback maximises the mean. The EKPAN lottery's drill at 75.7500 beats its farm-out at 33.2500 while losing 80.0000 with probability 0.650000, and nothing in either module can weigh that loss more heavily.

## No correlation beyond the drawing

Chance nodes are independent unless the tree is drawn so they are not. The EKPAN tree's drill and farm-out outcomes share the chances 0.350000, 0.150000 and 0.500000 only because they were typed that way. Sweep one without the other and the tree describes two different prospects.

## Only the mean of a distribution

A linked Monte Carlo summary enters at its mean. The EKPAN tree with success linked to a summary of mean 420, P90 185, P50 390 and P10 710, where P90 is the low case, rolls back to 105.0000, identical to a plain payoff of 420.0000. The spread is carried and never used. In the Decision Tree Builder the link is also a copy taken at the moment of linking: a run that is revalued later is not re-read until it is linked again.

## One survey and two actions in the Analyzer

The VOI Analyzer values one survey before one decision, with no sequential information, and it offers exactly two actions: the named decision and "Do Not". The EKPAN lottery's survey typed into it gives a gross voi of 19.84, the two-action value. With the farm-out available, the Bayes engine values the same survey at 24.8250.

## A check that never repairs

The consistency check refuses numbers that are not chances and withholds a value built on chances that contradict each other. IRRI, typed with both indicators at 20 / 80 percent, implies a success chance of 0.200000 against a stated 0.3, and the Analyzer withholds its value of information. It never guesses which box was mistyped.

## The mistake

The careful mistake is treating a tree that rolls back cleanly as a model that is complete. A tree with no refusal and a clear margin can still carry undiscounted payoffs, a correlated risk drawn as independent, a stale linked run or a missing action, and none of those produces a message. Write each of them down beside every result.

## Exercise

Name five things these two modules do not model or do not check, giving for each a teaching number that shows it. Then explain why the Analyzer's gross voi of 19.84 and the Bayes engine's 24.8250 are both correct for EKPAN's survey.
