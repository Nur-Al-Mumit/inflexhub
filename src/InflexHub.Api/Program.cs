using System.Diagnostics;
using InflexHub.Api.Errors;
using InflexHub.Application;
using InflexHub.Infrastructure;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Serilog.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Serilog from configuration (M0-2): console only in M0; no personal data is logged.
builder.Host.UseSerilog((context, loggerConfiguration) =>
    loggerConfiguration.ReadFrom.Configuration(context.Configuration));

// Layer registrations: Application (mediator + validation pipeline), Infrastructure
// (EF Core on PostgreSQL, snake_case naming, IClock).
builder.Services.AddInflexHubApplication();
builder.Services.AddInflexHubInfrastructure(builder.Configuration);

// RFC 9457 ProblemDetails with error-catalog slugs for every failure (M0-2):
// exceptions through the handler above, unmatched routes through the status
// code pages delegate below.
builder.Services.AddExceptionHandler<ProblemDetailsExceptionHandler>();
builder.Services.AddProblemDetails();

// OpenAPI document at /openapi/v1.json (api-spec).
builder.Services.AddOpenApi();

// Health endpoints (M0-4): live = process up; ready = database reachable.
builder.Services.AddHealthChecks()
    .AddNpgSql(
        builder.Configuration.GetConnectionString("Default") ?? string.Empty,
        name: "database",
        tags: ["ready"]);

var app = builder.Build();

app.UseExceptionHandler();

// Unmatched routes and other bare 404s get ProblemDetails with the not-found
// slug and the same traceId used everywhere else.
app.UseStatusCodePages(async context =>
{
    var httpContext = context.HttpContext;
    if (httpContext.Response.HasStarted
        || httpContext.Response.StatusCode != StatusCodes.Status404NotFound)
    {
        return;
    }

    var notFound = ErrorCatalog.NotFound;
    var problemDetails = new ProblemDetails
    {
        Type = notFound.Type,
        Title = notFound.Title,
        Status = notFound.Status,
        Detail = notFound.Detail,
    };
    problemDetails.Extensions["traceId"] =
        Activity.Current?.Id ?? httpContext.TraceIdentifier;

    var problemDetailsService =
        httpContext.RequestServices.GetRequiredService<IProblemDetailsService>();
    await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
    {
        HttpContext = httpContext,
        ProblemDetails = problemDetails,
    });
});

app.UseSerilogRequestLogging();

app.MapOpenApi();

app.MapHealthChecks("/health/live", new HealthCheckOptions { Predicate = _ => false });
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
});

app.Run();
