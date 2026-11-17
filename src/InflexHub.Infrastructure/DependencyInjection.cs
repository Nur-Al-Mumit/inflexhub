using InflexHub.Application.Contracts;
using InflexHub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace InflexHub.Infrastructure;

/// <summary>
/// Registers the InflexHub Infrastructure layer: the EF Core context on PostgreSQL
/// with snake_case naming, and framework implementations of Application contracts
/// (M0-2, M0-3).
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInflexHubInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddSingleton<IClock, SystemClock>();

        // Registration must tolerate a missing connection string: EF design-time
        // tooling and the migration bundle build the host without one and pass
        // --connection separately. An unconfigured API simply fails its
        // database health check (/health/ready) instead of not starting.
        var connectionString = configuration.GetConnectionString("Default") ?? string.Empty;

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString)
                .UseSnakeCaseNamingConvention());

        return services;
    }
}
