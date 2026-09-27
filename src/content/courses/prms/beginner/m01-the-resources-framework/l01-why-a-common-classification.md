# Why a common classification

{{panel:prms-classification-calculator}}

An oil or gas quantity means little on its own. A lender, a partner, a government and a buyer of shares all read a figure differently unless it comes with two labels: how likely the project behind it is to go ahead, and how sure the estimate itself is. SPE-PRMS 2018 (June 2018; CC BY-NC-ND 4.0), the Petroleum Resources Management System, gives the industry one shared set of those labels. This course teaches it section by section, in its own words, and works every example through a calculator that states its reasons.

## Two questions for every quantity

The framework asks two separate questions of every estimate. The first is about the project: is the accumulation discovered, is there a way to recover it, and is the project commercial? The answer is a **class** (PRMS 2.1 and Table 1). The second is about the estimate: what is the low, the best and the high outcome? The answer is a **category** (PRMS 2.2.2.2). A figure carries one answer to each, and this tier teaches both.

| class (engine) | Ekene projects in the class | category labels, low to high |
| --- | --- | --- |
| Reserves | 2 | 1P, 2P, 3P |
| Contingent Resources | 3 | 1C, 2C, 3C |
| Prospective Resources | 2 | 1U, 2U, 3U |
| Discovered Unrecoverable | 1 | none |

The Ekene field is synthetic, written for this course, and its eight projects run through every module.

## Why the course never quotes the standard

SPE-PRMS 2018 is published under a licence that forbids commercial use and derived works, and this course is sold. So the course cites the standard by section number and explains every idea in plain words of its own. You will see references such as "PRMS 2.1.3.3" throughout. Public texts, such as the Petroleum Industry Act 2021 and the US Code of Federal Regulations, are quoted word for word with their citation.

## Four words with a narrow meaning

This course uses four words more strictly than everyday speech does.

**Reserves** is one class of the framework: discovered, commercial and still to be produced. A national or company total is called "reported reserves", with its date and who reported it.

**Resources** means all quantities together. Each class is named in full: Contingent Resources, Prospective Resources.

**P90** always means the low estimate, the figure with at least a 90 percent probability of being met or exceeded when the method is probabilistic.

**Proved** means the cumulative low estimate of Reserves, the 1P. The slice is written Proved (P1), and the same pattern holds for probable and possible.

## What the engine does

The course's calculator calls one engine. Its function `classify` takes the stated facts of one project and returns the class, and `categorize` takes three estimates and returns the categories. Every decision comes back with the PRMS section it applies, so you can check the working line by line. The engine decides nothing that an input does not state.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The class, the sub-class and the chance of commerciality". Start from "EKN-1 Ekene Main waterflood" and read the Class tile, then the Source block at the foot of the result, and write down the section the classification cites. Switch the start selector to "EKN-6 Ekene Deep prospect" and do the same. For each project, write one sentence that answers the first question of this lesson, the class, and name the facts in the box that led to it.
