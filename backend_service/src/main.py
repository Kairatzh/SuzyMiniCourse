"""Минимальная жизнеспособная бэкенд сервис для демо"""

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List

from ai_service.src.agents.agent_gen import generate_c

app = FastAPI()

#Получаем запрос от пользователя
class Request(BaseModel):
    query: Optional[str] = None
    user_name: Optional[str] = None

#Данные или переменные для получение вывода в пайдантик схеме Курса
class Responce(BaseModel):
    query: str
    summary: Optional[str] = None
    tests: Optional[List[str]] = None
    videos: Optional[List[str]] = None

#Генерируем курсы на определенную тему на которую получили ответ 
@app.post("/v1/generate", response_model=Responce)
def generate(request: Request):
    return generate_c(request.query)









#Получаем ввод логина и пороля
class AutorizeInput(BaseModel):
    login: Optional[str] = None
    password: Optional[str] = None

#Выводим логин и пароль
class AutorizeOutput(BaseModel):
    login: Optional[str] = None
    password: Optional[str] = None

@app.get("/v1/autorize", responce_model=AutorizeOutput)
def authorize(input: AutorizeInput):
    return AutorizeOutput(input.login, input.output)
