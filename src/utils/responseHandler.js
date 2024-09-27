import { zValidator } from '@hono/zod-validator'
import { validator } from 'hono/validator'
import { z } from 'zod'

const zodErrorResponse = (result, c) => {
    const { error, success } = result
    if (!success) {
        return c.json({ error, success, message: 'Invalid Data' }, 403)
    }
}

export const zValidatorJson = schema =>
    zValidator('json', schema, zodErrorResponse)

// TODO haven't tested yet
export const zValidatorForm = body =>
    zValidator(
        'form',
        z.object({
            body: z.string(),
        }),
        zodErrorResponse
    )

//? TODO is this neccessary? Have this regex formula /:id{[0-9]+}
export const validatorParam = param => {
    return validator('param', (value, c) => {
        const isNumericalString = z
            .union([z.string(), z.number()])
            .pipe(z.coerce.number())
            .safeParse(value[param])

        if (!isNumericalString.success) {
            return zodErrorResponse(isNumericalString, c)
        }
    })
}

export const response200 = (data, message) => ({ data, message, success: true })
