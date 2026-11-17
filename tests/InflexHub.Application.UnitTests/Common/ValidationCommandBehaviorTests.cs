using Cortex.Mediator.Commands;
using FluentValidation;
using InflexHub.Application.Common;
using Shouldly;

namespace InflexHub.Application.UnitTests.Common;

public sealed record SampleCommand(string Name) : ICommand<string>;

public sealed class SampleCommandValidator : AbstractValidator<SampleCommand>
{
    public SampleCommandValidator()
    {
        RuleFor(command => command.Name).NotEmpty().MaximumLength(10);
    }
}

public sealed class ValidationCommandBehaviorTests
{
    [Test]
    public async Task Handle_ValidCommand_CallsNextAndReturnsResult()
    {
        var behavior = new ValidationCommandBehavior<SampleCommand, string>([new SampleCommandValidator()]);

        var result = await behavior.Handle(
            new SampleCommand("pos"),
            () => Task.FromResult("stored"),
            CancellationToken.None);

        result.ShouldBe("stored");
    }

    [Test]
    public async Task Handle_InvalidCommand_ThrowsValidationExceptionWithoutCallingNext()
    {
        var behavior = new ValidationCommandBehavior<SampleCommand, string>([new SampleCommandValidator()]);

        var exception = await Should.ThrowAsync<ValidationException>(() =>
            behavior.Handle(
                new SampleCommand(string.Empty),
                () => throw new AssertionException("next must not run for an invalid command"),
                CancellationToken.None));

        var failure = exception.Errors.ShouldHaveSingleItem();
        failure.PropertyName.ShouldBe("Name");
    }

    [Test]
    public async Task Handle_CommandLongerThanLimit_ThrowsValidationException()
    {
        var behavior = new ValidationCommandBehavior<SampleCommand, string>([new SampleCommandValidator()]);

        await Should.ThrowAsync<ValidationException>(() =>
            behavior.Handle(
                new SampleCommand("longer-than-ten"),
                () => Task.FromResult("stored"),
                CancellationToken.None));
    }

    [Test]
    public async Task Handle_NoValidatorsRegistered_CallsNext()
    {
        var behavior = new ValidationCommandBehavior<SampleCommand, string>([]);

        var result = await behavior.Handle(
            new SampleCommand("anything"),
            () => Task.FromResult("stored"),
            CancellationToken.None);

        result.ShouldBe("stored");
    }
}
