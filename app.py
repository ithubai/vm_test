"""Webapp Flask per estrarre righe d'ordine da un PDF e scaricare l'Excel."""

import os
import tempfile
import uuid
from pathlib import Path

from flask import Flask, jsonify, render_template, request, send_file

from excel_writer import scrivi_excel
from extractor import estrai_ordine

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 20 * 1024 * 1024  # 20 MB max upload

# download_id -> (percorso_file, nome_download)
_file_temporanei: dict[str, tuple[str, str]] = {}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/estrai", methods=["POST"])
def estrai():
    if "pdf" not in request.files:
        return jsonify({"errore": "Nessun file PDF caricato."}), 400

    pdf_file = request.files["pdf"]
    if not pdf_file.filename:
        return jsonify({"errore": "File non valido."}), 400

    riga1 = request.form.get("riga1") or None
    riga2 = request.form.get("riga2") or None
    modello = request.form.get("modello") or "claude-opus-4-7"

    # Salva il PDF in un file temporaneo
    tmp_pdf = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
    try:
        pdf_file.save(tmp_pdf.name)
        tmp_pdf.close()

        righe = estrai_ordine(tmp_pdf.name, riga1, riga2, modello)
    except Exception as e:
        return jsonify({"errore": str(e)}), 500
    finally:
        try:
            os.unlink(tmp_pdf.name)
        except OSError:
            pass

    if not righe:
        return jsonify({"errore": "Nessuna riga d'ordine trovata nel PDF."}), 400

    # Genera l'Excel e tienilo in memoria per il download
    download_id = str(uuid.uuid4())
    nome_base = Path(pdf_file.filename).stem
    percorso_xlsx = os.path.join(tempfile.gettempdir(), f"{download_id}.xlsx")
    scrivi_excel(righe, percorso_xlsx)
    _file_temporanei[download_id] = (percorso_xlsx, f"{nome_base}.xlsx")

    return jsonify({
        "righe": righe,
        "totale": len(righe),
        "download_id": download_id,
    })


@app.route("/download/<download_id>")
def download(download_id: str):
    entry = _file_temporanei.get(download_id)
    if not entry:
        return "File non trovato o scaduto.", 404
    percorso, nome = entry
    return send_file(percorso, as_attachment=True, download_name=nome)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
