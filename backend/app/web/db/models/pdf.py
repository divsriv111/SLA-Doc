import uuid
from app.web.db import db
from .base import BaseModel

class Pdf(BaseModel):
    """
    Pdf model representing a PDF document in the system.
    
    Attributes:
        id (str): Unique identifier for the PDF.
        name (str): Name of the PDF.
        user_id (int): Foreign key referencing the user who owns the PDF.
        user (relationship): Relationship to the User model.
        conversations (relationship): Relationship to the Conversation model.
    """
    id: str = db.Column(
        db.String(), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: str = db.Column(db.String(80), nullable=False)
    user_id: int = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    user = db.relationship("User", back_populates="pdfs")

    conversations = db.relationship(
        "Conversation",
        back_populates="pdf",
        order_by="desc(Conversation.created_on)",
    )

    def as_dict(self):
        """
        Convert the Pdf instance to a dictionary.
        
        Returns:
            dict: A dictionary representation of the Pdf instance.
        """
        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id,
        }
