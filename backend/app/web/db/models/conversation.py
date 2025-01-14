import uuid
from app.web.db import db
from .base import BaseModel


class Conversation(BaseModel):
    """
    Conversation model representing a conversation in the system.
    
    Attributes:
        id (str): Unique identifier for the conversation.
        created_on (datetime): Timestamp when the conversation was created.
        retriever (str): Information about the retriever used in the conversation.
        memory (str): Information about the memory used in the conversation.
        llm (str): Information about the language model used in the conversation.
        pdf_id (int): Foreign key referencing the associated PDF.
        pdf (relationship): Relationship to the Pdf model.
        user_id (int): Foreign key referencing the user who owns the conversation.
        user (relationship): Relationship to the User model.
        messages (relationship): Relationship to the Message model.
    """
    id: str = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_on = db.Column(db.DateTime, server_default=db.func.now())

    retriever: str = db.Column(db.String)
    memory: str = db.Column(db.String)
    llm: str = db.Column(db.String)

    pdf_id: int = db.Column(db.Integer, db.ForeignKey("pdf.id"), nullable=False)
    pdf = db.relationship("Pdf", back_populates="conversations")

    user_id: int = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    user = db.relationship("User", back_populates="conversations")

    messages = db.relationship(
        "Message", back_populates="conversation", order_by="Message.created_on"
    )

    def as_dict(self):
        """
        Convert the Conversation instance to a dictionary.
        
        Returns:
            dict: A dictionary representation of the Conversation instance.
        """
        return {
            "id": self.id,
            "pdf_id": self.pdf_id,
            "messages": [m.as_dict() for m in self.messages],
        }
