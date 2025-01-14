from flask import current_app
from queue import Queue
from threading import Thread
from app.chat.callbacks.stream import StreamingHandler

class StreamableChain:
    """
    A class that represents a streamable chain for processing input and streaming output.
    """

    def stream(self, input):
        """
        Stream the output of processing the input using a queue and a streaming handler.
        
        Args:
            input: The input to process.
        
        Yields:
            str: The next token in the streamed output.
        """
        queue = Queue()
        handler = StreamingHandler(queue)

        def task(app_context):
            app_context.push()
            self(input, callbacks=[handler])

        Thread(target=task, args=[current_app.app_context()]).start()
        
        while True:
            token = queue.get()
            if token is None:
                break
            yield token