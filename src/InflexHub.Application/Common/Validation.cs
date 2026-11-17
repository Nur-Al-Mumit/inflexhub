using FluentValidation;

namespace InflexHub.Application.Common;

/// <summary>
/// Shared validation step for the command and query pipeline behaviours: runs all
/// validators and throws <see cref="ValidationException"/> on the first invalid
/// request, so the Api maps it to ProblemDetails slug <c>validation-failed</c>.
/// </summary>
internal static class Validation
{
    public static async Task RunAsync<TRequest>(
        IEnumerable<IValidator<TRequest>> validators,
        TRequest request,
        CancellationToken cancellationToken)
    {
        var failures = (await Task.WhenAll(
                validators.Select(validator => validator.ValidateAsync(request, cancellationToken))))
            .SelectMany(result => result.Errors)
            .Where(failure => failure is not null)
            .ToList();

        if (failures.Count != 0)
        {
            throw new ValidationException(failures);
        }
    }
}
