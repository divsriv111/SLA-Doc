from pydantic import BaseModel
from langchain.schema import BaseChatMessageHistory

from app.web.api import (
    get_messages_by_conversation_id,
    add_message_to_conversation
)

class SqlMessageHistory(BaseChatMessageHistory, BaseModel):
    """
    SQL-based message history for a conversation.
    
    Attributes:
        conversation_id (str): The unique identifier for the conversation.
    """
    conversation_id: str

    @property
    def messages(self):
        """
        Retrieve all messages for the conversation.
        
        Returns:
            List[Message]: A list of messages for the conversation.
        """
        return get_messages_by_conversation_id(self.conversation_id)
    
    def add_message(self, message):
        """
        Add a message to the conversation.
        
        Args:
            message (BaseMessage): The message to add.
        
        Returns:
            None
        """
        return add_message_to_conversation(
            conversation_id=self.conversation_id,
            role=message.type,
            content=message.content
        )

    def clear(self):
        """
        Clear the message history for the conversation.
        
        Returns:
            None
        """
        pass