# Where that is safe and where it is not

Flatten-and-reshape gave the right answer on `wrapped_12.las`, and it gave it through a mechanism simple enough to hold in your head. That is a good position to be in, and it is exactly the position where a reader stops asking questions. This lesson asks them, because the honest description of a design includes the conditions it depends on.

The mechanism is right when two things hold. The number of tokens in the flat stream is an exact multiple of the declared curve count, and every record is complete, meaning each depth step contributed one full set of values in curve order with nothing missing and nothing extra. When both hold, the stride puts every value in the curve it came from. Neither condition has anything to do with wrapping, which is the point of the whole design.

Now take them away one at a time.

## A truncated final record

Suppose a transfer was cut off, or a writer stopped mid record, so the file ends part way through a depth step.

Follow the arithmetic. The stream is short by some number of tokens that is smaller than one full record, so the total is no longer an exact multiple of the curve count. The divisibility guard fires before any reshape happens, and the parse stops with a plain error that names how many values the data section held and how many curves the curve section declared, and says the file is ragged or truncated.

That is the behaviour you want. The failure is loud, it happens at parse time, and the message names the two counts a person needs. Nothing plausible and wrong gets built out of a half record.

Now change the truncation slightly. Suppose the file was cut cleanly at a record boundary, so whole depth steps are missing from the end and no partial record remains. The token count is still an exact multiple of the curve count, the guard sees nothing to complain about, and the parse succeeds. Every value that is present lands in the right curve, and the file reads as a shorter log.

The parser is not wrong here. It reported exactly what the data section contained. What it cannot do is know that something used to be there. Absence at a record boundary is invisible to a divisibility test, because divisibility is a property of what remains.

## A stray token

Now suppose a token got in that should not have, or one got lost from the middle.

If the miscount is not a multiple of the curve count, the guard fires again and the parse stops the same way. That covers a single stray token, and it covers most small accidents, because a small accident rarely adds or removes exactly one record's worth of values.

If the miscount does happen to be a multiple of the curve count, the guard passes and the reshape proceeds. From the position of the stray onward, every value is one slot out of place. A gamma ray reading is assigned to the density curve, a density reading to the neutron curve, and the depth column picks up a value that is not a depth. The curves are internally consistent, they have the right length, and they are wrong from a point in the middle to the end of the file.

That is the harder failure, and its danger is the one from lesson 1. The misplaced values are all real log readings, so nothing in them looks like corruption. They are just in the wrong columns.

## What the guard actually is

State the limit precisely, because the precise version is more useful than a vague warning.

The divisibility test is a necessary condition, not a sufficient one. It catches every corruption whose effect on the token count is not a multiple of the curve count, and it catches none whose effect is. It says nothing about whether the values are in the right order, whether a record is missing from the middle, or whether the file describes the well it claims to.

The parser makes no attempt to hide this. Its errors are plain and line numbered, and a token that is not a number at all stops the parse immediately with the line named, so text contamination in the data section is loud. Within the data section, what the parser can promise is that the reshape is arithmetically consistent with the counts the file declared.

## Where the second net goes

Since the parser cannot catch the divisibility-preserving cases, the defence has to sit outside it, and you already have two pieces of it.

The first is the header frame cross-check from the previous lesson. The depth frame implies a sample count that was computed without looking at the tokens at all, so a file that lost or gained whole records disagrees with its own header. That check is independent of the reshape, which is precisely what makes it worth running.

The second is the depth column itself, and this is where the campaign's uniform-step reading turns out to be doing more than one job. A record missing from the middle of a file leaves a gap in the depth column, and a step test that is allowed to fail will fail on it. A stray token that shifts everything by one slot puts a curve value into the depth column, and the depth column stops being monotonic. Neither of those checks was designed as a parser check, and both of them catch parser-invisible damage.

That is the shape of the honest answer. The reshape is sound for the files the format guarantees, loud for the corruptions that break its arithmetic, and silent for the corruptions that do not. The silence is covered by cross-checks that come from a different direction, and running them is your job rather than the engine's.

## Exercise

For each of these three situations, say whether the parse stops or succeeds, and if it succeeds, say what is wrong with the result and which cross-check would find it: a file cut off part way through its last depth step, a file cut off cleanly at a record boundary with whole depth steps missing from the end, and a stray extra value inserted in the middle of the data section.

As a self check: the part-way truncation leaves a token count that is not a multiple of the curve count, so the guard fires and the parse stops with an error naming both counts. The clean truncation preserves divisibility, so the parse succeeds and returns a log that is shorter than the well it describes, which the header frame cross-check finds because the declared start, stop and step imply a sample count the file no longer holds. A single stray value breaks divisibility and stops the parse, but a stray amounting to a whole record's worth of values does not, and in that case everything after the insertion point is shifted by one slot, which shows up as a depth column that is no longer monotonic or a step test that fails.
