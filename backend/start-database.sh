#!/bin/bash
docker stop postgres-container || true
docker rm postgres-container || true
docker build -t postgres-image .
docker run -d -p 5432:5432 --name postgres-container postgres-image
