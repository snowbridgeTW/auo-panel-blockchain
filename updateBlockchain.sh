#!/bin/bash

# base settings
UPDATE_FILE="$1"
CHR_COMMAND="chr node update -bc "
BLOCK_NUMBER=2

# key settings
NODE0_PK="key=02C86E998A0CD3E6FC1FE1B571CCCA60A59D8A3C1C6AF7D9446C25489C681F09F3"
NODE1_PK="key=0213DF1E0CCC65DB0BC34AEBC317F304B17868978EAFC873C637C58ECBB04DAB3C"
NODE2_PK="key=038FDE72308A4297F220C48D8ECE3147905F068EFE1908E51D5A25ADBA49A0652A"
NODE2_PK="key=03FEB85B59FADDAA7BD64E81CC2F57473EB220ABEA32A9398C65C0C06FBDEF3290"

# properties
NODE0_CONF="conf/node0.properties"
NODE1_CONF="conf/node1.properties"
NODE2_CONF="conf/node2.properties"
NODE3_CONF="conf/node3.properties"

if [ -z "$1" ]; then
  echo -e "\n使用方法: $0 <區塊鏈配置檔位置> <第幾個區塊後更新>"
  exit 1
fi

CONTAINER_COMMANDS=(
    "node0-cli: $CHR_COMMAND $1 -p $NODE0_PK -np $NODE0_CONF -n $BLOCK_NUMBER"
    "node1-cli: $CHR_COMMAND $1 -p $NODE1_PK -np $NODE1_CONF -n $BLOCK_NUMBER"
    "node2-cli: $CHR_COMMAND $1 -p $NODE2_PK -np $NODE2_CONF -n $BLOCK_NUMBER"
    "node3-cli: $CHR_COMMAND $1 -p $NODE2_PK -np $NODE3_CONF -n $BLOCK_NUMBER"
)

for CONTAINER_COMMAND in "${CONTAINER_COMMANDS[@]}"; do
    CONTAINER_NAME="${CONTAINER_COMMAND%%:*}"
    COMMAND="${CONTAINER_COMMAND#*:}"
    echo -e "\nCONTAINER_NAME: $CONTAINER_NAME"
    echo "COMMAND: $COMMAND"

    CLI_ID=$(docker ps | grep "$CONTAINER_NAME" | awk '{print $1}')
    if [ -z "$CLI_ID" ]; then
        echo "容器 $CONTAINER_NAME 未運行。"
    else
        echo "在容器 $CONTAINER_NAME ($CLI_ID) 中執行命令： docker exec -d -it $CLI_ID sh -c "$COMMAND""
        docker exec -d -it $CLI_ID sh -c "$COMMAND"
    fi
done

echo "執行完畢。。。"