#!/bin/sh

PROJECT_IDS=(
 "daofactory"
 "definance"
 "farmfactory"
 "multicurrencywallet"
 "nftmarketplace"
 "crosschain"
 "launchpad"
 "aigram"
)
STATIC_SOURCES=(
  "https://github.com/noxonsu/DAOwidget/tree/main/build"
  "https://github.com/noxonsu/definance/tree/master/vendor_source"
  "" # TODO: Farm
  "" # TODO: MCW
  "https://github.com/noxonsu/NFTsy/tree/main/vendor/dist"
  "https://github.com/appsource/crosschain"
  "https://github.com/noxonsu/launchpad/tree/main/build"
  "https://github.com/noxonsu/SensoricaBackend/tree/master/dist"
)
PLUGIN_SOURCES=(
  "https://github.com/noxonsu/DAOwidget"
  "https://github.com/noxonsu/definance"
  "https://github.com/noxonsu/farmfactory"
  "https://github.com/swaponline/multi-currency-wallet-pro"
  "https://github.com/noxonsu/NFTsy"
  "" # Crosschain
  "https://github.com/noxonsu/launchpad"
  "" # Sensorica
)