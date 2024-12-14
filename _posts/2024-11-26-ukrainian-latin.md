---
title: "The state of Ukrainian Latin"
tags: [ukraine, transliteration, romanization]
date: "2024-11-26 00:01"
thumbnail: true
---

TL;DR prefer [DSTU 9112:2021][DSTU9112] transliteration by default, if not bound
by a (legacy) law to an alternative.


Ukrainian writing system is traditionally based on Cyrillic alphabet, for example
this pangram:

    Хвацький юшковар Філіп щодня на ґанку
    готує сім'ї вечерю з жаб.

And so, in communication with Western countries, there has always been
a need to represent Ukrainian texts, places and personal names in Latin script.

Ukraine has a long history of attempts to write Ukrainian language in Latin script,
yet none of them have been widely adopted in Ukraine:
- [Romanization of Ukrainian][WROU]
- [Українська латинка][WUKL]

You can compare different historical systems with this browser extension I made:
[Ukraïnsjka Latynka][PVEXT].

[KMU 55:2010][KMU55] is the system currently used and adopted internationally.
It is a lossy transliteration of Cyrillic:

    Khvatskyi yushkovar Filip shchodnia na ganku
    hotuie simi vecheriu z zhab.

Since it is a lossy encoding, it is not reversible, and is hardly used for texts,
only for names in official documents.

[DSTU 9112:2021][DSTU9112] is a recent Ukraine national standard. It is reversible
back to Cyrillic, covers historical texts, and provides two alphabets, with and
without diacritics:

system A

    Xvacjkyj juškovar Filip ŝodnja na ganku
    ğotuje sim'ï večerju z žab.

system B

    Khvacjkyj jushkovar Filip shchodnja na ganku
    ghotuje sim'ji vecherju z zhab.

Here is a comparison of city names written in new and the legacy system
([see the full list][PVKAT])

| Name | uk-Latn-A | uk-Latn-B | KMU55 |
| -- | -- | -- | -- |
| Авдіївка | Avdiïvka | Avdijivka | Avdiivka |
| Бахмут | Baxmut | Bakhmut | Bakhmut |
| Глухів | Ğluxiv | Ghlukhiv | Hlukhiv |
| Київ | Kyïv | Kyjiv | Kyiv |
| Ржищів | Ržyŝiv | Rzhyshchiv | Rzhyshchiv |

As a national standard, DSTU 9112 is expected to replace legacy systems over time.

The movement for the complete replacement of Cyrillic with the Latin alphabet
is practically non-existent these days. It is too radical, without major benefits.
At the same time, the need to write Ukrainian language in Latin script
has always been present. Ukraine's recent national standard meets this need
with a nice system.

If you want to practice Ukrainian Latin, I suggest adopting DSTU 9112. It is good
enough for written text, compared to the alternatives. System B you can type
on a generic keyboard layout. For System A you will need a custom keyboard layout,
some examples here: [keyboard layouts for Ukrainian Latin][PVKBD].

Reference card ([IPA][IPAU]):

    ◌j, consonant+j forms a digraph, palatalizing the consonant:
      nja /nʲa/, cje /t͡sʲɛ/, sjk /sʲk/
    j in other positions: j /j/ m'ja /mjɑ/, p'je /pjɛ/, juk /juk/
    u /u/
    y /ɪ/
    ï, ji /ji/
    c /t͡s/
    č, ch /t͡ʃ/
    ğ, gh /ɦ/
    š, sh /ʃ/
    ŝ, shch /ʃt͡ʃ/
    x, kh /x/
    ž, zh /ʒ/
    other letters are generally intuitive:
      a b d e f g i k l m n o p r s t v z

If you are writing software that includes Cyrillic transliteration,
here are helper libraries: [software libraries for Cyrillic transliteration][PVLIB].

And if you need a quick online transliteration from Cyrillic,
here is the page: [Cyrillic transliteration online][PVTR].


[WROU]: https://en.wikipedia.org/wiki/Romanization_of_Ukrainian
[WUKL]: https://uk.wikipedia.org/wiki/Українська_латинка
[DSTU9112]: https://uk.wikipedia.org/wiki/ДСТУ_9112:2021
[KMU55]: https://zakon.rada.gov.ua/laws/show/55-2010-п
[IPAU]: https://en.wikipedia.org/wiki/Help:IPA/Ukrainian
[PVKAT]: https://paiv.github.io/ukraine-toponyms/
[PVEXT]: https://paiv.github.io/latynka/en/
[PVTR]: https://paiv.github.io/latynka/en/convert.html
[PVKBD]: https://paiv.github.io/latynka-keyboard/
[PVLIB]: https://paiv.github.io/uklatn/
