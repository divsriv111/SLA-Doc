from langchain.memory import ConversationBufferMemory
from app.chat.memories.histories.sql_history import SqlMessageHistory


def build_memory(chat_args):
    """
    Build a conversation buffer memory for the chat session using SQL-based message history.

    Args:
        chat_args: Arguments containing the configuration for the chat session.

    Returns:
        ConversationBufferMemory: An instance of the conversation buffer memory configured with the specified parameters.
    """
    return ConversationBufferMemory(
        chat_memory=SqlMessageHistory(
            conversation_id=chat_args.conversation_id
        ),
        return_messages=True,
        memory_key="chat_history",
        output_key="answer",
        input_key="question"  # Explicitly specify input key
    )
