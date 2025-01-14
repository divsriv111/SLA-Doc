from langchain.memory import ConversationBufferWindowMemory
from app.chat.memories.histories.sql_history import SqlMessageHistory

def window_buffer_memory_builder(chat_args):
    """
    Build a window buffer memory for the chat session.
    
    Args:
        chat_args: Arguments containing the configuration for the chat session.
    
    Returns:
        ConversationBufferWindowMemory: An instance of the window buffer memory configured with the specified parameters.
    """
    return ConversationBufferWindowMemory(
        memory_key="chat_history",
        output_key="answer",
        return_messages=True,
        chat_memory=SqlMessageHistory(
            conversation_id=chat_args.conversation_id
        ),
        k=2
    )