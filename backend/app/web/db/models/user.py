import uuid
from app.web.db import db
from .base import BaseModel

class User(BaseModel):
    """
    User model representing a user in the system.
    
    Attributes:
        id (str): Unique identifier for the user.
        email (str): Email address of the user.
        password (str): Hashed password of the user.
        pdfs (relationship): Relationship to the Pdf model.
        conversations (relationship): Relationship to the Conversation model.
    """
    id: str = db.Column(
        db.String(), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    email: str = db.Column(db.String(80), unique=True, nullable=False)
    password: str = db.Column(db.String(80), nullable=False)
    pdfs = db.relationship("Pdf", back_populates="user")
    conversations = db.relationship("Conversation", back_populates="user")

    def as_dict(self):
        """
        Convert the User instance to a dictionary.
        
        Returns:
            dict: A dictionary representation of the User instance.
        """
        return {"id": self.id, "email": self.email}
