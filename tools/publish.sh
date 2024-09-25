#!/bin/bash

# Check if the version argument is provided
if [ -z "$1" ]; then
  echo "Error: No version number provided."
  echo "Usage: ./publish.sh <version>"
  exit 1
fi

# Assign the version argument to a variable
version=$1

# Start the release process
git flow release start $version

# Update the version in package.json
yarn version --new-version $version

# Finish the release process
git flow release finish $version

# Push the changes to the remote repository
git push origin master --tags
git push origin develop

echo "Release $version has been published successfully."
