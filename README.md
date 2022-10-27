# Plan For You: сервис планирования времени

## Начало работы  

Склонировать репозиторий на свой компьютер:
```
git clone https://github.com/SVI-2022-Brigade-16/Plan-For-You.git Plan-For-You
cd Plan-For-You
```

Установить NestJS CLI:
```
npm i -g @nestjs/cli
```

## Запуск

Через npm:
```
npm run start
```

Через nest:
```
nest start
```

Просмотр в браузере:
```
http://localhost:3000
```

## Стиль кода  

#### Наименования в приложении:

`camelCase` — функции, аргументы, переменные, свойства и методы классов.

`snake_case` — папки, а также все объекты в базе данных.

`kebab-case.{type}.ts` — все файлы в `src`.

`PascalCase` — классы и интерфейсы.

#### Наименования в базе данных:

`public` — единственная используемая схема.

`user`, `meeting_plan` — примеры таблиц.

`id` или `uuid` — первичный ключ из одного атрибута.

`user_id` — внешний ключ, ссылающийся на первичный ключ `id` в таблице `user`.

`meeting_plan_pk` — ограничение первичного ключа таблицы `meeting_plan`.

`meeting_plan_fk_user` — ограничение внешнего ключа таблицы `meeting_plan`, ссылающегося на первичный ключ таблицы `user`.

`user_uq_login` — уникальное ограничение атрибута `login` таблицы `user`.

## Работа с Git

На компьютере должен быть склонированный репозиторий:
```
git clone https://github.com/SVI-2022-Brigade-16/Plan-For-You.git Plan-For-You
```

Зайти в папку с проектом и перейти на ветку со своим именем:
```
cd Plan-For-You
git checkout [ilya|ivan|nikita|yanyu]
```

Сделать **merge** ветки **dev** в свою ветку для получения последних изменений:
```
git merge dev
```

Поработать, добавить все свои изменения в заготовку коммита:
```
git add .
```

**Важно: Перед созданием коммита убедитесь, что вы находитесь в своей ветке!**  
Узнать, в какой ветке вы находитесь, можно с помощью команды:
```
git branch
```

Создать коммит и отправить его:
```
git commit -m "Commit message"
git push
```

Зайти в репозиторий Plan-For-You на GitHub и создать **pull request**.

*Репозиторий -> Вкладка "Pull requests" -> Кнопка "New pull request"*

В качестве `base:` выбрать `dev`.

В качестве `compare:` выбрать свою ветку.

## Документация

### NestJS:  
https://docs.nestjs.com  

### Swagger/OpenAPI:
https://docs.nestjs.com/openapi/introduction
