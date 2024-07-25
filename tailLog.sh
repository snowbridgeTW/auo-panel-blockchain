#!/bin/bash

echo -e "\n以下是正在運行的容器列表:"
docker ps --format "table {{.ID}}\t{{.Names}}"

echo -e "\n請輸入要查看的容器名稱:" 

if [ -z "$1" ]; then
  echo -e "\n使用方法: $0 <NAMES> <要顯示的行數>"
  exit 1
fi

CONTAINER_NAME="$1"
CONTAINER_ID=$(docker ps | grep "$CONTAINER_NAME" | awk '{print $1}')

if [ -z "$2" ]; then
    docker logs -tf --tail 1000 $CONTAINER_ID
fi

docker logs -tf --tail $2 $CONTAINER_ID

