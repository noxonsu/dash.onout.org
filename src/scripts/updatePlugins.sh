#!/bin/sh

# Used as the beginning of a path for some user or organization (ex. https://github.com/<SOURCE>)
SOURCES=("noxonsu" "noxonsu" "noxonsu" "swaponline" "noxonsu" "appsource" "noxonsu" "noxonsu")
# Used to interact with Git repo (ex. https://github.com/source/<NAME>)
REPO_NAMES=("DAOwidget" "definance" "farmfactory" "multi-currency-wallet-pro" "NFTsy" "crosschain" "launchpad" "SensoricaBackend")
# Used as a product identifier in the app and for the local file name
PROJECT_IDS=("daofactory" "definance" "farmfactory" "multicurrencywallet" "nftmarketplace" "crosschain" "launchpad" "aigram")
# Used to make a WP plugin files
PLUGIN_IDS=("daofactory" "definance" "farmfactory" "multicurrencywallet" "nftmarketplace" "" "launchpad" "")
# Used to make a static version files
# Paths relative to the root of the repository
# empty string means there is no build or we don't have the static version
# MCW pro TODO: we don't have index.html in a build directory - vendors/swap
BUILD_PATH=("build" "vendor_source" "" "" "" "crosschain" "<TODO: launchpad static files>" "dist")

if [[ ! -d ../assets/plugins ]]; then
  mkdir -p ../assets/plugins
fi

for ((i = 0; i < ${#REPO_NAMES[@]}; i++)); do
  SOURCE=${SOURCES[$i]}
  NAME=${REPO_NAMES[$i]}
  ID=${PROJECT_IDS[$i]}
  PLUGIN_ID=${PLUGIN_IDS[$i]}
  BUILD=${BUILD_PATH[$i]}

  echo ""
  echo "Update: $NAME.git; ID: $ID"
  git clone "https://github.com/$SOURCE/$NAME.git"

  # If build path not empty we'll pack a static version
  if [[ ! -z "$BUILD" ]]; then
    mkdir -p "static_$ID"
    cp -r $NAME/$BUILD/* "static_$ID"
    zip -9 -q -r static_$ID.zip "static_$ID"
    mv static_$ID.zip ../assets/plugins/

    rm -rf "static_$ID"
  fi
  # If plugin ID not empty we'll pack a WP version
  if [[ ! -z "$PLUGIN_ID" ]]; then
    zip -9 -q -r $ID.zip ./$NAME -x '*.git*'
    mv $ID.zip ../assets/plugins/
  fi

  rm -rf ./$NAME
done