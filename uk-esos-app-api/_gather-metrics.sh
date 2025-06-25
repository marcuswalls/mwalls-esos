#!/bin/bash

./mvnw clean install -P instrument
./mvnw sonar:sonar
