"""Estrae righe d'ordine (codice articolo + quantità) da un PDF usando Claude."""

import json
import pdfplumber
import anthropic

# Schema JSON che Claude deve restituire
_OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "righe": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "codice_articolo": {"type": "string"},
                    "descrizione":    {"type": "string"},
                    "quantita":       {"type": "number"},
                    "unita_misura":   {"type": "string"},
                },
                "required": ["codice_articolo", "quantita"],
                "additionalProperties": False,
            },
        }
    },
    "required": ["righe"],
    "additionalProperties": False,
}


def _leggi_pdf(percorso: str) -> str:
    """Estrae tutto il testo dal PDF (pagina per pagina)."""
    testo_pagine = []
    with pdfplumber.open(percorso) as pdf:
        for i, pagina in enumerate(pdf.pages, start=1):
            testo = pagina.extract_text()
            if testo:
                testo_pagine.append(f"--- Pagina {i} ---\n{testo}")
    if not testo_pagine:
        raise ValueError("Il PDF non contiene testo estraibile.")
    return "\n\n".join(testo_pagine)


def _costruisci_prompt(testo_pdf: str, esempio_riga1: str | None, esempio_riga2: str | None) -> str:
    """Costruisce il prompt utente per Claude."""
    parti = [
        "Sei un assistente specializzato nell'estrazione di dati da ordini clienti.",
        "Dal testo seguente estrai TUTTE le righe d'ordine, riportando per ciascuna:",
        "- codice_articolo: il codice/ID univoco del prodotto",
        "- descrizione: la descrizione del prodotto (se presente, altrimenti stringa vuota)",
        "- quantita: la quantità ordinata (numero)",
        "- unita_misura: l'unità di misura (es. PZ, KG, MT; stringa vuota se assente)",
    ]

    if esempio_riga1 or esempio_riga2:
        parti.append("\nEsempi di righe tratte da questo documento per aiutarti a capire il formato:")
        if esempio_riga1:
            parti.append(f"  Riga 1: {esempio_riga1}")
        if esempio_riga2:
            parti.append(f"  Riga 2: {esempio_riga2}")
        parti.append("Usa questi esempi per capire dove si trovano i campi e come sono formattati.")

    parti.append("\n--- TESTO DEL PDF ---")
    parti.append(testo_pdf)
    parti.append("--- FINE TESTO ---")
    parti.append("\nRestituisci SOLO il JSON strutturato richiesto, senza testo aggiuntivo.")

    return "\n".join(parti)


def estrai_ordine(
    percorso_pdf: str,
    esempio_riga1: str | None = None,
    esempio_riga2: str | None = None,
    modello: str = "claude-opus-4-7",
) -> list[dict]:
    """
    Legge il PDF, chiama Claude e restituisce le righe d'ordine estratte.

    Parametri
    ---------
    percorso_pdf : str
        Percorso al file PDF dell'ordine cliente.
    esempio_riga1 : str, opzionale
        Valori della prima riga d'esempio (es. "ART-001, 5 PZ").
    esempio_riga2 : str, opzionale
        Valori della seconda riga d'esempio.
    modello : str
        ID del modello Claude da usare.

    Ritorna
    -------
    list[dict]
        Lista di dizionari con chiavi: codice_articolo, descrizione,
        quantita, unita_misura.
    """
    testo_pdf = _leggi_pdf(percorso_pdf)
    prompt = _costruisci_prompt(testo_pdf, esempio_riga1, esempio_riga2)

    client = anthropic.Anthropic()

    risposta = client.messages.create(
        model=modello,
        max_tokens=4096,
        output_config={
            "format": {
                "type": "json_schema",
                "schema": _OUTPUT_SCHEMA,
            }
        },
        messages=[{"role": "user", "content": prompt}],
    )

    testo_risposta = next(
        (b.text for b in risposta.content if b.type == "text"), ""
    )

    dati = json.loads(testo_risposta)
    return dati["righe"]
