# concepts/routes.py
from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Course, File, Concept, Query, Student
from datetime import datetime
from sqlalchemy import func
from init import format_concepts_for_db, save_concepts_to_db
import requests

concepts_blueprint = Namespace(
    'concepts',
    description='Operations related to course concepts and materials'
)

# Models for request/response
concept_model = concepts_blueprint.model('Concept', {
    'id': fields.Integer(readonly=True),
    'content': fields.String(required=True),
    'explanation': fields.String(required=True),
    'file_id': fields.Integer(required=True),
    'created_at': fields.DateTime(readonly=True)
})

"""
file_model = concepts_blueprint.model('File', {
    'id': fields.Integer(readonly=True),
    'code': fields.String(required=True),
    'name': fields.String(required=True),
    'data': fields.String(required=True),
    'uploaded_at': fields.DateTime(readonly=True),
    'concepts': fields.List(fields.Nested(concept_model))
})

@concepts_blueprint.route('/files')
class FileResource(Resource):

    @jwt_required()
    @concepts_blueprint.expect(file_model)
    @concepts_blueprint.marshal_with(file_model)
    def post(self):
        Upload a new file
        data = request.get_json()
        new_file = File(
            code=data['coursecode'],
            name=data['title'],
            data=data['data'],
            uploaded_at=datetime.utcnow()
        )
        new_file.save()
        return new_file, 201

@concepts_blueprint.route('/files/<int:file_id>')
class FileDetail(Resource):
    @jwt_required()
    @concepts_blueprint.marshal_with(file_model)
    def get(self, file_id):
        Get specific file details
        file = File.query.get_or_404(file_id)
        return file

    @jwt_required()
    def delete(self, file_id):
        Delete a file
        file = File.query.get_or_404(file_id)
        file.delete()
        return {'message': 'File deleted successfully'}, 200
"""

@concepts_blueprint.route('/generate')
class ConceptGeneration(Resource):
    @jwt_required()
    @concepts_blueprint.expect(concept_model)
    def post(self):
        """Get concepts for given text from database"""
        data = request.get_json()
        file = data['file']
        file_id = File.query.filter_by(name=file).first()
        
        if not file:
            return {"message": "File not found"}, 404

        # Here you would integrate with your concept generation logic
        ai_api_url = 'https://your-ai-api.com/endpoint'
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'KH7WMA68NcBcaVrOFyO5l04rjLCZkSxJGW051q8pHccSCydmymgmFGClDZg58o14LFViST4KrKT3BlbkFJM68LIBiagu5sscxzJC2DxEYdzWFUOj5n8DyXMQ_b2zkRsY2nHlyUk0MPqe7NBBE-6kb5_Wu8AA'  # Replace with your AI API key if required
        }
        concepts = requests.post(ai_api_url, headers=headers, json=file_id.data)
        concepts.raise_for_status()
        
        
        formatted_concepts = format_concepts_for_db(concepts)
        save_concepts_to_db(formatted_concepts, file_id)

        
        return {formatted_concepts}, 200