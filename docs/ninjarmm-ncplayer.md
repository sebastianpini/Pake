# NinjaOne Remote (NCPlayer) in a Pake desktop app

English · [Deutsch](#deutsch)

> **Disclaimer:** This is not an official NinjaOne feature but a workaround,
> provided "as is" without warranty, liability, or official support.

## What this is

[Pake](https://github.com/tw93/Pake) wraps a website into a small desktop app. This
fork adds one thing: **NinjaOne Remote sessions start NCPlayer from inside the
Pake app**, the same way they do in your browser.

It is a personal workaround for NinjaOne users, not a product. It is not meant for
the original Pake project and no pull request is planned.

## The problem

You package your NinjaOne instance with Pake and sign in (SSO works). When you
start a remote connection, the page says NCPlayer is not installed, even though it
is. In a normal browser the same click opens NCPlayer.

Why: NinjaOne starts NCPlayer through a hidden `<iframe src="ninjarmm://...">`.
Browsers pass that custom link type to the operating system. The WebView inside a
Pake app (WKWebView on macOS) does not, and Pake's link opener only allows
`http(s)`, `mailto` and `tel`.

## What the fork changes

Only two things, on the branch `ninjarmm-ncplayer`:

| File | Change |
| --- | --- |
| `src-tauri/tauri.conf.json` | The list of link types Pake may hand to the OS now also allows `ninjarmm://`. Nothing else is opened that was not allowed before. |
| `scripts/ninjarmm-launch.js` | A small script inside the app. It notices `ninjarmm://` iframes and links and passes them to the OS, which starts NCPlayer. |

## Status

- Tested on macOS (Apple silicon) with NinjaOne Remote: NCPlayer starts from the app.
- Windows and Linux are untested.
- Not signed or notarized. On first launch macOS may block it: right-click the
  app, choose Open, confirm.

## How to build your own app

You need NCPlayer installed, Node 20.9+, and Rust (<https://rustup.rs>). The
published `pake-cli` from npm does **not** contain this change, so build from this
fork:

```bash
git clone -b ninjarmm-ncplayer https://github.com/sebastianpini/Pake.git
cd Pake
npx pnpm@10.26.2 install
npx pnpm@10.26.2 run cli:build
node dist/cli.js https://your-instance.example/ --name "NinjaOne Demo" \
  --inject scripts/ninjarmm-launch.js
```

The finished `.dmg` appears in the folder you ran the command from. The first
build compiles Tauri and can take several minutes. App names may contain letters,
numbers, dots, dashes and spaces, but no parentheses.

Keeping it current: the fork tracks upstream Pake. Rebase the branch onto
`tw93/Pake` `main` when you want newer Pake versions.

---

## Deutsch

> **Disclaimer:** Dies ist kein offizielles NinjaOne-Feature, sondern ein
> Workaround. Bereitgestellt "as is", ohne Gewährleistung, Haftung oder
> offiziellen Support.

### Worum es geht

[Pake](https://github.com/tw93/Pake) macht aus einer Webseite eine kleine
Desktop-App. Dieser Fork ergänzt genau eine Sache: **Remote-Sitzungen von NinjaOne
starten den NCPlayer auch aus der Pake-App heraus**, so wie im Browser.

Das ist ein persönlicher Workaround für NinjaOne-Nutzer, kein Produkt. Ein Pull
Request an das ursprüngliche Pake-Projekt ist nicht geplant.

### Das Problem

Du packst deine NinjaOne-Instanz mit Pake und meldest dich an (SSO funktioniert).
Beim Start einer Remote-Verbindung meldet die Seite, der NCPlayer sei nicht
installiert, obwohl er es ist. Im normalen Browser öffnet derselbe Klick den
NCPlayer.

Grund: NinjaOne startet den NCPlayer über ein unsichtbares
`<iframe src="ninjarmm://...">`. Browser geben diesen Link-Typ ans Betriebssystem
weiter. Das WebView in einer Pake-App (WKWebView auf macOS) tut das nicht, und
Pakes Link-Öffner erlaubt nur `http(s)`, `mailto` und `tel`.

### Was der Fork ändert

Nur zwei Dinge auf dem Branch `ninjarmm-ncplayer`:

| Datei | Änderung |
| --- | --- |
| `src-tauri/tauri.conf.json` | Die Liste der Link-Typen, die Pake ans Betriebssystem geben darf, enthält jetzt zusätzlich `ninjarmm://`. Es wird nichts geöffnet, was vorher nicht erlaubt war. |
| `scripts/ninjarmm-launch.js` | Ein kleines Skript in der App. Es erkennt `ninjarmm://`-iframes und -Links und gibt sie ans Betriebssystem weiter, das den NCPlayer startet. |

### Stand

- Getestet auf macOS (Apple Silicon) mit NinjaOne Remote: Der NCPlayer startet
  aus der App.
- Windows und Linux sind ungetestet.
- Nicht signiert und nicht notarisiert. Beim ersten Start kann macOS blockieren:
  Rechtsklick auf die App, "Öffnen", bestätigen.

### Eigene App bauen

Voraussetzungen: NCPlayer installiert, Node 20.9+ und Rust (<https://rustup.rs>).
Das `pake-cli` aus npm enthält diese Änderung **nicht**, du musst aus diesem Fork
bauen. Die Befehle stehen oben im englischen Abschnitt "How to build your own
app". Ersetze `https://your-instance.example/` durch deine Instanz-URL. Im
App-Namen sind Buchstaben, Zahlen, Punkte, Bindestriche und Leerzeichen erlaubt,
aber keine Klammern. Der erste Build dauert einige Minuten, weil Tauri
kompiliert wird.

Aktuell bleiben: Rebase den Branch auf `main` von `tw93/Pake`, wenn du eine neuere
Pake-Version brauchst.
