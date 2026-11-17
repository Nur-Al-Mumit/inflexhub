using Microsoft.EntityFrameworkCore;

namespace InflexHub.Infrastructure.Persistence;

/// <summary>
/// The InflexHub database context (M0-3). Table and column names are snake_case
/// (EFCore.NamingConventions) and times are timestamptz in UTC. Entities arrive with
/// the V1 Inquiries feature (V1-14/V1-18); M0 ships the wired-up context, the naming
/// convention, and the first migration so the pipeline is proven end to end.
/// </summary>
public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
}
