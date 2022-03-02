FROM node:12-alpine3.10 AS builder

LABEL maintainer="sebastian.raubach@hutton.ac.uk"

ARG BRANCH=master

# Force docker to not cache the next line
ADD https://api.github.com/repos/cropgeeks/seams-client/git/refs/heads/master version.json
# Clone the GridScore server code and client code
RUN echo "Pulling GitHub branch: $BRANCH"
RUN apk add --no-cache git && \
    if [ "$BRANCH" = "master" ] ; then git clone -b "main" --single-branch --depth 1 https://github.com/cropgeeks/seams-server.git /opt/seams-server ; else git clone -b "$BRANCH" --single-branch --depth 1 https://github.com/cropgeeks/seams-server.git /opt/seams-server ; fi && \
    if [ "$BRANCH" = "master" ] ; then git clone -b "main" --single-branch --depth 1 https://github.com/cropgeeks/seams-client.git /opt/seams-client ; else git clone -b "$BRANCH" --single-branch --depth 1 https://github.com/cropgeeks/seams-client.git /opt/seams-client ; fi

# Build the client code
WORKDIR /opt/seams-client
RUN rm -f .env && \
    echo "VUE_APP_BASE_URL=./api/" > .env && \
    apk add --no-cache python build-base gcc wget && \
    npm i && \
    npm run build && \
    mkdir /opt/seams-server/client/ && \
    cp -a /opt/seams-client/dist/. /opt/seams-server/client/

# Download Gradle and build the server code
RUN apk add --no-cache openjdk11 && \
    wget https://services.gradle.org/distributions/gradle-6.0.1-bin.zip -P /tmp/ && \
    unzip /tmp/gradle-6.0.1-bin.zip -d /opt/ && \
    echo "config.folder=/data/seams" > /opt/seams-server/config.properties && \
    echo "project.name=seams" >> /opt/seams-server/gradle.properties && \
    /opt/gradle-6.0.1/bin/gradle -p /opt/seams-server war


FROM tomcat:8-jdk11

LABEL maintainer="sebastian.raubach@hutton.ac.uk"

RUN mkdir -p /usr/local/tomcat/webapps && \
    rm -rf /usr/local/tomcat/webapps/ROOT

COPY --from=builder /opt/seams-server/build/libs/seams-*.war /usr/local/tomcat/webapps/ROOT.war

WORKDIR /usr/local/tomcat/
