from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):
    first_error = exc.errors()[0]

    return JSONResponse(
        status_code=422,
        content={
            "detail": first_error["msg"]
        }
    )