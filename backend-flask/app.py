import os
import re
from html import escape

import resend
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/contact": {
            "origins": [
                "http://127.0.0.1:5500",
                "http://localhost:3000",
                "https://paranadev.onrender.com",
            ]
        }
    },
)

resend.api_key = os.getenv("RESEND_API_KEY")
destination_email = os.getenv("DESTINATION_EMAIL")
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


@app.route("/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True) or {}
    nombre = str(data.get("nombre", "")).strip()
    email = str(data.get("email", "")).strip()
    mensaje = str(data.get("mensaje", "")).strip()

    if not destination_email:
        return jsonify({"error": "El servidor no tiene configurado el email de destino."}), 500

    if not all([nombre, email, mensaje]):
        return jsonify({"error": "Todos los campos son obligatorios."}), 400

    if not EMAIL_PATTERN.match(email):
        return jsonify({"error": "El email no tiene un formato válido."}), 400

    try:
        response = resend.Emails.send(
            {
                "from": "onboarding@resend.dev",
                "to": destination_email,
                "subject": f"Nuevo mensaje de contacto de {nombre}",
                "html": f"""
                    <p><strong>Nombre:</strong> {escape(nombre)}</p>
                    <p><strong>Email:</strong> {escape(email)}</p>
                    <p><strong>Mensaje:</strong></p>
                    <p>{escape(mensaje).replace(chr(10), "<br>")}</p>
                """,
            }
        )

        if response and response.get("id"):
            return jsonify({"message": "Consulta enviada con éxito."}), 200

        print("Error details from Resend:", response)
        return jsonify({"error": "Error al enviar el mensaje con Resend."}), 500

    except Exception as error:
        print(f"Error en el servidor: {error}")
        return jsonify({"error": "Error interno del servidor."}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
