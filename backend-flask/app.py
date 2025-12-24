import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from resend import Resend

load_dotenv() # Carga las variables de entorno del archivo .env

app = Flask(__name__)
# Configurar CORS para permitir solicitudes desde el frontend local y el desplegado en Render
CORS(app, resources={r"/contact": {"origins": ["http://127.0.0.1:5500", "http://localhost:3000", "https://paranadev.onrender.com"]}})

resend_api_key = os.getenv("RESEND_API_KEY")
destination_email = os.getenv("DESTINATION_EMAIL")
resend = Resend(api_key=resend_api_key)

@app.route("/contact", methods=["POST"])
def contact():
    data = request.json
    nombre = data.get("nombre")
    email = data.get("email")
    mensaje = data.get("mensaje")

    if not all([nombre, email, mensaje, destination_email]):
        return jsonify({"error": "Todos los campos son obligatorios y el servidor debe tener una configuración de email de destino."}), 400

    try:
        r = resend.emails.send({
            "from": "onboarding@resend.dev", # Reemplaza con tu dominio verificado en Resend
            "to": destination_email, # Reemplaza con tu dirección de correo donde quieres recibir los mensajes
            "subject": f"Nuevo mensaje de contacto de {nombre}",
            "html": f"""
                <p><strong>Nombre:</strong> {nombre}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Mensaje:</strong> {mensaje}</p>
            """,
        })
        print(r) # Para depuración, puedes ver la respuesta de Resend

        if r and r.get('id'): # Resend exitoso devuelve un ID de email
            return jsonify({"message": "Mensaje enviado con éxito."}), 200
        else:
            print("Error details from Resend:", r)
            return jsonify({"error": "Error al enviar el mensaje con Resend."}), 500

    except Exception as e:
        print(f"Error en el servidor: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000) # El puerto 5000 es el puerto por defecto de Flask
