#!/bin/bash

# run danger-brewing hub.
# specifying config path to be relative from /lib/index.js.
# node-config would otherwise: NODE_CONFIG_DIR=/config
sudo NODE_PATH=lib/ node lib/index.js
