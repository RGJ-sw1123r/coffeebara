package com.coffeebara.cafe.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class CafeSchemaInitializer implements ApplicationRunner {

	private final JdbcTemplate jdbcTemplate;

	public CafeSchemaInitializer(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public void run(org.springframework.boot.ApplicationArguments args) {
		Integer columnCount = jdbcTemplate.queryForObject(
			"""
				SELECT COUNT(*)
				FROM information_schema.COLUMNS
				WHERE TABLE_SCHEMA = DATABASE()
				  AND TABLE_NAME = 'cafe'
				  AND COLUMN_NAME = 'next_refresh_at'
				""",
			Integer.class
		);

		if (columnCount == null || columnCount == 0) {
			jdbcTemplate.execute(
				"""
					ALTER TABLE cafe
					ADD COLUMN next_refresh_at DATETIME NULL
					AFTER last_fetched_at
					"""
			);
		}

		jdbcTemplate.update(
			"""
				UPDATE cafe
				SET next_refresh_at = DATE_ADD(last_fetched_at, INTERVAL 30 DAY)
				WHERE next_refresh_at IS NULL
				"""
		);
	}
}
