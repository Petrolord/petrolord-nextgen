# Grounded and correct are different questions

{{panel:ae-scoring-explorer}}

A supported claim was found in a passage the answer cites and retrieved. That is a statement about the passage and the answer: the figure is traceable to a source. Whether the source says what the answer claims is a separate question. This course keeps the word "grounded" for that narrow meaning and never lets it stand for true.

## A supported answer to the wrong well

System B's Q05, "When did water break through at Ekene-6?", answers:

> Water broke through at Ekene-6 on 2024-09-01.

It cites EKD-027, which B retrieved, and EKD-027 contains the date 2024-09-01. The check finds it, and the answer is fully supported. EKD-027 is about Ekene-3's breakthrough. Ekene-6 broke through on the reference date, 2024-03-01, and B's short answer, "2024-09-01", scores exact match 0. It was planted: a wrong date that is still supported.

The check did exactly what it states. It found the figure in the passage. It cannot know that the passage is about another well, because it reads figures, dates and quotes, and nothing else.

## A number that matches by coincidence

The course states an answer of its own: "The spill was 5 bbl.", citing EKD-025, with no retrieved list given. EKD-025 says "5 months". The check matches the value 5 and ignores the unit, so the answer is supported, 1 of 1.

Both cases have the same lesson. A supported claim tells you where to look. Reading the passage tells you whether it says what the answer claims.

## Grounded beside correct

This is why the course reports groundedness beside the answer scores. For system B:

| query | groundedness | exact match of the short answer |
| --- | --- | --- |
| Q05 | fully supported | 0 |
| Q12 | two claims unsupported | 1 |

Q05 is grounded and wrong. Q12 is right and ungrounded: the depth is correct and its citation points at a passage that does not hold it. Each score catches what the other misses.

## Pooled and per answer

The engine returns two averages of support, and its basis names the difference:

> supportedFraction pools every claim of every answer; meanAnswerSupportedFraction averages the answers that have at least one claim

| figure | system A | system B |
| --- | --- | --- |
| pooled supported fraction | 0.959184 | 0.731707 |
| mean of the per-answer fractions | 0.962121 | 0.687500 |

The pooled fraction weights each claim equally, so an answer with five claims counts five times. The per-answer mean weights each answer equally. On system B the two differ more than on system A, so say which one you quote. An answer with no claim at all, such as system A's Q14 and Q24, has no fraction and is left out of the mean, with the reason:

> the answer has no checkable claim (no quote, date or number), so the supported fraction is undefined

That is a result returned as null, with the reason. The call succeeds.

## Exercise

Open the view for groundedness with its defaults. Find Q05 in B's answers and confirm that it draws no row in the table of unsupported claims. Then open the short answers view, change A's Q05 answer to B's, "2024-09-01", and read its exact match. Back in the groundedness view, replace the answers with the stated spill answer, `[{"query": "Q10", "text": "The spill was 5 bbl.", "citations": ["EKD-025"]}]`, switch "Use the retrieved lists" to no, and read the tiles.
