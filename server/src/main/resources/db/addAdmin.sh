export PGPASSWORD=postgres
docker exec -it budget-database psql -U postgres -d budget -c "INSERT INTO users (username, password, enabled) VALUES ('admin', '\$2a\$10\$yY0BX0t4asaqnFDe4HM2h.XjFkmYmOip2yr7GKtosx1J4hQR25Ar2', true);"
docker exec -it budget-database psql -U postgres -d budget -c "INSERT INTO authorities (username, authority) VALUES ('admin', 'ADMIN');"
docker exec -it budget-database psql -U postgres -d budget -c "INSERT INTO categories (id, username, description, color, index) VALUES (999, 'admin', 'Tulo', 'black', 999);"
