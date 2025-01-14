from typing import TypeVar, Optional, Type, List
from abc import abstractmethod
from app.web.db import db

T = TypeVar("T", bound="BaseModel")


class BaseModel(db.Model):
    """
    Base model class providing common database operations for all models.

    Attributes:
        __abstract__ (bool): Indicates that this is an abstract base class.
    """

    __abstract__ = True

    @classmethod
    def create(cls: Type[T], commit=True, **kwargs) -> T:
        """
        Create a new instance of the model and save it to the database.

        Args:
            commit (bool): Whether to commit the transaction.
            **kwargs: Attributes to set on the new instance.

        Returns:
            T: The created instance.
        """
        instance = cls(**kwargs)
        return instance.save(commit)

    @classmethod
    def find_by(cls: Type[T], **kwargs) -> Optional[T]:
        """
        Find a single instance of the model by the given criteria.

        Args:
            **kwargs: Criteria to filter by.

        Returns:
            Optional[T]: The found instance or None if not found.
        """
        return db.session.execute(db.select(cls).filter_by(**kwargs)).scalar_one()

    @classmethod
    def where(cls: Type[T], **kwargs) -> List[T]:
        """
        Find all instances of the model matching the given criteria.

        Args:
            **kwargs: Criteria to filter by.

        Returns:
            List[T]: A list of matching instances.
        """
        return db.session.execute(db.select(cls).filter_by(**kwargs)).scalars().all()

    @classmethod
    def upsert(cls: Type[T], commit=True, **kwargs) -> T:
        """
        Update an existing instance or create a new one if it doesn't exist.

        Args:
            commit (bool): Whether to commit the transaction.
            **kwargs: Attributes to set on the instance.

        Returns:
            T: The upserted instance.
        """
        instance = None
        if kwargs.get("id"):
            instance = cls.find_by(id=kwargs["id"])

        if instance:
            instance.update(commit, **kwargs)
            return instance
        else:
            instance = cls.create(**kwargs)
            return instance

    @classmethod
    def delete_by(cls, commit: bool = True, **kwargs) -> None:
        instance = cls.find_by(**kwargs)
        db.session.delete(instance)
        if commit:
            return db.session.commit()
        return

    @classmethod
    def as_dicts(cls, models):
        return [m.as_dict() for m in models]

    @abstractmethod
    def as_dict(self):
        raise NotImplementedError

    def update(self, commit=True, **kwargs):
        """
        Update the current instance with the given attributes.

        Args:
            commit (bool): Whether to commit the transaction.
            **kwargs: Attributes to update on the instance.

        Returns:
            T: The updated instance.
        """
        for attr, value in kwargs.items():
            if attr != ["id"]:
                setattr(self, attr, value)
        if commit:
            return self.save()
        return self

    def save(self, commit=True):
        """
        Save the current instance to the database.

        Args:
            commit (bool): Whether to commit the transaction.

        Returns:
            T: The saved instance.
        """
        db.session.add(self)
        if commit:
            db.session.commit()
        return self
