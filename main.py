#!/usr/bin/env python3
"""
Estrae i dati di un ordine cliente da un PDF e genera un file Excel.

Utilizzo
--------
# Base
python main.py ordine.pdf

# Con suggerimento sulle prime 2 righe per guidare l'estrazione
python main.py ordine.pdf \\
    --riga1 "ART-001, Vite M6x20, 500, PZ" \\
    --riga2 "ART-002, Dado M6, 1000, PZ"

# Output personalizzato
python main.py ordine.pdf -o risultato.xlsx

# Modello diverso
python main.py ordine.pdf --modello claude-sonnet-4-6
"""

import argparse
import sys
from pathlib import Path

from extractor import estrai_ordine
from excel_writer import scrivi_excel


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Estrae righe d'ordine da un PDF e genera un Excel.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )

    parser.add_argument(
        "pdf",
        help="Percorso al file PDF dell'ordine cliente.",
    )
    parser.add_argument(
        "-o", "--output",
        default=None,
        help="Percorso del file Excel di output (default: stesso nome del PDF con estensione .xlsx).",
    )
    parser.add_argument(
        "--riga1",
        default=None,
        metavar="TESTO",
        help=(
            "Valori della prima riga d'esempio per guidare Claude "
            "(es. 'ART-001, Vite M6, 500 PZ')."
        ),
    )
    parser.add_argument(
        "--riga2",
        default=None,
        metavar="TESTO",
        help="Valori della seconda riga d'esempio (opzionale, usato insieme a --riga1).",
    )
    parser.add_argument(
        "--modello",
        default="claude-opus-4-7",
        help="ID del modello Claude da usare (default: claude-opus-4-7).",
    )

    return parser.parse_args()


def main() -> None:
    args = _parse_args()

    percorso_pdf = Path(args.pdf)
    if not percorso_pdf.exists():
        print(f"Errore: il file '{percorso_pdf}' non esiste.", file=sys.stderr)
        sys.exit(1)
    if percorso_pdf.suffix.lower() != ".pdf":
        print(f"Attenzione: '{percorso_pdf}' potrebbe non essere un PDF.", file=sys.stderr)

    percorso_output = args.output or percorso_pdf.with_suffix(".xlsx").name

    # --- Estrazione ---
    print(f"Lettura PDF: {percorso_pdf}")
    if args.riga1:
        print(f"  Suggerimento riga 1: {args.riga1}")
    if args.riga2:
        print(f"  Suggerimento riga 2: {args.riga2}")
    print(f"Modello: {args.modello}")
    print("Estrazione in corso…")

    try:
        righe = estrai_ordine(
            percorso_pdf=str(percorso_pdf),
            esempio_riga1=args.riga1,
            esempio_riga2=args.riga2,
            modello=args.modello,
        )
    except Exception as e:
        print(f"Errore durante l'estrazione: {e}", file=sys.stderr)
        sys.exit(1)

    if not righe:
        print("Nessuna riga d'ordine trovata nel PDF.", file=sys.stderr)
        sys.exit(1)

    print(f"Righe estratte: {len(righe)}")

    # --- Anteprima ---
    print("\nAnteprima (prime 5 righe):")
    print(f"  {'Codice':<20} {'Descrizione':<35} {'Qtà':>8}  {'UM'}")
    print(f"  {'-'*20} {'-'*35} {'-'*8}  {'-'*6}")
    for r in righe[:5]:
        print(
            f"  {r.get('codice_articolo',''):<20} "
            f"{r.get('descrizione',''):<35} "
            f"{r.get('quantita',''):>8}  "
            f"{r.get('unita_misura','')}"
        )
    if len(righe) > 5:
        print(f"  … e altre {len(righe) - 5} righe")

    # --- Scrittura Excel ---
    print(f"\nGenerazione Excel: {percorso_output}")
    try:
        percorso_finale = scrivi_excel(righe, percorso_output)
    except Exception as e:
        print(f"Errore durante la scrittura Excel: {e}", file=sys.stderr)
        sys.exit(1)

    print(f"File salvato: {percorso_finale}")


if __name__ == "__main__":
    main()
