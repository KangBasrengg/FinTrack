package config

import (
	"context"
	"os"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
)

func InitDB() *pgxpool.Pool {
	err := godotenv.Load()
	if err != nil {
		log.Warn().Msg("No .env file found, relying on environment variables")
	}

	dbUrl := os.Getenv("DB_URL")
	if dbUrl == "" {
		log.Fatal().Msg("DB_URL is not set")
	}

	poolConfig, err := pgxpool.ParseConfig(dbUrl)
	if err != nil {
		log.Fatal().Err(err).Msg("Unable to parse DB_URL")
	}

	// Disable prepared statements for PgBouncer / Supabase Pooler
	// 1 corresponds to QueryExecModeSimpleProtocol in older pgx versions, 
	// or we can just append it to the DB_URL if this fails, but usually we can set it.
	// We'll append `?default_query_exec_mode=exec` to DB_URL if not present.
	if !strings.Contains(dbUrl, "statement_cache_capacity") {
		if strings.Contains(dbUrl, "?") {
			dbUrl += "&statement_cache_capacity=0&default_query_exec_mode=exec"
		} else {
			dbUrl += "?statement_cache_capacity=0&default_query_exec_mode=exec"
		}
		poolConfig, _ = pgxpool.ParseConfig(dbUrl)
	}

	pool, err := pgxpool.NewWithConfig(context.Background(), poolConfig)
	if err != nil {
		log.Fatal().Err(err).Msg("Unable to connect to database")
	}

	// Test connection
	err = pool.Ping(context.Background())
	if err != nil {
		log.Fatal().Err(err).Msg("Database ping failed")
	}

	log.Info().Msg("Successfully connected to database")
	return pool
}
