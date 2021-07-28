# intership-backend

#### Backend
* `docker-compose build` - собрать приложения. 
* `docker-compose up` - запустить приложение, БД и pgAdmin; (http://localhost:8888)
* `docker-compose up down` - остановить приложение и БД (локальная база очищается после остановки);

#### Миграции
* `npm run migrations_run` - выполнить последнюю доступную миграцию.
* `npm run migrations_gen <migration_name>` - создать файл миграции с внесенными изменениями в схеме хранения сущностей.
* `npm run migrations_create <migration_name>` - создать новый файл с миграцией. 

#### Дополнительная информация
Используемая СУБД - **PostgreSQL**
***
Используемые переменные:
* POSTGRES_DB
* POSTGRES_PASSWORD
* POSTGRES_USER
* POSTGRES_HOST
* POSTGRES_PORT









