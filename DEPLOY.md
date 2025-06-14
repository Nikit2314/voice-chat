# Инструкция по деплою на Timeweb

## Подготовка к деплою

1. Убедитесь, что у вас установлен Node.js версии 18 или выше
2. Выполните скрипт сборки:
   ```bash
   chmod +x build.sh
   ./build.sh
   ```
3. После выполнения скрипта будет создан файл `deploy.zip`

## Загрузка на Timeweb

1. Войдите в панель управления Timeweb
2. Перейдите в раздел "Файловый менеджер"
3. Загрузите содержимое `deploy.zip` в корневую директорию вашего сайта
4. Распакуйте архив

## Настройка Node.js на Timeweb

1. В панели управления Timeweb перейдите в раздел "Node.js"
2. Создайте новое приложение:
   - Укажите путь к файлу: `server.js`
   - Установите версию Node.js: 18.x
   - Укажите команду запуска: `npm start`
3. Установите переменные окружения:
   ```
   NODE_ENV=production
   PORT=3000
   ```

## Проверка работоспособности

1. Откройте ваш сайт в браузере
2. Проверьте консоль браузера на наличие ошибок
3. Проверьте подключение к серверу через Socket.IO

## Устранение неполадок

Если возникли проблемы:

1. Проверьте логи в панели управления Timeweb
2. Убедитесь, что все файлы загружены в правильные директории
3. Проверьте права доступа к файлам (должны быть 755 для директорий и 644 для файлов)
4. Убедитесь, что порт 3000 открыт и доступен

## Обновление сайта

Для обновления сайта:

1. Выполните скрипт сборки заново
2. Загрузите новые файлы через файловый менеджер
3. Перезапустите Node.js приложение в панели управления 