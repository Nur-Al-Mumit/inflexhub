using Cortex.Mediator.Queries;
using FluentValidation;

namespace InflexHub.Application.Common;

/// <summary>
/// Pipeline behaviour that runs every registered FluentValidation validator for a
/// query before its handler (M0-2).
/// </summary>
public sealed class ValidationQueryBehavior<TQuery, TResult>(
    IEnumerable<IValidator<TQuery>> validators)
    : IQueryPipelineBehavior<TQuery, TResult>
    where TQuery : IQuery<TResult>
{
    public async Task<TResult> Handle(
        TQuery query,
        QueryHandlerDelegate<TResult> next,
        CancellationToken cancellationToken)
    {
        await Validation.RunAsync(validators, query, cancellationToken);
        return await next();
    }
}
