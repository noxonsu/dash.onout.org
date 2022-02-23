#!/bin/sh

# TODO: how to make key-value structure?
SOURCES=("noxonsu" "noxonsu" "noxonsu" "noxonsu" "swaponline" "noxonsu")
REPO_NAMES=("DAOwidget" "definance" "farmfactory" "LotteryFactory" "multi-currency-wallet-pro" "NFTsy")
PLUGIN_IDS=("daofactory" "definance" "farmfactory" "lotteryfactory" "multicurrencywallet" "nftmarketplace")

for ((i = 0; i < ${#REPO_NAMES[@]}; i++)); do
  SOURCE=${SOURCES[$i]}
  NAME=${REPO_NAMES[$i]}
  ID=${PLUGIN_IDS[$i]}

  echo ""
  echo "Update: $NAME.git"
  echo "ID: $ID"

  git clone "https://github.com/$SOURCE/$NAME.git"

  if [[ ! -d ../assets/plugins ]]; then
    mkdir -p ../assets/plugins
  fi

  zip -9 -q -r $ID.zip ./$NAME -x '*.git*' && mv $ID.zip ../assets/plugins/
  rm -rf ./$NAME
done