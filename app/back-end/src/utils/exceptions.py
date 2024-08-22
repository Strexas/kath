"""
This module defines custom exception classes for the application.

It provides:
- `UnexpectedError`: A custom exception class used to signal unexpected errors
  that occur during the execution of the application.

Dependencies:
- Exception: The base class for all built-in exceptions in Python.
"""


class UnexpectedError(Exception):
    """
    Exception raised for unexpected errors in the application.

    This exception is used to indicate that an error has occurred which was not
    anticipated or handled explicitly. It allows for custom error messages to
    be provided when raising the exception.

    Args:
        message (str): A descriptive message about the error.

    Attributes:
        message (str): The error message provided during the exception initialization.

    Inherits:
        Exception: The base class for all built-in exceptions in Python.
    """

    def __init__(self, message):
        """
        Initialize an instance of the `UnexpectedError` exception.

        Args:
            message (str): A descriptive message about the error. This message
                           is stored in the `message` attribute and is passed
                           to the base `Exception` class.
        """
        self.message = message
        super().__init__(self.message)
