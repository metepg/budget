#!/bin/bash

# Variables for current and new app name
CURRENT_APP_NAME="defaultAppName"
NEW_APP_NAME="budget"

# Directories for server, test, resources, and client
SERVER_DIR="server/src/main/java/com/metepg"
TEST_DIR="server/src/test/java/com/metepg"
RESOURCES_DIR="server/src/main/resources"
CLIENT_DIR="client"

# File types to search in (excluding *.properties and *.java to avoid touching packages)
FILE_TYPES=("*.xml" "*.ts" "*.yml" "*.html" "*.js")

# Full package names for replacement in Java files
OLD_PACKAGE="com.metepg.$CURRENT_APP_NAME"
NEW_PACKAGE="com.metepg.$NEW_APP_NAME"

# Detect if we are on macOS (BSD `sed`) or Linux (GNU `sed`)
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_CMD="sed -i ''"
else
  # Assume GNU `sed` (Linux)
  SED_CMD="sed -i"
fi

# Check if the necessary directories exist and explicitly log if one is missing
if [[ ! -d "$SERVER_DIR" ]]; then
  echo "Error: $SERVER_DIR directory was not found. Exiting."
  exit 1
fi

if [[ ! -d "$CLIENT_DIR" ]]; then
  echo "Error: $CLIENT_DIR directory was not found. Exiting."
  exit 1
fi

if [[ ! -d "$RESOURCES_DIR" ]]; then
  echo "Error: $RESOURCES_DIR directory was not found. Exiting."
  exit 1
fi

# Step 1: Rename the defaultAppName directory to hours
if [[ -d "$SERVER_DIR/$CURRENT_APP_NAME" ]]; then
  mv "$SERVER_DIR/$CURRENT_APP_NAME" "$SERVER_DIR/$NEW_APP_NAME"
fi

if [[ -d "$TEST_DIR/$CURRENT_APP_NAME" ]]; then
  mv "$TEST_DIR/$CURRENT_APP_NAME" "$TEST_DIR/$NEW_APP_NAME"
fi

# Step 2: Update the package declarations inside Java files after renaming the folders
for dir in "$SERVER_DIR" "$TEST_DIR"; do
  if [[ -d "$dir" ]]; then
    find "$dir" -type f -name "*.java" -not -path "*/target/*" -not -path "*/.*" | while read -r file; do
      # Replace package declaration in Java files
      $SED_CMD "s|package $OLD_PACKAGE|package $NEW_PACKAGE|g" "$file"
      echo "Updated package declaration in: $file"
    done
  fi
done

# Step 3: Replace app name in non-Java files, but do NOT modify package names or paths
for dir in "$SERVER_DIR" "$CLIENT_DIR" "$RESOURCES_DIR"; do
  if [[ -d "$dir" ]]; then
    for file_type in "${FILE_TYPES[@]}"; do
      # Process only non-Java files, ensuring no package path modifications
      if [[ "$dir" == "$CLIENT_DIR" ]]; then
        # Exclude node_modules in client, and hidden directories
        find "$dir" -type f -name "$file_type" -not -path "*/node_modules/*" -not -path "*/.*" | while read -r file; do
          # Only update the app name, do not modify paths or package names
          $SED_CMD "s/$CURRENT_APP_NAME/$NEW_APP_NAME/g" "$file"
          echo "Updated app name in file: $file"
        done
      else
        # Exclude target in server, and hidden directories
        find "$dir" -type f -name "$file_type" -not -path "$SERVER_DIR/target/*" -not -path "*/.*" -not -path "*.java" | while read -r file; do
          # Only replace the app name, without modifying package paths
          $SED_CMD "s/$CURRENT_APP_NAME/$NEW_APP_NAME/g" "$file"
          echo "Updated app name in file: $file"
        done
      fi
    done
  fi
done

# Explicitly process server/pom.xml
POM_FILE="server/pom.xml"
if [[ -f "$POM_FILE" ]]; then
  $SED_CMD "s/$CURRENT_APP_NAME/$NEW_APP_NAME/g" "$POM_FILE"
  echo "Updated app name in file: $POM_FILE"
else
  echo "pom.xml not found in $SERVER_DIR"
fi

# Step 4: Only modify application-dev.properties without touching application.properties
APPLICATION_PROPERTIES="$RESOURCES_DIR/application.properties"
DEV_PROPERTIES="$RESOURCES_DIR/application-dev.properties"

if [[ -f "$APPLICATION_PROPERTIES" ]]; then
  # Copy the content of application.properties to application-dev.properties
  cp "$APPLICATION_PROPERTIES" "$DEV_PROPERTIES"

  # Update only the application-dev.properties file to change the app name
  $SED_CMD "s/$CURRENT_APP_NAME/$NEW_APP_NAME/g" "$DEV_PROPERTIES"

  echo "Created $DEV_PROPERTIES with updated app name."
else
  echo "Error: $APPLICATION_PROPERTIES was not found."
  exit 1
fi

echo "App name replaced in application-dev.properties from '$CURRENT_APP_NAME' to '$NEW_APP_NAME'."
