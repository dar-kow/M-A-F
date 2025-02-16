# Etap budowania
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Skopiuj plik csproj i przywróć zależności
COPY ["backend/backend.csproj", "backend/"]
RUN dotnet restore "backend/backend.csproj"

# Skopiuj resztę kodu i zbuduj projekt
COPY . .
WORKDIR "/src/backend"
RUN dotnet publish -c Release -o /app/publish

# Etap runtime (używamy obrazu SDK, aby narzędzie dotnet-ef było dostępne)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Instalacja narzędzia dotnet-ef globalnie
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

# Skopiuj skrypt entrypoint
COPY backend/entrypoint.sh .
RUN chmod +x entrypoint.sh
EXPOSE 80
ENTRYPOINT ["./entrypoint.sh"]