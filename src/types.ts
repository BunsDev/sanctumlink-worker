import { DateTime, Str } from "@cloudflare/itty-router-openapi";

export enum AttributeTypes {
    PrimaryEmail = 'PrimaryEmail',
    NameOfUser = 'NameOfUser',
    PrimaryPhone = 'PrimaryPhone',
    DateOfBirth = 'DateOfBirth',
    BirthCertificateDocument = 'BirthCertificateDocument',
    CountryOfBirth = 'CountryOfBirth',
    NationalId = 'NationalId',
    CurrentCountryOfResidence = 'CurrentCountryOfResidence',
    CurrentStateOfResidence = 'CurrentStateOfResidence',
    PrimaryPhysicalAddress = 'PrimaryPhysicalAddress',
    UtilityBillForPrimaryResidence = 'UtilityBillForPrimaryResidence',
    Wallet = 'Wallet',
    Email = 'Email',
}
