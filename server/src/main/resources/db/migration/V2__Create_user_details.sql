CREATE TABLE user_details
(
    id           SERIAL PRIMARY KEY,
    user_id      TEXT UNIQUE NOT NULL,
    net_income   BIGINT      NOT NULL,
    other_income BIGINT DEFAULT 0,
    savings_goal BIGINT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (username) ON DELETE CASCADE
);

CREATE TABLE categories
(
    id      SERIAL PRIMARY KEY,
    user_id INT  NOT NULL,
    name    TEXT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES user_details (id) ON DELETE CASCADE
);

CREATE TABLE bills
(
    id          SERIAL PRIMARY KEY,
    user_id     INT    NOT NULL,
    category_id INT    NOT NULL,
    amount      BIGINT NOT NULL,
    description TEXT,
    bill_date   DATE   NOT NULL DEFAULT CURRENT_DATE,
    FOREIGN KEY (user_id) REFERENCES user_details (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);

CREATE TABLE weekly_budget
(
    id                 SERIAL PRIMARY KEY,
    user_id            INT    NOT NULL,
    week_start         DATE   NOT NULL,
    initial_budget     BIGINT NOT NULL,
    remaining_budget   BIGINT NOT NULL,
    cumulative_savings BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user_details (id) ON DELETE CASCADE
);
