using Cortex.Mediator.Queries;
using FluentValidation;
using InflexHub.Application.Common;
using Shouldly;

namespace InflexHub.Application.UnitTests.Common;

public sealed record SampleQuery(string Slug) : IQuery<string>;

public sealed class SampleQueryValidator : AbstractValidator<SampleQuery>
{
    public SampleQueryValidator()
    {
        RuleFor(query => query.Slug).NotEmpty();
    }
}

public sealed class ValidationQueryBehaviorTests
{
    [Test]
    public async Task Handle_ValidQuery_CallsNextAndReturnsResult()
    {
        var behavior = new ValidationQueryBehavior<SampleQuery, string>([new SampleQueryValidator()]);

        var result = await behavior.Handle(
            new SampleQuery("pos"),
            () => Task.FromResult("found"),
            CancellationToken.None);

        result.ShouldBe("found");
    }

    [Test]
    public async Task Handle_InvalidQuery_ThrowsValidationException()
    {
        var behavior = new ValidationQueryBehavior<SampleQuery, string>([new SampleQueryValidator()]);

        var exception = await Should.ThrowAsync<ValidationException>(() =>
            behavior.Handle(
                new SampleQuery(string.Empty),
                () => Task.FromResult("found"),
                CancellationToken.None));

        exception.Errors.ShouldHaveSingleItem().PropertyName.ShouldBe("Slug");
    }
}
