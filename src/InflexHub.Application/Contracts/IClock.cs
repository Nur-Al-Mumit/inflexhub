namespace InflexHub.Application.Contracts;

/// <summary>
/// Time source for the application. Handlers never call <c>DateTime.UtcNow</c>
/// directly; they use this contract so tests can fix the time (M0-2).
/// </summary>
public interface IClock
{
    DateTimeOffset UtcNow { get; }
}
