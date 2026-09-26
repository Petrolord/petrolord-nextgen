# Mandatory requirements first

{{panel:pr-envelope-calculator}}

Before a single technical mark is given, each bid is checked against its mandatory requirements. These are pass or fail conditions: a bid security in the required form, a bid form signed by someone with authority to bind the bidder. A bid that fails any one of them leaves the evaluation there. It is not scored, and its price envelope is never opened.

## Why requirements come before scores

A mandatory requirement protects the tender itself. A bid with no security can be withdrawn without cost after the prices are known; a bid with no signature may bind nobody. Scoring such a bid would spend the panel's time on an offer the company could never accept, and a high score might tempt the panel to overlook the defect. So the engine checks requirements first and states the order in its stages: the technical envelope runs mandatory requirements, then the pass mark.

## WS6 on the well services tender

Each well services bid carries two requirements, bid-security and signed-bid-form, each marked met or not met. Five bids meet both. WS6 meets its bid security and does not meet signed-bid-form. The engine returns it with this reason:

> WS6: failed the mandatory requirement signed-bid-form; the bid is not scored and its commercial envelope is not opened

WS6 is the bid with the strongest technical proposal on paper, with scores of 4 on four of its five criteria. None of that is read. Its row carries no technical percentage at all, which is different from a percentage of zero: the bid was never scored.

| bid | bid-security | signed-bid-form | status |
| --- | --- | --- | --- |
| WS1 to WS5 | met | met | scored against the pass mark |
| WS6 | met | not met | fail-mandatory |

## Every failed requirement is named

When a bid fails more than one requirement, the engine names them all, so the report to the bidder is complete. Stated as a test, with both requirements set to not met on WS1, the reason reads:

> WS1: failed the mandatory requirements bid-security, signed-bid-form; the bid is not scored and its commercial envelope is not opened

## Two refusals on the shape of a requirement

Each requirement is an entry with an id and a met flag of true or false. If the requirements arrive as text instead of a list, the engine refuses:

> bids[0].mandatory must be an array of { id, met } when given

If an entry is missing its met flag, it refuses that too:

> bids[0].mandatory[0] must be { id: a non-empty string, met: true or false }

The engine will not assume a requirement was met because nobody said otherwise. The words "when given" matter: a bid with no mandatory list at all is simply scored.

## Exercise

In the envelope calculator choose "The technical envelope". In the bids box, find WS1 and set both of its met flags to false. Read the status and the reason the panel returns for WS1, and check that the other bids are unchanged. Restore both flags. Then delete the word met and its value from WS1's first requirement and read the refusal, noting the field it names.
