#!/usr/bin/env bash

function main {

    declare path="$1" branch="$2"

    if [ -z "$path" ] || [ -z "$branch" ]; then
        echo "No arguments supplied"
        exit 1
    fi

    cd $1

    # unset global env variables which node sets on script execution (which disturb nvm loading)
    export npm_config_prefix=

    # loading nvm
    . ~/.nvm/nvm.sh

    if ! nvm use stable; then
        echo "cannot use nvm"
        echo "please see if script ~/.nvm/nvm.sh exists or version oetker"
        exit 1
    fi

    if [ "$(git rev-parse --abbrev-ref HEAD)" != "$branch" ]; then
        echo "Current frontend branch is not $branch"
        exit 1;
    fi

    if ! ./frontend base release --environment=production; then
        echo "Frontend build base is interrupted"
    fi

    if ! ./frontend professional release --environment=production; then
        echo "Frontend build professional is interrupted"
    fi
}

main "$@"


