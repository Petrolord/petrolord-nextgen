# What a tier claims

A tier is a sentence, not a badge. The engine's source writes each of the three out in full, and if you are going to quote one in a document that other people rely on, you owe it a close reading. This lesson takes the sentences apart clause by clause, and spends most of its time on the clauses that are not there.

## Benchmark verified, clause by clause

The full text, as the engine documents it: implementation has been tested against a published worked example and matches within the stated tolerance, and the reference case is recorded for traceability.

**"Has been tested."** Past tense, and by somebody else, on a date. Testing happened once, in a release, against a fixture that is committed in a repository. It is not happening now, and it is not happening to your case.

**"Against a published worked example."** Singular. One example is enough to earn the phrase. A path anchored on one printed table and a path anchored on six both come back with the same word.

**"And matches within the stated tolerance."** This is a conjunct, not a hedge. The claim is not that the code matched; the claim is that the code matched *to a stated number*, and if you drop the number you have not shortened the claim, you have changed it into a different and much weaker one. A tier quoted without its tolerance is a tier quoted wrongly.

**"The reference case is recorded for traceability."** The most useful clause and the most ignored. It is a promise that a string exists naming the source, and therefore an invitation to go and read it. Lesson 4 takes that invitation.

Now the missing clauses, and this is the part to write down.

It does not claim that your run is correct. It does not claim that the method is appropriate to your reservoir. It does not claim that the method is accurate in general, only on one case. It does not claim anything about when, because the date lives inside the reference string and not in the tier word. And it does not claim that the tolerance is small.

## Published method and engineering basis

`published_method` says the implementation follows a recognized peer reviewed or industry standard formulation, and that the workflow includes documented assumptions, internal checks, and calculation traceability. Everything there is about the code and its documentation. Nothing in it is a comparison against an outside number. It is the honest word for "we implemented what the literature says and we can show you our working, and nobody has printed an answer we could check against".

`engineering_basis` goes one step further down and says so explicitly: established reservoir engineering principles where a suitable public worked example is not available, documented, traceable, and ready for engineering use within stated assumptions. Note the shape of that last phrase. It does not apologise. It bounds.

## The tolerance is the claim

Nine of the twelve reachable paths come back with a tolerance attached. The values are 0.13, 0.19, 0.76, 1.5, 3.53 and 10 percent. The widest is 76.9230769230769 times the narrowest.

The instinct is to read that as a quality ranking, and it is the wrong instinct. A tolerance is an agreement measured on one specific comparison, and the comparisons are not alike. The oil pot aquifer path states 0.13 percent because it is compared against Pletcher's multicell simulation tables, where the reference is itself a numerical result computed to many digits. The oil Fetkovich path states 10 percent because it is compared against Dake's oil in place of 312 MMSTB, and Fetkovich and Hurst van Everdingen are different aquifer methods that were never going to agree to three digits on real data. A 10 percent claim against a hard target can be far better evidence than a 0.13 percent claim against a soft one.

So read a tolerance as the width of the door the developers were willing to walk through, and then ask what was on the other side of it.

## Three paths with no number at all

Three of the twelve return no tolerance: the volumetric gas line, and the oil tank with no aquifer in both its gas cap variants. The gas one is consistent, because it is `published_method` and a method claim has nothing to be tolerant about.

The oil one is not consistent, and it is the most important thing in this lesson. The oil tank with no aquifer is the path that ran the entire Associate tier. It comes back `benchmark_verified`, which asserts a match within a stated tolerance, and it states no tolerance. Its reference string does contain numbers, and they are wide: on Ahmed Example 11-3, engine 291.3 MM STB against Ahmed's graphical fit of 257 MM STB and a volumetric booking of 270.6 MM STB. Engine against graphical fit is 13.3463035019455 percent. Engine against volumetric is 7.64966740576496 percent. The gas cap variant on Dake Exercise 3.4 is much tighter, engine 115.5 MM STB against Dake's 114 MM STB, 1.31578947368421 percent, and the string says so.

Nothing there is dishonest. The reference string reports the spread openly and even names the cause, which is that a least squares fit and a graphical fit are different estimators. But the tier word promised a stated tolerance and the payload does not carry one, so a consumer that renders the badge and drops the string shows a reader an unqualified benchmark claim on the loosest comparison in the engine.

## Worked example: the tier claim moves when the model does, in the wrong direction

Run the Ekene tank as committed. Oil, no aquifer, no gas cap. Tier `benchmark_verified`, tolerance field empty, reference the Ahmed 11-3 and Dake 3.4 pair above. The answer is 12139208.1074968 stb and it agrees with the independent volumetric booking to 6.13761666407432e-15 relative, which is as right as an answer gets.

Now force a pot aquifer onto the same tank, which the Professional tier showed returns an oil in place of -516449.043355256 stb. The path has changed, so the tier resolves again: still `benchmark_verified`, reference now Pletcher SPE 75354 Tables 10 to 13, and a stated tolerance of **0.13 percent**.

Read that carefully. The run that is correct to fourteen digits carries no stated tolerance. The run that returns a negative volume of oil carries the tightest tolerance in the engine. Both are honest statements about their code paths and neither is a statement about the run, which is exactly the confusion lesson 3 exists to kill.

## Exercise

Write the tier sentence for a case of your own, in full, as it would appear in a reserves memo. Use this template and fill every slot: method path, tier word, reference case with its author and year, stated tolerance, and the date the validation was performed.

Then delete the reference and the tolerance and read what is left. Show both versions to a colleague and ask which one they would sign. The gap between the two is the whole reason this module exists.

Second part. Take the oil tank with no aquifer, which states no tolerance, and propose one from the numbers in its reference string. Say which you would quote, why, and what a reviewer would object to in the choice. There is no clean answer, which is the point.
