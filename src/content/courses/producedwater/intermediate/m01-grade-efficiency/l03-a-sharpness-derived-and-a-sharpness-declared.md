# A sharpness derived and a sharpness declared

Three devices in this module carry a sharpness of 3 and two carry a sharpness of 2. Those two numbers have completely different standing, and a reader who can say which is which has learned the most portable thing in this course.

{{panel:pw-water-explorer}}

## The declared one

The gravity devices and the hydrocyclone use a sharpness of 3. It lives in the module's frozen `DECLARED_CONSTANTS` under `defaultSharpness`, described there as the grade curve of the gravity and centrifugal devices.

DECLARED means customary or chosen, with no publication anywhere in this repository to check it against. The module's own comment says that PINNING such a number is all any gate can do, and a pin is not a validation. What a pin buys is that moving the value is a reviewed act rather than a silent one.

That matters here more than it looks, because sharpness is worth real percentage points of removal. A reader should treat the 3 as the model's stated selectivity and not as a measured property of a basin.

## The derived one

Flotation and the media bed use a sharpness of 2, and that value was not chosen at all.

Both of those devices capture by INTERCEPTION. A droplet is caught when it comes within its own radius of something, so the capture rate goes as the SQUARE of the droplet diameter. Integrate a rate like that over a fixed time or a fixed depth and the survival is an exponential in the square of the reduced size. An exponential in the square of the reduced size has the same half point and the same leading power as the reduced efficiency family at m equal to 2, so that is the family the train integrates.

Nothing about that argument is a preference. Change the capture mechanism and the exponent changes with it.

## Reading the difference off a train

The Professional train in this course puts both kinds of device in series, and the sharpness column is printed beside every cut size for exactly this reason:

| device | cut micron | sharpness |
| --- | --- | --- |
| 200 liners | 4.430689 | 3 |
| 5 cells of 12 m3 | 23.734355 | 2 |
| a 20 m2 bed | 9.149437 | 2 |

The two sharpnesses in that table are not a style choice, and the difference between them is worth real percentage points of removal on the same water.

## The habit this builds

Every figure in this module arrives with a status. It is DERIVED, meaning it follows from something else on the page. It is DECLARED, meaning somebody chose it and the module says so in one frozen place. It is a CALIBRATION, of which this module has exactly one. Or it is HELD, meaning the repository carries no publication and the module states the absence rather than guessing.

Ask that question of the two sharpnesses and you get two different answers, from one line of code that looks identical in both places.

## Exercise

Name the four kinds of number above, and place the sharpness of 3 and the sharpness of 2 in the right one of them.

Then say what would have to change about a media bed for its sharpness to stop being 2.
