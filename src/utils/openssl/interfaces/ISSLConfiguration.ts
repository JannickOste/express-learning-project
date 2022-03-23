/**
 * @module utils.openssl.interfaces
 */


/**
 * OpenSSL configuration interface.
 */
export interface ISSLConfiguration {
    default_ca: string, 
    dir: string,
    certs: string, 
    crl_dir: string, 
    database: string, 
    new_certs_dir: string, 
    certificate: string,
    serial: string,
    crl: string, 
    private_key: string
    randfile: string, 
    x509_extensions: string, 
    default_days: number, 
    default_crl_days: number, 
    default_md: string, 
    preserve: string, 
    policy: string, 
    countryName: string, 
    stateOrProvinceName: string, 
    organizationName: string, 
    organizationalUnitName: string, 
    localityName: string, 
    commonName: string, 
    emailAddress: string, 
    default_bits: number, 
    default_keyfile: string, 
    distinguished_name: string, 
    attributes: string,
}
