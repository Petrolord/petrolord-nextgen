# The four statuses

Four words describe how a barrier element is doing, and the engine accepts no fifth.

{{panel:wi-envelope-explorer}}

## The list

An element carries exactly one of these:

**verified**, **degraded**, **failed**, **not-verified**.

That is the whole vocabulary. The engine exports it as ELEMENT_STATUSES and it holds 4 entries. Anything else is not a status the engine will read.

## What each one claims

**verified.** Somebody tested this element, the test passed, and the test is still current. It is a claim about evidence, which the next lesson takes apart.

**degraded.** The element is impaired but still doing part of its job. A valve that seals slowly. A cement column with a channel that still holds most of the differential.

**failed.** The element is not doing its job. Not slowly, not partly. It is not a barrier.

**not-verified.** Nobody knows. There is no current test. The element may be perfectly sound and there is no evidence either way.

## Why the engine refuses a fifth word

Feed `envelopeStatus` an element whose status is not one of the four and it throws, naming the element:

`Unknown element status "..." on "...".`

That refusal exists because the alternative is worse. A function that silently ignores a word it does not recognise has to decide what to do with the element, and every choice it could make is a guess about a barrier. Refusing is the only honest option, and it puts the element name in the message so you can go and fix the row.

## They rank, they do not average

The four are ordered by how much confidence they justify: verified, then degraded and not-verified together, then failed. That ordering is the whole of the next module. What matters here is that an element never sits between two statuses. It is one of the four, chosen by whoever holds the test evidence.

## The vocabulary trap ahead

An ENVELOPE is described with a different set of words. Two of them, degraded and failed, are shared with the element list, and that overlap is the source of a real defect this course will show you. Keep the two lists apart from the start.

## Exercise

1. In the panel, set every element to verified, then change one to each of the four statuses in turn. Note the envelope verdict each time and keep the four results.
2. Write a one-line test that would justify moving an element from not-verified to verified. Then say when that verification expires.
3. Name one element on your own wells that you believe is sound but could not defend as verified today.
