#!/bin/sh

# TODO: make it work on Windows
# TODO: how to make key-value structure?
SOURCES=("noxonsu" "noxonsu" "noxonsu" "noxonsu" "swaponline" "noxonsu")
REPO_NAMES=("DAOwidget" "definance" "farmfactory" "LotteryFactory" "multi-currency-wallet-pro" "NFTsy")
PLUGIN_IDS=("daofactory" "definance" "farmfactory" "lotteryfactory" "multicurrencywallet" "nftmarketplace")
# paths relative to the root of the repository 
# empty string means there is no build or we don't have the static version (or i didn't find it o_o)
# NFT TODO: check the VUE app (vendor/dist) for NFT repo and add the path
# MCW pro TODO: we don't have index.html in a build directory - vendors/swap
BUILD_PATH=("build" "vendor_source" "" "" "" "")

if [[ ! -d ../assets/plugins ]]; then
  mkdir -p ../assets/plugins
fi

for ((i = 0; i < ${#REPO_NAMES[@]}; i++)); do
  SOURCE=${SOURCES[$i]}
  NAME=${REPO_NAMES[$i]}
  ID=${PLUGIN_IDS[$i]}
  BUILD=${BUILD_PATH[$i]}

  echo ""
  echo "Update: $NAME.git"
  echo "ID: $ID"

  git clone "https://github.com/$SOURCE/$NAME.git"

  # if build path not empty
  if [[ ! -z "$BUILD" ]]; then
    mkdir -p "static_$ID"
    cp -r $NAME/$BUILD/* "static_$ID"
    zip -9 -q -r static_$ID.zip "static_$ID"
    mv static_$ID.zip ../assets/plugins/

    rm -rf "static_$ID"
  fi

  zip -9 -q -r $ID.zip ./$NAME -x '*.git*'
  mv $ID.zip ../assets/plugins/

  rm -rf ./$NAME
done