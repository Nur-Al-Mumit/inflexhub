using System.Text.Json;
using FluentValidation;

namespace InflexHub.Api.Errors;

/// <summary>
/// Maps exceptions to entries of the error catalog (api-spec: Error catalog).
/// Slugs are stable public identifiers used in ProblemDetails <c>type</c> URLs.
/// </summary>
internal static class ErrorCatalog
{
    private const string ErrorTypeBaseUrl = "https://inflexhub.com/errors/";

    public sealed record Error(
        int Status,
        string Slug,
        string Title,
        string Detail,
        IReadOnlyDictionary<string, string[]>? FieldErrors = null)
    {
        public string Type => $"{ErrorTypeBaseUrl}{Slug}";
    }

    /// <summary>
    /// 404 for unmatched routes and missing resources, written by the status
    /// code pages integration for empty-body responses.
    /// </summary>
    public static Error NotFound { get; } = new(
        Status: StatusCodes.Status404NotFound,
        Slug: "not-found",
        Title: "Not found",
        Detail: "The requested resource does not exist.");

    public static Error Resolve(Exception exception) => exception switch
    {
        // 400 validation-failed: shape errors from the FluentValidation pipeline.
        ValidationException validation => new(
            Status: StatusCodes.Status400BadRequest,
            Slug: "validation-failed",
            Title: "Validation failed",
            Detail: "One or more fields are invalid.",
            FieldErrors: validation.Errors
                .GroupBy(failure => ToCamelCase(failure.PropertyName), StringComparer.Ordinal)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(failure => failure.ErrorMessage).ToArray())),

        // 500 internal-error: unexpected failure; traceId is added by ProblemDetails.
        _ => new(
            Status: StatusCodes.Status500InternalServerError,
            Slug: "internal-error",
            Title: "Internal error",
            Detail: "An unexpected error occurred. Quote the traceId when contacting support."),
    };

    private static string ToCamelCase(string propertyName) =>
        JsonNamingPolicy.CamelCase.ConvertName(propertyName);
}
