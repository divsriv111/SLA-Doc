import uuid
from app.web.db import db
from .base import BaseModel


class Pdf(BaseModel):
    __tablename__ = "pdf"

    id: str = db.Column(
        db.String(), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    group_id: str = db.Column(
        db.String, db.ForeignKey("group.id"), nullable=False)
    name: str = db.Column(db.String(80), nullable=False)
    user_id: int = db.Column(
        db.Integer, db.ForeignKey("user.id"), nullable=False)
    extracted_data: str = db.Column(
        db.String(5000), nullable=True)  # Add this field
    user = db.relationship("User", back_populates="pdfs")

    group = db.relationship("Group", back_populates="pdfs")  # Add the relationship to Group

    conversations = db.relationship(
        "Conversation",
        back_populates="pdf",
        order_by="desc(Conversation.created_on)",
    )

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id,
            "extracted_data": self.extracted_data,
            "group_id": self.group_id,
            "group_title": self.group.title if self.group else None,
        }
