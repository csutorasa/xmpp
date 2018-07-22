#/bin/bash

FQDN="ARMINPC"
PASSWORD="pass"
RSABITS=4096

# make directories to work from
mkdir -p tmp

PATH_TMP=tmp

######
# CA #
######

openssl genrsa -des3 -passout pass:$PASSWORD -out $PATH_TMP/ca.key $RSABITS

# Create Authority Certificate
openssl req -new -x509 -days 365 -key $PATH_TMP/ca.key -out ca.crt -passin pass:$PASSWORD -subj "/C=FR/ST=./L=./O=ACME Signing Authority Inc/CN=."

##########
# SERVER #
##########

# Generate server key
openssl genrsa -out server.key $RSABITS

# Generate server cert
openssl req -new -key server.key -out $PATH_TMP/server.csr -passout pass:$PASSWORD -subj "/C=FR/ST=./L=./O=ACME Signing Authority Inc/CN=$FQDN"

# Sign server cert with self-signed cert
openssl x509 -req -days 365 -passin pass:$PASSWORD -in $PATH_TMP/server.csr -CA ca.crt -CAkey $PATH_TMP/ca.key -set_serial 01 -out server.crt

##########
# CLIENT #
##########

openssl genrsa -out client.key $RSABITS

openssl req -new -key client.key -out $PATH_TMP/client.csr -passout pass:$PASSWORD -subj "/C=FR/ST=./L=./O=ACME Signing Authority Inc/CN=CLIENT"

openssl x509 -req -days 365 -passin pass:$PASSWORD -in $PATH_TMP/client.csr -CA ca.crt -CAkey $PATH_TMP/ca.key -set_serial 01 -out client.crt

rm -rf $PATH_TMP
