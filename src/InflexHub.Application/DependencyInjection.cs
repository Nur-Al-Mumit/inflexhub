using Cortex.Mediator.DependencyInjection;
using FluentValidation;
using InflexHub.Application.Common;
using Microsoft.Extensions.DependencyInjection;

namespace InflexHub.Application;

/// <summary>
/// Marker type for assembly scanning: mediator handlers and validators are
/// registered from the assembly that contains it.
/// </summary>
public sealed class ApplicationAssemblyMarker { }

/// <summary>
/// Registers the InflexHub Application layer: the Cortex.Mediator pipeline with
/// FluentValidation behaviours, and every validator in this assembly (M0-2).
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInflexHubApplication(this IServiceCollection services)
    {
        services.AddCortexMediator(
        [
            typeof(ApplicationAssemblyMarker),
        ],
        options =>
        {
            options.AddOpenCommandPipelineBehavior(typeof(ValidationCommandBehavior<,>));
            options.AddOpenQueryPipelineBehavior(typeof(ValidationQueryBehavior<,>));
        });

        services.AddValidatorsFromAssemblyContaining<ApplicationAssemblyMarker>();

        return services;
    }
}
