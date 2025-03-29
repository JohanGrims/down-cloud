# 🚀 Down-Cloud: HPI Schulcloud Migrationstool

Down-Cloud ist ein leistungsstarkes Chrome-Erweiterungs-Tool, das dir hilft, deine Dateien aus der HPI Schulcloud zu sichern und nahtlos zur neuen Nextcloud-Umgebung zu migrieren. Da die HPI Schulcloud keine direkte Download-Funktionalität mehr bietet, schließt Down-Cloud diese Lücke und ermöglicht dir einen effizienten Migrationsprozess.

## ✨ Hauptfunktionen

- 📁 Automatisches Crawling der Schulcloud-Ordnerstruktur
- 🔍 Erkennung aller verfügbaren Dateien und Unterordner
- 📦 Paralleles Herunterladen durch intelligentes Tab-Management
- ⚡ Konfigurierbare Batch-Downloads für optimale Performance
- 🧩 Interaktiver Dateibaum zur präzisen Auswahl
- 📊 Echtzeit-Status während des Crawling-Prozesses
- 🗂️ Export leerer Ordnerstrukturen als ZIP

## 🔧 Installation

1. Installiere die neueste Version von Google Chrome
2. Lade die aktuelle `.crx`-Datei aus dem [Releases](https://github.com/johangrims/down-cloud/releases)-Bereich herunter
   > ⚠️ **Wichtig**: Verwende Rechtsklick → "Link speichern unter...", sonst zeigt Chrome einen Fehler an (CRX_REQUIRED_PROOF_MISSING)
3. Öffne `chrome://extensions` in Chrome
4. Aktiviere den "Entwicklermodus" (oben rechts)
5. Ziehe die heruntergeladene `.crx`-Datei per Drag & Drop in das Browserfenster
6. Fertig! 🎉 Die Erweiterung ist einsatzbereit

## 🚀 So funktioniert es

Down-Cloud nutzt eine innovative Multi-Tab-Strategie:

1. **Intelligentes Crawling**: Die Erweiterung öffnet Hintergrund-Tabs, um die gesamte Ordnerstruktur automatisch zu erfassen
2. **Effizientes Tab-Management**: Temporäre Tabs werden für jede Datei/jeden Ordner im Hintergrund geöffnet und wieder geschlossen
3. **Echtzeitanalyse**: Eine vollständige Baumstruktur deiner Dateien wird während des Scans erstellt und angezeigt
4. **Optimierte Batch-Verarbeitung**: Downloads werden in konfigurierbaren Gruppen ausgeführt, um den Server zu schonen
5. **Parallele Verarbeitung**: Mehrere Downloads laufen gleichzeitig, was die Migrationszeit erheblich verkürzt

## ⚠️ Wichtig: Vorsicht bei komplexen Ordnerstrukturen

Bei umfangreichen Dateisammlungen können folgende Probleme auftreten:

- In seltenen Fällen versucht Down-Cloud bis zu 200 Tabs gleichzeitig zu öffnen
- Dies kann zu Leistungsproblemen oder zum Einfrieren von Chrome führen
- Bei Chrome-Absturz: Browser vollständig beenden (über Task-Manager/Force Quit)
- **Nach einem Absturz**: NICHT "Sitzung wiederherstellen" wählen, sondern mit neuer Sitzung starten
- Bei komplexen Strukturen die Batch-Einstellungen anpassen (kleinere Gruppen, längere Pausen)

## 🎮 Anwendung

1. Navigiere zum Dateibereich in der HPI Schulcloud
2. Klicke auf die "Down-Cloud"-Schaltfläche
3. Verfolge in Echtzeit die Erkennung deiner Ordnerstruktur
4. Wähle gezielt aus, was du herunterladen möchtest
5. Starte den Download-Prozess und beobachte den Fortschritt

### 🌳 Effiziente Dateiauswahl

Der interaktive Dateibaum bietet:

- Einzelauswahl von Dateien durch direktes Anklicken
- Massenauswahl durch Ordner-Klick (inkl. aller Unterordner und Dateien)
- Übersichtliche Hierarchie-Darstellung für schnelle Navigation

## ⚙️ Performance-Optimierung

Passe folgende Parameter für optimale Ergebnisse an:

| Parameter | Funktion | Standard | Empfehlung |
|-----------|----------|----------|------------|
| **batchSize** | Anzahl gleichzeitiger Downloads | 5 | 3-5 (normal), 1-2 (langsame Verbindung) |
| **batchDelay** | Wartezeit zwischen Download-Gruppen (Sek.) | 5 | 5-10 (große Datenmengen) |
| **scanTime** | Maximale Zeit für Ordnerstruktur-Scan (Sek.) | 20 | 30-60 (tiefe Ordnerstrukturen) |

## 💡 Experten-Tipps

- Nutze zuerst die "Ordnerstruktur als ZIP"-Funktion, um einen Überblick zu erhalten
- Bei tiefen Ordnerstrukturen: Erhöhe die Scan-Zeit in den Einstellungen
- Achte auf ausreichend Speicherplatz im Downloads-Ordner
- Starte mit kleineren Ordnern, um optimale Einstellungen zu finden
- Vermeide Tab-Überlastung durch selektive Auswahl statt Komplett-Migration
- Bei Leistungsproblemen: Prozess stoppen und Batch-Parameter anpassen

## 🛠️ Technische Details

Down-Cloud kombiniert mehrere fortschrittliche Techniken:

- DOM-Analyse zur Identifikation aller Datei- und Ordnerelemente
- Rekursive Crawler-Funktion für vollständige Baumstruktur-Erstellung
- Intelligentes Batch-Management für optimierte Server-Auslastung
- Chrome-API-Integration für Tab- und Speicherverwaltung

## 🔒 Datenschutz

- Alle Operationen laufen ausschließlich lokal in deinem Browser
- Keine Datenübertragung an externe Server
- Temporäre Daten werden nach Abschluss der Migration gelöscht

---

⭐ Entwickelt als pragmatische Lösung für die Schulcloud-Migration. Dieses Tool hilft dir, deine wertvollen Daten sicher in die neue Nextcloud-Umgebung zu übertragen.

📣 Feedback, Probleme oder Verbesserungsvorschläge? Erstelle ein Issue auf GitHub und hilf mit, Down-Cloud weiterzuentwickeln!