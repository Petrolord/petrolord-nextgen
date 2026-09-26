# A scope, a tender and a contract

{{panel:pr-envelope-calculator}}

A company that needs work done on its wells writes down what it needs, invites contractors to offer a price, and chooses one under rules it stated before any offer arrived. This course teaches those rules as arithmetic you can check by hand, and this first lesson sets out the three words the rest of the tier stands on: the scope, the tender and the contract.

## The scope

The scope is the written description of the work: what is to be done, where, to what standard and over what period. The first Ekene tender in this course is synthetic, written for this platform, and its scope reads: two producers, Ekene-3 and Ekene-5, near the top of the Ekene Sand; rig up coiled tubing, clean out fill to the perforations, pump a 15% HCl matrix treatment with nitrogen lift, flow back, and move to the second well.

## The tender

The tender is the invitation and everything that answers it. The invitation carries the scope, a bill of quantities for each bidder to price, the technical criteria with their weights, a pass mark and the award basis. Each bid comes in two parts: a technical proposal and a priced bill. The well services tender asks for six priced items:

| bill item (fixture) | unit | what it prices |
| --- | --- | --- |
| mob | lump sum | Mobilisation to Ekene-3 |
| ct-spread | day | Coiled tubing spread, 18 operating days |
| pump-spread | day | Pumping spread, 6 pumping days |
| acid | m3 | 15% HCl treating fluid with additives, 60 m3 |
| nitrogen | thousand scf | Nitrogen for lift and displacement, 120 thousand scf |
| demob | lump sum | Demobilisation from Ekene-5 |

## The contract

The contract is what the winning bid becomes. The evaluation decides which bid that is, and it decides nothing more. An evaluated cost ranks bids under stated rules, and a combined score depends on the weight and the scoring methods chosen. That is why the course quotes every such figure with its settings beside it.

## Rules that can be written down

Every step of the evaluation you will learn is a rule with a source, and every source is a public text named with its edition. The engine behind the course, `engines/supplychain/tender.js`, applies those rules. Each figure a lesson quotes is a value it returned on fixed inputs, and the same inputs give the same figure on any machine.

## Where the practicals run

This is an engine course, and there is no Suite app for it. Every practical runs in the course's own calculator panels, which call the same engine the lessons quote. At this tier that is the envelope calculator above. It starts from the Ekene well services tender, and you can replace any of its inputs with bids of your own.

## Exercise

In the envelope calculator, choose the view "The whole tender in one call". The box holds the whole well services tender as one block of text. Find in it the criteria, the pass mark and the six bids, then find the six bill lines of the table above inside the first bid. Read the award tile and the table of excluded bids. For each excluded bid, write one sentence saying at which stage it left the evaluation. Keep those sentences: the next module explains both exclusions.
