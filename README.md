
# Проект MoviesExplorer бэкенд


# Репозиторий

 [Репозиторий *тык*](https://github.com/IRaizyrI/movies-explorer-api)
 ``https://github.com/IRaizyrI/movies-explorer-api``

 [Ссылка на запущенный апи *тык*](https://api.logvinovilya-dip.nomoredomains.monster/api)
 ``https://api.logvinovilya-dip.nomoredomains.monster/api``
 
## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
`/middlewares` — папка с файлами промежуточных обработчиков (middleware), таких как аутентификация пользователя
`/errors` — папка с файлами пользовательских ошибок для централизованной обработки ошибок
`/utils` — папка для хранения вспомогатепльных констант
  
Остальные директории вспомогательные, создаются при необходимости разработчиком
Проект берет информацию из .env файла следующей структуры:
```
NODE_ENV=
DB_LINK=
JWT_SECRET=
```
## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload
