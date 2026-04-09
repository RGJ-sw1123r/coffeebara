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
