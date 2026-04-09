CREATE TABLE IF NOT EXISTS cafe (
    cafe_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '내부 카페 식별자',
    kakao_place_id VARCHAR(64) NOT NULL COMMENT 'Kakao 장소 고유 ID',
    place_name VARCHAR(255) NOT NULL COMMENT '카페명',
    category_name VARCHAR(255) COMMENT 'Kakao 카테고리 전체 경로',
    phone VARCHAR(64) COMMENT '대표 전화번호',
    address_name VARCHAR(255) COMMENT '지번 주소',
    road_address_name VARCHAR(255) COMMENT '도로명 주소',
    latitude DECIMAL(10,7) COMMENT '위도',
    longitude DECIMAL(10,7) COMMENT '경도',
    place_url VARCHAR(500) COMMENT 'Kakao 장소 상세 URL',
    last_fetched_at DATETIME NOT NULL COMMENT '마지막 수집 시각',
    next_refresh_at DATETIME NULL COMMENT '다음 갱신 예정 시각',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시각',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시각',
    PRIMARY KEY (cafe_id),
    UNIQUE KEY uk_cafe_kakao_place_id (kakao_place_id)
) COMMENT='카페 마스터 데이터';
