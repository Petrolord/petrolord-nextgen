# Pooling leaves into outcomes

{{panel:qr-event-tree}}

A tree can end in the same outcome by more than one path. EREMOR's overfill produces a pool fire when the bund contains the spill and it ignites, and again when the bund is overtopped and the spill ignites outside it. An individual risk calculation needs one frequency per outcome, so the engine adds every leaf that shares an outcome name into a single total. This is pooling, and forgetting to do it is one of the commonest ways to undercount.

## The pooled totals

| outcome | total frequency per year | leaves pooled |
| --- | --- | --- |
| no release | 0.001900000000 | one |
| pool fire | 0.000014500000 | two |
| no fire | 0.000085500000 | two |

The two pool fire leaves, 0.000007000000 and 0.000007500000 per year, pool into one outcome at 0.000014500000 per year. The two no fire leaves pool the same way. The engine returns both views: every leaf with its own path and frequency, and then the total per outcome. Read the leaves to check the tree and the totals to use it.

## Reading only the first leaf

Suppose an analyst finds the first pool fire leaf and stops there. The pool fire frequency then reads 0.000007000000 per year, which misses the leaf through the overtopped bund. That figure is a real leaf frequency, and it looks perfectly reasonable on a page. It simply leaves out the second leaf, and every individual risk built on it would come out short as well.

The protection against this is the outcome name. When two leaves carry the same `outcome`, the engine pools them without being asked. A leaf with no `outcome` of its own takes its branch name, so two branches both named fire, in different parts of a tree, also pool.

## A pooled golden case

The golden case three-way-with-pooled-outcome runs a tree with a three way branch set and an outcome reached by more than one path. Through the engine it gives:

| outcome | frequency per year |
| --- | --- |
| fire | 0.000858000000 |
| safe | 0.011752000000 |
| escalation | 0.000390000000 |

Each of those is a pooled total. The oracle that wrote the golden computed every tree in exact fractions, and the engine matches it. No published source prints an event tree worked example, so the golden cases are the reference here.

## Why pool by name

Pooling is what turns a tree into the input the next step needs. A location-specific individual risk multiplies one frequency per outcome by one stated probability of death per outcome at a place. The pool fire kills with the same stated Pd whichever path produced it, so the two leaves belong together before that multiplication.

The name is therefore a modelling decision. Two outcomes that look alike but kill differently at a place should carry different names, so that each can meet its own stated probability of death.

## Exercise

Add the two no fire leaf frequencies, 0.000063000000 and 0.000022500000 per year, and confirm that you reach the pooled total in the table. Then add the three pooled totals of the overfill tree and check that they return the initiating frequency of 0.002000000000 per year.
