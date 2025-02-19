"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash , check_password_hash

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/registro', methods =['POST'])
def registro():

    email = request.json.get ('name', None)
    password = request.json.get ('passsword', None)

    if not email or password:
        return jsonify({"msg": "Error en el correo la contraseña"}), 400
    
    user = User.query.filter_by(email = email).first()
    if user:
        return jsonify({"msg" : "usuario existente"}), 400
    
    nuevo_usuario = User(email = email, password = password, is_active = True)
    db.session.add(nuevo_usuario)
    db.session.commit()

    access_token = create_access_token(identity = nuevo_usuario.id)
    return jsonify({"msg": "usuario registrado con éxito", "token": access_token}), 200

@api.route('/login', methods = ['POST'])
def login():
    email = request.json.get ('email')
    password = request.json.get ('password')
    if not email or password:
        return jsonify({"msg": "email o contraseña son erróneos"})
    
    user = User.query.filter_by(email = email).first
    if user and user.password == password:
        access_token = create_access_token(identity = user.id)
        return jsonify({"msg": "Has iniciado sesión correctamente", "token": access_token}), 200
    if user and user.password != password:
        return jsonify({"msg": "Error en el email o contraseña"}), 400
    
@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    usuario_navegando = get_jwt_identity()
    return jsonify({"estas protegido", usuario_navegando}), 200