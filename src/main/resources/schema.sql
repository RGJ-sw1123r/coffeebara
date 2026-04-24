-- Spring bootstrap schema only.
-- Archive-facing schema source of truth lives in frontend/prisma/schema.prisma.
-- db/schema.sql remains the manual/reference SQL aligned to Prisma.

CREATE TABLE IF NOT EXISTS cafe (
    kakao_place_id VARCHAR(64) NOT NULL COMMENT 'Kakao place primary key',
    place_name VARCHAR(255) NOT NULL COMMENT 'Cafe name',
    category_name VARCHAR(255) COMMENT 'Kakao category path',
    phone VARCHAR(64) COMMENT 'Cafe phone number',
    address_name VARCHAR(255) COMMENT 'Jibun address',
    road_address_name VARCHAR(255) COMMENT 'Road address',
    latitude DECIMAL(10,7) COMMENT 'Latitude',
    longitude DECIMAL(10,7) COMMENT 'Longitude',
    place_url VARCHAR(500) COMMENT 'Kakao place detail URL',
    last_fetched_at DATETIME NOT NULL COMMENT 'Last fetched timestamp',
    next_refresh_at DATETIME NULL COMMENT 'Next refresh timestamp',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    PRIMARY KEY (kakao_place_id)
) COMMENT='Cafe master data';

CREATE TABLE IF NOT EXISTS app_user (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Application user primary key',
    auth_provider VARCHAR(40) NOT NULL COMMENT 'Authentication provider',
    provider_user_id VARCHAR(100) NOT NULL COMMENT 'Provider user id',
    email VARCHAR(255) NULL COMMENT 'User email if consented',
    nickname VARCHAR(100) NOT NULL COMMENT 'Display nickname',
    display_name VARCHAR(100) NULL COMMENT 'Display name used in Coffeebara',
    profile_image_url VARCHAR(500) NULL COMMENT 'Profile image URL',
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER' COMMENT 'Spring Security role',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated timestamp',
    last_login_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Last successful login timestamp',
    PRIMARY KEY (id),
    UNIQUE KEY uk_app_user_provider (auth_provider, provider_user_id)
) COMMENT='Application users authenticated by social login';
