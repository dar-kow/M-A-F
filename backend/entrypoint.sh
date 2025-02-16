#!/bin/bash
set -e

echo "Running migrations..."
# Próbuje uruchomić migrację – jeśli zakończy się błędem, skrypt przejdzie dalej
dotnet ef database update || echo "Migration step failed or not needed. Continuing..."

echo "Starting application..."
exec dotnet backend.dll