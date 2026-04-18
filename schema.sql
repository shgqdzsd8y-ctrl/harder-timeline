CREATE TABLE IF NOT EXISTS comments (
  id         TEXT    PRIMARY KEY,
  node_id    TEXT    NOT NULL,
  author     TEXT    NOT NULL,
  body       TEXT    NOT NULL,
  created_at INTEGER NOT NULL,
  ip_hash    TEXT,
  hidden     INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_comments_node
  ON comments (node_id, created_at);

CREATE INDEX IF NOT EXISTS idx_comments_ip_hash
  ON comments (ip_hash, created_at);
