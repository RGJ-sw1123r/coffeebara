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

CREATE TABLE IF NOT EXISTS user_saved_cafe (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'User saved cafe primary key',
    app_user_id BIGINT NOT NULL COMMENT 'Owner app_user id',
    kakao_place_id VARCHAR(64) NOT NULL COMMENT 'Saved Kakao place id',
    saved_type VARCHAR(40) NOT NULL DEFAULT 'GENERAL' COMMENT 'Saved cafe usage type',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated timestamp',
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_saved_cafe_user_place (app_user_id, kakao_place_id),
    KEY idx_user_saved_cafe_user_created (app_user_id, created_at),
    KEY idx_user_saved_cafe_place (kakao_place_id),
    CONSTRAINT fk_user_saved_cafe_app_user
        FOREIGN KEY (app_user_id) REFERENCES app_user (id),
    CONSTRAINT fk_user_saved_cafe_cafe
        FOREIGN KEY (kakao_place_id) REFERENCES cafe (kakao_place_id)
) COMMENT='Member-owned saved cafe relations';

CREATE TABLE IF NOT EXISTS cafe_record (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Cafe record primary key',
    app_user_id BIGINT NOT NULL COMMENT 'Owner app_user id',
    kakao_place_id VARCHAR(64) NOT NULL COMMENT 'Related Kakao place id',
    record_type VARCHAR(40) NOT NULL COMMENT 'Cafe record type',
    display_order INT NOT NULL DEFAULT 0 COMMENT 'Display order across mixed cafe records',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated timestamp',
    PRIMARY KEY (id),
    KEY idx_cafe_record_user_place_order (app_user_id, kakao_place_id, display_order, id),
    KEY idx_cafe_record_place (kakao_place_id),
    CONSTRAINT fk_cafe_record_app_user
        FOREIGN KEY (app_user_id) REFERENCES app_user (id),
    CONSTRAINT fk_cafe_record_cafe
        FOREIGN KEY (kakao_place_id) REFERENCES cafe (kakao_place_id)
) COMMENT='Member-owned cafe record header for mixed record ordering';

CREATE TABLE IF NOT EXISTS cafe_note (
    cafe_record_id BIGINT NOT NULL COMMENT 'Parent cafe_record id',
    title VARCHAR(255) NULL COMMENT 'Optional note title shown in the record list',
    note_text VARCHAR(1000) NOT NULL COMMENT 'Text note content',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated timestamp',
    PRIMARY KEY (cafe_record_id),
    CONSTRAINT fk_cafe_note_cafe_record
        FOREIGN KEY (cafe_record_id) REFERENCES cafe_record (id)
        ON DELETE CASCADE
) COMMENT='Text record payload linked to cafe_record';

CREATE TABLE IF NOT EXISTS media_asset (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Media asset primary key',
    storage_key VARCHAR(500) NOT NULL COMMENT 'Future storage object key',
    original_file_name VARCHAR(255) NOT NULL COMMENT 'Original uploaded file name',
    content_type VARCHAR(100) NOT NULL COMMENT 'Media content type',
    file_size BIGINT NOT NULL COMMENT 'File size in bytes',
    width INT NULL COMMENT 'Image width in pixels',
    height INT NULL COMMENT 'Image height in pixels',
    checksum VARCHAR(128) NOT NULL COMMENT 'Asset checksum for deduplication or integrity checks',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    PRIMARY KEY (id),
    UNIQUE KEY uk_media_asset_storage_key (storage_key),
    KEY idx_media_asset_checksum (checksum)
) COMMENT='Stored media asset metadata';

CREATE TABLE IF NOT EXISTS media_attachment (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Media attachment primary key',
    media_asset_id BIGINT NOT NULL COMMENT 'Attached media_asset id',
    owner_type VARCHAR(40) NOT NULL COMMENT 'Attachment owner domain type',
    owner_id BIGINT NOT NULL COMMENT 'Attachment owner id in the target domain',
    attachment_role VARCHAR(40) NOT NULL COMMENT 'Attachment usage role within the owner',
    sort_order INT NOT NULL DEFAULT 0 COMMENT 'Display order within the same attachment group',
    is_cover TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Whether this attachment is the cover image',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    deleted_at DATETIME NULL COMMENT 'Soft delete timestamp',
    PRIMARY KEY (id),
    KEY idx_media_attachment_owner_lookup (owner_type, owner_id, deleted_at, sort_order, id),
    KEY idx_media_attachment_asset (media_asset_id),
    KEY idx_media_attachment_owner_role (owner_type, owner_id, attachment_role, deleted_at),
    CONSTRAINT fk_media_attachment_media_asset
        FOREIGN KEY (media_asset_id) REFERENCES media_asset (id)
) COMMENT='Generic attachment link between media assets and domain owners';
