#!/bin/bash

TIMESTAMP=$(date +%F_%H-%M-%S)

BACKUP_DIR="./backups/crash_demo_$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

mongodump --uri="mongodb+srv://Imaginary:OOeKmjMoGkuaSElR@cluster0.6jjak1e.mongodb.net/todoApp" --out="$BACKUP_DIR"

echo "✅ Backup completed at $TIMESTAMP -> $BACKUP_DIR"
