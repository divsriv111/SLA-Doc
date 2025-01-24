import uuid
from app.web.db import db
from .base import BaseModel


class Group(BaseModel):
    __tablename__ = 'group'

    id = db.Column(db.String(), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(80), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Relationship to Pdf
    pdfs = db.relationship('Pdf', back_populates='group')

    def as_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "user_id": self.user_id
        }