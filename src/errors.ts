// Тип для объекта ошибки
type ErrorResult = { error: string }

export class UnauthorizedError extends Error {
    status = 401

    constructor(message = 'Not authenticated') {
        super(message)
        this.name = 'UnauthorizedError'
    }
}

export class UnknownActionError extends Error {
}

export type ActionResponse<T> = { ok: true, data: T } | { ok: false, error: string }

// wrapper для всех ошибок в экшенах вместо try/catch @param fn - асинхронная функция, которую мы оборачиваем
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(fn: T) {
    // Определяем тип успешного результата (например, { message: string })
    type SuccessType = Awaited<ReturnType<T>>

    // Определяем полный тип возвращаемого значения: Успех ИЛИ Ошибка
    type ActionReturnType = SuccessType | ErrorResult

    return async (...args: Parameters<T>): Promise<ActionReturnType> => {
        try {
            // 3. Вызываем функцию и возвращаем SuccessType
            const result: SuccessType = await fn(...args)
            return result
        } catch (err: unknown) {
            console.error('Action error:', err)

            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка на сервере'

            // 4. Возвращаем ErrorResult, который теперь является частью ActionReturnType
            return { error: errorMessage }
        }
    }
}