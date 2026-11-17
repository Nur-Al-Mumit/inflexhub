using Cortex.Mediator.Commands;
using FluentValidation;

namespace InflexHub.Application.Common;

/// <summary>
/// Pipeline behaviour that runs every registered FluentValidation validator for a
/// command before its handler (M0-2). Validators check shape only; business rules
/// (BR-2, BR-3, BR-5) live in handlers and the domain.
/// </summary>
public sealed class ValidationCommandBehavior<TCommand, TResult>(
    IEnumerable<IValidator<TCommand>> validators)
    : ICommandPipelineBehavior<TCommand, TResult>
    where TCommand : ICommand<TResult>
{
    public async Task<TResult> Handle(
        TCommand command,
        CommandHandlerDelegate<TResult> next,
        CancellationToken cancellationToken)
    {
        await Validation.RunAsync(validators, command, cancellationToken);
        return await next();
    }
}
