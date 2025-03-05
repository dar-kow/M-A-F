# Etap budowy – używamy obrazu SDK
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Kopiowanie pliku projektu i przywrócenie zależności
COPY ["*.csproj", "./"]
RUN dotnet restore

# Kopiowanie reszty plików i publikacja
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Etap runtime – używamy obrazu ASP.NET (mniejszy obraz)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 80
ENTRYPOINT ["dotnet", "backend.dll"]
