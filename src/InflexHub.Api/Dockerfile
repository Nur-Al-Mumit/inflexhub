# InflexHub API image (M0-7). Build context: repository root (needs the
# solution, props files, and catalog/products.json). Base images are pinned to
# exact tags (devops guardrail: no floating tags, no latest).

# ---------- build ----------
FROM mcr.microsoft.com/dotnet/sdk:10.0.404 AS build
WORKDIR /src

# Restore in a layer of its own: project files only first.
COPY InflexHub.slnx Directory.Build.props Directory.Packages.props ./
COPY src/InflexHub.Domain/InflexHub.Domain.csproj src/InflexHub.Domain/
COPY src/InflexHub.Application/InflexHub.Application.csproj src/InflexHub.Application/
COPY src/InflexHub.Infrastructure/InflexHub.Infrastructure.csproj src/InflexHub.Infrastructure/
COPY src/InflexHub.Api/InflexHub.Api.csproj src/InflexHub.Api/
COPY tests/InflexHub.Application.UnitTests/InflexHub.Application.UnitTests.csproj tests/InflexHub.Application.UnitTests/
RUN dotnet restore InflexHub.slnx

COPY . .
RUN dotnet publish src/InflexHub.Api/InflexHub.Api.csproj \
    --no-restore \
    --configuration Release \
    --output /app \
    --warnaserror

# ---------- migration bundle ----------
# The one-shot migrate service runs this self-contained executable; migrations
# never run at API startup (golden rule 19). dotnet-ef comes from the committed
# local tool manifest (dotnet-tools.json), which pins its version.
FROM build AS bundle
RUN dotnet tool restore
RUN dotnet ef migrations bundle \
    --project src/InflexHub.Infrastructure \
    --startup-project src/InflexHub.Api \
    --configuration Release \
    --output /migrator/efbundle

# ---------- migrator (compose target for the `migrate` service) ----------
FROM mcr.microsoft.com/dotnet/aspnet:10.0.4 AS migrator
WORKDIR /migrator
COPY --from=bundle /migrator/efbundle ./efbundle
# Pass --connection at run time; see docker-compose.yml.
ENTRYPOINT ["./efbundle"]

# ---------- api ----------
FROM mcr.microsoft.com/dotnet/aspnet:10.0.4 AS api
WORKDIR /app
COPY --from=build /app ./
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
# Non-root (the aspnet base image ships the `app` user).
USER app
ENTRYPOINT ["dotnet", "InflexHub.Api.dll"]
