# The refusals, each naming its field

{{panel:ae-retrieval-explorer}}

Handed an input it cannot use, the engine returns an object with two parts: `error`, a sentence saying what is wrong, and `field`, the name of the input it refused. The sentence always starts with that name, so you can find the fault in your own input at once. This lesson reads the refusals you will meet first, in the engine's own words.

## No documents

A ranking needs something to rank. Handed an empty list, or a single passage id where the list of documents belongs, the engine refuses naming `documents`:

> documents must be a non-empty array of { id, text }

The message also tells you the shape it wants: a list of objects, each with an id and a text.

## A repeated passage id

Two passages with one id would make a ranking ambiguous, so the engine refuses the second and points back at the first. With EKD-001 given twice it names `documents[1].id`:

> documents[1].id repeats EKD-001 (documents[0])

The field names the position of the repeat, counted from 0, and the bracket names where the first copy sits. An empty id is refused on its own:

> documents[0].id must be a non-empty string

## A query that is not text

A query is a string of words. Given a number instead, the engine names `query`:

> query must be a string

When several queries run at once, each is checked by position. A null query text names `queries[0].text`:

> queries[0].text must be a string

## A method the engine does not offer

Asked for a method other than TF-IDF or BM25, the engine names `method`:

> method must be 'bm25' or 'tfidf'

## Refusals and notes are different things

A refusal means the call did not run. A note means the call ran and the result is honest about what it could not do. A query of punctuation only, or a query whose words appear in no passage, is not refused. BM25 returns an empty ranking with the reason beside it:

> the query has no token, so no document is ranked

> no document contains a query term, so no document is ranked

TF-IDF gives its own reason for the second case:

> no query term is in the corpus vocabulary, so no document is ranked

Say "returned with a note" for these, and keep "refused" for a call that returned `error`.

## Why read the words

The message states the exact condition, so it tells you what the engine accepts as well as what it rejected. A panel shows the engine's `error` as returned.

| what you gave | field named |
| --- | --- |
| no documents | `documents` |
| a repeated id | `documents[1].id` |
| a query that is a number | `query` |
| a method not offered | `method` |

## Exercise

In the retrieval explorer choose "BM25, read term by term". Replace the passage box with `[]` and read the refusal and the field it names. Put the hand set back, then copy the d1 line so d1 appears twice, and read which position the engine names. Next type the JSON `[{"id": "a", "text": 5}]` as the passages and read the refusal for a text that is not a string. Put the hand set back once more and type the query "helicopter": confirm the result carries a note and no refusal. The method list in the panel offers only the two methods, so the refusal for any other method is read here in the lesson.
