CREATE TABLE IF NOT EXISTS cafe (
    cafe_id BIGINT NOT NULL AUTO_INCREMENT,
    kakao_place_id VARCHAR(64) NOT NULL,
    place_name VARCHAR(255) NOT NULL,
    category_name VARCHAR(255),
    phone VARCHAR(64),
    address_name VARCHAR(255),
    road_address_name VARCHAR(255),
    latitude VARCHAR(32),
    longitude VARCHAR(32),
    place_url VARCHAR(500),
    last_fetched_at DATETIME NOT NULL,
    next_refresh_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (cafe_id),
    UNIQUE KEY uk_cafe_kakao_place_id (kakao_place_id)
);
