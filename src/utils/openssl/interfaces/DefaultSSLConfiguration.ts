/**
 * @module utils.openssl.interfaces
 */
import { Globals } from "../../../misc/Globals";
import { OpenSSL } from "../OpenSSL";
import {
    ISSLConfiguration
} from "./ISSLConfiguration";

/**
 * Default data for the ISSLConfiguration interface.
 */
export class DefaultSSLConfiguration implements ISSLConfiguration 
{
    public readonly default_ca="CA_DEFAULT";
    public readonly dir=Globals.configurationRoot;
    public readonly certs="certs";
    public readonly serial="serial";
    public readonly crl_dir="crl";
    public readonly database="index.txt";
    public readonly new_certs_dir="newcerts";
    public readonly certificate=`${OpenSSL.keyName}_certificate.pem`;
    public readonly crl="crl.pem";
    public readonly private_key=`${OpenSSL.keyName}_private.pem`;
    public readonly randfile="private.rnd";
    public readonly x509_extensions="x509v3_extensions";
    public readonly default_days = 365;
    public readonly default_crl_days = 30;
    public readonly default_md = "md5";
    public readonly preserve = "no";
    public readonly policy = "policy_match";
    public readonly countryName = "match";
    public readonly stateOrProvinceName = "match";
    public readonly organizationName = "match";
    public readonly organizationalUnitName = "optional";
    public readonly localityName = "optional";
    public readonly commonName = "supplied";
    public readonly emailAddress = "optional";
    public readonly default_bits = 1024;
    public readonly default_keyfile=`${OpenSSL.keyName}_private.pem`;
    public readonly distinguished_name="req_distinguished_name";
    public readonly attributes="req_attributes";

    public static readonly templateString: string = [
        "####################################################################",
        "#                                                                  #",
        "#          ExpressJS-Server SSL properties example file.           #",
        "#                                                                  #",
        "####################################################################",
        "#                                                                  #",
        "#       Auto generated by expressjs-server by Oste Jannick         #",
        "#                                                                  #",
        "####################################################################\n",
        "RANDFILE          = .rnd\n",
        "####################################################################",
        "[ ca ]",
        "default_ca        = {DEFAULT_CA}                # The default ca section\n",
        "####################################################################",
        "[ CA_default ]\n",
        "dir              = {DIR}                        # Where everything is kept",
        "certs            = $dir\\{CERTS}                # Where the issued certs are kept",
        "crl_dir          = $dir\\{CRL_DIR}              # Where the issued crl are kept",
        "database         = $dir\\{DATABASE}             # database index file.",
        "new_certs_dir    = $dir\\{NEW_CERTS_DIR}        # default place for new certs.\n",
        "certificate      = $dir\\{CERTIFICATE}          # The CA certificate",
        "serial           = $dir\\{SERIAL}               # The current serial number",
        "crl              = $dir\\{CRL}                  # The current CRL",
        "private_key      = $dir\\private\\{PRIVATE_KEY} # The private key",
        "RANDFILE         = $dir\\private\\{RANDFILE}    # private random number file\n",
        "x509_extensions  = {X509_EXTENSIONS}            # The extentions to add to the cert",
        "default_days     = {DEFAULT_DAYS}               # how long to certify for",
        "default_crl_days = {DEFAULT_CRL_DAYS}           # how long before next CRL",
        "default_md       = {DEFAULT_MD}                 # which md to use.",
        "preserve         = {PRESERVE}                   # keep passed DN ordering\n",
        "policy        = {POLICY}\n",
        "[ policy_match ]",
        "countryName                = {COUNTRYNAME}",
        "stateOrProvinceName        = {STATEORPROVINCENAME}",
        "organizationName           = {ORGANIZATIONNAME}",
        "organizationalUnitName     = {ORGANIZATIONALUNITNAME}",
        "commonName                 = {COMMONNAME}",
        "emailAddress               = {EMAILADDRESS}\n",
        "[ policy_anything ]",
        "countryName            = optional",
        "stateOrProvinceName    = optional",
        "localityName           = optional",
        "organizationName       = optional",
        "organizationalUnitName = optional",
        "commonName             = supplied",
        "emailAddress           = {EMAILADDRESS}\n",
        "####################################################################",
        "[ req ]",
        "default_bits        = {DEFAULT_BITS}",
        "default_keyfile     = {DEFAULT_KEYFILE}",
        "distinguished_name  = {DISTINGUISHED_NAME}",
        "attributes          = {ATTRIBUTES}\n",
        "[ req_distinguished_name ]",
        "countryName            = Country Name (2 letter code)",
        "countryName_min        = 2",
        "countryName_max        = 2\n",
        "stateOrProvinceName    = State or Province Name (full name)\n",
        "localityName           = Locality Name (eg, city)\n",
        "0.organizationName     = Organization Name (eg, company)\n",
        "organizationalUnitName = Organizational Unit Name (eg, section)\n",
        "commonName             = Common Name (eg, your website’s domain name)",
        "commonName_max         = 64\n",
        "emailAddress           = Email Address",
        "emailAddress_max       = 40\n",
        "[ req_attributes ]",
        "challengePassword      = A challenge password",
        "challengePassword_min  = 4",
        "challengePassword_max  = 20\n",
        "[ x509v3_extensions ]"
    ].join("\n");
}