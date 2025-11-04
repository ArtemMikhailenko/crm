export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  switch (error.response?.status) {
    case 400:
      return 'Неверные данные запроса'
    case 401:
      return 'Необходима авторизация'
    case 403:
      return 'Доступ запрещён'
    case 404:
      return 'Ресурс не найден'
    case 409:
      return 'Конфликт данных'
    case 500:
      return 'Внутренняя ошибка сервера'
    default:
      return 'Произошла неизвестная ошибка'
  }
}