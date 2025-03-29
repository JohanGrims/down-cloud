# 🚀 Down-Cloud: HPI Schulcloud Migrationstool

Down-Cloud ist ein innovatives Chrome-Erweiterungstool, das dir hilft, deine Dateien aus der HPI Schulcloud zu retten und den Übergang zur neuen Nextcloud-Umgebung zu meistern! Da die HPI Schulcloud keine direkte Download-Funktionalität mehr bietet, springt Down-Cloud ein und ermöglicht dir einen nahtlosen Migrationsprozess.

## ✨ Funktionen

- 📁 Intelligentes Crawling der Schulcloud-Ordnerstruktur
- 🔍 Automatische Erkennung aller verfügbaren Dateien und Unterordner
- 📦 Paralleles Herunterladen durch cleveres Tab-Management
- ⚡ Batch-Downloads mit konfigurierbarer Geschwindigkeit
- 🧩 Interaktiver Dateibaum zur gezielten Auswahl
- 📊 Live-Status-Updates während des Crawling-Prozesses
- 🗂️ Export leerer Ordnerstrukturen als ZIP zur Wiederverwendung

## 🔧 Installation

1. Stelle sicher, dass du die neueste Version von Google Chrome installiert hast.
2. Gehe zum [Releases](https://github.com/johangrims/down-cloud/releases) Bereich und lade die neueste `.crx`-Datei herunter.
   > ⚠️ **Wichtig**: Verwende Rechtsklick → "Link speichern unter...", sonst wird Chrome einen Fehler anzeigen!
3. Öffne `chrome://extensions` in deinem Browser.
4. Aktiviere den "Entwicklermodus" oben rechts.
5. Ziehe die heruntergeladene `.crx`-Datei per Drag & Drop in das Browserfenster.
6. Fertig! 🎉 Die Extension ist nun einsatzbereit.

## 🚀 Funktionsweise im Detail

Down-Cloud arbeitet mit einer ausgeklügelten Multi-Tab-Strategie:

1. **Intelligentes Crawling**: Die Erweiterung öffnet automatisch Tabs im Hintergrund, um die gesamte Ordnerstruktur zu erfassen, ohne dass du manuell navigieren musst.

2. **Dynamisches Tab-Management**: Für jede Datei und jeden Ordner werden temporäre Tabs geöffnet, Informationen extrahiert und dann wieder geschlossen - alles für dich unsichtbar im Hintergrund!

3. **Fortschrittliche Datenerfassung**: Während des Scan-Prozesses wird eine vollständige Baumstruktur deiner Dateien erstellt, die in Echtzeit im Dialog angezeigt wird.

4. **Batch-Processing**: Um den Schulcloud-Server nicht zu überlasten, werden Downloads in konfigurierbaren Chargen ausgeführt, mit einstellbaren Pausen zwischen den Batches.

5. **Parallele Downloads**: Die Erweiterung nutzt Chromes Fenster- & Tab-System, um mehrere Downloads gleichzeitig zu starten und so die Migrationszeit erheblich zu verkürzen.

## ⚠️ Wichtige Warnung vor Tab-Überlastung

Bei umfangreichen Ordnerstrukturen kann es in seltenen Fällen zu unerwarteten Schleifen kommen, die Chrome zum Einfrieren bringen können:

- Down-Cloud könnte versuchen, bis zu 200 Tabs gleichzeitig zu öffnen!
- Dies kann bei komplexen Ordnerstrukturen zu erheblichen Leistungsproblemen oder sogar zum vollständigen Einfrieren von Chrome führen.
- Sollte Chrome nicht mehr reagieren, hilft nur noch das komplette Beenden des Browsers (Task-Manager oder Force Quit).
- **Wichtig**: Nach einem solchen Absturz NICHT auf "Sitzung wiederherstellen" oder "Tabs wiederherstellen" klicken, da sonst die problematischen Tabs erneut geöffnet werden!
- Starte Chrome besser mit einer neuen, leeren Sitzung und passe dann die Down-Cloud-Einstellungen entsprechend an.

## 🎮 Anwendung

Nach der Installation erscheint auf den Seiten der HPI Schulcloud eine stylische "Down-Cloud" Schaltfläche:

1. Navigiere zu deinem Dateibereich in der HPI Schulcloud.
2. Klicke auf die "Down-Cloud" Schaltfläche - ein interaktiver Dialog erscheint.
3. Beobachte in Echtzeit, wie deine Ordnerstruktur erkannt wird!
4. Wähle gezielt aus, welche Ordner oder Dateien du herunterladen möchtest.
5. Lehne dich zurück und beobachte, wie Down-Cloud die Arbeit für dich erledigt!

### 🌳 Interaktive Dateiauswahl im Dateibaum

Der Dateibaum bietet dir eine übersichtliche Darstellung deiner gesamten Ordnerstruktur:

Klicke auf einzelne Dateien, um sie herunterzuladen. Durch Klicken auf einen Ordner lädst du automatisch diesen alle darin enthaltenen Dateien und Dateien etwaiger Unterordner herunter. So kannst du mit einem Klick ganze Ordnerstrukturen herunterladen!


## ⚙️ Konfiguration & Performance

Die Erweiterung bietet dir folgende anpassbare Parameter:

### batchSize (Chargengröße)
Diese Einstellung legt fest, wie viele Downloads gleichzeitig gestartet werden. Ein höherer Wert beschleunigt den gesamten Prozess, kann aber bei langsamen Verbindungen zu Problemen führen.
- **Standard**: 5 Dateien
- **Empfehlung**: 3-5 für normale Internetverbindungen, 1-2 bei langsameren Verbindungen

### batchDelay (Chargenverzögerung)
Dieser Wert bestimmt, wie viele Sekunden Down-Cloud wartet, bevor der nächste Stapel von Downloads gestartet wird. Eine längere Verzögerung schont den Schulcloud-Server und verhindert mögliche Verbindungsabbrüche.
- **Standard**: 5 Sekunden
- **Empfehlung**: 5-10 Sekunden bei größeren Datenmengen

### scanTime (Scan-Dauer)
Diese Einstellung legt fest, wie viele Sekunden Down-Cloud maximal aufwendet, um deine Ordnerstruktur zu durchsuchen und alle Unterordner zu identifizieren. Bei komplexen oder sehr umfangreichen Strukturen solltest du diesen Wert erhöhen.
- **Standard**: 20 Sekunden
- **Empfehlung**: 30-60 Sekunden bei tiefen Ordnerstrukturen

⚡ **Performance-Tipp**: Bei sehr großen Ordnerstrukturen oder langsameren Verbindungen kannst du die Batch-Größe verringern und die Verzögerung erhöhen, um eine zuverlässigere Übertragung zu gewährleisten.

## 💡 Profi-Tipps

- Nutze die "Ordnerstruktur als ZIP" Funktion, um zunächst einen Überblick über deine Dateien zu bekommen und die Ordnerstruktur eventuell wieder herzustellen.
- Bei komplexen Strukturen: Erhöhe die Scan-Zeit über die Einstellungen, damit auch tief verschachtelte Ordner vollständig erfasst werden.
- Achte auf deinen Downloads-Ordner! Er könnte schnell voll werden, wenn du große Datenmengen migrierst.
- Für umfangreiche Migrationen: Starte mit kleinen Ordnern, um die optimalen Einstellungen für deine Verbindung zu finden.
- Um Tab-Überlastung zu vermeiden: Versuche, nur die wirklich benötigten Ordner auszuwählen, anstatt alles auf einmal zu migrieren.
- Bei ersten Anzeichen von Leistungsproblemen (Chrome reagiert träge): Stoppe den aktuellen Prozess und verringere die Batch-Größe oder erhöhe die Verzögerung.

## 🛠️ Technischer Hintergrund

Down-Cloud nutzt eine Kombination aus DOM-Manipulation, Chrome's Background-Tab-API und asynchronen Prozessen:

- Die DOM-Analyse identifiziert alle Datei- und Ordnerelemente auf der Schulcloud-Seite
- Die recursive Crawler-Funktion baut eine vollständige Baumstruktur auf
- Ein intelligenter Download-Manager steuert die Batch-Verarbeitung
- Chrome's Speicher-API wird genutzt, um den Zustand zwischen Tabs zu synchronisieren

## 🔒 Datenschutz & Sicherheit

Down-Cloud läuft vollständig in deinem Browser und sendet keine Daten an externe Server. Alle Operationen werden lokal ausgeführt, und nach Abschluss der Migration werden sämtliche temporären Daten aus dem Chrome-Speicher gelöscht.

---

⭐ Entwickelt aus der Not heraus. Dieses Tool hilft dir, deine wertvollen Daten sicher in die neue Nextcloud-Umgebung zu übertragen.

📣 Fragen? Probleme? Verbesserungsvorschläge? Öffne ein Issue auf GitHub und hilf mit, Down-Cloud noch besser zu machen!
