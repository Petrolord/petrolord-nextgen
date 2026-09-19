# Events with no hours are refused

{{panel:ss-rates-explorer}}

Give the pooling function a site with 0 hours and 1 recordable, and it returns no rate at all. It refuses the whole call and names the period by its index:

> exposureHours[3] is zero but counts has events in that period: an event needs someone at work

The index counts from zero, so `exposureHours[3]` is the fourth entry in the list. Put the same bad entry second in the list and the refusal names `exposureHours[1]` instead:

> exposureHours[1] is zero but counts has events in that period: an event needs someone at work

| a period in the list | hours | events | what the engine does |
| --- | --- | --- | --- |
| working site | above zero | 0 or more | included in the pooled rate |
| mothballed site | 0 | 0 | rate null, counted in `periodsWithoutHours` |
| bad entry | 0 | 1 | whole call refused, period named |

## Why this is bad data

The last lesson showed that a period with no hours and no events is fine: nobody worked, nothing happened, and the period contributes nothing. A period with no hours and one event is different. An event needs someone at work. If somebody was injured at the site, somebody was there, and their hours belong in the list. Either the hours are missing or the event was recorded against the wrong site or the wrong month.

The engine cannot tell which, so it will not guess. Setting the event aside would lose an injury from the record. Keeping the event and ignoring the zero would put an event over hours that belonged to somebody else. Both would produce a rate, and both rates would be wrong. So the engine refuses and says where to look.

## Why the index matters

A pooled rate may run over dozens of sites or months. A refusal that said only "bad data" would leave someone reading down a spreadsheet for the problem. The engine names the field exactly, down to the position in the list, so the person fixing it can go straight to that row. On KWALE, with a mothballed site listed fourth, one recordable against it produces the refusal for `exposureHours[3]`.

The same shape of refusal guards the other list inputs. If the counts list and the hours list are different lengths, the engine names the hours:

> exposureHours must be an array the same length as counts

## What to do with the refusal

The fix is never to change the zero to a small number to make the call go through. That would invent hours. Go back to the source: find who was working when the event happened, record their hours against that period, and run the rate again. If the event belongs to a different site, move it there. When the lists are right, KWALE's three working sites pool to 0.968312 per 200,000 hours, and a mothballed site with no events can be listed without changing it.

## Exercise

Open the rates explorer's pooling view and type KWALE's three sites followed by a fourth with 0 hours and 1 event. Copy the refusal and check which index it names. Then move that bad entry to the second position in the list and confirm the index changes to 1. Finally, set the fourth site's event count back to 0 and confirm the pooled rate returns to 0.968312.
