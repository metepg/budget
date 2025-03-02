CREATE TABLE categories
(
    id          SERIAL PRIMARY KEY,
    username    TEXT NOT NULL,
    description TEXT NOT NULL,
    index       INTEGER,
    FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE
);

CREATE TABLE monthly_records
(
    id          SERIAL PRIMARY KEY,
    date        DATE      NOT NULL DEFAULT CURRENT_DATE,
    username    TEXT      NOT NULL,
    type        TEXT      NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    description TEXT      NOT NULL,
    amount      INTEGER   NOT NULL,
    recurring   BOOLEAN   NOT NULL DEFAULT FALSE,
    modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    category_id INT,
    FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
);

CREATE TABLE saving_goals
(
    id           SERIAL PRIMARY KEY,
    username     TEXT   NOT NULL,
    savings_goal BIGINT NOT NULL,
    modified_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE
);

CREATE TABLE monthly_budgets
(
    id                 SERIAL PRIMARY KEY,
    username           TEXT   NOT NULL,
    month              DATE   NOT NULL,
    total_income       BIGINT NOT NULL DEFAULT 0,
    total_expense      BIGINT NOT NULL DEFAULT 0,
    cumulative_savings BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE,
    UNIQUE (username, month)
);
