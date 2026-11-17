using System.Diagnostics;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace InflexHub.Api.Errors;

/// <summary>
/// Turns every unhandled exception into an RFC 9457 ProblemDetails response with an
/// error-catalog slug and the request's traceId (M0-2). Logs the same traceId the
/// response carries — never message bodies that could hold personal data.
/// </summary>
internal sealed class ProblemDetailsExceptionHandler(
    IProblemDetailsService problemDetailsService,
    ILogger<ProblemDetailsExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var error = ErrorCatalog.Resolve(exception);
        var traceId = Activity.Current?.Id ?? httpContext.TraceIdentifier;

        if (error.Status >= StatusCodes.Status500InternalServerError)
        {
            logger.LogError(
                "Unhandled exception {ExceptionType} on {Method} {Path}; traceId {TraceId}",
                exception.GetType().Name,
                httpContext.Request.Method,
                httpContext.Request.Path,
                traceId);
        }

        httpContext.Response.StatusCode = error.Status;

        var problemDetails = new ProblemDetails
        {
            Type = error.Type,
            Title = error.Title,
            Status = error.Status,
            Detail = error.Detail,
        };

        problemDetails.Extensions["traceId"] = traceId;

        if (error.FieldErrors is not null)
        {
            problemDetails.Extensions["errors"] = error.FieldErrors;
        }

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = problemDetails,
        });
    }
}
