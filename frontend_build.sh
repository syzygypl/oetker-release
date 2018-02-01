#!/usr/bin/env bash

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "No arguments supplied"
    exit 1
fi

cd $1

export npm_config_prefix=


. ~/.nvm/nvm.sh

if ! nvm use stable; then
    echo "cannot use nvm"
    echo "please see if script ~/.nvm/nvm.sh exists or version oetker"
    exit 1
fi

if ! git status | grep "$2"; then
    echo "Current frontend branch is not $2"
    exit 1;
fi

if ! ./frontend base release --environment=production; then
    echo "Frontend build base is interrupted"
fi

if ! ./frontend professional release --environment=production; then
    echo "Frontend build professional is interrupted"
fi

