-- PostgreSQL Change Logging System
-- Complete script to track database changes via triggers

-- 1. Create the logging table
CREATE TABLE IF NOT EXISTS change_log (
    id SERIAL PRIMARY KEY,
    transaction_id BIGINT,
    timestamp TIMESTAMP DEFAULT NOW(),
    table_name TEXT,
    operation TEXT,
    row_id TEXT,
    old_json JSONB,
    new_json JSONB
);

-- 2. Create the logging function
CREATE OR REPLACE FUNCTION log_changes() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO change_log (transaction_id, table_name, operation, row_id, old_json)
        VALUES (txid_current(), TG_TABLE_NAME, TG_OP, OLD.ctid::TEXT, to_jsonb(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO change_log (transaction_id, table_name, operation, row_id, old_json, new_json)
        VALUES (txid_current(), TG_TABLE_NAME, TG_OP, NEW.ctid::TEXT, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO change_log (transaction_id, table_name, operation, row_id, new_json)
        VALUES (txid_current(), TG_TABLE_NAME, TG_OP, NEW.ctid::TEXT, to_jsonb(NEW));
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. Function to add audit triggers to all tables (except change_log)
CREATE OR REPLACE FUNCTION add_audit_triggers() RETURNS void AS $$
DECLARE
    rec RECORD;
    audit_trigger_name TEXT;
BEGIN
    FOR rec IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          AND table_name != 'change_log'  -- Exclude the logging table
    LOOP
        audit_trigger_name := rec.table_name || '_audit_trigger';
        
        -- Check if trigger already exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name = audit_trigger_name 
              AND event_object_table = rec.table_name
              AND trigger_schema = 'public'
        ) THEN
            EXECUTE format('CREATE TRIGGER %I 
                           AFTER INSERT OR UPDATE OR DELETE ON %I 
                           FOR EACH ROW EXECUTE FUNCTION log_changes()', 
                           audit_trigger_name, rec.table_name);
            RAISE NOTICE 'Added audit trigger to table: %', rec.table_name;
        ELSE
            RAISE NOTICE 'Audit trigger already exists on table: %', rec.table_name;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 4. Function to drop all audit triggers
CREATE OR REPLACE FUNCTION drop_audit_triggers() RETURNS void AS $$
DECLARE
    rec RECORD;
    audit_trigger_name TEXT;
BEGIN
    FOR rec IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          AND table_name != 'change_log'
    LOOP
        audit_trigger_name := rec.table_name || '_audit_trigger';
        
        -- Check if trigger exists before trying to drop
        IF EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE information_schema.triggers.trigger_name = audit_trigger_name 
              AND event_object_table = rec.table_name
              AND trigger_schema = 'public'
        ) THEN
            EXECUTE format('DROP TRIGGER %I ON %I', audit_trigger_name, rec.table_name);
            RAISE NOTICE 'Dropped audit trigger from table: %', rec.table_name;
        ELSE
            RAISE NOTICE 'No audit trigger found on table: %', rec.table_name;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Usage examples:
/*
-- To start auditing all tables:
SELECT add_audit_triggers();

-- To stop auditing (remove all triggers):
SELECT drop_audit_triggers();

-- To view recent changes:
SELECT * FROM change_log ORDER BY timestamp DESC LIMIT 10;

-- To view changes by transaction:
SELECT transaction_id, timestamp, COUNT(*) as change_count,
       array_agg(DISTINCT table_name) as tables_affected
FROM change_log 
GROUP BY transaction_id, timestamp
ORDER BY timestamp DESC;

-- To view changes for a specific transaction:
SELECT * FROM change_log 
WHERE transaction_id = 12345  -- replace with actual transaction_id
ORDER BY id;

-- To clear the log:
TRUNCATE change_log;
*/