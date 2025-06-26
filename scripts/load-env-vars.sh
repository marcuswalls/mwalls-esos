#!/bin/bash
set -e

SCRIPT_NAME=$(basename -- "$0")
SCRIPT_PATH="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd -P)"
SCRIPT_PARENT_PATH="$(dirname "$SCRIPT_PATH")"

# If there is an .env file or an .env.local file in the current directory then we use that
# Does not support inheritance - i.e. it will either load from the current directory or the project directory, not both.
CURRENT_PATH="$(pwd -P)"
SEARCH_PATH="$SCRIPT_PARENT_PATH"
if [[ "$CURRENT_PATH" != "$SCRIPT_PARENT_PATH" ]]; then
    if [[ -f "$CURRENT_PATH/.env" || -f "$CURRENT_PATH/.env.local" ]]; then
        echo "Using local environment definitions from current directory"
        SEARCH_PATH="$CURRENT_PATH"
    fi
fi

# Make sure we have an .env or .env.local file in the search path
if [[ ! -f "$SEARCH_PATH/.env" && ! -f "$SEARCH_PATH/.env.local" ]]; then
  echo "Error: Neither .env nor .env.local found in $SEARCH_PATH" >&2
  exit 1
fi

validate_env_file() {
    local file="$1"
    if ! grep -q "^[a-zA-Z_][a-zA-Z0-9_]*=" "$file" 2>/dev/null; then
        if [[ -s "$file" ]]; then
            echo "Warning: $file does not contain valid environment variable definitions" >&2
        fi
    fi
}

load_env_file() {
    local file="$1"
    validate_env_file "$file"
    if ! source "$file"; then
        echo "Error: Failed to load environment variables from $file" >&2
        exit 1
    fi
}

set -o allexport

if [ -f "$SEARCH_PATH/.env" ]; then
    load_env_file "$SEARCH_PATH/.env"
fi

if [ -f "$SEARCH_PATH/.env.local" ]; then
    load_env_file "$SEARCH_PATH/.env.local"
fi

set +o allexport
