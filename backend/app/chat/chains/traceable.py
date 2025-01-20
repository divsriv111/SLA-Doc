from langfuse.model import CreateTrace
from app.chat.tracing.langfuse import langfuse


class TraceableChain:
    def __call__(self, *args, **kwargs):
        try:
            # Initialize callbacks list if not present
            if "callbacks" not in kwargs:
                kwargs["callbacks"] = []

            # Create trace only if metadata exists
            if hasattr(self, 'metadata'):
                trace = langfuse.trace(
                    CreateTrace(
                        id=self.metadata["conversation_id"],
                        metadata=self.metadata
                    )
                )
                if trace:
                    kwargs["callbacks"].append(trace.getNewHandler())

            return super().__call__(*args, **kwargs)
        except Exception as e:
            print(f"Tracing error: {str(e)}")
            # Continue chain execution even if tracing fails
            return super().__call__(*args, **kwargs)
