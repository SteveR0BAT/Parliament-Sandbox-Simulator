#!/usr/bin/env python3
"""Inject the configurable, Latin-script generic deputy name generator."""
from pathlib import Path
import base64
import re
import zlib

ROOT = Path(__file__).resolve().parents[1] / "website"
DEPUTY_NAMES_SOURCE = zlib.decompress(base64.b64decode("eNptWstuI0eW3ddXEEIvqgaWbLhfhqvdBvWWSEoyKataZRhwkBlkhvIRdGQGVUlnLXo16B+YZRvGDOCpAbwwDMzKO9r/NefciKQk92zIfETcuO97bkSaYmld3aubpe590zvUS183F6rQk7rJde9tb+5s0dvZe58Dqp2Xz569/37vOnVa75YY1ZuqMqt6yumeKWtd1saWKs+b3tRZlez1+nnes74G0Z6peiClSlPpBIN7Q1Xjt5o5s6z3nsn6+yDW+6T3xdy4qv64V9XOlIv3eoVJklw/3OfqX9+OVY0RpS+m2r0H8qY2KufDT7unX758NrNlVff2+xeDyce9sZ5Zl/zlNxK/J0z8FVx886zXK3xemxl+vFP5x70vdvq5fqPKRLt2pJxR7TnErdp+oZxqT3XpTNZO7BwvhkYV7UGqy/aW70bgxLZn5cKZpL3E8PbKmQbD/Azzj3JdqvYaFL9uTxUub0xWW9deqASkJqrwOm/7JrPtodEL2w61yVV7pVZ4fOLUTLcDLNqeVWrKgWVty3akTTtWc4UHx05jqbPEmao9UIXJc91eWJW2r8naER6QD6x0WBgoFStVqWovq5lyO+/1ds6hm0rk1e2D/K9A/1yrEsvhQXvrKz+PgoxMGdji7JF1C47KV3CSNfRSJl+vTFW3l5maU0a7Ulk7tlVloIFSZVCkShKVtFe6dnbVTgymQtGpKquKgk11ZiDwvcorXBz6qYVcEwWpq3aAUWAN5gZfYLOCAcCBVh7KzKBICHxgqxrqmDqVmqI9NtUsxfCxKjB/X7tFe2Xh6jPf9tNCJ+1QCZVDr1yt2xtVfe0hx6mdz+HMECzRjS7AEGiNvFumTfva6NyUZO5YO6cN1pyAh5JkxirFtHbfqHKWmvYgVy6jnj7Y+/CPX74Hl4OynZmpkt4WNP8KBqM3QQWYbyFbDRXPUpr2UK3gUOe20su0vU4RXzBxqlyOeYeINQyB69WpvqdbpLZs8Bp+UNtlGnTk8ArzUx88oWkvc7OCL/RX5HqZ4jL4FTxOKNsaaugXEJGWckuQOYIjNlDF1CwUnOkoN2vMqNPonCO4MS13Y2bwakyDm6jSPnauKE6ULgpylNwrlzzyuUCuX5Y6uuPQeqSTRwsOtYaKm6gRLhDcAKtHNVaiRz7gKkvxKFPDBfIcwQETOzgBVqjr9pXKM9xe0URwEN2UNk/gI87arGqjY5+qBgIcw6cwBtG1nAolm9MF2jEFc4ks513JIdZSZftQlG5AxMMscI3UOI2cAL+zXDk1teKiUDCzHAP60JYIlbKdeJBeiQ9VqV2CRFkvLLymgR5yhMIrzNGl+NSfPuTvnz8Uz5o6JMUqpWNRTZOaHt0GA9DoVLCGUHrrcU/twPzWtH1Xp57aWBhkeloH3qSMaE0nsHB76hdpO/ZLWrLzRZhrgfivH5lq6w0PXhX9AqQU8hBMLeJj1nHO+MGDKyySQ4HQNNQG1ejotWBDPK02eQLnXZQoVlv3evCgKEonYBTmKjW5WXbSdzxLvHWeKU4X3Q3CNI8EOVd4hQSmn7hbDK3Ol0KgS7zqKhrqONe15B74dQpuqDjqyjsHF77SrFq0PL2hgAIee8N1qsLcfpXOnJ3TW01578wihbpgj7l6g9xWr++jqE89DTKSeo457QAPI1Wu6WzGle6RLeCwSL/lLKd9P6dk99bCEcS5F9U9gEOKbEtLTJt2P1ezTAbQJdXCawmowJO44x8/4u/vPxJ3nNOi4o1SRq4Mc2VQsZQw2vbc5wZJc/OP2lCPocSyWKGmqXLzPTN/H3UNY04U/FvS3RtT6G2dC3nigBLokM80yOXRjAtbSxErmdE273KjH3kj0pbONdmAO23+uwrc8M1BmtvNOwwoobODzbsZYrntexcobP5R8H4fKMVIHO5cKZ/DTWaoHJU4Bicb5hxUFw891Cw8JT0zltlH3hZ53wocqioUC9N1s2IRjJWuoznUcz1dYW5c60Q5qfJSMzC1dqzcY+vfIBgRXZhybJGlDOENSGEGahczcGRZYz7eHfqlJXlxIbBu6eKPLDLUC6GM9YTWMfnhOlVF9uAn5aw98QxfODus5GJuAV5aKajQibf8XtxkoV0RqiGQUUVQQO5iVMYEJbGG/0mt53ClQa480qDN50jQizbqShAE0gLcJ8PYYxSwN8FbEPyYNdQMAFoK2lcdvvMsc1So6ryHkazaAfIPRpQRmZQsaqbqqp6uCQcFDD340zBgI8dopLLWpsqUJCmhAJKOWM1oOPQslRI2DzlpK29g6mEl4fQa4acroTTa/CzqnMxSwOKa/6U2THwdzAnYaATMgmu1KKXczbIwx+ePgA3uN/81x4uBBTf7yrMGgg/qf8C4EA23F9p3w5Fa1wA/RSEmg3c65SGW2/y8oIltoIskVsvFEMbRgVWWPC3lcYA5jE1NxxnqVEYONv+b5k+8wsGXTHCLh+Q+AXgDKu1QLJ7j7gKwGREEFWYpwclNDjRSmIh9TETRZyyotx7TxCPgrERpKA+6gPzoGgAvTfnYMwLUvcwXCsiyVnSTM/GHyUrXOUH8UQbQL4+uUZb4BFAZlCqJQdK4sjlf32hHIolep6hdw8YncEmxJ9myK3pDAMO8EikbLddR9vgmihhugtxxXCd0eCWSxzdhBTARFiD/kT753ZIXz43Ucb0lTu63tMtHPLcTPOL/wK+RHSpcAVbzucVU/A/hiInGe7vmLdoA0Fwx79g1Bwfwf2PzTCZhTMN7aA8JYoXWxdQV/mE+Tp/oQnO1E5v7KR4jn1kkoQSP9u0iEY5uQHpKIsc6sSS+lQghkDcK09CCqSrck3U4AcddOrlD6s0xZoQ+gk9Fi3olTvlRKGlG/KDzyqoS3SGPIxuvrQBxbSXPIKlayQEzAr6Yv+hYuGFLiMRLrFeamNIsI28ms65tgZRnu3oXIEWiKRQbB7wwkrNCG4qiZNnyAMbjr1tRxZwYU0krzGL0FndhebfAgxuVs6dnGkNOZTMaGsUbRKzdRgGtjlWBuJc6dJ/GwjCwGQFATpHMwsS4AVBSMW9J2tqKSiqhDRwjuK30TpjRHlVLW5nabnsmiU1LiG2LadBMII6HSL1Qwb7zvFY5OUCpQk7QPdErSvbMQK2hB6SYSdDuek1DFVPo2EjxqzFrX7kp8hD6OAIaxga7TGeDKCAzFgxsKKbfsqxkZRN1bMTgT1q8asldkDS6yV3wEtHUtmkLNTp0++fEjI71IGAObgaMzIJ/V2oKEWObz8CF4s8FxG7+zobbxo0HyL75QazOPyyFaKGH8C7uGoR8xvr34B00vyD0aHzkr1gLOUIJ9KJazsrNuwC3hcfOBYaEck8Z3vwdOT//DSORA3qGuBLCgG/HFqjjhwW77RNbrjff5biCisvNd0j363a4+WmJP7Ky+aHE1QQvUOTW7dXmHfcaTjY/FQ8D2nMDiMdxY29Q5x4IHWK1tRgdrjDymx/tOuqPg9laIURzVAH4lK8NiPPFhcIAx4DELQxnCywi3N5svlvLJkHYUzgxYhtHRxuFjH+AOoCpl1DzOnhGSCDcivOgUWnBxXbzn7bTnMSukWwxF1aujVpwQ8ji90rThaIfQFmb71VugxkLmmPzE+0RTRGM1OHlsAMVYpOeal3sonRMB+vo7WLm/+EOkgtCxAwTKiK6O5OoCI7QnAVsFEM8Gjh0iLV68JTI0ZbDod/80DHzyCs6OudWSSGiQkgkbA3FrZ/tXsuVDv/S05rthg/diTOr6N7A87oCTpwAlyrxK6KIqlPfSi7ZPQ65HcRJAb7Lm35eaMo7NlMsAQMY8EDVAL+msI02b2RpOlVggczhXssaF55AdGIVPefGxKFlLbQOmOdh4ET1RMCdR01T7V0WU8cI4Aiwuy+/Iw8R59zCIdxHhAKW4zdrDwhgoJACKbCELftIeN1mHfwdi6G9+o+CyEsXKm9f66bUS9aFedtvfv0WhUUBrmH2nLsu2q3QcVdEw9zjwmPXwAcaXh+hcBxoEt0nhJtoghndBCTTZ0LUT3jl0pxzgQ48MBcYR0PPVg9OGHYQb3/5MS8QoAPVkA9it82/Y/Ws/fWfKsXCHJD88uO6u3C//FhAqHW9+dllYA6PKOQ6kbl9VwGeIV5/+Za9Aqb88uPme/TRfArCxHkDgfgWjwceHQ7mZnj56z9NAY1kxG3gs1/rX79Fkvm55H8/qyx6YJ/7GubPQORa4fFALUn3CCaV9Y66rZlYCxZaKq1ghlB1JfezeSMkPYMNcwGxSvoWOjtD/TU0NUV+ztKaLc4JbgtmotJkjNsswDXNzJNa7nYSElywQkpwYaziJnRfahrqqCZahQvUsiprQeiWOR4zrxHM1MuQfADuaikSJaMRxdqjhgYbbzfqhJ8xiK23jASWg3AXBMRPWZE1SQWNqUnWmpoDfV6dYLkqXRmpqaYCHT4FpsmIHEx7XZkMFYo7A7aQuSdIirmMQvGEkkycfsj2Ml6LtmUMuKlW2+cDO+UMvhihmiTbF9cVnBuio7WYgp/ApMkCjwMUA5CBqNT0IPV1tV0U6ZJD9hUQKQ9IgBdS6kQ4RfehKwETE8JR5/NOAvZ8HY1+JS2Eac86TTCoAUhl8CTVLKsmpIoPw3ZfqqdO39OvIpgIyOLCQuVHyMKIG+kw+1IGPof2bgFM+XxkqxRAbhV2pc5qdE+XzBBHZIQhFAtN7GVvpRMXI4I4/Anz4L74GZsV/OWo4gYRmGSW66/CHvHQ2NjG59zvV0Q+c2mVghhwgy2D0IqlU5pGpT5yN0nptvC+Ou34kCXRbgdAemB5+IIoYuu35l6/FIZ6DRwp26mKRwWdkNJ2s+VDX8+Cl4Pv/toCDDVcasm8jN4imfJ8gHt9pVy90qbioUG5GzdVFHPuIRJVKYdCEG3NLVslJxcouarZynGZqgYPQR1xIVhz97KEBhsuhEljvUC3QTljkxE6Xxk9kwJgwTlPKMI5hZwqMc3eykbLnGchcA+wwEakPeVDhHB37tFlYaQ6U8SzJzRVCY+bxMT0cJobRkEJMMU2XocKOR2MwoC3qsIAphC8PkUeiEdWZ1TloTTFY7idErdRoJ+yC6GD0ERmWvYik7wUAXgRylN/mvg8h0lxoXMXzk2mqLM9LAeW5TKI3sk2wiDrZU+a9OM5EhJVZVFjZCkEAPQhm1LO+oys6xQ6KhKabDoVR3T3iDsMvLsDR595BFrK/YTdY7S8pL47UpXsMOxG5eJqIu/i8Q5MAISP5DNlBwMbFjRwhutTPJBdBrgvhBSNlMFvUFLAYm2mYAqMLFJu9WtTyCHDFI9HBCqDFLI04hB/CCUEPVEZEaMcynEz65Y7fpxnSX5kUCPOPXc43njcv05NqgRBlo3nIJ4oMvwX7d+Msnj2ShMvKzlFvAXmlTdlwxvNMzzFge1nfD5UHIqLU49GidVowsgCyIZ7sGSUC9maEh6MDsuxaoOfzwzH/w00b+OwV3wwNGAxXPjuEFUW4O9rsv7K4996TIWSaHjcQhKPymMB7RFqYZEhbl8zO/JAVoRgXcPFNe8O+eIUTB7z4kARSAsbH+x9EHRryqRr6GEiNP3uzvPMz9QNXTv1BKgU98ZkLHkEDkRFK8DXVEk+mcpeEzSt4plvOF49lEs4YUpgpGVLcdUwfapyZWQ6CjZ/xxx5oVPuF9k7Im4TgMAdsgkCq8biK6CSkXSVPBBgl5ZVaSFRMPCMq7G6w/JwsirkyMQRS63onE7reIg7ElHGSGVwfscsJigbGapga1izyYSd0jbQPPFL4mqdJA3GQ8yzRvYWuSt+wz1AIj6OgGIPFcNBoNXSSo8BnFzL1oRdEv2CdafkJJLdeoWaM/DIwkA0iI5SuztNYIuyKVcQoa7D5ZXJub8HOj5JPU+o0Ivco6zsW6JQ9YZ97T7GhyOIYNeMO+ViV/jlLm060Vb+D+1u4+nRuwA/p0qeIXR2K7TRtzoMNbv3Fi8xTi7OrS05GnMkG4JSw81kzNaBFEdxIRKZ+N0p3V/LSwii8ZrZUu6PQPMOaaLBUhIk8jexdlcxI+02yCyMo7DyNSanjXBdLsLVBFQWwsepMHEUeJeey8jR/GkYZklVMpUEHs+veSzI004q01DqBczFyEg5EMTOQ1AWEjSXaaBCCD6gCKf3fN1PyxBi56IDXo2RUQZsfi1THZEQ3PUUcy8QMhNWowvqOgTeH8RAd0R/MashZ3p0V2PmAV5MiGj5MGM+Khg53B86qys+OVQm46cEmUfSPUXh5lSTIVHgkWPzw8fc3YSM/YwJGqkopLoxi4ixgTiLWcnM3W/4VcIRD/mRT43gRa4EznkLES3BsyV6C3VHWOtnrHnkgD59y0ekPUFKlrBSFMWvfeAWMITD4icQrwjE0P9CKKge2KqgGNtPGIhRGxk/IJVbrsC+DgMTpoZKUTW4W3jumI3IsFA4K60nahUqp5EGLWDWRFYsalw0Y+92ypdhFi4ydY+WesHfEz67zFQYo+XZsb8LnT0sGIHKfPsdwylHBCjxGpcJGxoVv5oZ3Ksifr8CRF/eA44v7FpuwD9hWKKBh9DN+3ssBte9Rg+tjEAWbr+AqgBCw27lOlVTVjOnRF255lq2qKRdSXKuX3LTFCYFEcEp/Iwl59+IuEnADgpLxDqXvip4vLtv/VTNlAvZ9UKjV0Z84CdUbvawnqqbcj/2HilZPuMZ6Yzd/rWu5kAHsEsC+19K7kQRqGQhlPzE3MkW7RIs0yIBItG2C1NZrG1qX+hcYhgtiZr79iLJ7coz11ZESJnU5rA+MkpmC+qNW7sj21gQKnjchJojW6Ijvwhf+GS2zO6ZRcBlxbCkToBttHxpZJcykRXYZ/e+PcwRDGy3gjgCsuNa4Zuc+EVP90VMZK5jlYxEBkgWpr92CKfNOx6wsCrfhzWfchHXvMhsZdhWFWFjK4XFFn4rSSfgVhKd0cqd4vuN2FzUM2KSAq88mwUnZlkjCwJ13DFFBHlHvvaqjZqOwne6OpJGLrcLwoA5D0HCJxlYDLgsbPP+mXs1b18+ezb35YwNX29pZtlz1L28+2ztRXchn5mF79LQm3pd9T7pceBetcxN/Xyn3XnxkudduvaujEO+QDyne/McdfS5XPK01RbPX/T+LY7YQzO9qNMXX7589vbZM/1GPvHbcrNAp40A0Q+fvj2v+O3bx//y+d8nvZ0nn8Dt/H98h8/1OKnqvsaLN2jVy8eP+T3ek4/zsMAHX+JHPsn7Qpj4svfpp+F+78nSL7fryXJUE5X6sPaLhxH8QLAb0PEgr8289xuN/fWTR7y96PT81e++EcJve7/7hsTefvVAPAzvyD+S98Vvx6CUko2nC/7lifyfcqkweo9fCvXr5x+82Kvt58uldgeIgecv3u591fs4UnzkCo9ZfFjuMcNvn/0fS3ygCw==")).decode("utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    target = ROOT / path
    text = target.read_text(encoding="utf-8")
    if new in text:
        return
    if old not in text:
        raise RuntimeError(f"Expected source marker was not found in {path}: {old[:100]!r}")
    target.write_text(text.replace(old, new, 1), encoding="utf-8")


def main() -> None:
    names_path = ROOT / "src/lib/deputyNames.ts"
    names_path.parent.mkdir(parents=True, exist_ok=True)
    DEPUTY_NAMES_SOURCE = DEPUTY_NAMES_SOURCE.replace('chinese: ["Wei|Jian', 'chinese: ["Xi|Wei|Jian', 1)
    DEPUTY_NAMES_SOURCE = DEPUTY_NAMES_SOURCE.replace('|Cao|Peng", 0.05', '|Cao|Peng|Wongyang", 0.05', 1)
    names_path.write_text(DEPUTY_NAMES_SOURCE, encoding="utf-8")

    replace_once(
        "src/lib/types.ts",
        "export interface ChamberSettings {\n",
        '''export type DeputyNameStyle =
  | "multicultural" | "american" | "british" | "french" | "german"
  | "russian" | "italian" | "spanish" | "portuguese" | "turkish"
  | "georgian" | "hebrew" | "arabic" | "chinese" | "indian"
  | "korean" | "japanese" | "african";

export interface ChamberSettings {
  genericDeputyNames: DeputyNameStyle;\n''',
    )
    replace_once(
        "src/lib/defaults.ts",
        "export const DEFAULT_SETTINGS: ChamberSettings = {\n",
        'export const DEFAULT_SETTINGS: ChamberSettings = {\n  genericDeputyNames: "multicultural",\n',
    )
    replace_once(
        "src/lib/parliament.ts",
        'import type { Deputy, Faction, Party, ProjectData } from "./types";\n',
        'import type { Deputy, DeputyNameStyle, Faction, Party, ProjectData } from "./types";\nimport { generateDeputyName } from "./deputyNames";\n',
    )

    parliament_path = ROOT / "src/lib/parliament.ts"
    parliament = parliament_path.read_text(encoding="utf-8")
    old_names = re.search(r"const FIRST = \[.*?\n\nexport const deputyList", parliament, re.S)
    if old_names:
        parliament = parliament[:old_names.start()] + 'export const randomName = (style: DeputyNameStyle = "multicultural") => generateDeputyName(style);\n\nexport const deputyList' + parliament[old_names.end():]
        parliament_path.write_text(parliament, encoding="utf-8")
    elif "generateDeputyName(style)" not in parliament:
        raise RuntimeError("Could not find the old deputy name arrays in parliament.ts")

    replace_once(
        "src/lib/parliament.ts",
        "export function makeDeputy(partial: Partial<Deputy> = {}): Deputy {",
        'export function makeDeputy(partial: Partial<Deputy> = {}, nameStyle: DeputyNameStyle = "multicultural"): Deputy {',
    )
    replace_once("src/lib/parliament.ts", "    name: randomName(),", "    name: randomName(nameStyle),")
    replace_once(
        "src/lib/parliament.ts",
        "      name: asLeader ? party.leader : randomName(),",
        "      name: asLeader && party.leader ? party.leader : randomName(d.settings.genericDeputyNames),",
    )
    replace_once(
        "src/lib/store.ts",
        "const dep = makeDeputy({ ...tpl, ...(list[i] ? { name: list[i] } : {}) });",
        "const dep = makeDeputy({ ...tpl, ...(list[i] ? { name: list[i] } : {}) }, d.settings.genericDeputyNames);",
    )
    replace_once("src/lib/store.ts", "const dep = makeDeputy();", "const dep = makeDeputy({}, d.settings.genericDeputyNames);")
    replace_once("src/lib/store.ts", "const dep = makeDeputy({ partyId: party.id });", "const dep = makeDeputy({ partyId: party.id }, d.settings.genericDeputyNames)")
    replace_once(
        "src/lib/defaults.ts",
        "{ ...makeDeputy(), ...(dep as object), id }",
        "{ ...makeDeputy({}, d.settings.genericDeputyNames), ...(dep as object), id }",
    )
    replace_once(
        "src/components/SettingsPanel.tsx",
        'import type { ChamberSettings, CategoryId, VotingMode } from "@/lib/types";',
        'import type { ChamberSettings, CategoryId, DeputyNameStyle, VotingMode } from "@/lib/types";',
    )
    replace_once(
        "src/components/SettingsPanel.tsx",
        '      <Section title="Seat geometry">\n',
        '''      <Section title="Seat Geometry & Parliamentary Settings">
        <Field label="Generic deputy names" hint="Applies to newly generated deputies only. Existing names and manually entered names are unchanged. All names use Latin letters.">
          <select className="select" value={s.genericDeputyNames} onChange={(e) => upd({ genericDeputyNames: e.target.value as DeputyNameStyle })}>
            <option value="multicultural">0 · Generic Multicultural</option>
            <option value="american">1 · American</option>
            <option value="british">2 · British</option>
            <option value="french">3 · French</option>
            <option value="german">4 · German</option>
            <option value="russian">5 · Russian</option>
            <option value="italian">6 · Italian</option>
            <option value="spanish">7 · Spanish</option>
            <option value="portuguese">8 · Portuguese</option>
            <option value="turkish">9 · Turkish</option>
            <option value="georgian">10 · Georgian</option>
            <option value="hebrew">11 · Hebrew</option>
            <option value="arabic">12 · Arabic</option>
            <option value="chinese">13 · Chinese</option>
            <option value="indian">14 · Indian</option>
            <option value="korean">15 · Korean</option>
            <option value="japanese">16 · Japanese</option>
            <option value="african">17 · Generic African</option>
          </select>
        </Field>
''',
    )
    print("Generic deputy name styles added to the parliament settings and generation paths.")


if __name__ == "__main__":
    main()
