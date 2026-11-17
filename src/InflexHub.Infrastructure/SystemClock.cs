using InflexHub.Application.Contracts;

namespace InflexHub.Infrastructure;

/// <summary>
/// Production <see cref="IClock"/>: the real system clock in UTC (M0-2).
/// </summary>
public sealed class SystemClock : IClock
{
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}
