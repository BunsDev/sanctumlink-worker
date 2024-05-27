
-- DROP TABLE Identities;
CREATE TABLE IF NOT EXISTS Identities (
    IdentityId TEXT PRIMARY KEY,
    Email TEXT NOT NULL UNIQUE,
    Account TEXT NOT NULL,
    CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- DROP TABLE Attributes;
CREATE TABLE IF NOT EXISTS Attributes (
    IdentityId TEXT,
    AttributeType TEXT NOT NULL,
    AttributeValue TEXT NOT NULL,
    AttributeHash TEXT NOT NULL,
    CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(IdentityId) REFERENCES Identities(IdentityId) ON DELETE CASCADE
);
