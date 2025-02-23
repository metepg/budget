CREATE TABLE incomes
(
    id         SERIAL PRIMARY KEY,
    username   TEXT      NOT NULL,
    source     TEXT      NOT NULL,
    amount     BIGINT    NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE
);

CREATE TABLE expenses
(
    id          SERIAL PRIMARY KEY,
    username    TEXT      NOT NULL,
    amount      BIGINT    NOT NULL,
    description TEXT      NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE
);

CREATE TABLE saving_goals
(
    id           SERIAL PRIMARY KEY,
    username     TEXT   NOT NULL,
    savings_goal BIGINT NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE
);

CREATE TABLE categories
(
    id       SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    name     TEXT NOT NULL UNIQUE,
    FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE
);

CREATE TABLE bills
(
    id          SERIAL PRIMARY KEY,
    username    TEXT   NOT NULL,
    category_id INT    NOT NULL,
    amount      BIGINT NOT NULL,
    description TEXT,
    bill_date   DATE   NOT NULL DEFAULT CURRENT_DATE,
    FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);

CREATE TABLE weekly_budgets
(
    id                 SERIAL PRIMARY KEY,
    username           TEXT   NOT NULL,
    week_start         DATE   NOT NULL,
    initial_budget     BIGINT NOT NULL,
    remaining_budget   BIGINT NOT NULL,
    cumulative_savings BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE
);
